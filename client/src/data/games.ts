import { gameArt } from "@/assets/icons";
import type { AnyGame } from "@/games/types";
import {
  foundationsWordSearch1,
  foundationsWordSearch2,
  foundationsQuiz,
  foundationsCrossword3,
  foundationsCrossword4,
} from "@/games/money-basics/foundations-of-money";
import {
  kenyanCurrencyWordSearch1,
  kenyanCurrencyWordSearch2,
  kenyanCurrencyWordSearch3,
  kenyanCurrencyWordSearch4,
  kenyanCurrencyQuiz1,
  kenyanCurrencyCrossword1,
  kenyanCurrencyCrossword2,
  tactileSecurityActivity,
} from "@/games/money-basics/features-of-kenyan-currency";
import {
  mpesaWordSearch,
  mpesaQuiz,
  mpesaGoQuiz,
  mpesaCrossword1,
  mpesaCrossword2,
} from "@/games/money-basics/characteristics-of-mpesa";
import {
  kenyanExportsWordSearch,
  kenyanExportsQuiz,
} from "@/games/money-basics/kenyan-exports";
import {
  kenyanImportsWordSearch1,
  kenyanImportsWordSearch2,
  kenyanImportsQuiz,
} from "@/games/money-basics/kenyan-imports";
import {
  currenciesKenyaWordSearch1,
  currenciesKenyaWordSearch2,
  currenciesKenyaQuiz,
  currenciesKenyaCryptogram,
} from "@/games/money-basics/currencies-of-kenya";
import {
  historyOfTradeWordSearch1,
  historyOfTradeWordSearch2,
  historyOfTradeWordSearch3,
  historyOfTradeWordSearch4,
  historyOfTradeQuiz,
  historyOfTradeCrossword5,
} from "@/games/global-money/history-of-trade";
import {
  currenciesAfricaWordSearch1,
  currenciesAfricaWordSearch2,
  currenciesAfricaQuiz,
} from "@/games/global-money/currencies-africa";
import {
  currenciesAmericaWordSearch,
  currenciesEuropeWordSearch,
  currenciesMiddleEastWordSearch,
  currenciesAsiaWordSearch1,
  currenciesAsiaWordSearch2,
} from "@/games/global-money/currencies-world";
import {
  africaExportsWordSearch1,
  africaExportsWordSearch2,
  africaExportsWordSearch3,
} from "@/games/global-money/africa-exports";
import {
  currenciesAfricaCryptogram,
  currenciesAfricaCryptoQuiz,
  afroNoteActivity,
  currenciesAmericaCryptogram,
  currenciesAmericaQuiz,
  worldCupTicketActivity,
  currenciesEuropeCryptogram,
  currenciesEuropeQuiz,
  europeDailyCapActivity,
  currenciesMiddleEastCryptogram,
  currenciesMiddleEastQuiz,
  currenciesAsiaCryptogram,
  currenciesAsiaQuiz,
  africanCitiesWordSearch,
} from "@/games/global-money/cryptograms";
import {
  budgetingWordSearch1,
  budgetingWordSearch2,
  budgetingWordSearch3,
  budgetingQuiz,
  schoolBudgetChallengeActivity,
  homeTreasureHuntActivity,
} from "@/games/spending-saving/budgeting";
import {
  consumerSkillsWordSearch1,
  consumerSkillsWordSearch2,
  consumerSkillsWordSearch3,
  consumerSkillsWordSearch4,
  consumerSkillsWordSearch5,
  consumerSkillsQuiz,
} from "@/games/spending-saving/consumer-skills";
import {
  savvyShopperWordSearch,
  savvyShopperQuiz,
} from "@/games/spending-saving/savvy-shopper";
import {
  paymentMethodsWordSearch1,
  paymentMethodsWordSearch2,
  paymentMethodsWordSearch3,
  paymentMethodsQuiz,
} from "@/games/spending-saving/methods-of-payment";
import {
  bankingWordSearch1,
  bankingWordSearch2,
  bankingQuiz,
  bankAccountsMatcherActivity,
  savingWordSearch,
  bankingSwahiliWordSearch,
} from "@/games/spending-saving/banking";
import {
  bankingCryptogram,
  bankingCryptoQuiz,
  teenAccountActivity,
  bankAccountsCryptogram,
  bankAccountsQuiz,
} from "@/games/spending-saving/banking-cryptograms";
import {
  videoGamesCrossword1,
  videoGamesCrossword2,
  videoGamesCrossword3,
  videoGamesQuiz,
  squadOutingActivity,
} from "@/games/spending-saving/video-games";
import {
  creditLoansWordSearch1,
  creditLoansWordSearch2,
  creditLoansQuiz,
} from "@/games/spending-saving/credit-loans";
import {
  digitalEconomyWordSearch,
  digitalEconomyQuiz,
} from "@/games/spending-saving/digital-economy";
import {
  wouldYouRatherActivity,
  smartMoneyPledgeActivity,
} from "@/games/spending-saving/activities";
import {
  earningWordSearch1,
  earningWordSearch2,
  earningQuiz,
  earningCrossword3,
  earningCrossword4,
  earningQuiz2,
} from "@/games/earning-growing/earning";
import {
  careersWordSearch1,
  careersWordSearch2,
  careersWordSearch3,
  careersWordSearch4,
  careersWordSearch5,
  careersWordSearch6,
  careersWordSearch7,
  careersWordSearch8,
  careersWordSearch9,
  careersWordSearch10,
  careersQuiz1,
  careersQuiz2,
} from "@/games/earning-growing/careers-employment";
import {
  entrepreneurshipWordSearch1,
  entrepreneurshipWordSearch2,
  entrepreneurshipWordSearch3,
  entrepreneurshipQuiz,
  photographerGigActivity,
} from "@/games/earning-growing/entrepreneurship";
import {
  investingWordSearch1,
  investingWordSearch2,
  investingWordSearch3,
  investingWordSearch4,
  investingWordSearch5,
  investingQuiz1,
  investingQuiz2,
} from "@/games/earning-growing/investing";

