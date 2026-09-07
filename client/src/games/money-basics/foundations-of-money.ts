import { WordSearchPuzzle, QuizPuzzle } from "../types";

export const foundationsWordSearch1: WordSearchPuzzle = {
  type: "wordsearch",
  id: "mb-foundations-ws1",
  title: "Foundations of Money: Puzzle 1",
  topic: "Money Basics",
  theme: "What is Money & Early Trade",
  instruction: "Find the 14 words hidden in the grid related to the foundations of money and early commerce.",
  size: 14,
  words: [
    "BARTER",
    "COINS",
    "COMMODITY",
    "CURRENCY",
    "EXCHANGE",
    "MEDIUM",
    "MONEY",
    "SCARCITY",
    "STORE",
    "TRADE",
    "VALUE",
    "WEALTH",
    "GOODS",
    "SERVICES",
  ],
  grid: [
    ["C", "O", "M", "M", "O", "D", "I", "T", "Y", "Q", "B", "A", "R", "T"],
    ["U", "X", "E", "R", "S", "C", "A", "R", "C", "I", "T", "Y", "V", "E"],
    ["R", "E", "X", "C", "H", "A", "N", "G", "E", "P", "R", "O", "A", "R"],
    ["R", "S", "E", "R", "V", "I", "C", "E", "S", "L", "A", "B", "L", "G"],
    ["E", "T", "O", "P", "M", "E", "D", "I", "U", "M", "D", "T", "U", "O"],
    ["N", "O", "F", "W", "E", "A", "L", "T", "H", "K", "E", "R", "E", "O"],
    ["C", "R", "M", "O", "N", "E", "Y", "J", "L", "Z", "X", "A", "O", "D"],
    ["Y", "E", "G", "S", "Q", "U", "C", "O", "I", "N", "S", "D", "P", "S"],
    ["M", "E", "D", "I", "U", "M", "O", "F", "E", "X", "C", "E", "I", "S"],
    ["V", "A", "L", "U", "E", "K", "N", "O", "P", "Q", "R", "S", "T", "U"],
    ["B", "A", "R", "T", "E", "R", "T", "R", "A", "D", "E", "R", "S", "V"],
    ["S", "T", "O", "R", "E", "O", "F", "V", "A", "L", "U", "E", "M", "W"],
    ["C", "O", "I", "N", "A", "G", "E", "H", "I", "J", "K", "L", "M", "N"],
    ["P", "A", "Y", "M", "E", "N", "T", "S", "Y", "S", "T", "E", "M", "Z"],
  ],
};

export const foundationsWordSearch2: WordSearchPuzzle = {
  type: "wordsearch",
  id: "mb-foundations-ws2",
  title: "Foundations of Money: Puzzle 2",
  topic: "Money Basics",
  theme: "Characteristics of Sound Money",
  instruction: "Search for the essential characteristics of sound money.",
  size: 14,
  words: [
    "ACCEPTABILITY",
    "DIVISIBILITY",
    "DURABILITY",
    "INFLATION",
    "LEGAL TENDER",
    "LIQUIDITY",
    "PORTABILITY",
    "PURCHASING",
    "STABILITY",
    "UNIFORMITY",
    "SCARCITY",
    "STORE",
  ],
  grid: [
    ["A", "C", "C", "E", "P", "T", "A", "B", "I", "L", "I", "T", "Y", "S"],
    ["D", "I", "V", "I", "S", "I", "B", "I", "L", "I", "T", "Y", "P", "C"],
    ["D", "U", "R", "A", "B", "I", "L", "I", "T", "Y", "Z", "Q", "U", "A"],
    ["I", "N", "F", "L", "A", "T", "I", "O", "N", "M", "N", "O", "R", "R"],
    ["L", "E", "G", "A", "L", "T", "E", "N", "D", "E", "R", "P", "C", "C"],
    ["L", "I", "Q", "U", "I", "D", "I", "T", "Y", "A", "B", "C", "H", "I"],
    ["P", "O", "R", "T", "A", "B", "I", "L", "I", "T", "Y", "D", "A", "T"],
    ["S", "T", "A", "B", "I", "L", "I", "T", "Y", "E", "F", "G", "S", "Y"],
    ["U", "N", "I", "F", "O", "R", "M", "I", "T", "Y", "H", "I", "I", "Z"],
    ["S", "C", "A", "R", "C", "I", "T", "Y", "J", "K", "L", "M", "N", "X"],
    ["S", "T", "O", "R", "E", "O", "F", "V", "A", "L", "U", "E", "G", "W"],
    ["P", "U", "R", "C", "H", "A", "S", "I", "N", "G", "R", "S", "T", "V"],
    ["P", "A", "Y", "M", "E", "N", "T", "S", "Y", "S", "T", "E", "M", "U"],
    ["C", "E", "N", "T", "R", "A", "L", "B", "A", "N", "K", "I", "N", "G"],
  ],
};

