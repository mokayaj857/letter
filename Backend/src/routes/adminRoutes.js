const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware'); // Protect management routes
const {
  createGame, updateGame, deleteGame,
  createQuestion, updateQuestion, deleteQuestion,
  createBadge, updateBadge, deleteBadge
} = require('../controllers/adminController');

// All routes are protected by JWT authentication
router.use(authenticateToken);

// --- Games Management ---
router.post('/games', createGame);
router.put('/games/:id', updateGame);
router.delete('/games/:id', deleteGame);

// --- Questions Management ---
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);

// --- Badges Management ---
router.post('/badges', createBadge);
router.put('/badges/:id', updateBadge);
router.delete('/badges/:id', deleteBadge);

module.exports = router;