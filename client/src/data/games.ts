import { gameArt } from "@/assets/icons";
import type { AnyGame } from "@/games/types";
import {
  foundationsWordSearch1,
  foundationsWordSearch2,
  foundationsQuiz,
} from "@/games/money-basics/foundations-of-money";
import {
  kenyanCurrencyWordSearch1,
  kenyanCurrencyWordSearch2,
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
} from "@/games/spending-saving/banking";
import {
  creditLoansWordSearch1,
  creditLoansWordSearch2,
  creditLoansQuiz,
} from "@/games/spending-saving/credit-loans";
import {
  taxesWordSearch1,
  taxesWordSearch2,
  taxesQuiz,
} from "@/games/spending-saving/taxes";
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

export const games: Game[] = [
  {
    id: "money-basics",
    title: "Money Basics",
    blurb: "Where money comes from, value, Kenyan currency & trade.",
    art: gameArt["money-basics"],
    tint: "bg-sun",
    done: 1,
    levels: [
      {
        title: "Foundations of Money: Word Search",
        kind: "wordsearch",
        state: "done",
        xp: 60,
        gameData: foundationsWordSearch1,
      },
      {
        title: "Foundations of Money: Quiz",
        kind: "quiz",
        state: "current",
        xp: 80,
        gameData: foundationsQuiz,
      },
      {
        title: "Features of Kenyan Currency: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: kenyanCurrencyWordSearch1,
      },
      {
        title: "Currency Security: Crossword",
        kind: "crossword",
        state: "locked",
        xp: 75,
        gameData: kenyanCurrencyCrossword1,
      },
      {
        title: "Characteristics of M-Pesa: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: mpesaWordSearch,
      },
      {
        title: "M-Pesa GO & Privacy: Crossword",
        kind: "crossword",
        state: "locked",
        xp: 70,
        gameData: mpesaCrossword1,
      },
      {
        title: "Kenyan Exports: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: kenyanExportsWordSearch,
      },
      {
        title: "Kenyan Exports: Quiz",
        kind: "quiz",
        state: "locked",
        xp: 80,
        gameData: kenyanExportsQuiz,
      },
      {
        title: "Kenyan Imports: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: kenyanImportsWordSearch1,
      },
      {
        title: "Currencies of Kenya: A1Z26 Cryptogram",
        kind: "cryptogram",
        state: "locked",
        xp: 150,
        gameData: currenciesKenyaCryptogram,
      },
      {
        title: "Money Basics: Boss Battle Quiz",
        kind: "boss",
        state: "locked",
        xp: 150,
        gameData: kenyanCurrencyQuiz1,
      },
    ],
  },
  {
    id: "global-money",
    title: "Global Money & Trade",
    blurb: "Ancient African trade routes, cowrie shells, and world currencies.",
    art: gameArt["digital-money"],
    tint: "bg-sky",
    done: 0,
    levels: [
      {
        title: "History of Trade in Africa: Word Search",
        kind: "wordsearch",
        state: "current",
        xp: 60,
        gameData: historyOfTradeWordSearch1,
      },
      {
        title: "Trans-Saharan & Maritime Trade: Quiz",
        kind: "quiz",
        state: "locked",
        xp: 80,
        gameData: historyOfTradeQuiz,
      },
      {
        title: "Currencies of Africa: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: currenciesAfricaWordSearch1,
      },
      {
        title: "Currencies of Africa: Quiz",
        kind: "quiz",
        state: "locked",
        xp: 80,
        gameData: currenciesAfricaQuiz,
      },
      {
        title: "Currencies of the Americas: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: currenciesAmericaWordSearch,
      },
      {
        title: "Currencies of Europe: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: currenciesEuropeWordSearch,
      },
      {
        title: "Asian Currencies: Boss Battle",
        kind: "boss",
        state: "locked",
        xp: 150,
        gameData: currenciesAsiaWordSearch1,
      },
    ],
  },
  {
    id: "earning",
    title: "Earning",
    blurb: "Active wages, future careers, freelancing and workplace skills.",
    art: gameArt["smart-spender"],
    tint: "bg-leaf",
    done: 0,
    levels: [
      {
        title: "Sources of Income: Word Search",
        kind: "wordsearch",
        state: "current",
        xp: 60,
        gameData: earningWordSearch1,
      },
      {
        title: "Earned vs Passive Income: Quiz",
        kind: "quiz",
        state: "locked",
        xp: 80,
        gameData: earningQuiz,
      },
      {
        title: "Future Tech Careers: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: careersWordSearch1,
      },
      {
        title: "Career Navigation & Employability: Quiz",
        kind: "quiz",
        state: "locked",
        xp: 80,
        gameData: careersQuiz1,
      },
      {
        title: "Workplace Skills & Ethics: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: careersWordSearch3,
      },
      {
        title: "Professional Ethics Boss Battle",
        kind: "boss",
        state: "locked",
        xp: 150,
        gameData: careersQuiz2,
      },
    ],
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    blurb: "Start a mini business, calculate profit, and pitch like a founder.",
    art: gameArt["young-hustler"],
    tint: "bg-sun",
    done: 0,
    comingSoon: true,
    levels: [
      {
        title: "Startup Foundations & Strategy: Word Search",
        kind: "wordsearch",
        state: "current",
        xp: 60,
        gameData: entrepreneurshipWordSearch1,
      },
      {
        title: "Branding, Pitch & Suppliers: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: entrepreneurshipWordSearch2,
      },
      {
        title: "Business Planning & Jua Kali: Quiz",
        kind: "quiz",
        state: "locked",
        xp: 80,
        gameData: entrepreneurshipQuiz,
      },
      {
        title: "Family Event Photographer Gig Project",
        kind: "activity",
        state: "locked",
        xp: 150,
        gameData: photographerGigActivity,
      },
    ],
  },
  {
    id: "budgeting",
    title: "Budgeting",
    blurb: "Plan a monthly budget, needs vs wants, and master spending.",
    art: gameArt["budget-boss"],
    tint: "bg-primary-soft",
    done: 0,
    levels: [
      {
        title: "Needs vs Wants: Word Search",
        kind: "wordsearch",
        state: "current",
        xp: 60,
        gameData: budgetingWordSearch1,
      },
      {
        title: "Fixed vs Variable Costs: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: budgetingWordSearch3,
      },
      {
        title: "Budget Allocation & Priorities: Quiz",
        kind: "quiz",
        state: "locked",
        xp: 80,
        gameData: budgetingQuiz,
      },
      {
        title: "Home Treasure Hunt & Waste Audit",
        kind: "activity",
        state: "locked",
        xp: 100,
        gameData: homeTreasureHuntActivity,
      },
      {
        title: "The KSh 8,000 School Shopping Challenge",
        kind: "activity",
        state: "locked",
        xp: 120,
        gameData: schoolBudgetChallengeActivity,
      },
      {
        title: "Consumer Skills & Bargaining: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: consumerSkillsWordSearch1,
      },
      {
        title: "Smart Spender Boss Battle Quiz",
        kind: "boss",
        state: "locked",
        xp: 150,
        gameData: consumerSkillsQuiz,
      },
    ],
  },
  {
    id: "saving",
    title: "Saving",
    blurb: "Emergency funds, bank accounts, and delayed gratification.",
    art: gameArt["save-invest"],
    tint: "bg-sky",
    done: 0,
    levels: [
      {
        title: "Banking Foundations & Deposits: Word Search",
        kind: "wordsearch",
        state: "current",
        xp: 60,
        gameData: bankingWordSearch1,
      },
      {
        title: "Banking & Savings Accounts: Quiz",
        kind: "quiz",
        state: "locked",
        xp: 80,
        gameData: bankingQuiz,
      },
      {
        title: "Piggy Vault Match-Up",
        kind: "activity",
        state: "locked",
        xp: 150,
        gameData: bankAccountsMatcherActivity,
      },
      {
        title: "Methods of Payment: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: paymentMethodsWordSearch1,
      },
      {
        title: "Payment Security & PIN: Quiz",
        kind: "quiz",
        state: "locked",
        xp: 80,
        gameData: paymentMethodsQuiz,
      },
      {
        title: "Would You Rather: Delayed Gratification",
        kind: "activity",
        state: "locked",
        xp: 100,
        gameData: wouldYouRatherActivity,
      },
      {
        title: "Credit & Loans Boss Battle Quiz",
        kind: "boss",
        state: "locked",
        xp: 150,
        gameData: creditLoansQuiz,
      },
    ],
  },
  {
    id: "investing",
    title: "Investing",
    blurb: "Stocks, bonds, compound interest, and capital markets.",
    art: gameArt["digital-money"],
    tint: "bg-berry",
    done: 0,
    levels: [
      {
        title: "Investing & Asset Classes: Word Search",
        kind: "wordsearch",
        state: "current",
        xp: 60,
        gameData: investingWordSearch1,
      },
      {
        title: "Compound Interest & Bonds: Quiz",
        kind: "quiz",
        state: "locked",
        xp: 80,
        gameData: investingQuiz1,
      },
      {
        title: "NSE & Capital Markets: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: investingWordSearch3,
      },
      {
        title: "Nairobi Securities Exchange & Net Worth: Quiz",
        kind: "quiz",
        state: "locked",
        xp: 80,
        gameData: investingQuiz2,
      },
      {
        title: "Digital Economy & Tech Skills: Word Search",
        kind: "wordsearch",
        state: "locked",
        xp: 60,
        gameData: digitalEconomyWordSearch,
      },
      {
        title: "Digital Economy & Cloud Tech: Boss Quiz",
        kind: "boss",
        state: "locked",
        xp: 150,
        gameData: digitalEconomyQuiz,
      },
      {
        title: "The Smart Money Pledge Ceremony",
        kind: "activity",
        state: "locked",
        xp: 100,
        gameData: smartMoneyPledgeActivity,
      },
    ],
  },
];

// Map legacy IDs to the new pillar categories for seamless navigation
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
