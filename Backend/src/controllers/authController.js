const pool = require('../config/db');
const { ensureUser, findUserByFirebaseUid, buildDashboard } = require('./userData');

/**
 * POST /api/auth/social-login
 * Body: { provider, email, username, avatar?, age?, firebaseUid }
 * Upserts the user and returns the full dashboard payload.
 */
exports.socialLogin = async (req, res) => {
  const { provider, email, username, avatar, age, firebaseUid } = req.body || {};

  if (!firebaseUid && !email) {
    return res.status(400).json({ success: false, message: 'firebaseUid or email is required.' });
  }

  try {
    const tokenData = req.tokenData || {};
    const uid = firebaseUid || tokenData.firebaseUid;
    const user = await ensureUser({
      firebaseUid: uid,
      email: email || tokenData.email,
      username: username || tokenData.name,
      avatar,
      age,
      provider: provider || 'email',
    });

    const dashboard = await buildDashboard(user.id, {
      provider,
      token: null,
    });
    res.status(200).json({ success: true, data: dashboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/auth/dashboard
 * Protected (Bearer token). Returns full profile state for login hydration.
 */
exports.dashboard = async (req, res) => {
  try {
    const uid = req.tokenData.firebaseUid;
    let user = uid ? await findUserByFirebaseUid(uid) : null;

    // If firebase-admin verified a token but user has no DB row yet, ensure it
    if (!user && req.tokenData.firebaseUid) {
      user = await ensureUser({
        firebaseUid: uid,
        email: req.tokenData.email,
        username: req.tokenData.name,
        provider: 'email',
      });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const dashboard = await buildDashboard(user.id);
    res.status(200).json({ success: true, data: dashboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
