const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/firebaseAuth');
const {
  updateProfile,
  updateSettings,
  updateGoal,
  spendCoins,
  buyItem,
  equipItem,
  completeLevel,
  completeDaily,
  unlockBadge,
  listAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} = require('../controllers/userController');

router.use(authenticateToken);

// Profile & state
router.put('/profile', updateProfile);
router.put('/settings', updateSettings);
router.put('/goal', updateGoal);
router.post('/coins/spend', spendCoins);

// Shop
router.post('/items', buyItem);
router.put('/items/:itemId/equip', equipItem);

// Levels & daily
router.post('/levels', completeLevel);
router.post('/daily/complete', completeDaily);

// Badges
router.post('/badges/:badgeId/unlock', unlockBadge);

// Registered accounts
router.get('/accounts', listAccounts);
router.post('/accounts', createAccount);
router.put('/accounts/:id', updateAccount);
router.delete('/accounts/:id', deleteAccount);

module.exports = router;
