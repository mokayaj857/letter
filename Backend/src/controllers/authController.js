const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, email, password, age } = req.body;
  
  // Normalize optional email
  const userEmail = email && email.trim() !== '' ? email : null;

  try {
    // 1. Check existing username or email safely
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE username = ? OR (email IS NOT NULL AND email = ?)',
      [username, userEmail]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username or Email already exists.' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert User
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash, age) VALUES (?, ?, ?, ?)',
      [username, userEmail, hashedPassword, age]
    );

    // 4. Generate JWT
    const token = jwt.sign(
      { id: result.insertId, username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token,
      user: { id: result.insertId, username, email: userEmail, age }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, email: user.email, age: user.age, points: user.total_points }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};