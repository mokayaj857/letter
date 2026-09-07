// Placeholder / catalog route removed — game content lives client-side.
// See userRoutes.js for the real gameplay state endpoints.
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Game routes working!' });
});

module.exports = router;
