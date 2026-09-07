import { WordSearchPuzzle, QuizPuzzle } from "../types";

export const kenyanExportsWordSearch: WordSearchPuzzle = {
  type: "wordsearch",
  id: "mb-exports-ws1",
  title: "Kenyan Exports & Produce: Word Search",
  topic: "Money Basics",
  theme: "Major Commodities Kenya Sells to the World",
  instruction: "Find Kenya's leading export commodities sold to international global markets.",
  size: 14,
  words: [
    "AVOCADOS",
    "BLACK TEA",
    "CARNATIONS",
    "COFFEE",
    "CUT FLOWERS",
    "FRENCH BEANS",
    "MACADAMIA",
    "MANGOES",
    "PASSION FRUIT",
    "PYRETHRUM",
    "ROSES",
    "SODIUM CARBONATE",
    "TEXTILES",
    "TITANIUM",
  ],
  grid: [
    ["B", "L", "A", "C", "K", "T", "E", "A", "A", "V", "O", "C", "A", "D"],
    ["C", "U", "T", "F", "L", "O", "W", "E", "R", "S", "C", "O", "F", "F"],
    ["M", "A", "C", "A", "D", "A", "M", "I", "A", "R", "O", "S", "E", "S"],
    ["C", "A", "R", "N", "A", "T", "I", "O", "N", "S", "P", "A", "S", "S"],
    ["P", "Y", "R", "E", "T", "H", "R", "U", "M", "T", "E", "X", "T", "I"],
    ["F", "R", "E", "N", "C", "H", "B", "E", "A", "N", "S", "A", "B", "C"],
    ["S", "O", "D", "I", "U", "M", "C", "A", "R", "B", "O", "N", "A", "T"],
    ["T", "I", "T", "A", "N", "I", "U", "M", "M", "A", "N", "G", "O", "E"],
    ["P", "A", "S", "S", "I", "O", "N", "F", "R", "U", "I", "T", "K", "E"],
    ["H", "O", "R", "T", "I", "C", "U", "L", "T", "U", "R", "E", "E", "X"],
    ["F", "O", "R", "E", "I", "G", "N", "E", "X", "C", "H", "A", "N", "G"],
    ["E", "A", "S", "T", "A", "F", "R", "I", "C", "A", "T", "R", "A", "D"],
    ["P", "O", "R", "T", "M", "O", "M", "B", "A", "S", "A", "A", "I", "R"],
    ["N", "A", "I", "R", "O", "B", "I", "C", "A", "R", "G", "O", "S", "P"],
  ],
};

export const kenyanExportsQuiz: QuizPuzzle = {
  type: "quiz",
  id: "mb-exports-quiz",
  title: "Kenyan Exports Quiz",
  topic: "Money Basics",
  instruction: "Test your knowledge on Kenya's international trade, foreign exchange, and major exports.",
  questions: [
    {
      id: 1,
      question: "Which agricultural product is Kenya's single largest foreign exchange export earner?",
      options: ["Black Tea", "Wheat", "Cocoa", "Apples"],
      correctIndex: 0,
      explanation:
        "Kenya is one of the world's leading exporters of high-grade black tea, particularly CTC tea from the highlands.",
    },
    {
      id: 2,
      question: "Which lake area in the Great Rift Valley is famous for large-scale greenhouse rose and flower farming?",
      options: ["Lake Turkana", "Lake Naivasha", "Lake Victoria", "Lake Baringo"],
      correctIndex: 1,
      explanation:
        "Lake Naivasha is the hub of Kenya's booming floriculture and cut flower export sector.",
    },
    {
      id: 3,
      question: "What mineral resource is mined at Lake Magadi and exported for glass manufacturing?",
      options: ["Soda Ash (Sodium Carbonate)", "Gold", "Diamond", "Uranium"],
      correctIndex: 0,
      explanation:
        "Lake Magadi produces huge reserves of natural trona / soda ash, which is exported globally for making glass and detergents.",
    },
    {
      id: 4,
      question: "Why do exports earn 'foreign exchange' for Kenya?",
      options: [
        "Foreign buyers pay in international currencies like US Dollars, Euros, and Pounds, boosting Kenya's foreign reserves",
        "Exports are given away for free",
        "Kenya must pay buyers to take the tea",
        "It prevents local farmers from eating",
      ],
      correctIndex: 0,
      explanation:
        "Export earnings bring foreign currencies into Kenya's central bank reserves, strengthening the national economy.",
    },
    {
      id: 5,
      question: "What natural pesticide flower extract is Kenya historically renowned for producing?",
      options: ["Pyrethrum", "Sunflower", "Hibiscus", "Dandelion"],
      correctIndex: 0,
      explanation:
        "Pyrethrum flowers contain natural pyrethrins used worldwide in organic and eco-friendly insecticides.",
    },
  ],
};
