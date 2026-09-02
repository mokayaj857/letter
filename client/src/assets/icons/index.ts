import avatarLion from "./avatar-lion.png";
import avatarKoala from "./avatar-koala.png";
import avatarRabbit from "./avatar-rabbit.png";
import avatarMonkey from "./avatar-monkey.png";
import avatarFox from "./avatar-fox.png";
import avatarPanda from "./avatar-panda.png";
import avatarPenguin from "./avatar-penguin.png";
import avatarFrog from "./avatar-frog.png";

import gameMoneyBasics from "./game-money-basics.png";
import gameBudgetBoss from "./game-budget-boss.png";
import gameSaveGrow from "./game-save-grow.png";
import gameSmartSpender from "./game-smart-spender.png";
import gameDigitalMoney from "./game-digital-money.png";
import gameYoungHustler from "./game-young-hustler.png";

import badgeMedal from "./badge-medal.png";
import badgePiggy from "./badge-piggy.png";
import badgeFlame from "./badge-flame.png";
import badgeSprout from "./badge-sprout.png";
import badgeTarget from "./badge-target.png";
import badgeRocket from "./badge-rocket.png";

import shopDino from "./shop-dino.png";
import shopRainbow from "./shop-rainbow.png";
import shopCrown from "./shop-crown.png";
import shopBalloon from "./shop-balloon.png";

import coin from "./coin.png";
import trophy from "./trophy.png";

export const avatars = {
  lion: avatarLion,
  koala: avatarKoala,
  rabbit: avatarRabbit,
  monkey: avatarMonkey,
  fox: avatarFox,
  panda: avatarPanda,
  penguin: avatarPenguin,
  frog: avatarFrog,
} as const;

export type AvatarKey = keyof typeof avatars;

export const avatarList = Object.entries(avatars) as [AvatarKey, string][];

export const gameArt = {
  "money-basics": gameMoneyBasics,
  "budget-boss": gameBudgetBoss,
  "save-invest": gameSaveGrow,
  "smart-spender": gameSmartSpender,
  "digital-money": gameDigitalMoney,
  "young-hustler": gameYoungHustler,
} as const;

export const icons = {
  coin,
  trophy,
  badgeMedal,
  badgePiggy,
  badgeFlame,
  badgeSprout,
  badgeTarget,
  badgeRocket,
  shopDino,
  shopRainbow,
  shopCrown,
  shopBalloon,
};
