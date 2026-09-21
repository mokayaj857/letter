import { CrosswordPuzzle, QuizPuzzle, ActivityPuzzle } from "../types";

export const videoGamesCrossword1: CrosswordPuzzle = {
  type: "crossword",
  id: "sw-videogames-cw1",
  title: "Video Games: Puzzle 1",
  topic: "Spending Wisely",
  instruction: "Fill the gaming money words from the puzzle-book word bank.",
  rows: 10,
  cols: 12,
  wordBank: ["XP", "Skin", "Grinding", "Opulence", "Battle Pass", "Box", "Lootbox", "Discount"],
  acrossClues: [
    { number: 3, clue: "A ticket that provides new content in exchange for playing or a one-time purchase.", answer: "BATTLEPASS", row: 2, col: 0, direction: "across" },
    { number: 5, clue: "Repeating a set task or quest to gather in-game currency or experience points; teaches that money is earned through effort.", answer: "GRINDING", row: 6, col: 0, direction: "across" },
  ],
  downClues: [
    { number: 1, clue: "A virtual grab bag containing random items; often compared to gambling because you don't know what you're buying.", answer: "LOOTBOX", row: 0, col: 11, direction: "down" },
    { number: 2, clue: "Experience points used to measure progress; in finance, this is like building your credit history.", answer: "XP", row: 0, col: 9, direction: "down" },
    { number: 4, clue: "A purely cosmetic variant of a character or weapon; buying these is a common want that requires budgeting.", answer: "SKIN", row: 0, col: 7, direction: "down" },
  ],
};

export const videoGamesCrossword2: CrosswordPuzzle = {
  type: "crossword",
  id: "sw-videogames-cw2",
  title: "Video Games: Puzzle 2",
  topic: "Spending Wisely",
  instruction: "Solve Kenyan games and money-goal clues from the book.",
  rows: 10,
  cols: 12,
  wordBank: ["Online", "Hiru", "Wants", "Budget", "Loan", "Goal", "NairobiX", "Emerald"],
  acrossClues: [
    { number: 3, clue: "The first 3D video game developed in Kenya, featuring a sci-fi defense of the capital city.", answer: "NAIROBIX", row: 2, col: 0, direction: "across" },
    { number: 4, clue: "Planning your pocket money in a way that will enable you to buy a new console or skins.", answer: "BUDGET", row: 5, col: 0, direction: "across" },
    { number: 6, clue: "The primary currency used for trading with villagers in Minecraft.", answer: "EMERALD", row: 8, col: 0, direction: "across" },
  ],
  downClues: [
    { number: 1, clue: "Items like new gaming headsets or rare skins that are NOT necessary for survival.", answer: "WANTS", row: 0, col: 11, direction: "down" },
    { number: 2, clue: "A Kenyan action-adventure game where you play as a Maasai Warrior.", answer: "HIRU", row: 0, col: 9, direction: "down" },
    { number: 5, clue: "A specific target you save for, such as game keys.", answer: "GOAL", row: 0, col: 8, direction: "down" },
  ],
};

export const videoGamesCrossword3: CrosswordPuzzle = {
  type: "crossword",
  id: "sw-videogames-cw3",
  title: "Video Games: Puzzle 3",
  topic: "Spending Wisely",
  instruction: "Fill safety, privacy, and in-game trading terms.",
  rows: 12,
  cols: 12,
  wordBank: ["Avatar", "Block", "Phishing", "Haki", "Budget", "Sale", "Password", "Scam", "Offer", "Trading", "Savings", "Token"],
  acrossClues: [
    { number: 5, clue: "A secret key that should never be shared in a game chat, not even with someone claiming to be an admin.", answer: "PASSWORD", row: 1, col: 0, direction: "across" },
    { number: 6, clue: "A digital character image you should use instead of your real photo to protect your privacy online.", answer: "AVATAR", row: 4, col: 0, direction: "across" },
    { number: 7, clue: "A scam where players are sent fake links for free skins or loot boxes to steal their M-Pesa or login details.", answer: "PHISHING", row: 7, col: 0, direction: "across" },
    { number: 8, clue: "The process of exchanging resources like wheat or coal for emeralds; a basic lesson in supply and demand.", answer: "TRADING", row: 10, col: 0, direction: "across" },
  ],
  downClues: [
    { number: 1, clue: "A vital safety feature; you should do this immediately if another player is being rude or making you uncomfortable.", answer: "BLOCK", row: 0, col: 10, direction: "down" },
    { number: 2, clue: "A plan used to manage your gold or emeralds while playing.", answer: "BUDGET", row: 0, col: 8, direction: "down" },
    { number: 3, clue: "A Kenyan game that teaches players about environmental rights and protecting trees.", answer: "HAKI", row: 3, col: 2, direction: "down" },
    { number: 4, clue: "Money set aside for future goals like new headphones.", answer: "SAVINGS", row: 2, col: 4, direction: "down" },
  ],
};

