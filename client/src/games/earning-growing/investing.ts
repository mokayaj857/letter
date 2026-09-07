import { WordSearchPuzzle, QuizPuzzle } from "../types";

export const investingWordSearch1: WordSearchPuzzle = {
  type: "wordsearch",
  id: "eg-investing-ws1",
  title: "Investing & Assets: Word Search",
  topic: "Save & Grow",
  theme: "Stocks, Real Estate, Bonds, and Mutual Funds",
  instruction: "Find the 14 words covering asset classes, portfolios, and capital growth.",
  size: 14,
  words: [
    "ASSET",
    "BONDS",
    "BULL MARKET",
    "CAPITAL GAIN",
    "COMPOUNDING",
    "DIVIDEND",
    "DIVERSIFY",
    "EQUITY",
    "FUND MANAGER",
    "GROWTH",
    "PORTFOLIO",
    "REAL ESTATE",
    "RETURN",
    "STOCKS",
  ],
  grid: [
    ["C", "A", "P", "I", "T", "A", "L", "G", "A", "I", "N", "B", "U", "L"],
    ["C", "O", "M", "P", "O", "U", "N", "D", "I", "N", "G", "A", "S", "L"],
    ["F", "U", "N", "D", "M", "A", "N", "A", "G", "E", "R", "S", "E", "M"],
    ["D", "I", "V", "E", "R", "S", "I", "F", "Y", "D", "I", "E", "T", "A"],
    ["P", "O", "R", "T", "F", "O", "L", "I", "O", "I", "E", "T", "A", "R"],
    ["R", "E", "A", "L", "E", "S", "T", "A", "T", "E", "V", "E", "R", "K"],
    ["S", "T", "O", "C", "K", "S", "E", "Q", "U", "I", "T", "Y", "G", "E"],
    ["B", "O", "N", "D", "S", "G", "R", "O", "W", "T", "H", "U", "N", "T"],
    ["D", "I", "V", "I", "D", "E", "N", "D", "R", "E", "T", "U", "R", "N"],
    ["S", "H", "A", "R", "E", "H", "O", "L", "D", "E", "R", "S", "N", "S"],
    ["M", "U", "T", "U", "A", "L", "F", "U", "N", "D", "P", "A", "S", "E"],
    ["I", "N", "D", "E", "X", "F", "U", "N", "D", "T", "R", "A", "C", "K"],
    ["T", "R", "E", "A", "S", "U", "R", "Y", "B", "I", "L", "L", "S", "P"],
    ["F", "I", "N", "A", "N", "C", "I", "A", "L", "F", "R", "E", "E", "D"],
  ],
};

export const investingWordSearch3: WordSearchPuzzle = {
  type: "wordsearch",
  id: "eg-investing-ws3",
  title: "NSE & Capital Markets: Word Search",
  topic: "Save & Grow",
  theme: "Nairobi Securities Exchange & Regulators",
  instruction: "Search for stock exchange, brokerage, and capital market terms.",
  size: 14,
  words: [
    "BEAR MARKET",
    "BLUE CHIP",
    "BROKER",
    "CDSC ACCOUNT",
    "CMA KENYA",
    "COMMISSION",
    "DIVIDEND",
    "INDEX NSE",
    "IPO OFFER",
    "LIQUIDITY",
    "MARKET CAP",
    "SHARE PRICE",
    "TRADING",
    "VOLUME",
  ],
  grid: [
    ["B", "E", "A", "R", "M", "A", "R", "K", "E", "T", "B", "L", "U", "E"],
    ["C", "D", "S", "C", "A", "C", "C", "O", "U", "N", "T", "C", "H", "I"],
    ["C", "M", "A", "K", "E", "N", "Y", "A", "B", "R", "O", "K", "E", "P"],
    ["I", "P", "O", "O", "F", "F", "E", "R", "V", "O", "L", "U", "M", "E"],
    ["M", "A", "R", "K", "E", "T", "C", "A", "P", "T", "R", "A", "D", "E"],
    ["S", "H", "A", "R", "E", "P", "R", "I", "C", "E", "D", "I", "V", "I"],
    ["L", "I", "Q", "U", "I", "D", "I", "T", "Y", "I", "N", "D", "E", "X"],
    ["C", "O", "M", "M", "I", "S", "S", "I", "O", "N", "N", "S", "E", "M"],
    ["S", "E", "C", "U", "R", "I", "T", "I", "E", "S", "E", "X", "C", "H"],
    ["I", "N", "V", "E", "S", "T", "O", "R", "P", "R", "O", "T", "E", "C"],
    ["G", "O", "V", "E", "R", "N", "M", "E", "N", "T", "B", "O", "N", "D"],
    ["C", "O", "R", "P", "O", "R", "A", "T", "E", "B", "O", "N", "D", "S"],
    ["W", "E", "A", "L", "T", "H", "C", "R", "E", "A", "T", "I", "O", "N"],
    ["F", "I", "N", "A", "N", "C", "I", "A", "L", "F", "U", "T", "U", "R"],
  ],
};

