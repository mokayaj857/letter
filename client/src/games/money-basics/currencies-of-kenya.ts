import { WordSearchPuzzle, CryptogramPuzzle, QuizPuzzle } from "../types";

export const currenciesKenyaWordSearch1: WordSearchPuzzle = {
  type: "wordsearch",
  id: "mb-currencies-ws1",
  title: "Currencies of Kenya & Pre-Colonial Trade: Word Search",
  topic: "Money Basics",
  theme: "Historical Mediums of Exchange in Kenya",
  instruction: "Find historical items and colonial currencies used across Kenyan history.",
  size: 14,
  words: [
    "BEADS",
    "CLOTH",
    "COPPER WIRES",
    "COWRIE SHELLS",
    "FLORIN",
    "GOATS",
    "IRON HOES",
    "IVORY",
    "RUPEE",
    "SALT",
    "SHILLING",
    "THALER",
  ],
  grid: [
    ["C", "O", "W", "R", "I", "E", "S", "H", "E", "L", "L", "S", "A", "B"],
    ["C", "O", "P", "P", "E", "R", "W", "I", "R", "E", "S", "C", "D", "E"],
    ["I", "R", "O", "N", "H", "O", "E", "S", "F", "L", "O", "R", "I", "N"],
    ["S", "H", "I", "L", "L", "I", "N", "G", "R", "U", "P", "E", "E", "G"],
    ["T", "H", "A", "L", "E", "R", "B", "E", "A", "D", "S", "H", "I", "J"],
    ["I", "V", "O", "R", "Y", "G", "O", "A", "T", "S", "C", "L", "O", "T"],
    ["C", "L", "O", "T", "H", "S", "A", "L", "T", "K", "L", "M", "N", "H"],
    ["C", "A", "T", "T", "L", "E", "C", "A", "M", "E", "L", "S", "O", "P"],
    ["M", "A", "R", "I", "A", "T", "H", "E", "R", "E", "S", "A", "Q", "R"],
    ["P", "E", "S", "A", "P", "I", "C", "E", "A", "N", "N", "A", "S", "T"],
    ["S", "I", "L", "V", "E", "R", "G", "O", "L", "D", "U", "V", "W", "X"],
    ["C", "O", "L", "O", "N", "I", "A", "L", "P", "E", "N", "N", "Y", "Y"],
    ["E", "A", "S", "T", "A", "F", "R", "I", "C", "A", "N", "B", "O", "A"],
    ["C", "E", "N", "T", "E", "N", "A", "R", "Y", "C", "O", "I", "N", "S"],
  ],
};

export const currenciesKenyaCryptogram: CryptogramPuzzle = {
  type: "cryptogram",
  id: "mb-currencies-crypto1",
  title: "Indigenous Currencies & Historic Money Cryptogram",
  topic: "Money Basics",
  instruction:
    "Decode the cipher where each letter corresponds to its numerical alphabet position (A=1, B=2, ..., Z=26).",
  cipherType: "A1Z26",
  items: [
    {
      number: 1,
      prompt: "The Swahili word for money, originally derived from a fractional coin.",
      cipherSequence: [16, 5, 19, 1], // P E S A
      solution: "PESA",
      hint: "Common word used everywhere in East Africa",
    },
    {
      number: 2,
      prompt: "Small porcelain-like marine sea shells used as pre-colonial currency along trade routes.",
      cipherSequence: [3, 15, 23, 18, 9, 5], // C O W R I E
      solution: "COWRIE",
      hint: "Marine shell from the Indian Ocean",
    },
    {
      number: 3,
      prompt: "Pre-colonial metallic currency forged by blacksmiths for dowry and trade.",
      cipherSequence: [9, 18, 15, 14, 8, 15, 5], // I R O N H O E
      solution: "IRONHOE",
      hint: "Agricultural tool forged from iron",
    },
    {
      number: 4,
      prompt: "Austrian silver trade coin widely circulated in East Africa in the 19th century.",
      cipherSequence: [20, 8, 1, 12, 5, 18], // T H A L E R
      solution: "THALER",
      hint: "Maria Theresa silver coin",
    },
    {
      number: 5,
      prompt: "Currency of British India that circulated in Kenya during the construction of the railway.",
      cipherSequence: [18, 21, 16, 5, 5], // R U P E E
      solution: "RUPEE",
      hint: "Indian silver currency",
    },
    {
      number: 6,
      prompt: "Short-lived currency introduced in 1920 to replace the Indian Rupee in East Africa.",
      cipherSequence: [6, 12, 15, 18, 9, 14], // F L O R I N
      solution: "FLORIN",
      hint: "Used for barely two years before the Shilling",
    },
    {
      number: 7,
      prompt: "Standard currency unit introduced in 1921 across Kenya, Uganda, and Tanganyika.",
      cipherSequence: [19, 8, 9, 12, 12, 9, 14, 7], // S H I L L I N G
      solution: "SHILLING",
      hint: "Official currency unit today",
    },
    {
      number: 8,
      prompt: "Valuable white mineral seasoning mined and traded block by block across Africa.",
      cipherSequence: [19, 1, 12, 20], // S A L T
      solution: "SALT",
      hint: "Essential food preservative and condiment",
    },
  ],
};

export const currenciesKenyaQuiz: QuizPuzzle = {
  type: "quiz",
  id: "mb-currencies-quiz",
  title: "Currencies of Kenya Quiz",
  topic: "Money Basics",
  instruction: "Test your historical memory on the evolution of money in Kenyan history.",
  questions: [
    {
      id: 1,
      question: "Which pre-colonial currency came from marine snails harvested in the Indian Ocean?",
      options: ["Cowrie Shells", "Plastic chips", "Paper coupons", "Iron beads"],
      correctIndex: 0,
      explanation:
        "Cowrie shells (Cypraea moneta) were durable, light, and widely recognized across African caravan trade routes.",
    },
    {
      id: 2,
      question: "Why was the Indian Rupee adopted in Kenya in the late 1890s?",
      options: [
        "It was brought by Indian merchants and thousands of indentured railway laborers building the Uganda Railway",
        "It was discovered underground in Nairobi",
        "The King of India bought Kenya",
        "It was printed on baobab leaves",
      ],
      correctIndex: 0,
      explanation:
        "Construction of the Uganda Railway brought thousands of Indian workers, making the Rupee the de facto regional currency.",
    },
    {
      id: 3,
      question: "In what year did Kenya introduce its very own independent national currency after independence?",
      options: ["1966", "1950", "1985", "2000"],
      correctIndex: 0,
      explanation:
        "The Central Bank of Kenya opened and issued the first independent Kenyan Shilling notes and coins in September 1966.",
    },
    {
      id: 4,
      question: "What was the East African Currency Board (EACB)?",
      options: [
        "The colonial authority established in 1919 that issued the East African Shilling for Kenya, Uganda, and Tanganyika",
        "A pirate ship operating in Mombasa",
        "A private toy factory",
        "A wooden chalkboard used in schools",
      ],
      correctIndex: 0,
      explanation:
        "The EACB managed the shared currency of East Africa until member nations formed their own central banks in the 1960s.",
    },
  ],
};
