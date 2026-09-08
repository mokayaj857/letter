const { admin, adminApp, isFirebaseReady } = require('../config/firebaseAdmin');

/**
 * Verify the Firebase ID token from the Authorization header.
 * If firebase-admin is not configured (dev fallback), trusts the
 * `x-firebase-uid` header / `firebaseUid` in the body instead.
 *
 * Attaches to req:
 *   req.user     = { firebaseUid, email, name, id }  (id = DB user id)
 *   req.dbUser   = full user row (optional unless findUser set)
 */
async function authenticateFirebaseToken(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  let uid = null;
  let email = null;
  let name = null;

  if (isFirebaseReady() && token) {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      uid = decoded.uid;
      email = decoded.email || null;
      name = decoded.name || null;
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
  } else if (token === undefined || token === null) {
    // No token provided
  }

  // Dev fallback: allow uid passed via header/body when Firebase isn't configured
  if (!uid) {
    const headerUid = req.headers['x-firebase-uid'];
    const bodyUid = req.body && req.body.firebaseUid;
    const paramUid = req.params && req.params.firebaseUid;
    uid = headerUid || bodyUid || paramUid || null;
    email = (req.headers['x-firebase-email']) || (req.body && req.body.email) || null;
    name = (req.headers['x-firebase-name']) || (req.body && req.body.username) || null;
  }

  if (!uid) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  req.tokenData = { firebaseUid: uid, email, name };
  next();
}

module.exports = authenticateFirebaseToken;
