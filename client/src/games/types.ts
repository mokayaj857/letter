export type GameType =
  | "wordsearch"
  | "crossword"
  | "quiz"
  | "activity";

export interface WordSearchPuzzle {
  type: "wordsearch";
  id: string;
  title: string;
  topic: string;
  theme?: string;
  instruction?: string;
  size: number; // usually 14
  grid: string[][]; // 14x14 characters uppercase
  words: string[]; // words to find
  clues?: Record<string, string>; // optional definition or clue
}

export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
  direction: "across" | "down";
}

export interface CrosswordPuzzle {
  type: "crossword";
  id: string;
  title: string;
  topic: string;
  instruction?: string;
  rows: number;
  cols: number;
  grid?: string[][]; // Optional precomputed grid with black cells as '#'
  acrossClues: CrosswordClue[];
  downClues: CrosswordClue[];
  wordBank?: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizPuzzle {
  type: "quiz";
  id: string;
  title: string;
  topic: string;
  instruction?: string;
  questions: QuizQuestion[];
}

export interface CryptogramPuzzle {
  type: "cryptogram";
  id: string;
  title: string;
  topic: string;
  instruction?: string;
  cipherType: "A1Z26"; // A=1, B=2, ..., Z=26
  items: {
    number: number;
    prompt: string;
    cipherSequence: number[]; // e.g., [16, 5, 19, 1] for PESA
    solution: string;
    hint?: string;
  }[];
}

export interface ActivityPuzzle {
  type: "activity";
  id: string;
  title: string;
  topic: string;
  subtype: "budget_challenge" | "account_matcher" | "would_you_rather" | "photographer_gig" | "smart_money_pledge" | "home_treasure_hunt";
  instruction: string;
  config?: any;
}

export type AnyGame =
  | WordSearchPuzzle
  | CrosswordPuzzle
  | QuizPuzzle
  | CryptogramPuzzle
  | ActivityPuzzle;
