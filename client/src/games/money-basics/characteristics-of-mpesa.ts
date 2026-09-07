import { WordSearchPuzzle, CrosswordPuzzle, QuizPuzzle } from "../types";

export const mpesaWordSearch: WordSearchPuzzle = {
  type: "wordsearch",
  id: "mb-mpesa-ws1",
  title: "Characteristics of M-Pesa: Word Search",
  topic: "Money Basics",
  theme: "Mobile Money & Digital Payments",
  instruction: "Find the 14 words describing Safaricom's revolutionary M-Pesa ecosystem.",
  size: 14,
  words: [
    "AGENT",
    "AIRTIME",
    "BUY GOODS",
    "CASH IN",
    "CASH OUT",
    "CONVENIENT",
    "DEPOSIT",
    "FULIZA",
    "INSTANT",
    "PAYBILL",
    "PIN",
    "SAFARICOM",
    "SECURE",
    "WITHDRAW",
  ],
  grid: [
    ["S", "A", "F", "A", "R", "I", "C", "O", "M", "P", "A", "Y", "B", "I"],
    ["B", "U", "Y", "G", "O", "O", "D", "S", "A", "G", "E", "N", "T", "L"],
    ["C", "A", "S", "H", "I", "N", "D", "E", "P", "O", "S", "I", "T", "L"],
    ["C", "A", "S", "H", "O", "U", "T", "F", "U", "L", "I", "Z", "A", "M"],
    ["C", "O", "N", "V", "E", "N", "I", "E", "N", "T", "A", "B", "C", "P"],
    ["W", "I", "T", "H", "D", "R", "A", "W", "P", "I", "N", "S", "E", "E"],
    ["I", "N", "S", "T", "A", "N", "T", "S", "E", "C", "U", "R", "E", "S"],
    ["A", "I", "R", "T", "I", "M", "E", "T", "I", "L", "L", "N", "O", "A"],
    ["S", "I", "M", "C", "A", "R", "D", "T", "A", "R", "I", "F", "F", "B"],
    ["T", "R", "A", "N", "S", "A", "C", "T", "I", "O", "N", "K", "L", "M"],
    ["M", "S", "H", "W", "A", "R", "I", "O", "K", "O", "A", "P", "Q", "R"],
    ["H", "A", "K", "I", "Kisha", "A", "B", "C", "D", "E", "F", "G", "H", "I"],
    ["S", "M", "A", "R", "T", "P", "H", "O", "N", "E", "A", "P", "P", "S"],
    ["D", "I", "G", "I", "T", "A", "L", "W", "A", "L", "L", "E", "T", "S"],
  ],
};

export const mpesaCrossword1: CrosswordPuzzle = {
  type: "crossword",
  id: "mb-mpesa-cw1",
  title: "M-Pesa Technology & Safety Crossword",
  topic: "Money Basics",
  instruction: "Fill in the crossword clues covering M-Pesa safety, agent operations, and transactions.",
  rows: 8,
  cols: 10,
  wordBank: ["AGENT", "PIN", "FULIZA", "SAFARICOM", "PAYBILL", "AIRTIME"],
  acrossClues: [
    {
      number: 1,
      clue: "Telecommunications network provider that invented and launched M-Pesa.",
      answer: "SAFARICOM",
      row: 0,
      col: 0,
      direction: "across",
    },
    {
      number: 3,
      clue: "Secret 4-digit security code that must NEVER be shared with anyone.",
      answer: "PIN",
      row: 2,
      col: 2,
      direction: "across",
    },
    {
      number: 5,
      clue: "Continuous overdraft credit facility on M-Pesa.",
      answer: "FULIZA",
      row: 4,
      col: 1,
      direction: "across",
    },
  ],
  downClues: [
    {
      number: 1,
      clue: "Physical kiosk operator where customers deposit cash or make withdrawals.",
      answer: "AGENT",
      row: 1,
      col: 0,
      direction: "down",
    },
    {
      number: 2,
      clue: "Unique business number used to settle utility bills and school fees.",
      answer: "PAYBILL",
      row: 1,
      col: 5,
      direction: "down",
    },
    {
      number: 4,
      clue: "Talk time and data minutes purchased instantly through phone menu.",
      answer: "AIRTIME",
      row: 1,
      col: 8,
      direction: "down",
    },
  ],
};

export const mpesaQuiz: QuizPuzzle = {
  type: "quiz",
  id: "mb-mpesa-quiz",
  title: "Characteristics of M-Pesa Quiz",
  topic: "Money Basics",
  instruction: "Answer questions testing your knowledge of mobile wallet security and transactions.",
  questions: [
    {
      id: 1,
      question: "In what year was M-Pesa originally launched in Kenya?",
      options: ["1999", "2007", "2015", "2020"],
      correctIndex: 1,
      explanation:
        "M-Pesa was pioneered and launched by Safaricom in Kenya in March 2007.",
    },
    {
      id: 2,
      question: "What is the primary function of an M-Pesa PIN?",
      options: [
        "To check the current weather in your town",
        "A private secret code that authenticates and authorizes any transaction",
        "A public phone number to share with strangers",
        "The price of a brand new phone",
      ],
      correctIndex: 1,
      explanation:
        "Your M-Pesa PIN is your private digital signature. Sharing it compromises your funds.",
    },
    {
      id: 3,
      question: "What service allows users to reverse money sent accidentally to the wrong number?",
      options: [
        "Sending the SMS transaction message to 456 / Hakikisha reversal",
        "Switching off your phone for 2 days",
        "Changing your wallpaper",
        "Deleting the M-Pesa app immediately",
      ],
      correctIndex: 0,
      explanation:
        "Forwarding the M-Pesa SMS confirmation code to 456 initiates an instant transaction reversal request.",
    },
    {
      id: 4,
      question: "What is the difference between a Paybill Number and a Till Number (Buy Goods)?",
      options: [
        "Paybill requires an Account Number (e.g. school fee/meter no), whereas Till is for instant point-of-sale shop purchases",
        "Till is only for aeroplanes and Paybill is for ships",
        "There is no difference; they are exactly identical",
        "Paybill is free of any network connection",
      ],
      correctIndex: 0,
      explanation:
        "Paybills route payments to specific customer accounts using an account number, while Till Numbers are used directly at shop checkouts.",
    },
    {
      id: 5,
      question: "What safety precaution must you always observe before confirming any M-Pesa payment?",
      options: [
        "Check the Hakikisha pop-up to verify the recipient's name and the exact amount",
        "Press send without looking at the screen",
        "Give your phone to a stranger on the street to type your PIN",
        "Send double the requested amount",
      ],
      correctIndex: 0,
      explanation:
        "Hakikisha displays the verified name of the recipient, allowing you 15 seconds to cancel if incorrect.",
    },
  ],
};
