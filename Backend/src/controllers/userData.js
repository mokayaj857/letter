const pool = require('../config/db');

/**
 * Ensure a user row exists for a given firebase_uid (upsert by UID or email).
 * Creates default rows in all related tables if the user is new.
 */
async function ensureUser({ firebaseUid, email, username, avatar, age, provider }) {
  const [existing] = await pool.execute(
    'SELECT * FROM users WHERE firebase_uid = ? OR email = ? LIMIT 1',
    [firebaseUid || null, email || null]
  );

  let user;
  if (existing.length > 0) {
    user = existing[0];
    // fill in missing firebase_uid if matched by email
    if (!user.firebase_uid && firebaseUid) {
      await pool.execute('UPDATE users SET firebase_uid = ? WHERE id = ?', [firebaseUid, user.id]);
      user.firebase_uid = firebaseUid;
    }
    // update name/avatar if provided and user still has defaults
    const updates = [];
    const params = [];
    if (username && (user.name === 'Player' || !user.name)) {
      updates.push('name = ?'); params.push(username);
    }
    if (avatar) {
      updates.push('avatar = ?'); params.push(avatar);
    }
    if (age) {
      updates.push('age = ?'); params.push(age);
    }
    if (provider) {
      updates.push('provider = ?'); params.push(provider);
    }
    if (updates.length > 0) {
      params.push(user.id);
      await pool.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
      user = { ...user, ...Object.fromEntries(updates.map((u, i) => {
        const key = u.split(' ')[0];
        return [key, params[i]];
      })) };
    }
  } else {
    const [result] = await pool.execute(
      `INSERT INTO users (firebase_uid, email, name, avatar, age, provider, coins)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [firebaseUid || null, email || null, username || 'Player', avatar || 'lion', age || null, provider || null, 150]
    );
    const userId = result.insertId;
    user = { id: userId, firebase_uid: firebaseUid, email, name: username || 'Player', avatar: avatar || 'lion' };

    // initialize related rows
    await pool.execute(
      'INSERT INTO user_settings (user_id) VALUES (?)', [userId]
    );
    await pool.execute(
      'INSERT INTO savings_goal (user_id) VALUES (?)', [userId]
    );
    // default owned item
    await pool.execute(
      'INSERT INTO owned_items (user_id, item_id, equipped) VALUES (?, ?, ?)',
      [userId, 'shop-dino', true]
    );
    // default badges (all unearned except medal/piggy)
    const [badges] = await pool.execute('SELECT id FROM badges');
    for (const b of badges) {
      const got = (b.id === 'medal' || b.id === 'piggy') ? true : false;
      const dateUnlocked = got ? 'Today' : null;
      await pool.execute(
        'INSERT INTO user_badges (user_id, badge_id, got, date_unlocked) VALUES (?, ?, ?, ?)',
        [userId, b.id, got, dateUnlocked]
      );
    }
    // initialize game progress for all known games
    const gameIds = ['money-basics', 'budget-boss', 'save-invest', 'smart-spender', 'digital-money', 'young-hustler'];
    for (const gid of gameIds) {
      await pool.execute(
        'INSERT INTO game_progress (user_id, game_id, levels_completed) VALUES (?, ?, ?)',
        [userId, gid, 0]
      );
    }
  }
  return user;
}

/**
 * Resolve DB user by firebaseUid. Returns row or null.
 */
async function findUserByFirebaseUid(firebaseUid) {
  const [rows] = await pool.execute('SELECT * FROM users WHERE firebase_uid = ? LIMIT 1', [firebaseUid]);
  return rows.length ? rows[0] : null;
}

/**
 * Build the full dashboard payload in the exact shape of client LetterboxState.
 */
async function buildDashboard(userId, extraAuth = {}) {
  const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
  if (users.length === 0) return null;
  const u = users[0];

  const [settingsRows] = await pool.execute('SELECT * FROM user_settings WHERE user_id = ?', [userId]);
  const s = settingsRows[0] || {};
  const [goalRows] = await pool.execute('SELECT * FROM savings_goal WHERE user_id = ?', [userId]);
  const g = goalRows[0] || {};
  const [items] = await pool.execute('SELECT item_id FROM owned_items WHERE user_id = ? AND equipped = TRUE', [userId]);
  const [ownedRows] = await pool.execute('SELECT item_id FROM owned_items WHERE user_id = ?', [userId]);
  const [badgeCats] = await pool.execute('SELECT * FROM badges ORDER BY id');
  const [userBadges] = await pool.execute('SELECT * FROM user_badges WHERE user_id = ?', [userId]);
  const ubMap = Object.fromEntries(userBadges.map((r) => [r.badge_id, r]));
  const [progressRows] = await pool.execute('SELECT * FROM game_progress WHERE user_id = ?', [userId]);
  const todayStr = new Date().toISOString().slice(0, 10);
  const [dailyRows] = await pool.execute(
    'SELECT * FROM daily_challenge WHERE user_id = ? AND day = ?',
    [userId, todayStr]
  );
  const [accounts] = await pool.execute(
    'SELECT * FROM registered_accounts WHERE owner_user_id = ?',
    [userId]
  );

  const badges = (badgeCats || []).map((b) => {
    const ub = ubMap[b.id] || {};
    return {
      id: b.id,
      name: b.name,
      artKey: b.art_key,
      got: Boolean(ub.got),
      dateUnlocked: ub.date_unlocked || undefined,
      desc: b.desc_text,
      xpValue: b.xp_value,
    };
  });

  const gameProgress = {};
  for (const p of progressRows || []) gameProgress[p.game_id] = p.levels_completed;

  const daily = dailyRows[0] || {
    completed: false,
    title: 'Build a KES 5,000 monthly budget',
    xp: 150,
    coins: 40,
  };

  return {
    user: {
      name: u.name,
      avatar: u.avatar,
      level: u.level,
      title: u.title,
      coins: u.coins,
      streak: u.streak,
      xp: u.xp,
      equippedItem: (items[0] && items[0].item_id) || (ownedRows[0] && ownedRows[0].item_id) || null,
      age: u.age || undefined,
      email: u.email || undefined,
      provider: u.provider || undefined,
    },
    settings: {
      soundEnabled: s.sound_enabled !== undefined ? Boolean(s.sound_enabled) : true,
      musicEnabled: s.music_enabled !== undefined ? Boolean(s.music_enabled) : true,
      musicVolume: s.music_volume ?? 70,
      soundVolume: s.sound_volume ?? 80,
      bgmTrack: s.bgm_track || 'auto',
      remindersEnabled: s.reminders_enabled !== undefined ? Boolean(s.reminders_enabled) : true,
      streakFreeze: s.streak_freeze !== undefined ? Boolean(s.streak_freeze) : true,
      parentPin: s.parent_pin || '1234',
      dailyLimitMinutes: s.daily_limit_minutes ?? 30,
      isPrivate: s.is_private !== undefined ? Boolean(s.is_private) : false,
    },
    goal: {
      title: g.title || 'New football boots',
      current: g.current ?? 240,
      target: g.target ?? 400,
    },
    ownedItems: (ownedRows || []).map((r) => r.item_id),
    badges,
    gameProgress,
    dailyChallenge: {
      completed: Boolean(daily.completed),
      title: daily.title,
      xp: daily.xp,
      coins: daily.coins,
    },
    registeredAccounts: (accounts || []).map((a) => ({
      id: String(a.id),
      emailOrPhone: a.email_or_phone || '',
      name: a.name || '',
      avatar: a.avatar || 'lion',
      age: a.age || undefined,
      provider: a.provider || undefined,
      pictureCode: a.picture_code ? a.picture_code.split('-').filter(Boolean) : undefined,
      createdAt: a.created_at instanceof Date ? a.created_at.toISOString() : a.created_at,
    })),
    auth: {
      isLoggedIn: true,
      email: u.email || undefined,
      provider: u.provider || undefined,
      ...extraAuth,
    },
  };
}

module.exports = { ensureUser, findUserByFirebaseUid, buildDashboard };