export const foundationsQuiz: QuizPuzzle = {
  type: "quiz",
  id: "mb-foundations-quiz",
  title: "Foundations of Money Quiz",
  topic: "Money Basics",
  instruction: "Test your understanding of the origin, functions, and characteristics of money.",
  questions: [
    {
      id: 1,
      question: "What is the primary definition of money in economics?",
      options: [
        "A piece of gold stored in a museum",
        "Any item generally accepted as payment for goods and services and repayment of debts",
        "Only printed paper notes issued by governments",
        "Coins made exclusively of silver or copper",
      ],
      correctIndex: 1,
      explanation:
        "Money is anything that is widely accepted as a medium of exchange, unit of account, and store of value.",
    },
    {
      id: 2,
      question: "Which of the following was a major drawback of the Barter system?",
      options: [
        "Items had too much intrinsic value",
        "The requirement of the double coincidence of wants",
        "Everyone had identical goods to exchange",
        "Trading occurred too quickly without delays",
      ],
      correctIndex: 1,
      explanation:
        "Under barter, trade only happens if both parties coincidentally desire what the other person is offering.",
    },
    {
      id: 3,
      question: "Which characteristic of money ensures it can withstand wear, tear, and frequent handling?",
      options: ["Divisibility", "Portability", "Durability", "Scarcity"],
      correctIndex: 2,
      explanation:
        "Durability means money does not easily rot, crumble, or deteriorate during continuous circulation.",
    },
    {
      id: 4,
      question: "Which function of money allows people to measure and compare the prices of different items?",
      options: [
        "Unit of account",
        "Store of value",
        "Standard of deferred payment",
        "Medium of exchange",
      ],
      correctIndex: 0,
      explanation:
        "As a unit of account, money provides a common benchmark and numerical pricing scale for all goods.",
    },
    {
      id: 5,
      question: "Why are precious metals like gold and silver effective historical forms of commodity money?",
      options: [
        "They are extremely common and easy to create anywhere",
        "They are durable, divisible, scarce, and universally valued",
        "They degrade quickly so people spend them fast",
        "They are legally banned from trade",
      ],
      correctIndex: 1,
      explanation:
        "Precious metals possess high intrinsic value, portability, divisibility, and resistance to corrosion.",
    },
    {
      id: 6,
      question: "What does 'Legal Tender' mean?",
      options: [
        "Money that must legally be accepted to settle a financial debt",
        "Money borrowed from friends with no contract",
        "Coins that are only valid during daytime",
        "Vouchers that can only be redeemed at one toy shop",
      ],
      correctIndex: 0,
      explanation:
        "Legal tender is currency declared by national law to be legally recognized for settling debts and transactions.",
    },
    {
      id: 7,
      question: "What is 'divisibility' in sound currency?",
      options: [
        "Money can be cut up into pieces with scissors at home",
        "Money is available in various standard denominations for transactions of different sizes",
        "Money loses value when divided",
        "Prices must always be round thousands",
      ],
      correctIndex: 1,
      explanation:
        "Divisibility allows currency to be broken down into convenient smaller units (e.g. 50, 100, 200, 500, 1000 KSh).",
    },
    {
      id: 8,
      question: "What happens during severe 'Inflation'?",
      options: [
        "The purchasing power of money decreases as prices rise",
        "Money becomes impossible to count",
        "All goods become free in supermarkets",
        "The central bank closes permanently",
      ],
      correctIndex: 0,
      explanation:
        "Inflation reduces the real purchasing power of money, meaning each unit buys fewer goods and services.",
    },
    {
      id: 9,
      question: "What makes fiat money different from commodity money?",
      options: [
        "Fiat money has no intrinsic physical value; its value comes from government backing and public trust",
        "Fiat money is made only of real diamonds",
        "Fiat money can never be stolen",
        "Fiat money is only used by children",
      ],
      correctIndex: 0,
      explanation:
        "Fiat currency (like modern banknotes) has value backed by government decree rather than commodity backing.",
    },
    {
      id: 10,
      question: "Why is 'Portability' important for modern money?",
      options: [
        "Money can be used to purchase aeroplanes",
        "Money is light and compact enough to carry conveniently for daily transactions",
        "Money can fly away in the wind",
        "Money only works inside airports",
      ],
      correctIndex: 1,
      explanation:
        "Portability ensures individuals can carry sufficient purchasing power without requiring heavy transport.",
    },
  ],
};
