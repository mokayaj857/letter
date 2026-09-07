import { WordSearchPuzzle, QuizPuzzle, ActivityPuzzle } from "../types";

export const bankingWordSearch1: WordSearchPuzzle = {
  type: "wordsearch",
  id: "ss-banking-ws1",
  title: "Banking Foundations: Word Search",
  topic: "Save & Grow",
  theme: "Bank Accounts, Deposits, and Savings Instruments",
  instruction: "Find terms on bank accounts, compound interest, and banking security.",
  size: 14,
  words: [
    "ACCOUNT",
    "ATM",
    "BRANCH",
    "CHEQUEBOOK",
    "COMPOUND INTEREST",
    "CURRENT",
    "DEPOSIT",
    "FIXED DEPOSIT",
    "INTEREST RATE",
    "LIQUIDITY",
    "OVERDRAFT",
    "PASSBOOK",
    "SAVINGS",
    "WITHDRAWAL",
  ],
  grid: [
    ["F", "I", "X", "E", "D", "D", "E", "P", "O", "S", "I", "T", "A", "B"],
    ["C", "O", "M", "P", "O", "U", "N", "D", "I", "N", "T", "E", "R", "E"],
    ["I", "N", "T", "E", "R", "E", "S", "T", "R", "A", "T", "E", "A", "S"],
    ["C", "H", "E", "Q", "U", "E", "B", "O", "O", "K", "C", "U", "R", "T"],
    ["W", "I", "T", "H", "D", "R", "A", "W", "A", "L", "D", "E", "P", "O"],
    ["O", "V", "E", "R", "D", "R", "A", "F", "T", "L", "I", "Q", "U", "S"],
    ["S", "A", "V", "I", "N", "G", "S", "P", "A", "S", "S", "B", "O", "I"],
    ["B", "R", "A", "N", "C", "H", "A", "C", "C", "O", "U", "N", "T", "T"],
    ["C", "E", "N", "T", "R", "A", "L", "B", "A", "N", "K", "A", "T", "M"],
    ["K", "D", "I", "C", "I", "N", "S", "U", "R", "A", "N", "C", "E", "S"],
    ["M", "O", "B", "I", "L", "E", "B", "A", "N", "K", "I", "N", "G", "F"],
    ["C", "U", "S", "T", "O", "M", "E", "R", "C", "A", "R", "E", "H", "U"],
    ["S", "T", "A", "T", "E", "M", "E", "N", "T", "C", "A", "S", "H", "N"],
    ["T", "E", "L", "L", "E", "R", "S", "A", "F", "E", "V", "A", "U", "L"],
  ],
};

export const bankingQuiz: QuizPuzzle = {
  type: "quiz",
  id: "ss-banking-quiz",
  title: "Banking & Savings Accounts Quiz",
  topic: "Save & Grow",
  instruction: "Understand how banking products generate interest and protect depositor wealth.",
  questions: [
    {
      id: 1,
      question: "What is a 'Fixed Deposit Account'?",
      options: [
        "An account where you lock away money for a set period (e.g. 1 year) in exchange for higher guaranteed interest",
        "An account that is permanently broken and cannot be opened",
        "An account only used to fix broken furniture",
        "A wallet kept in a refrigerator",
      ],
      correctIndex: 0,
      explanation:
        "Fixed deposits reward savers with higher interest rates in return for keeping funds locked until maturity.",
    },
    {
      id: 2,
      question: "What government body protects depositor bank balances in Kenya up to KSh 500,000 in case a bank collapses?",
      options: [
        "Kenya Deposit Insurance Corporation (KDIC)",
        "Kenya Wildlife Service (KWS)",
        "Postal Corporation",
        "Traffic Police",
      ],
      correctIndex: 0,
      explanation:
        "The KDIC guarantees depositor protection up to KSh 500,000 per customer in licensed commercial banks.",
    },
    {
      id: 3,
      question: "What is 'Compound Interest'?",
      options: [
        "Interest earned on both the initial principal AND the accumulated interest over time ('interest on interest')",
        "Interest that is subtracted from your account every day",
        "A fee paid to visit a bank branch",
        "Interest that only applies to copper coins",
      ],
      correctIndex: 0,
      explanation:
        "Albert Einstein called compounding the 8th wonder of the world: money exponentially multiplies over decades.",
    },
    {
      id: 4,
      question: "Which bank account is primarily designed for daily transactions and unlimited cheque payments?",
      options: ["Current / Checking Account", "Fixed Deposit", "Retirement Annuity", "Locked Treasury Bond"],
      correctIndex: 0,
      explanation:
        "Current accounts facilitate daily payroll, cheques, and unlimited transactions, typically offering zero interest.",
    },
    {
      id: 5,
      question: "What is an 'Overdraft Facility' on a bank account?",
      options: [
        "Permission from the bank to withdraw or spend more money than you have in your account up to an agreed limit",
        "When cold wind enters the bank lobby",
        "An ATM that dispenses too many notes by accident",
        "A drawing made with a pen",
      ],
      correctIndex: 0,
      explanation:
        "An overdraft is a short-term credit line allowing account balances to temporarily drop below zero.",
    },
  ],
};

export const bankAccountsMatcherActivity: ActivityPuzzle = {
  type: "activity",
  id: "ss-bank-matcher-activity",
  title: "Types of Bank Accounts: 21-Scenario Matcher",
  topic: "Save & Grow",
  subtype: "account_matcher",
  instruction:
    "Read each customer's scenario and match them with the perfect bank account from the book's comprehensive comparison matrix!",
  config: {
    scenarios: [
      {
        id: "s1",
        customer: "Amina (Age 13)",
        need: "Wants to save birthday money and pocket change with parental supervision and zero monthly maintenance fees.",
        correctAccount: "Junior / Kids Savings Account",
        explanation: "Junior accounts offer fee-free savings with parental controls and bonus interest for young savers.",
      },
      {
        id: "s2",
        customer: "Mama Brian (Wholesale Grocery Owner)",
        need: "Processes 60 supplier payments and customer cheques daily, needing unlimited transactions and overdraft support.",
        correctAccount: "Current / Business Checking Account",
        explanation: "Current accounts are designed for high-volume commerce with chequebooks and overdraft facilities.",
      },
      {
        id: "s3",
        customer: "Uncle Juma (Retired Teacher)",
        need: "Has KSh 500,000 retirement lump sum that he will not touch for 3 years, wanting the highest safe guaranteed return.",
        correctAccount: "Fixed Deposit Account",
        explanation: "Fixed deposits lock funds for a predetermined duration in return for premium interest rates.",
      },
      {
        id: "s4",
        customer: "Wanjiku (College Student)",
        need: "Receives HELB loan disbursement and buys campus lunch via mobile app with low transaction charges.",
        correctAccount: "Student Bank Account",
        explanation: "Student accounts offer subsidized mobile banking, zero ledger fees, and student ID verification.",
      },
    ],
    accountTypes: [
      "Junior / Kids Savings Account",
      "Current / Business Checking Account",
      "Fixed Deposit Account",
      "Student Bank Account",
      "Foreign Currency Account",
      "Joint Account",
      "Islamic Banking Account",
    ],
  },
};
