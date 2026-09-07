import { WordSearchPuzzle, QuizPuzzle } from "../types";

export const africanCurrenciesWordSearch1: WordSearchPuzzle = {
  type: "wordsearch",
  id: "gm-african-ws1",
  title: "Currencies of Africa: Word Search",
  topic: "Global Money & Trade",
  theme: "National Currencies Across the African Continent",
  instruction: "Find the 14 national currencies used across African nations.",
  size: 14,
  words: [
    "BIRR",
    "CEDI",
    "DIRHAM",
    "DINAR",
    "FRANC",
    "KWACHA",
    "METICAL",
    "NAIRA",
    "POUND",
    "PULA",
    "RAND",
    "RUPEE",
    "SHILLING",
    "WALLET",
  ],
  grid: [
    ["S", "H", "I", "L", "L", "I", "N", "G", "N", "A", "I", "R", "A", "A"],
    ["K", "W", "A", "C", "H", "A", "D", "I", "R", "H", "A", "M", "B", "C"],
    ["D", "I", "N", "A", "R", "C", "E", "D", "I", "R", "A", "N", "D", "E"],
    ["M", "E", "T", "I", "C", "A", "L", "P", "U", "L", "A", "P", "O", "D"],
    ["B", "I", "R", "R", "F", "R", "A", "N", "C", "R", "U", "P", "E", "E"],
    ["P", "O", "U", "N", "D", "W", "A", "L", "L", "E", "T", "S", "A", "F"],
    ["E", "A", "S", "T", "A", "F", "R", "I", "C", "A", "P", "A", "T", "H"],
    ["N", "I", "G", "E", "R", "I", "A", "N", "A", "I", "R", "A", "X", "Y"],
    ["S", "O", "U", "T", "H", "A", "F", "R", "I", "C", "A", "R", "A", "N"],
    ["G", "H", "A", "N", "A", "C", "E", "D", "I", "C", "E", "D", "I", "S"],
    ["E", "T", "H", "I", "O", "P", "I", "A", "B", "I", "R", "R", "B", "A"],
    ["B", "O", "T", "S", "W", "A", "N", "A", "P", "U", "L", "A", "L", "A"],
    ["M", "O", "N", "E", "T", "A", "R", "Y", "U", "N", "I", "O", "N", "S"],
    ["A", "F", "R", "I", "C", "A", "N", "C", "E", "N", "T", "R", "A", "L"],
  ],
};

export const africanCurrenciesQuiz: QuizPuzzle = {
  type: "quiz",
  id: "gm-african-quiz",
  title: "Currencies of Africa Quiz",
  topic: "Global Money & Trade",
  instruction: "Match African nations to their official national currencies.",
  questions: [
    {
      id: 1,
      question: "Which country uses the 'Naira' as its official currency?",
      options: ["Nigeria", "South Africa", "Egypt", "Ghana"],
      correctIndex: 0,
      explanation: "Nigeria's official currency is the Nigerian Naira (symbol ₦).",
    },
    {
      id: 2,
      question: "What is the national currency of South Africa?",
      options: ["Rand (ZAR)", "Kwacha", "Pula", "Birr"],
      correctIndex: 0,
      explanation:
        "South Africa uses the Rand (ZAR), named after the Witwatersrand gold-bearing reef.",
    },
    {
      id: 3,
      question: "What is the currency of Botswana, which translates to 'Rain' in Setswana?",
      options: ["Pula (BWP)", "Cedi", "Franc", "Shilling"],
      correctIndex: 0,
      explanation:
        "Pula means 'rain' in Setswana, symbolizing precious blessings in a semi-arid country.",
    },
    {
      id: 4,
      question: "Which West African country uses the 'Cedi'?",
      options: ["Ghana", "Kenya", "Tanzania", "Morocco"],
      correctIndex: 0,
      explanation:
        "Ghana uses the Ghana Cedi, named after the cowrie shell (sedie) formerly used for trade.",
    },
  ],
};
