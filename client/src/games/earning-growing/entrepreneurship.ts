import { WordSearchPuzzle, QuizPuzzle, ActivityPuzzle } from "../types";

export const entrepreneurshipWordSearch1: WordSearchPuzzle = {
  type: "wordsearch",
  id: "eg-entrepreneurship-ws1",
  title: "Entrepreneurship Mindset: Word Search",
  topic: "Young Hustler",
  theme: "Starting a Business & Solving Community Needs",
  instruction: "Find the 14 words describing enterprise, innovation, and risk management.",
  size: 14,
  words: [
    "BUSINESS PLAN",
    "CAPITAL",
    "CUSTOMER",
    "ENTERPRISE",
    "FOUNDER",
    "INNOVATION",
    "MARKET",
    "MARKETING",
    "PITCH",
    "PROFIT",
    "REVENUE",
    "RISK TAKER",
    "STARTUP",
    "SUPPLIER",
  ],
  grid: [
    ["B", "U", "S", "I", "N", "E", "S", "S", "P", "L", "A", "N", "A", "B"],
    ["I", "N", "N", "O", "V", "A", "T", "I", "O", "N", "C", "A", "P", "I"],
    ["E", "N", "T", "E", "R", "P", "R", "I", "S", "E", "D", "E", "F", "T"],
    ["C", "U", "S", "T", "O", "M", "E", "R", "F", "O", "U", "N", "D", "A"],
    ["R", "I", "S", "K", "T", "A", "K", "E", "R", "M", "A", "R", "K", "L"],
    ["M", "A", "R", "K", "E", "T", "I", "N", "G", "P", "I", "T", "C", "H"],
    ["P", "R", "O", "F", "I", "T", "R", "E", "V", "E", "N", "U", "E", "S"],
    ["S", "T", "A", "R", "T", "U", "P", "S", "U", "P", "P", "L", "I", "E"],
    ["J", "U", "A", "K", "A", "L", "I", "V", "E", "N", "T", "U", "R", "E"],
    ["H", "U", "S", "T", "L", "E", "S", "O", "L", "U", "T", "I", "O", "N"],
    ["B", "R", "A", "N", "D", "I", "N", "G", "C", "A", "S", "H", "F", "L"],
    ["N", "E", "T", "W", "O", "R", "K", "I", "N", "G", "S", "A", "L", "E"],
    ["E", "C", "O", "N", "O", "M", "I", "C", "V", "A", "L", "U", "E", "S"],
    ["S", "C", "A", "L", "A", "B", "I", "L", "I", "T", "Y", "G", "I", "G"],
  ],
};

export const entrepreneurshipWordSearch2: WordSearchPuzzle = {
  type: "wordsearch",
  id: "eg-entrepreneurship-ws2",
  title: "Startup & Pitch: Word Search",
  topic: "Young Hustler",
  theme: "Pitching Ideas and Raising Seed Funding",
  instruction: "Search for terms used in venture pitching, angel investments, and seed funding.",
  size: 14,
  words: [
    "ANGEL INVESTOR",
    "BOOTSTRAP",
    "CROWDFUNDING",
    "EQUITY",
    "INCUBATOR",
    "LOAN",
    "MENTOR",
    "NETWORKING",
    "PARTNERSHIP",
    "PROTOTYPE",
    "SCALING",
    "SEED MONEY",
    "TRACTION",
    "VALUATION",
  ],
  grid: [
    ["A", "N", "G", "E", "L", "I", "N", "V", "E", "S", "T", "O", "R", "A"],
    ["B", "O", "O", "T", "S", "T", "R", "A", "P", "E", "Q", "U", "I", "T"],
    ["C", "R", "O", "W", "D", "F", "U", "N", "D", "I", "N", "G", "B", "Y"],
    ["I", "N", "C", "U", "B", "A", "T", "O", "R", "M", "E", "N", "T", "O"],
    ["N", "E", "T", "W", "O", "R", "K", "I", "N", "G", "L", "O", "A", "N"],
    ["P", "A", "R", "T", "N", "E", "R", "S", "H", "I", "P", "S", "E", "E"],
    ["P", "R", "O", "T", "O", "T", "Y", "P", "E", "S", "C", "A", "L", "D"],
    ["S", "E", "E", "D", "M", "O", "N", "E", "Y", "T", "R", "A", "C", "M"],
    ["T", "R", "A", "C", "T", "I", "O", "N", "V", "A", "L", "U", "A", "O"],
    ["V", "A", "L", "U", "A", "T", "I", "O", "N", "P", "I", "T", "C", "N"],
    ["B", "U", "S", "I", "N", "E", "S", "S", "M", "O", "D", "E", "L", "E"],
    ["M", "A", "R market", "K", "E", "T", "F", "I", "T", "S", "A", "L", "E", "Y"],
    ["E", "L", "E", "V", "A", "T", "O", "R", "P", "I", "T", "C", "H", "S"],
    ["F", "O", "U", "N", "D", "E", "R", "S", "S", "H", "A", "R", "E", "S"],
  ],
};

export const entrepreneurshipQuiz: QuizPuzzle = {
  type: "quiz",
  id: "eg-entrepreneurship-quiz",
  title: "Entrepreneurship & Small Business Quiz",
  topic: "Young Hustler",
  instruction: "Test your acumen on pricing, profit calculation, and business models.",
  questions: [
    {
      id: 1,
      question: "How is net business 'Profit' calculated?",
      options: [
        "Total Revenue minus Total Business Expenses / Costs",
        "Total Revenue plus Total Cash in the bank",
        "The number of hours you worked",
        "How many friends like your social media post",
      ],
      correctIndex: 0,
      explanation:
        "Profit = Revenue - Expenses. If expenses exceed revenue, the business makes a loss.",
    },
    {
      id: 2,
      question: "What is 'Bootstrapping' a business?",
      options: [
        "Starting and growing a business using only your own personal savings and early sales cashflow, without taking outside investors",
        "Buying expensive shoes for all staff",
        "Tying your shoe laces before work",
        "Borrowing from 10 loan apps at once",
      ],
      correctIndex: 0,
      explanation:
        "Bootstrapping means self-funding your startup and reinvesting early revenue back into the business.",
    },
    {
      id: 3,
      question: "What is an 'Elevator Pitch'?",
      options: [
        "A clear, punchy 30-to-60 second summary of your business idea, value proposition, and customer problem",
        "A button inside a lift",
        "A speech made only on the top floor of a skyscraper",
        "A loud shout in an elevator",
      ],
      correctIndex: 0,
      explanation:
        "An elevator pitch convinces an investor or customer of your idea's value in the time it takes to ride an elevator.",
    },
  ],
};

export const photographerGigActivity: ActivityPuzzle = {
  type: "activity",
  id: "eg-photographer-gig-activity",
  title: "The Family Event Photographer Gig: Project",
  topic: "Young Hustler",
  subtype: "photographer_gig",
  instruction:
    "You have been hired to photograph a birthday party! Calculate your equipment cost, editing hours, pricing strategy, and calculate your profit margin.",
  config: {
    baseCost: 1500, // printing + transport
    pricingOptions: [
      { id: "p1", package: "Basic Shoot (50 digital photos)", price: 3500, estProfit: 2000 },
      { id: "p2", package: "Standard Package (100 digital + 20 framed prints)", price: 6500, estProfit: 4500 },
      { id: "p3", package: "VIP Package (Full day shoot + photobook album + drone shots)", price: 12000, estProfit: 8500 },
    ],
  },
};
