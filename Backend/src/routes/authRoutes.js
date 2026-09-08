const express = require('express');
const router = express.Router();
const { socialLogin, dashboard } = require('../controllers/authController');
const authenticateToken = require('../middleware/firebaseAuth');

// Public: upsert + return dashboard (used by client's social login sync)
router.post('/social-login', socialLogin);

// Protected: full dashboard for login hydration
router.get('/dashboard', authenticateToken, dashboard);

module.exports = router;
