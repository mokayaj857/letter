const pool = require('../config/db');

// 1. Get Questions for a Specific Game
exports.getGameQuestions = async (req, res) => {
  const { gameId } = req.params;

  try {
    const [questions] = await pool.execute(
      'SELECT id, game_id, question, options, points FROM questions WHERE game_id = ?',
      [gameId]
    );

    // MySQL returns JSON as string or object depending on driver config; ensure object structure
    const formattedQuestions = questions.map(q => ({
      ...q,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
    }));

    res.json({ success: true, questions: formattedQuestions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Submit Game Session Answers
exports.submitGameResult = async (req, res) => {
  const userId = req.user.id;
  const gameId = req.params.id;
  const { answers, durationSeconds } = req.body; 
  // Expects answers format: [{ questionId: 1, selectedIndex: 0 }, { questionId: 2, selectedIndex: 1 }]

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Fetch correct answers for validation
    const [questions] = await connection.execute(
      'SELECT id, correct_answer, points, explanation FROM questions WHERE game_id = ?',
      [gameId]
    );

    let earnedScore = 0;
    const qMap = new Map(questions.map(q => [q.id, q]));
    const feedback = [];

    answers.forEach(ans => {
      const q = qMap.get(ans.questionId);
      if (q) {
        const isCorrect = Number(q.correct_answer) === Number(ans.selectedIndex);
        if (isCorrect) {
          earnedScore += q.points;
        }
        feedback.push({
          questionId: q.id,
          isCorrect,
          correctAnswerIndex: q.correct_answer,
          explanation: q.explanation
        });
      }
    });

    // Save Game Session
    await connection.execute(
      'INSERT INTO game_sessions (user_id, game_id, score, duration_seconds) VALUES (?, ?, ?, ?)',
      [userId, gameId, earnedScore, durationSeconds || 0]
    );

    // Update User Total Points
    await connection.execute(
      'UPDATE users SET total_points = total_points + ? WHERE id = ?',
      [earnedScore, userId]
    );

    // Upsert Progress Record
    await connection.execute(
      `INSERT INTO progress (user_id, game_id, highest_score, attempts_count, completion_percentage)
       VALUES (?, ?, ?, 1, 100.00)
       ON DUPLICATE KEY UPDATE
         highest_score = GREATEST(highest_score, VALUES(highest_score)),
         attempts_count = attempts_count + 1,
         completion_percentage = 100.00`,
      [userId, gameId, earnedScore]
    );

    // Evaluate and Award New Badges
    const [[user]] = await connection.execute('SELECT total_points FROM users WHERE id = ?', [userId]);
    const [eligibleBadges] = await connection.execute(
      `SELECT id, name, icon FROM badges 
       WHERE requirement_points <= ? 
       AND requirement_type = 'points'
       AND id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = ?)`,
      [user.total_points, userId]
    );

    for (let badge of eligibleBadges) {
      await connection.execute(
        'INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)',
        [userId, badge.id]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      score: earnedScore,
      totalPoints: user.total_points,
      newBadges: eligibleBadges,
      feedback
    });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
};