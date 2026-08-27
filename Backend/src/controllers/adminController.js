const pool = require('../config/db');

// ==========================================
// GAMES CRUD
// ==========================================

// Create Game
exports.createGame = async (req, res) => {
  const { title, description, category, difficulty, level, image } = req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO games (title, description, category, difficulty, level, image) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, category, difficulty || 'Easy', level || 1, image || null]
    );

    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      gameId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Game
exports.updateGame = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, difficulty, level, image, is_active } = req.body;

  try {
    const [result] = await pool.execute(
      `UPDATE games 
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           category = COALESCE(?, category),
           difficulty = COALESCE(?, difficulty),
           level = COALESCE(?, level),
           image = COALESCE(?, image),
           is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [title, description, category, difficulty, level, image, is_active, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    res.json({ success: true, message: 'Game updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Game (Cascades to Questions & Sessions per DB Constraints)
exports.deleteGame = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM games WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Game not found' });
    }

    res.json({ success: true, message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// QUESTIONS CRUD
// ==========================================

// Create Question
exports.createQuestion = async (req, res) => {
  const { game_id, question, options, correct_answer, explanation, points } = req.body;

  try {
    // Stringify JS array if not already JSON string
    const optionsJson = typeof options === 'string' ? options : JSON.stringify(options);

    const [result] = await pool.execute(
      `INSERT INTO questions (game_id, question, options, correct_answer, explanation, points)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [game_id, question, optionsJson, correct_answer, explanation || null, points || 10]
    );

    res.status(201).json({
      success: true,
      message: 'Question added successfully',
      questionId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Question
exports.updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question, options, correct_answer, explanation, points } = req.body;

  try {
    const optionsJson = options ? (typeof options === 'string' ? options : JSON.stringify(options)) : null;

    const [result] = await pool.execute(
      `UPDATE questions
       SET question = COALESCE(?, question),
           options = COALESCE(?, options),
           correct_answer = COALESCE(?, correct_answer),
           explanation = COALESCE(?, explanation),
           points = COALESCE(?, points)
       WHERE id = ?`,
      [question, optionsJson, correct_answer, explanation, points, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.json({ success: true, message: 'Question updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Question
exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM questions WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// BADGES CRUD
// ==========================================

// Create Badge
exports.createBadge = async (req, res) => {
  const { name, description, icon, requirement_points, requirement_type } = req.body;
  try {
    const [result] = await pool.execute(
      `INSERT INTO badges (name, description, icon, requirement_points, requirement_type)
       VALUES (?, ?, ?, ?, ?)`,
      [name, description, icon, requirement_points || 0, requirement_type || 'points']
    );

    res.status(201).json({
      success: true,
      message: 'Badge created successfully',
      badgeId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Badge
exports.updateBadge = async (req, res) => {
  const { id } = req.params;
  const { name, description, icon, requirement_points, requirement_type } = req.body;

  try {
    const [result] = await pool.execute(
      `UPDATE badges
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           icon = COALESCE(?, icon),
           requirement_points = COALESCE(?, requirement_points),
           requirement_type = COALESCE(?, requirement_type)
       WHERE id = ?`,
      [name, description, icon, requirement_points, requirement_type, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Badge not found' });
    }

    res.json({ success: true, message: 'Badge updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Badge
exports.deleteBadge = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.execute('DELETE FROM badges WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Badge not found' });
    }

    res.json({ success: true, message: 'Badge deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};