export const investingQuiz1: QuizPuzzle = {
  type: "quiz",
  id: "eg-investing-quiz1",
  title: "Investing Fundamentals Quiz",
  topic: "Save & Grow",
  instruction: "Test your grasp on shares, bonds, inflation hedging, and compounding.",
  questions: [
    {
      id: 1,
      question: "What does owning a 'Share' of a company mean?",
      options: [
        "You own a fractional equity slice of that business and are entitled to a share of profits and voting rights",
        "You get to borrow the company car on weekends",
        "You must work in their factory for free",
        "You are sharing lunch with the CEO",
      ],
      correctIndex: 0,
      explanation:
        "Shares represent fractional equity ownership in a corporation.",
    },
    {
      id: 2,
      question: "What is 'Diversification' in investment strategy?",
      options: [
        "Spreading investments across different asset classes and industries to minimize risk ('not putting all eggs in one basket')",
        "Putting all your money into one single new company",
        "Converting all money to paper notes",
        "Hiding money under a bed mattress",
      ],
      correctIndex: 0,
      explanation:
        "Diversification shields your portfolio from catastrophic loss if one sector declines.",
    },
    {
      id: 3,
      question: "What is a 'Government Treasury Bond'?",
      options: [
        "A secure debt security issued by the National Treasury / Central Bank promising periodic coupon interest plus full principal repayment",
        "A treasure chest buried on a pirate island",
        "A lottery ticket sold by the bank",
        "A paper coupon to visit game parks",
      ],
      correctIndex: 0,
      explanation:
        "Treasury bonds represent low-risk government debt backed by the national government.",
    },
  ],
};

export const investingQuiz2: QuizPuzzle = {
  type: "quiz",
  id: "eg-investing-quiz2",
  title: "Capital Markets & NSE Quiz",
  topic: "Save & Grow",
  instruction: "Understand the mechanics of the Nairobi Securities Exchange (NSE) and CMA.",
  questions: [
    {
      id: 1,
      question: "What is the Capital Markets Authority (CMA)?",
      options: [
        "The statutory regulatory body that licenses brokers and protects investors in Kenya's capital markets",
        "A private security company guarding bank doors",
        "A sports association",
        "A university math club",
      ],
      correctIndex: 0,
      explanation:
        "CMA regulates and supervises capital market participants to ensure transparency and investor safety.",
    },
    {
      id: 2,
      question: "What is a 'CDSC Account' required for in Kenya?",
      options: [
        "The electronic depository account where your shares and bonds are held securely in digital book-entry form",
        "A bank debit card used at gas stations",
        "A music streaming account",
        "A student discount ID",
      ],
      correctIndex: 0,
      explanation:
        "Central Depository & Settlement Corporation (CDSC) manages the digital clearing and holding of securities.",
    },
  ],
};
