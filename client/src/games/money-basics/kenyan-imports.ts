import { WordSearchPuzzle, QuizPuzzle } from "../types";

export const kenyanImportsWordSearch1: WordSearchPuzzle = {
  type: "wordsearch",
  id: "mb-imports-ws1",
  title: "Kenyan Imports: Word Search",
  topic: "Money Basics",
  theme: "Goods and Commodities Kenya Buys from Other Nations",
  instruction: "Search for vital items Kenya purchases and imports from international trading partners.",
  size: 14,
  words: [
    "CHEMICALS",
    "CRUDE OIL",
    "ELECTRONICS",
    "FERTILIZER",
    "MACHINERY",
    "MEDICINE",
    "METALS",
    "MOTOR VEHICLES",
    "PALM OIL",
    "PETROLEUM",
    "PHARMACEUTICALS",
    "PLASTICS",
    "RICE",
    "STEEL",
    "WHEAT",
  ],
  grid: [
    ["P", "E", "T", "R", "O", "L", "E", "U", "M", "M", "E", "T", "A", "L"],
    ["F", "E", "R", "T", "I", "L", "I", "Z", "E", "R", "C", "H", "E", "M"],
    ["M", "A", "C", "H", "I", "N", "E", "R", "Y", "P", "L", "A", "S", "T"],
    ["E", "L", "E", "C", "T", "R", "O", "N", "I", "C", "S", "T", "E", "E"],
    ["M", "O", "T", "O", "R", "V", "E", "H", "I", "C", "L", "E", "S", "X"],
    ["C", "R", "U", "D", "E", "O", "I", "L", "W", "H", "E", "A", "T", "Y"],
    ["P", "H", "A", "R", "M", "A", "C", "E", "U", "T", "I", "C", "A", "L"],
    ["M", "E", "D", "I", "C", "I", "N", "E", "P", "A", "L", "M", "O", "I"],
    ["R", "I", "C", "E", "C", "H", "E", "M", "I", "C", "A", "L", "S", "Z"],
    ["S", "H", "I", "P", "P", "I", "N", "G", "C", "O", "N", "T", "A", "I"],
    ["K", "I", "L", "I", "N", "D", "I", "N", "I", "D", "O", "C", "K", "S"],
    ["C", "U", "S", "T", "O", "M", "S", "D", "U", "T", "Y", "T", "A", "X"],
    ["T", "A", "R", "I", "F", "F", "B", "A", "L", "A", "N", "C", "E", "S"],
    ["T", "R", "A", "D", "E", "D", "E", "F", "I", "C", "I", "T", "U", "V"],
  ],
};

export const kenyanImportsQuiz: QuizPuzzle = {
  type: "quiz",
  id: "mb-imports-quiz",
  title: "Kenyan Imports & Trade Balance Quiz",
  topic: "Money Basics",
  instruction: "Understand how imports shape Kenya's economic balance of payments.",
  questions: [
    {
      id: 1,
      question: "What is Kenya's single largest import expense item?",
      options: [
        "Petroleum products & crude fuel",
        "Wooden furniture",
        "Coffee beans",
        "Bottled drinking water",
      ],
      correctIndex: 0,
      explanation:
        "Refined petroleum products and energy inputs represent Kenya's largest single import expenditure.",
    },
    {
      id: 2,
      question: "Which port serves as the primary maritime gateway for all goods imported into Kenya and East Africa?",
      options: [
        "Port of Mombasa (Kilindini Harbour)",
        "Port of Kisumu",
        "Port of Lamu only",
        "Lake Naivasha dock",
      ],
      correctIndex: 0,
      explanation:
        "The Port of Mombasa is the busiest deep-water seaport in East Africa handling containerized imports.",
    },
    {
      id: 3,
      question: "What does a 'Trade Deficit' mean?",
      options: [
        "When the value of goods imported exceeds the total value of goods exported",
        "When a country stops using paper money",
        "When a country gives away its resources for free",
        "When there is no sea access",
      ],
      correctIndex: 0,
      explanation:
        "A trade deficit occurs when a nation spends more on imported goods than it earns from selling exports.",
    },
    {
      id: 4,
      question: "What tax is charged on imported goods upon entering the country?",
      options: ["Customs Duty / Import Tariff", "Pay As You Earn (PAYE)", "Rental Income Tax", "Road Toll only"],
      correctIndex: 0,
      explanation:
        "Customs duties and tariffs are levied by Kenya Revenue Authority (KRA) on imported products.",
    },
    {
      id: 5,
      question: "Why does Kenya import significant amounts of wheat and rice?",
      options: [
        "Domestic consumption demand exceeds local farm production capacity",
        "Kenya is not allowed to grow crops",
        "Imported food has no calories",
        "Wheat is used to build roads",
      ],
      correctIndex: 0,
      explanation:
        "Local harvest yields of rice and wheat do not fully satisfy national consumer demand, necessitating imports.",
    },
  ],
};