export interface Level {
  title: string;
  kind: "wordsearch" | "crossword" | "quiz" | "cryptogram" | "sim" | "activity" | "lesson" | "boss";
  state: "done" | "current" | "locked";
  xp: number;
  gameData?: AnyGame;
}

export interface Game {
  id: string;
  title: string;
  blurb: string;
  art: string;
  tint: string;
  locked?: boolean;
  comingSoon?: boolean;
  unlockXp?: number;
  done: number;
  levels: Level[];
}

const LEVEL_KIND_ORDER: Record<Level["kind"], number> = {
  wordsearch: 0,
  quiz: 1,
  boss: 1,
  crossword: 2,
  cryptogram: 3,
  activity: 4,
  sim: 4,
  lesson: 1,
};

function withProgress(levels: Omit<Level, "state">[], opening: "done" | "current" = "current"): Level[] {
  return levels.map((level, i) => ({
    ...level,
    state: i === 0 ? opening : opening === "done" && i === 1 ? "current" : "locked",
  }));
}

function orderedTopic(...parts: Omit<Level, "state">[][]): Omit<Level, "state">[] {
  return parts.flat().sort((a, b) => LEVEL_KIND_ORDER[a.kind] - LEVEL_KIND_ORDER[b.kind]);
}

function lv(
  title: string,
  kind: Level["kind"],
  xp: number,
  gameData: AnyGame,
): Omit<Level, "state"> {
  return { title, kind, xp, gameData };
}

