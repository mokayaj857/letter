const pool = require('../config/db');

exports.submitGameResult = async (req, res) => {
  const userId = req.user.id;
  const gameId = req.params.id;
  const { answers, duration } = req.body; // answers: [{ questionId: 1, selected: 'A' }]

  try {
    // 1. Fetch questions for validation
    const [questions] = await pool.execute(
      'SELECT id, correct_answer, points FROM questions WHERE game_id = ?',
      [gameId]
    );

    let calculatedScore = 0;
    const qMap = new Map(questions.map(q => [q.id, q]));

    answers.forEach(ans => {
      const q = qMap.get(ans.questionId);
      if (q && q.correct_answer === ans.selected) {
        calculatedScore += q.points;
      }
    });

    // 2. Record Game Session
    await pool.execute(
      'INSERT INTO game_sessions (user_id, game_id, score, duration_seconds) VALUES (?, ?, ?, ?)',
      [userId, gameId, calculatedScore, duration || 0]
    );

    // 3. Update User Total Points
    await pool.execute('UPDATE users SET total_points = total_points + ? WHERE id = ?', [calculatedScore, userId]);

    // 4. Update or Insert Progress
    const [existingProgress] = await pool.execute(
      'SELECT highest_score FROM progress WHERE user_id = ? AND game_id = ?',
      [userId, gameId]
    );

    if (existingProgress.length > 0) {
      if (calculatedScore > existingProgress[0].highest_score) {
        await pool.execute(
          'UPDATE progress SET highest_score = ?, completion_percentage = 100.00 WHERE user_id = ? AND game_id = ?',
          [calculatedScore, userId, gameId]
        );
      }
    } else {
      await pool.execute(
        'INSERT INTO progress (user_id, game_id, highest_score, completion_percentage) VALUES (?, ?, ?, 100.00)',
        [userId, gameId, calculatedScore]
      );
    }

    // 5. Evaluate and Award Badges
    const [user] = await pool.execute('SELECT total_points FROM users WHERE id = ?', [userId]);
    const totalPoints = user[0].total_points;

    const [eligibleBadges] = await pool.execute(
      'SELECT id FROM badges WHERE requirement_points <= ? AND id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = ?)',
      [totalPoints, userId]
    );

    for (let badge of eligibleBadges) {
      await pool.execute('INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)', [userId, badge.id]);
    }

    res.json({
      success: true,
      scoreEarned: calculatedScore,
      totalPoints,
      newBadgesAwarded: eligibleBadges.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};