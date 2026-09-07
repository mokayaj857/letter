const pool = require('../config/db');
const { findUserByFirebaseUid, buildDashboard } = require('./userData');

// Helper to resolve DB user id from req
async function resolveUser(req) {
  const uid = req.tokenData.firebaseUid;
  if (!uid) return null;
  const user = await findUserByFirebaseUid(uid);
  return user ? user.id : null;
}

/**
 * PUT /api/user/profile
 * Body: { name?, avatar?, age?, equippedItem?, email?, title? }
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = await resolveUser(req);
    if (!userId) return res.status(404).json({ success: false, message: 'User not found.' });

    const { name, avatar, age, equippedItem, email, title } = req.body || {};
    const updates = [];
    const params = [];
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (avatar !== undefined) { updates.push('avatar = ?'); params.push(avatar); }
    if (age !== undefined) { updates.push('age = ?'); params.push(age); }
    if (equippedItem !== undefined) { updates.push('equipped_item = ?'); params.push(equippedItem); }
    if (email !== undefined) { updates.push('email = ?'); params.push(email); }
    if (title !== undefined) { updates.push('title = ?'); params.push(title); }

    if (updates.length > 0) {
      params.push(userId);
      await pool.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const dashboard = await buildDashboard(userId);
    res.json({ success: true, data: dashboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/user/settings
 * Body: any subset of settings fields
 */