export const games: Game[] = [
  {
    id: "money-basics",
    title: "Money Basics",
    blurb: "Where money comes from, value, Kenyan currency & trade.",
    art: gameArt["money-basics"],
    tint: "bg-sun",
    done: 1,
    levels: withProgress(
      [
        ...orderedTopic([
          lv("Foundations of Money: Word Search", "wordsearch", 60, foundationsWordSearch1),
          lv("Foundations of Money: Word Search 2", "wordsearch", 60, foundationsWordSearch2),
          lv("Foundations of Money: Quiz", "quiz", 80, foundationsQuiz),
          lv("Foundations of Money: Crossword 3", "crossword", 75, foundationsCrossword3),
          lv("Foundations of Money: Crossword 4", "crossword", 75, foundationsCrossword4),
        ]),
        ...orderedTopic([
          lv("Features of Kenyan Currency: Word Search", "wordsearch", 60, kenyanCurrencyWordSearch1),
          lv("Features of Kenyan Currency: Word Search 2", "wordsearch", 60, kenyanCurrencyWordSearch2),
          lv("Features of Kenyan Currency: Word Search 3", "wordsearch", 60, kenyanCurrencyWordSearch3),
          lv("Features of Kenyan Currency: Word Search 4", "wordsearch", 60, kenyanCurrencyWordSearch4),
          lv("Features of Kenyan Currency: Quiz", "quiz", 80, kenyanCurrencyQuiz1),
          lv("Currency Security: Crossword", "crossword", 75, kenyanCurrencyCrossword1),
          lv("Currency Security: Crossword 2", "crossword", 75, kenyanCurrencyCrossword2),
          lv("Banknote Tactile Bars Inspection", "activity", 100, tactileSecurityActivity),
        ]),
        ...orderedTopic([
          lv("Characteristics of M-Pesa: Word Search", "wordsearch", 60, mpesaWordSearch),
          lv("Characteristics of M-Pesa: Quiz", "quiz", 80, mpesaQuiz),
          lv("M-Pesa GO & Youth Security Quiz", "quiz", 80, mpesaGoQuiz),
          lv("M-Pesa GO & Privacy: Crossword", "crossword", 70, mpesaCrossword1),
          lv("Characteristics of M-Pesa: Crossword 2", "crossword", 70, mpesaCrossword2),
        ]),
        ...orderedTopic([
          lv("Kenyan Exports: Word Search", "wordsearch", 60, kenyanExportsWordSearch),
          lv("Kenyan Exports: Quiz", "quiz", 80, kenyanExportsQuiz),
        ]),
        ...orderedTopic([
          lv("Kenyan Imports: Word Search", "wordsearch", 60, kenyanImportsWordSearch1),
          lv("Kenyan Imports: Word Search 2", "wordsearch", 60, kenyanImportsWordSearch2),
          lv("Kenyan Imports: Quiz", "quiz", 80, kenyanImportsQuiz),
        ]),
        ...orderedTopic([
          lv("Currencies of Kenya: Word Search 1", "wordsearch", 60, currenciesKenyaWordSearch1),
          lv("Currencies of Kenya: Word Search 2", "wordsearch", 60, currenciesKenyaWordSearch2),
          lv("Currencies of Kenya: Quiz", "quiz", 80, currenciesKenyaQuiz),
          lv("Currencies of Kenya: A1Z26 Cryptogram", "cryptogram", 150, currenciesKenyaCryptogram),
        ]),
      ],
      "done",
    ),
  },
  {
    id: "global-money",
    title: "Global Money & Trade",
    blurb: "Ancient African trade routes, cowrie shells, and world currencies.",
    art: gameArt["digital-money"],
    tint: "bg-sky",
    done: 0,
    levels: withProgress([
        ...orderedTopic([
          lv("History of Trade in Africa: Word Search", "wordsearch", 60, historyOfTradeWordSearch1),
          lv("History of Trade in Africa: Word Search 2", "wordsearch", 60, historyOfTradeWordSearch2),
          lv("History of Trade in Africa: Word Search 3", "wordsearch", 60, historyOfTradeWordSearch3),
          lv("History of Trade in Africa: Word Search 4", "wordsearch", 60, historyOfTradeWordSearch4),
          lv("Trans-Saharan & Maritime Trade: Quiz", "quiz", 80, historyOfTradeQuiz),
          lv("History of Trade in Africa: Crossword 5", "crossword", 75, historyOfTradeCrossword5),
        ]),
        ...orderedTopic([
          lv("Currencies of Africa: Word Search", "wordsearch", 60, currenciesAfricaWordSearch1),
          lv("Currencies of Africa: Word Search 2", "wordsearch", 60, currenciesAfricaWordSearch2),
          lv("Notable Cities of Africa: Word Search", "wordsearch", 60, africanCitiesWordSearch),
          lv("Currencies of Africa: Quiz", "quiz", 80, currenciesAfricaQuiz),
          lv("Currencies of Africa: Cryptogram Quiz", "quiz", 80, currenciesAfricaCryptoQuiz),
          lv("Currencies of Africa: A1Z26 Cryptogram", "cryptogram", 150, currenciesAfricaCryptogram),
          lv("Design a 100 Afro Note", "activity", 100, afroNoteActivity),
        ]),
        ...orderedTopic([
          lv("Currencies of the Americas: Word Search", "wordsearch", 60, currenciesAmericaWordSearch),
          lv("Currencies of the Americas: Quiz", "quiz", 80, currenciesAmericaQuiz),
          lv("Currencies of the Americas: A1Z26 Cryptogram", "cryptogram", 150, currenciesAmericaCryptogram),
          lv("The Three-Nation Ticket Budget", "activity", 100, worldCupTicketActivity),
        ]),
        ...orderedTopic([
          lv("Currencies of Europe: Word Search", "wordsearch", 60, currenciesEuropeWordSearch),
          lv("Currencies of Europe: Quiz", "quiz", 80, currenciesEuropeQuiz),
          lv("Currencies of Europe: A1Z26 Cryptogram", "cryptogram", 150, currenciesEuropeCryptogram),
          lv("The Daily Cap Calculation", "activity", 100, europeDailyCapActivity),
        ]),
        ...orderedTopic([
          lv("Currencies of the Middle East: Word Search", "wordsearch", 60, currenciesMiddleEastWordSearch),
          lv("Currencies of the Middle East: Quiz", "quiz", 80, currenciesMiddleEastQuiz),
          lv("Currencies of the Middle East: A1Z26 Cryptogram", "cryptogram", 150, currenciesMiddleEastCryptogram),
        ]),
        ...orderedTopic([
          lv("Currencies of Asia: Word Search 1", "wordsearch", 60, currenciesAsiaWordSearch1),
          lv("Currencies of Asia: Word Search 2", "wordsearch", 60, currenciesAsiaWordSearch2),
          lv("Currencies of Asia: Quiz", "quiz", 80, currenciesAsiaQuiz),
          lv("Currencies of Asia: A1Z26 Cryptogram", "cryptogram", 150, currenciesAsiaCryptogram),
        ]),
        ...orderedTopic([
          lv("Africa’s Exports: Word Search 1", "wordsearch", 60, africaExportsWordSearch1),
          lv("Africa’s Exports: Word Search 2", "wordsearch", 60, africaExportsWordSearch2),
          lv("Africa’s Exports: Word Search 3", "wordsearch", 60, africaExportsWordSearch3),
        ]),
      ]),
  },
  {
    id: "earning",
    title: "Earning",
    blurb: "Active wages, future careers, freelancing and workplace skills.",
    art: gameArt["smart-spender"],
    tint: "bg-leaf",
    done: 0,
    levels: withProgress([
      ...orderedTopic([
        lv("Sources of Income: Word Search", "wordsearch", 60, earningWordSearch1),
        lv("Sources of Income: Word Search 2", "wordsearch", 60, earningWordSearch2),
        lv("Earned vs Passive Income: Quiz", "quiz", 80, earningQuiz),
        lv("Types of Income: Quiz 2", "quiz", 80, earningQuiz2),
        lv("Types of Income: Crossword 3", "crossword", 75, earningCrossword3),
        lv("Types of Income: Crossword 4", "crossword", 75, earningCrossword4),
      ]),
      ...orderedTopic([
        lv("Careers & Employment: Word Search 1", "wordsearch", 60, careersWordSearch1),
        lv("Careers & Employment: Word Search 2", "wordsearch", 60, careersWordSearch2),
        lv("Workplace Skills & Ethics: Word Search", "wordsearch", 60, careersWordSearch3),
        lv("Careers & Employment: Word Search 4", "wordsearch", 60, careersWordSearch4),
        lv("Careers & Employment: Word Search 5", "wordsearch", 60, careersWordSearch5),
        lv("Careers & Employment: Word Search 6", "wordsearch", 60, careersWordSearch6),
        lv("Careers & Employment: Word Search 7", "wordsearch", 60, careersWordSearch7),
        lv("Careers & Employment: Word Search 8", "wordsearch", 60, careersWordSearch8),
        lv("Careers & Employment: Word Search 9", "wordsearch", 60, careersWordSearch9),
        lv("Careers & Employment: Word Search 10", "wordsearch", 60, careersWordSearch10),
        lv("Career Navigation & Employability: Quiz", "quiz", 80, careersQuiz1),
        lv("Professional Ethics Quiz", "quiz", 150, careersQuiz2),
      ]),
    ]),
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    blurb: "Start a mini business, calculate profit, and pitch like a founder.",
    art: gameArt["young-hustler"],
    tint: "bg-sun",
    done: 0,
    levels: withProgress([
      ...orderedTopic([
        lv("Startup Foundations & Strategy: Word Search", "wordsearch", 60, entrepreneurshipWordSearch1),
        lv("Branding, Pitch & Suppliers: Word Search", "wordsearch", 60, entrepreneurshipWordSearch2),
        lv("Business Expansion & Permits: Word Search", "wordsearch", 60, entrepreneurshipWordSearch3),
        lv("Business Planning & Jua Kali: Quiz", "quiz", 80, entrepreneurshipQuiz),
        lv("Family Event Photographer Gig Project", "activity", 150, photographerGigActivity),
      ]),
    ]),
  },
  {
    id: "budgeting",
    title: "Budgeting",
    blurb: "Plan a monthly budget, needs vs wants, and master spending.",
    art: gameArt["budget-boss"],
    tint: "bg-primary-soft",
    done: 0,
    levels: withProgress([
      ...orderedTopic([
        lv("Needs vs Wants: Word Search", "wordsearch", 60, budgetingWordSearch1),
        lv("Expense Forecasts & Cutbacks: Word Search", "wordsearch", 60, budgetingWordSearch2),
        lv("Fixed vs Variable Costs: Word Search", "wordsearch", 60, budgetingWordSearch3),
        lv("Budget Allocation & Priorities: Quiz", "quiz", 80, budgetingQuiz),
        lv("Home Treasure Hunt & Waste Audit", "activity", 100, homeTreasureHuntActivity),
        lv("The KSh 8,000 School Shopping Challenge", "activity", 120, schoolBudgetChallengeActivity),
      ]),
      ...orderedTopic([
        lv("Savvy Shopper: Word Search", "wordsearch", 60, savvyShopperWordSearch),
        lv("Savvy Shopper: Quiz", "quiz", 80, savvyShopperQuiz),
      ]),
      ...orderedTopic([
        lv("Video Games: Quiz", "quiz", 80, videoGamesQuiz),
        lv("Video Games: Crossword 1", "crossword", 75, videoGamesCrossword1),
        lv("Video Games: Crossword 2", "crossword", 75, videoGamesCrossword2),
        lv("Video Games: Crossword 3", "crossword", 75, videoGamesCrossword3),
        lv("Plan a Squad Outing", "activity", 100, squadOutingActivity),
      ]),
      ...orderedTopic([
        lv("Consumer Skills & Bargaining: Word Search", "wordsearch", 60, consumerSkillsWordSearch1),
        lv("Consumer Skills: Word Search 2", "wordsearch", 60, consumerSkillsWordSearch2),
        lv("Consumer Skills: Word Search 3", "wordsearch", 60, consumerSkillsWordSearch3),
        lv("Consumer Skills: Word Search 4", "wordsearch", 60, consumerSkillsWordSearch4),
        lv("Consumer Skills: Word Search 5", "wordsearch", 60, consumerSkillsWordSearch5),
        lv("Consumer Skills: Quiz", "quiz", 80, consumerSkillsQuiz),
      ]),
    ]),
  },
  {
    id: "saving",
    title: "Saving",
    blurb: "Emergency funds, bank accounts, and delayed gratification.",
    art: gameArt["save-invest"],
    tint: "bg-sky",
    done: 0,
    levels: withProgress([
      ...orderedTopic([
        lv("Saving: Word Search", "wordsearch", 60, savingWordSearch),
      ]),
      ...orderedTopic([
        lv("Banking Foundations & Deposits: Word Search", "wordsearch", 60, bankingWordSearch1),
        lv("Banking: Word Search 2", "wordsearch", 60, bankingWordSearch2),
        lv("Banking Swahili: Word Search", "wordsearch", 60, bankingSwahiliWordSearch),
        lv("Banking & Savings Accounts: Quiz", "quiz", 80, bankingQuiz),
        lv("Banking Cryptogram: Quiz", "quiz", 80, bankingCryptoQuiz),
        lv("Banking: A1Z26 Cryptogram", "cryptogram", 150, bankingCryptogram),
        lv("Opening a Teen Account", "activity", 100, teenAccountActivity),
      ]),
      ...orderedTopic([
        lv("Types of Bank Accounts: Quiz", "quiz", 80, bankAccountsQuiz),
        lv("Types of Bank Accounts: A1Z26 Cryptogram", "cryptogram", 150, bankAccountsCryptogram),
        lv("Piggy Vault Match-Up", "activity", 150, bankAccountsMatcherActivity),
      ]),
      ...orderedTopic([
        lv("Methods of Payment: Word Search", "wordsearch", 60, paymentMethodsWordSearch1),
        lv("Methods of Payment: Word Search 2", "wordsearch", 60, paymentMethodsWordSearch2),
        lv("Methods of Payment: Word Search 3", "wordsearch", 60, paymentMethodsWordSearch3),
        lv("Payment Security & PIN: Quiz", "quiz", 80, paymentMethodsQuiz),
        lv("Would You Rather: Delayed Gratification", "activity", 100, wouldYouRatherActivity),
      ]),
      ...orderedTopic([
        lv("Credit & Loans: Word Search 1", "wordsearch", 60, creditLoansWordSearch1),
        lv("Credit & Loans: Word Search 2", "wordsearch", 60, creditLoansWordSearch2),
        lv("Credit & Loans: Quiz", "quiz", 80, creditLoansQuiz),
      ]),
    ]),
  },
  {
    id: "investing",
    title: "Investing",
    blurb: "Stocks, bonds, compound interest, and capital markets.",
    art: gameArt["digital-money"],
    tint: "bg-berry",
    done: 0,
    levels: withProgress([
      ...orderedTopic([
        lv("Investing & Asset Classes: Word Search", "wordsearch", 60, investingWordSearch1),
        lv("Investing: Word Search 2", "wordsearch", 60, investingWordSearch2),
        lv("NSE & Capital Markets: Word Search", "wordsearch", 60, investingWordSearch3),
        lv("Investing: Word Search 4", "wordsearch", 60, investingWordSearch4),
        lv("Investing: Word Search 5", "wordsearch", 60, investingWordSearch5),
        lv("Compound Interest & Bonds: Quiz", "quiz", 80, investingQuiz1),
        lv("Nairobi Securities Exchange & Net Worth: Quiz", "quiz", 80, investingQuiz2),
      ]),
      ...orderedTopic([
        lv("Digital Economy & Tech Skills: Word Search", "wordsearch", 60, digitalEconomyWordSearch),
        lv("Digital Economy & Cloud Tech: Quiz", "quiz", 80, digitalEconomyQuiz),
        lv("The Smart Money Pledge Ceremony", "activity", 100, smartMoneyPledgeActivity),
      ]),
    ]),
  },
];

const idAliasMap: Record<string, string> = {
  "budget-boss": "budgeting",
  "save-invest": "saving",
  "smart-spender": "budgeting",
  "digital-money": "investing",
  "young-hustler": "entrepreneurship",
};

export const getGame = (id: string): Game | undefined => {
  const targetId = idAliasMap[id] || id;
  return games.find((g) => g.id === targetId);
};
