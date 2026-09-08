-- =============================================================
-- LetterBox seed data
-- idempotent: re-runnable
-- =============================================================
USE letter_box;

-- 6 badges (static catalog)
INSERT INTO badges (id, name, art_key, desc_text, xp_value) VALUES
  ('medal',  'First Coin',    'badgeMedal',  'Collected your very first gold coin in a quest.', 50),
  ('piggy',  'Piggy Pro',     'badgePiggy',  'Deposited 100+ coins into your savings goal.',     100),
  ('flame',  '5 Day Streak',  'badgeFlame',  'Completed quests 5 days in a row.',                 150),
  ('sprout', 'Smart Saver',   'badgeSprout', 'Completed the budget simulation.',                  100),
  ('target', 'Goal Getter',   'badgeTarget', 'Reach 100% of your personal savings goal.',         200),
  ('rocket', 'Super Saver',   'badgeRocket', 'Complete 10 quest levels without errors.',          250)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  art_key = VALUES(art_key),
  desc_text = VALUES(desc_text),
  xp_value = VALUES(xp_value);
