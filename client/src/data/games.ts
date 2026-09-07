import { gameArt } from "@/assets/icons";
import type { AnyGame } from "@/games/types";
import {
  foundationsWordSearch1,
  foundationsQuiz,
} from "@/games/money-basics/foundations-of-money";
import {
  kenyanCurrencyWordSearch1,
  kenyanCurrencyQuiz1,
  kenyanCurrencyCrossword1,
} from "@/games/money-basics/features-of-kenyan-currency";
import {
  mpesaWordSearch,
  mpesaCrossword1,
} from "@/games/money-basics/characteristics-of-mpesa";
import {
  currenciesKenyaCryptogram,
} from "@/games/money-basics/currencies-of-kenya";
import {
  budgetingWordSearch1,
  budgetingWordSearch3,
  budgetingQuiz,
  schoolBudgetChallengeActivity,
  homeTreasureHuntActivity,
} from "@/games/spending-saving/budgeting";
import {
  consumerSkillsWordSearch1,
  consumerSkillsQuiz,
} from "@/games/spending-saving/consumer-skills";
import {
  paymentMethodsWordSearch1,
  paymentMethodsQuiz,
} from "@/games/spending-saving/methods-of-payment";
import {
  bankingWordSearch1,
  bankingQuiz,
  bankAccountsMatcherActivity,
} from "@/games/spending-saving/banking";
import {
  creditLoansQuiz,
} from "@/games/spending-saving/credit-loans";
import {
  digitalEconomyWordSearch,
  digitalEconomyQuiz,
} from "@/games/spending-saving/digital-economy";
import {
  wouldYouRatherActivity,
} from "@/games/spending-saving/activities";
import {
  earningWordSearch1,
  earningQuiz,
} from "@/games/earning-growing/earning";
import {
  careersWordSearch1,
  careersWordSearch3,
  careersQuiz1,
  careersQuiz2,
} from "@/games/earning-growing/careers-employment";
import {
  investingWordSearch1,
  investingWordSearch3,
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
        title: "Budget Allocation & 50/30/20 Rule: Quiz",
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
        title: "Types of Bank Accounts: 21-Scenario Matcher",
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
        title: "Would You Rather: Delay of Gratification",
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
        title: "Nairobi Securities Exchange & CDSC: Quiz",
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
        title: "Investing & Cyber Safety: Boss Battle",
        kind: "boss",
        state: "locked",
        xp: 150,
        gameData: digitalEconomyQuiz,
      },
    ],
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    blurb: "Start a mini business, calculate profit, and pitch like a founder.",
    art: gameArt["young-hustler"],
    tint: "bg-sun",
    locked: true,
    comingSoon: true,
    done: 0,
    levels: [],
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
