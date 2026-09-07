import { WordSearchPuzzle, QuizPuzzle } from "../types";

export const careersWordSearch1: WordSearchPuzzle = {
  type: "wordsearch",
  id: "eg-careers-ws1",
  title: "Future Careers & Tech Roles: Word Search",
  topic: "Young Hustler",
  theme: "Emerging Professions and Modern Disciplines",
  instruction: "Search for high-growth 21st-century careers and specializations.",
  size: 14,
  words: [
    "ACCOUNTANT",
    "ACTUARY",
    "AGRONOMIST",
    "APP DEVELOPER",
    "ARCHITECT",
    "DATA SCIENTIST",
    "DOCTOR",
    "ECONOMIST",
    "ENGINEER",
    "LAWYER",
    "PILOT",
    "ROBOTICS",
    "SURGEON",
    "VETERINARIAN",
  ],
  grid: [
    ["D", "A", "T", "A", "S", "C", "I", "E", "N", "T", "I", "S", "T", "A"],
    ["A", "P", "P", "D", "E", "V", "E", "L", "O", "P", "E", "R", "C", "C"],
    ["A", "C", "C", "O", "U", "N", "T", "A", "N", "T", "A", "C", "T", "U"],
    ["A", "G", "R", "O", "N", "O", "M", "I", "S", "T", "R", "O", "B", "A"],
    ["A", "R", "C", "H", "I", "T", "E", "C", "T", "E", "N", "G", "I", "R"],
    ["E", "C", "O", "N", "O", "M", "I", "S", "T", "L", "A", "W", "Y", "Y"],
    ["R", "O", "B", "O", "T", "I", "C", "S", "P", "I", "L", "O", "T", "E"],
    ["S", "U", "R", "G", "E", "O", "N", "D", "O", "C", "T", "O", "R", "R"],
    ["V", "E", "T", "E", "R", "I", "N", "A", "R", "I", "A", "N", "S", "S"],
    ["C", "A", "R", "E", "E", "R", "P", "A", "T", "H", "W", "A", "Y", "S"],
    ["M", "E", "N", "T", "O", "R", "S", "H", "I", "P", "G", "U", "I", "D"],
    ["P", "R", "O", "F", "E", "S", "S", "I", "O", "N", "A", "L", "I", "S"],
    ["I", "N", "N", "O", "V", "A", "T", "I", "O", "N", "L", "A", "B", "S"],
    ["L", "E", "A", "D", "E", "R", "S", "H", "I", "P", "T", "E", "A", "M"],
  ],
};

export const careersWordSearch3: WordSearchPuzzle = {
  type: "wordsearch",
  id: "eg-careers-ws3",
  title: "Workplace Skills & Ethics: Word Search",
  topic: "Young Hustler",
  theme: "Soft Skills, Communication, Integrity, and Teamwork",
  instruction: "Find the core interpersonal skills demanded by modern employers.",
  size: 14,
  words: [
    "ADAPTABILITY",
    "COLLABORATION",
    "COMMUNICATION",
    "CREATIVITY",
    "CRITICAL THINK",
    "DEDICATION",
    "EMPATHY",
    "HONESTY",
    "INITIATIVE",
    "INTEGRITY",
    "LEADERSHIP",
    "PUNCTUALITY",
    "RESILIENCE",
    "TEAMWORK",
  ],
  grid: [
    ["C", "O", "M", "M", "U", "N", "I", "C", "A", "T", "I", "O", "N", "A"],
    ["C", "O", "L", "L", "A", "B", "O", "R", "A", "T", "I", "O", "N", "D"],
    ["C", "R", "E", "A", "T", "I", "V", "I", "T", "Y", "E", "M", "P", "A"],
    ["A", "D", "A", "P", "T", "A", "B", "I", "L", "I", "T", "Y", "A", "P"],
    ["I", "N", "I", "T", "I", "A", "T", "I", "V", "E", "H", "O", "N", "T"],
    ["I", "N", "T", "E", "G", "R", "I", "T", "Y", "L", "E", "A", "D", "A"],
    ["P", "U", "N", "C", "T", "U", "A", "L", "I", "T", "Y", "D", "E", "B"],
    ["R", "E", "S", "I", "L", "I", "E", "N", "C", "E", "T", "E", "A", "I"],
    ["T", "E", "A", "M", "W", "O", "R", "K", "D", "E", "D", "I", "C", "L"],
    ["C", "R", "I", "T", "I", "C", "A", "L", "T", "H", "I", "N", "K", "I"],
    ["E", "M", "P", "A", "T", "H", "Y", "H", "O", "N", "E", "S", "T", "T"],
    ["P", "R", "O", "F", "E", "S", "S", "I", "O", "N", "A", "L", "I", "Y"],
    ["W", "O", "R", "K", "E", "T", "H", "I", "C", "V", "A", "L", "U", "E"],
    ["E", "X", "C", "E", "L", "L", "E", "N", "C", "E", "S", "K", "I", "L"],
  ],
};

export const careersQuiz1: QuizPuzzle = {
  type: "quiz",
  id: "eg-careers-quiz1",
  title: "Career Navigation & Employability Quiz",
  topic: "Young Hustler",
  instruction: "Explore how education, practical skills, and continuous learning create lucrative careers.",
  questions: [
    {
      id: 1,
      question: "What is an 'Actuary' in the financial sector?",
      options: [
        "A mathematics professional who analyzes statistical probabilities of risk in insurance and pensions",
        "An actor on television shows",
        "A person who paints road signs",
        "A museum security guard",
      ],
      correctIndex: 0,
      explanation:
        "Actuaries utilize advanced mathematics and statistics to model financial risk for insurers and pension funds.",
    },
    {
      id: 2,
      question: "Why are 'Soft Skills' (like communication and teamwork) as crucial as technical degrees?",
      options: [
        "They enable people to collaborate effectively, solve real problems, and lead productive teams",
        "They allow you to sleep during meetings",
        "They make computer screens softer",
        "Employers only care about video games",
      ],
      correctIndex: 0,
      explanation:
        "Technical ability gets you the interview; emotional intelligence and collaboration ensure leadership success.",
    },
  ],
};

export const careersQuiz2: QuizPuzzle = {
  type: "quiz",
  id: "eg-careers-quiz2",
  title: "Professional Ethics Quiz",
  topic: "Young Hustler",
  instruction: "Demonstrate your understanding of integrity in the modern workplace.",
  questions: [
    {
      id: 1,
      question: "What does 'Workplace Integrity' mean?",
      options: [
        "Consistently doing the right, honest, and ethical thing even when no supervisor is watching",
        "Arriving 3 hours late every day",
        "Taking office equipment home without permission",
        "Blaming mistakes on coworkers",
      ],
      correctIndex: 0,
      explanation:
        "Integrity is the cornerstone of professional trust, career reputation, and business longevity.",
    },
  ],
};
