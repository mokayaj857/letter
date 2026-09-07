import { WordSearchPuzzle, QuizPuzzle } from "../types";

export const taxesWordSearch1: WordSearchPuzzle = {
  type: "wordsearch",
  id: "ss-taxes-ws1",
  title: "Taxes & National Revenue: Word Search",
  topic: "Young Hustler",
  theme: "Public Finance, KRA, and Civic Development",
  instruction: "Find the 14 words related to taxes, public services, and government revenues.",
  size: 14,
  words: [
    "COMPLIANCE",
    "CUSTOMS",
    "EXCISE DUTY",
    "FILING",
    "HEALTHCARE",
    "INFRASTRUCTURE",
    "ITAX",
    "KRA",
    "PAYE",
    "PUBLIC ROADS",
    "REVENUE",
    "SCHOOLS",
    "TAX PIN",
    "VAT",
  ],
  grid: [
    ["I", "N", "F", "R", "A", "S", "T", "R", "U", "C", "T", "U", "R", "E"],
    ["C", "O", "M", "P", "L", "I", "A", "N", "C", "E", "C", "U", "S", "T"],
    ["E", "X", "C", "I", "S", "E", "D", "U", "T", "Y", "F", "I", "L", "O"],
    ["H", "E", "A", "L", "T", "H", "C", "A", "R", "E", "P", "A", "I", "M"],
    ["P", "U", "B", "L", "I", "C", "R", "O", "A", "D", "S", "K", "N", "S"],
    ["S", "C", "H", "O", "O", "L", "S", "R", "E", "V", "E", "N", "G", "A"],
    ["T", "A", "X", "P", "I", "N", "I", "T", "A", "X", "P", "A", "Y", "E"],
    ["V", "A", "T", "K", "R", "A", "B", "U", "D", "G", "E", "T", "M", "N"],
    ["N", "A", "T", "I", "O", "N", "A", "L", "T", "R", "E", "A", "S", "U"],
    ["C", "I", "T", "I", "Z", "E", "N", "S", "H", "I", "P", "L", "A", "W"],
    ["C", "O", "R", "P", "O", "R", "A", "T", "E", "T", "A", "X", "E", "S"],
    ["D", "E", "V", "O", "L", "U", "T", "I", "O", "N", "F", "U", "N", "D"],
    ["E", "C", "O", "N", "O", "M", "I", "C", "G", "R", "O", "W", "T", "H"],
    ["T", "A", "X", "P", "A", "Y", "E", "R", "S", "R", "I", "G", "H", "T"],
  ],
};

export const taxesQuiz: QuizPuzzle = {
  type: "quiz",
  id: "ss-taxes-quiz",
  title: "Taxes & Nation Building Quiz",
  topic: "Young Hustler",
  instruction: "Understand how public revenues build schools, hospitals, and national infrastructure.",
  questions: [
    {
      id: 1,
      question: "Which government agency collects taxes on behalf of the Kenyan Government?",
      options: [
        "Kenya Revenue Authority (KRA)",
        "Kenya Bureau of Standards (KEBS)",
        "Kenya Power (KPLC)",
        "Kenya Red Cross",
      ],
      correctIndex: 0,
      explanation:
        "The Kenya Revenue Authority (KRA) is mandated to assess, collect, and account for all government revenues.",
    },
    {
      id: 2,
      question: "What is PAYE (Pay-As-You-Earn)?",
      options: [
        "Direct income tax deducted by employers from salaried workers' monthly wages",
        "A game show prize",
        "A ticket to board a matatu",
        "A discount voucher for clothes",
      ],
      correctIndex: 0,
      explanation:
        "PAYE is progressive income tax deducted at source from employees' gross compensation.",
    },
    {
      id: 3,
      question: "What is VAT (Value Added Tax)?",
      options: [
        "A consumption tax charged on the supply of goods and services (standard rate 16% in Kenya)",
        "A road speed limit fine",
        "A prize awarded to top students",
        "A bank savings deposit",
      ],
      correctIndex: 0,
      explanation:
        "VAT is an indirect consumption tax paid by end consumers on taxable products and services.",
    },
    {
      id: 4,
      question: "Why do governments collect taxes from citizens and businesses?",
      options: [
        "To fund public infrastructure like roads, hospitals, national security, water networks, and free primary/secondary education",
        "To buy private islands for politicians",
        "To hide the money in caves",
        "To reduce the number of cars on roads",
      ],
      correctIndex: 0,
      explanation:
        "Taxes provide the essential revenue that finances public healthcare, emergency services, transport infrastructure, and education.",
    },
    {
      id: 5,
      question: "What is a KRA PIN required for in Kenya?",
      options: [
        "Opening a formal bank account, registering a business, filing tax returns, and buying land",
        "Unlocking any smartphone",
        "Joining a social media app",
        "Buying sweets at a tuck shop",
      ],
      correctIndex: 0,
      explanation:
        "A KRA Personal Identification Number (PIN) uniquely identifies individual and corporate taxpayers for formal financial activities.",
    },
  ],
};