export const videoGamesQuiz: QuizPuzzle = {
  type: "quiz",
  id: "sw-videogames-quiz",
  title: "Video Games: Quiz",
  topic: "Spending Wisely",
  instruction: "Needs vs wants, Kenyan games, and online safety from the puzzle book.",
  questions: [
    { id: 1, question: "Buying a skin for your character in your favourite video game is an example of a?", options: ["Fixed Expense", "Want", "Investment", "Need"], correctIndex: 1, explanation: "Skins are cosmetic wants, not survival needs." },
    { id: 2, question: "What does grinding in a video game teach you about real-life money?", options: ["You should spend money as soon as you get it", "Money grows on trees", "Currency is earned through consistent effort and time", "Borrowing is better than earning"], correctIndex: 2, explanation: "Grinding shows that currency comes from effort over time." },
    { id: 3, question: "What is interest in a bank account?", options: ["A fee you pay to keep your money there", "A type of in-game achievement", "The price of a new video game", "The extra money the bank pays you for saving with them"], correctIndex: 3, explanation: "Banks pay interest on savings." },
    { id: 4, question: "Which Kenyan game features a Maasai prince fighting poachers to protect ancestral lands?", options: ["Hiru", "Nairobi X", "Boda Boda Madness", "Haki: Shield and Defend"], correctIndex: 0, explanation: "Hiru is the Kenyan Maasai warrior adventure." },
    { id: 5, question: "In the game Haki: Shield and Defend, what is the player's main objective?", options: ["Racing motorcycles", "Protecting trees from illegal loggers", "Fighting space aliens", "Building a city"], correctIndex: 1, explanation: "Haki teaches environmental rights and protecting trees." },
    { id: 6, question: "The game Nairobbery features characters who fight against?", options: ["Forest fires", "Wild animals", "Gangs and corruption in Nairobi", "Alien invaders"], correctIndex: 2, explanation: "Nairobbery is set against gangs and corruption." },
    { id: 7, question: "If a stranger in an online game asks to move the chat to WhatsApp, what should you do?", options: ["Ask for their number first", "Tell them your home address instead", "Share your number immediately", "Decline and block them to stay safe"], correctIndex: 3, explanation: "Platform hopping is a common scam. Block them." },
    { id: 8, question: "What is phishing in the context of gaming?", options: ["A scam to steal your login or M-Pesa details using fake links", "A way to level up faster", "A type of gaming headset", "A mini-game involving catching fish"], correctIndex: 0, explanation: "Phishing uses fake free-skin links to steal details." },
    { id: 9, question: "Why should you use an avatar instead of your real photo online?", options: ["Real photos are banned in all games", "To protect your personal identity and privacy", "It looks cooler", "To save data"], correctIndex: 1, explanation: "Avatars hide your real identity." },
    { id: 10, question: "If you are being bullied in a game, which three buttons are your best friends?", options: ["Start, Select, Home", "Delete, Shift, Enter", "Mute, Block, Report", "Jump, Duck, Shoot"], correctIndex: 2, explanation: "Mute, block, and report stop harassment." },
    { id: 11, question: "Which Kenyan authority should you contact for serious cybercrime or online threats?", options: ["Ministry of Education", "Nairobi City County", "Kenya Revenue Authority", "DCI Cybercrime Unit"], correctIndex: 3, explanation: "Serious threats go to the DCI Cybercrime Unit." },
  ],
};

export const squadOutingActivity: ActivityPuzzle = {
  type: "activity",
  id: "sw-squad-outing-activity",
  title: "Plan a Squad Outing",
  topic: "Spending Wisely",
  subtype: "home_treasure_hunt",
  instruction: "Draft a full budget for a day trip to Nairobi National Park.",
  config: {
    steps: [
      { step: 1, title: "List the costs", description: "Write transport, park entry, and snack costs for everyone in the squad." },
      { step: 2, title: "Add a total", description: "Add the numbers and check you have the correct total before asking parents." },
      { step: 3, title: "Needs vs treats", description: "Circle needs (fare and entry) first. Snacks only if money remains." },
    ],
  },
};
