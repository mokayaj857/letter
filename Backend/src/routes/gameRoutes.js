// src/routes/gameRoutes.js
const express = require('express');
const router = express.Router();

// Placeholder route to test
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Game routes working!' });
});

module.exports = router;