-- =============================================================
-- LetterBox Backend Schema
-- MySQL
-- =============================================================
CREATE DATABASE IF NOT EXISTS letter_box;
USE letter_box;

-- -------------------------------------------------------------
-- 1. users
-- -------------------------------------------------------------
DROP TABLE IF EXISTS registered_accounts;
DROP TABLE IF EXISTS user_badges;
DROP TABLE IF EXISTS badges;
DROP TABLE IF EXISTS game_progress;
DROP TABLE IF EXISTS daily_challenge;
DROP TABLE IF EXISTS owned_items;
DROP TABLE IF EXISTS savings_goal;
DROP TABLE IF EXISTS user_settings;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  firebase_uid  VARCHAR(128) UNIQUE,
  email         VARCHAR(255) UNIQUE,
  name          VARCHAR(100) NOT NULL DEFAULT 'Player',
  avatar        VARCHAR(20)  NOT NULL DEFAULT 'lion',
  level         INT UNSIGNED NOT NULL DEFAULT 1,
  title         VARCHAR(50)  NOT NULL DEFAULT 'Beginner Saver',
  coins         INT UNSIGNED NOT NULL DEFAULT 100,
  streak        INT UNSIGNED NOT NULL DEFAULT 1,
  xp            INT UNSIGNED NOT NULL DEFAULT 250,
  equipped_item VARCHAR(30)  NULL,
  age           VARCHAR(10)  NULL,
  provider      VARCHAR(20)  NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------
-- 2. user_settings (1:1 with users)
-- -------------------------------------------------------------
CREATE TABLE user_settings (
  user_id            INT UNSIGNED PRIMARY KEY,
  sound_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  music_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  music_volume       TINYINT UNSIGNED NOT NULL DEFAULT 70,
  sound_volume       TINYINT UNSIGNED NOT NULL DEFAULT 80,
  bgm_track          VARCHAR(30)  NOT NULL DEFAULT 'auto',
  reminders_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  streak_freeze      BOOLEAN NOT NULL DEFAULT TRUE,
  parent_pin         VARCHAR(10)  NOT NULL DEFAULT '1234',
  daily_limit_minutes SMALLINT UNSIGNED NOT NULL DEFAULT 30,
  is_private         BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 3. savings_goal (1:1 with users)
-- -------------------------------------------------------------
CREATE TABLE savings_goal (
  user_id INT UNSIGNED PRIMARY KEY,
  title   VARCHAR(100) NOT NULL DEFAULT 'New football boots',
  current INT UNSIGNED NOT NULL DEFAULT 240,
  target  INT UNSIGNED NOT NULL DEFAULT 400,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 4. owned_items
--   item_id values: shop-dino, shop-rainbow, shop-crown, shop-balloon
-- -------------------------------------------------------------
CREATE TABLE owned_items (
  user_id  INT UNSIGNED NOT NULL,
  item_id  VARCHAR(30) NOT NULL,
  equipped BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (user_id, item_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 5. badges (static catalog, seeded)
-- -------------------------------------------------------------
CREATE TABLE badges (
  id        VARCHAR(20) PRIMARY KEY,
  name      VARCHAR(50)  NOT NULL,
  art_key   VARCHAR(30)  NOT NULL,
  desc_text VARCHAR(200) NOT NULL,
  xp_value  INT UNSIGNED NOT NULL DEFAULT 0
);

-- -------------------------------------------------------------
-- 6. user_badges
-- -------------------------------------------------------------
CREATE TABLE user_badges (
  user_id       INT UNSIGNED NOT NULL,
  badge_id      VARCHAR(20) NOT NULL,
  got           BOOLEAN NOT NULL DEFAULT FALSE,
  date_unlocked VARCHAR(20) NULL,
  PRIMARY KEY (user_id, badge_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 7. game_progress
--   game_id values: money-basics, budget-boss, save-invest,
--                   smart-spender, digital-money, young-hustler
-- -------------------------------------------------------------
CREATE TABLE game_progress (
  user_id          INT UNSIGNED NOT NULL,
  game_id          VARCHAR(30) NOT NULL,
  levels_completed INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, game_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 8. daily_challenge (per user, per day)
-- -------------------------------------------------------------
CREATE TABLE daily_challenge (
  user_id   INT UNSIGNED NOT NULL,
  day       DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  title     VARCHAR(150) NULL,
  xp        INT UNSIGNED NULL,
  coins     INT UNSIGNED NULL,
  PRIMARY KEY (user_id, day),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 9. registered_accounts (kids' accounts under a Firebase owner)
-- -------------------------------------------------------------
CREATE TABLE registered_accounts (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_user_id  INT UNSIGNED NULL,
  email_or_phone VARCHAR(255) NULL,
  name           VARCHAR(100) NULL,
  avatar         VARCHAR(20)  NULL,
  age            VARCHAR(10)  NULL,
  provider       VARCHAR(20)  NULL,
  picture_code   VARCHAR(100) NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE CASCADE
);