exports.updateSettings = async (req, res) => {
  try {
    const userId = await resolveUser(req);
    if (!userId) return res.status(404).json({ success: false, message: 'User not found.' });

    const allowed = [
      'soundEnabled', 'musicEnabled', 'musicVolume', 'soundVolume', 'bgmTrack',
      'remindersEnabled', 'streakFreeze', 'parentPin', 'dailyLimitMinutes', 'isPrivate',
    ];
    const updates = [];
    const params = [];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        updates.push(`${key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()} = ?`);
        params.push(req.body[key]);
      }
    }
    if (updates.length > 0) {
      params.push(userId);
      await pool.execute(
        `UPDATE user_settings SET ${updates.join(', ')} WHERE user_id = ?`,
        params
      );
    }
    const dashboard = await buildDashboard(userId);
    res.json({ success: true, data: dashboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/user/goal
 * Body: { title?, target?, deposit? }
 * If deposit is present, debit coins and add to goal.current.
 */
exports.updateGoal = async (req, res) => {
  try {
    const userId = await resolveUser(req);
    if (!userId) return res.status(404).json({ success: false, message: 'User not found.' });

    const { title, target, deposit } = req.body || {};
    const [users] = await pool.execute('SELECT coins FROM users WHERE id = ?', [userId]);
    let coins = users[0] ? users[0].coins : 0;

    const [goalRows] = await pool.execute('SELECT * FROM savings_goal WHERE user_id = ?', [userId]);
    let goal = goalRows[0] || { title: 'New football boots', current: 240, target: 400 };

    let newCurrent = goal.current;
    if (typeof deposit === 'number') {
      const amt = Math.floor(Math.max(0, deposit));
      if (coins < amt) {
        return res.status(400).json({ success: false, message: 'Not enough coins.' });
      }
      coins -= amt;
      newCurrent = goal.current + amt;
      await pool.execute('UPDATE users SET coins = ? WHERE id = ?', [coins, userId]);

      // Award 'target' badge if reached
      if (newCurrent >= goal.target) {
        await pool.execute(
          `UPDATE user_badges SET got = TRUE, date_unlocked = 'Today'
           WHERE user_id = ? AND badge_id = 'target'`,
          [userId]
        );
      }
    }

    const newTitle = title !== undefined ? title : goal.title;
    const newTarget = target !== undefined ? target : goal.target;
    // upsert goal row
    await pool.execute(
      `INSERT INTO savings_goal (user_id, title, current, target)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), current = ?, target = VALUES(target)`,
      [userId, newTitle, newCurrent, newTarget, newCurrent]
    );

    const dashboard = await buildDashboard(userId);
    res.json({ success: true, data: dashboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/user/items
 * Body: { itemId, cost }
 * Buys an item: deduct coins, add to owned_items, set equipped.
 */
exports.buyItem = async (req, res) => {
  try {
    const userId = await resolveUser(req);
    if (!userId) return res.status(404).json({ success: false, message: 'User not found.' });

    const { itemId, cost } = req.body || {};
    if (!itemId || typeof cost !== 'number') {
      return res.status(400).json({ success: false, message: 'itemId and cost are required.' });
    }

    const [[owned]] = await pool.execute(
      'SELECT 1 FROM owned_items WHERE user_id = ? AND item_id = ?',
      [userId, itemId]
    );
    if (owned) {
      return res.status(400).json({ success: false, message: 'Item already owned.' });
    }

    const [[u]] = await pool.execute('SELECT coins FROM users WHERE id = ?', [userId]);
    if (u.coins < cost) {
      return res.status(400).json({ success: false, message: 'Not enough coins.' });
    }

    await pool.execute('UPDATE users SET coins = coins - ?, equipped_item = ? WHERE id = ?', [cost, itemId, userId]);
    await pool.execute('UPDATE owned_items SET equipped = FALSE WHERE user_id = ?', [userId]);
    await pool.execute(
      'INSERT INTO owned_items (user_id, item_id, equipped) VALUES (?, ?, ?)',
      [userId, itemId, true]
    );

    const dashboard = await buildDashboard(userId);
    res.json({ success: true, data: dashboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/user/items/:itemId/equip
 */
exports.equipItem = async (req, res) => {
  try {
    const userId = await resolveUser(req);
    if (!userId) return res.status(404).json({ success: false, message: 'User not found.' });

    const itemId = req.params.itemId;
    const [[owned]] = await pool.execute(
      'SELECT 1 FROM owned_items WHERE user_id = ? AND item_id = ?',
      [userId, itemId]
    );
    if (!owned) {
      return res.status(400).json({ success: false, message: 'Item not owned.' });
    }

    await pool.execute('UPDATE owned_items SET equipped = FALSE WHERE user_id = ?', [userId]);
    await pool.execute('UPDATE owned_items SET equipped = TRUE WHERE user_id = ? AND item_id = ?', [userId, itemId]);
    await pool.execute('UPDATE users SET equipped_item = ? WHERE id = ?', [itemId, userId]);

    const dashboard = await buildDashboard(userId);
    res.json({ success: true, data: dashboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/user/levels
 * Body: { gameId, levelIndex, xpReward, coinReward }
 * Server-authoritative: bump game_progress, add xp/coins/streak, level-up.
 */
exports.completeLevel = async (req, res) => {
  try {
    const userId = await resolveUser(req);
    if (!userId) return res.status(404).json({ success: false, message: 'User not found.' });

    const { gameId, levelIndex, xpReward = 0, coinReward = 0 } = req.body || {};
    if (!gameId || typeof levelIndex !== 'number') {
      return res.status(400).json({ success: false, message: 'gameId and levelIndex are required.' });
    }

    await pool.execute(
      `INSERT INTO game_progress (user_id, game_id, levels_completed)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE levels_completed = GREATEST(levels_completed, VALUES(levels_completed))`,
      [userId, gameId, levelIndex + 1]
    );

    await pool.execute(
      'UPDATE users SET xp = xp + ?, coins = coins + ?, streak = streak + 1 WHERE id = ?',
      [xpReward, coinReward, userId]
    );

    // apply level-up formula: level = floor(xp/350) + 1
    await pool.execute(
      `UPDATE users SET level = GREATEST(level, FLOOR(xp / 350) + 1) WHERE id = ?`,
      [userId]
    );

    const dashboard = await buildDashboard(userId);
    res.json({ success: true, data: dashboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/user/daily/complete
 * Body: {}
 * Marks today's daily challenge completed and awards rewards.
 */
exports.completeDaily = async (req, res) => {
  try {
    const userId = await resolveUser(req);
    if (!userId) return res.status(404).json({ success: false, message: 'User not found.' });

    const today = new Date().toISOString().slice(0, 10);
    const [rows] = await pool.execute(
      'SELECT * FROM daily_challenge WHERE user_id = ? AND day = ?',
      [userId, today]
    );
    let row = rows[0];

    if (row && row.completed) {
      return res.status(400).json({ success: false, message: 'Already completed today.' });
    }

    const title = (row && row.title) || 'Build a KES 5,000 monthly budget';
    const xp = (row && row.xp) || 150;
    const coins = (row && row.coins) || 40;

    await pool.execute(
      `INSERT INTO daily_challenge (user_id, day, completed, title, xp, coins)
       VALUES (?, ?, TRUE, ?, ?, ?)
       ON DUPLICATE KEY UPDATE completed = TRUE, title = VALUES(title), xp = VALUES(xp), coins = VALUES(coins)`,
      [userId, today, title, xp, coins]
    );
    await pool.execute('UPDATE users SET xp = xp + ?, coins = coins + ?, streak = streak + 1 WHERE id = ?', [xp, coins, userId]);
    await pool.execute('UPDATE users SET level = GREATEST(level, FLOOR(xp / 350) + 1) WHERE id = ?', [userId]);

    const dashboard = await buildDashboard(userId);
    res.json({ success: true, data: dashboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/user/badges/:badgeId/unlock
 * Grants a badge and awards its XP.
 */
exports.unlockBadge = async (req, res) => {
  try {
    const userId = await resolveUser(req);
    if (!userId) return res.status(404).json({ success: false, message: 'User not found.' });

    const badgeId = req.params.badgeId;
    const [[badge]] = await pool.execute('SELECT * FROM badges WHERE id = ?', [badgeId]);
    if (!badge) return res.status(404).json({ success: false, message: 'Badge not found.' });

    const [[existing]] = await pool.execute(
      'SELECT got FROM user_badges WHERE user_id = ? AND badge_id = ?',
      [userId, badgeId]
    );
    if (!existing || existing.got) {
      return res.status(400).json({ success: false, message: 'Badge already earned.' });
    }

    await pool.execute(
      `INSERT INTO user_badges (user_id, badge_id, got, date_unlocked)
       VALUES (?, ?, TRUE, 'Today')
       ON DUPLICATE KEY UPDATE got = TRUE, date_unlocked = 'Today'`,
      [userId, badgeId]
    );
    await pool.execute('UPDATE users SET xp = xp + ? WHERE id = ?', [badge.xp_value, userId]);
    await pool.execute('UPDATE users SET level = GREATEST(level, FLOOR(xp / 350) + 1) WHERE id = ?', [userId]);

    const dashboard = await buildDashboard(userId);
    res.json({ success: true, data: dashboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---------------- registered accounts ----------------

/**
 * GET /api/accounts
 */
exports.listAccounts = async (req, res) => {
  try {
    const userId = await resolveUser(req);
    if (!userId) return res.status(404).json({ success: false, message: 'User not found.' });
    const [rows] = await pool.execute(
      'SELECT * FROM registered_accounts WHERE owner_user_id = ?',
      [userId]
    );
    res.json({
      success: true,
      data: rows.map((a) => ({
        id: String(a.id),
        emailOrPhone: a.email_or_phone,
        name: a.name,
        avatar: a.avatar,
        age: a.age,
        provider: a.provider,
        pictureCode: a.picture_code ? a.picture_code.split('-').filter(Boolean) : undefined,
        createdAt: a.created_at,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/accounts
 * Body: { emailOrPhone, name, avatar, age, provider, pictureCode: string[] }
 */
exports.createAccount = async (req, res) => {
  try {
    const userId = await resolveUser(req);
    if (!userId) return res.status(404).json({ success: false, message: 'User not found.' });

    const { emailOrPhone, name, avatar, age, provider, pictureCode } = req.body || {};
    const pictureCodeStr = pictureCode ? pictureCode.join('-') : null;

    const [result] = await pool.execute(
      `INSERT INTO registered_accounts (owner_user_id, email_or_phone, name, avatar, age, provider, picture_code)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, emailOrPhone, name, avatar, age, provider, pictureCodeStr]
    );

    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * PUT /api/accounts/:id
 */
exports.updateAccount = async (req, res) => {
  try {
    const userId = await resolveUser(req);
    if (!userId) return res.status(404).json({ success: false, message: 'User not found.' });

    const accId = req.params.id;
    const { emailOrPhone, name, avatar, age, provider, pictureCode } = req.body || {};
    const pictureCodeStr = pictureCode ? pictureCode.join('-') : null;

    const updates = [];
    const params = [];
    if (emailOrPhone !== undefined) { updates.push('email_or_phone = ?'); params.push(emailOrPhone); }
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (avatar !== undefined) { updates.push('avatar = ?'); params.push(avatar); }
    if (age !== undefined) { updates.push('age = ?'); params.push(age); }
    if (provider !== undefined) { updates.push('provider = ?'); params.push(provider); }
    if (pictureCodeStr !== undefined) { updates.push('picture_code = ?'); params.push(pictureCodeStr); }

    if (updates.length > 0) {
      params.push(accId, userId);
      await pool.execute(
        `UPDATE registered_accounts SET ${updates.join(', ')} WHERE id = ? AND owner_user_id = ?`,
        params
      );
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * DELETE /api/accounts/:id
 */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = await resolveUser(req);
    if (!userId) return res.status(404).json({ success: false, message: 'User not found.' });
    await pool.execute('DELETE FROM registered_accounts WHERE id = ? AND owner_user_id = ?', [req.params.id, userId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
