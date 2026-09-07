import { WordSearchPuzzle, QuizPuzzle } from "../types";

export const digitalEconomyWordSearch: WordSearchPuzzle = {
  type: "wordsearch",
  id: "ss-digital-ws1",
  title: "Digital Economy & Tech Skills: Word Search",
  topic: "Digital Money",
  theme: "AI, Web3, Fintech, Cloud Computing & Digital Security",
  instruction: "Find the 14 words shaping modern digital work and fintech innovation.",
  size: 14,
  words: [
    "ALGORITHM",
    "AUTOMATION",
    "BLOCKCHAIN",
    "CLOUD",
    "CODING",
    "CYBERSECURITY",
    "DATA SCIENCE",
    "DIGITAL ASSET",
    "E COMMERCE",
    "FINTECH",
    "INTERNET",
    "METAVERSE",
    "PASSWORD",
    "PHISHING",
  ],
  grid: [
    ["C", "Y", "B", "E", "R", "S", "E", "C", "U", "R", "I", "T", "Y", "A"],
    ["B", "L", "O", "C", "K", "C", "H", "A", "I", "N", "C", "L", "O", "U"],
    ["D", "A", "T", "A", "S", "C", "I", "E", "N", "C", "E", "C", "O", "T"],
    ["A", "L", "G", "O", "R", "I", "T", "H", "M", "P", "H", "I", "S", "O"],
    ["A", "U", "T", "O", "M", "A", "T", "I", "O", "N", "F", "I", "N", "M"],
    ["E", "C", "O", "M", "M", "E", "R", "C", "E", "P", "A", "S", "S", "A"],
    ["F", "I", "N", "T", "E", "C", "H", "M", "E", "T", "A", "V", "E", "T"],
    ["P", "A", "S", "S", "W", "O", "R", "D", "C", "O", "D", "I", "N", "I"],
    ["D", "I", "G", "I", "T", "A", "L", "A", "S", "S", "E", "T", "S", "O"],
    ["I", "N", "T", "E", "R", "N", "E", "T", "S", "K", "I", "L", "L", "N"],
    ["M", "O", "B", "I", "L", "E", "A", "P", "P", "L", "I", "C", "A", "T"],
    ["A", "R", "T", "I", "F", "I", "C", "I", "A", "L", "I", "N", "T", "E"],
    ["S", "O", "F", "T", "W", "A", "R", "E", "D", "E", "V", "E", "L", "O"],
    ["T", "E", "L", "E", "M", "E", "D", "I", "C", "I", "N", "E", "S", "S"],
  ],
};

export const digitalEconomyQuiz: QuizPuzzle = {
  type: "quiz",
  id: "ss-digital-quiz",
  title: "Digital Economy & Cyber Safety Quiz",
  topic: "Digital Money",
  instruction: "Master digital identity hygiene, password security, and modern tech skills.",
  questions: [
    {
      id: 1,
      question: "What is 'Two-Factor Authentication' (2FA) and why is it crucial?",
      options: [
        "A security measure requiring two separate verification checks (e.g. password + SMS/authenticator code) before granting access",
        "Having two computer screens side by side",
        "Writing your password on two different post-it notes",
        "Paying twice for every app download",
      ],
      correctIndex: 0,
      explanation:
        "2FA ensures that even if an attacker steals your password, they cannot breach your account without your physical second factor.",
    },
    {
      id: 2,
      question: "What is a 'Phishing' attack?",
      options: [
        "Fraudulent messages designed to deceive people into revealing sensitive credentials, PINs, or bank account numbers",
        "Catching fish using high-tech digital rods",
        "Cleaning your computer monitor screen",
        "Playing virtual reality games with dolphins",
      ],
      correctIndex: 0,
      explanation:
        "Phishing uses deceptive links, fake urgency, and forged logos to harvest passwords from unsuspecting victims.",
    },
    {
      id: 3,
      question: "What makes a strong, uncrackable master password or passphrase?",
      options: [
        "A combination of 12+ characters containing uppercase, lowercase, numbers, and symbols, with no personal names or birthdays",
        "Your pet's name followed by 123",
        "The word 'password' in all capitals",
        "Your date of birth",
      ],
      correctIndex: 0,
      explanation:
        "Complex passphrases resist automated brute-force and dictionary dictionary cyberattacks.",
    },
    {
      id: 4,
      question: "Why should you avoid performing financial transactions over public unsecured Wi-Fi networks in cafes or airports?",
      options: [
        "Unencrypted public networks allow bad actors to snoop and intercept data packets in transit (Man-in-the-Middle attacks)",
        "Public Wi-Fi makes your phone heavier",
        "Public Wi-Fi uses up your cash coins",
        "Banks block all Wi-Fi signals",
      ],
      correctIndex: 0,
      explanation:
        "Public Wi-Fi lacks encryption protections; always use cellular data or a reputable VPN for financial operations.",
    },
  ],
};
