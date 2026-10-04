import type { QuizPuzzle, QuizQuestion } from "../types";

function placeCorrect(options: string[], correctIndex: number, id: number) {
  const n = options.length;
  const correct = options[correctIndex] ?? options[0];
  const rest = options.filter((_, i) => i !== correctIndex);
  let s = id * 2654435761;
  for (let i = rest.length - 1; i > 0; i--) {
    s = (s ^ (s >>> 16)) >>> 0;
    const j = s % (i + 1);
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  const target = (id - 1) % n;
  rest.splice(target, 0, correct);
  return { options: rest, correctIndex: target };
}

export function q(
  id: number,
  lessonTitle: string,
  lessonBody: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  tryAgain: string,
): QuizQuestion {
  const shuffled = placeCorrect(options, correctIndex, id);
  return {
    id,
    lessonTitle,
    lessonBody,
    question,
    options: shuffled.options,
    correctIndex: shuffled.correctIndex,
    explanation,
    tryAgain,
    hint: tryAgain,
  };
}

export function lessonQuiz(
  id: string,
  title: string,
  topic: string,
  theme: string,
  questions: QuizQuestion[],
): QuizPuzzle {
  return {
    type: "quiz",
    id,
    title,
    topic,
    theme,
    instruction: "Read the lesson, then pick the best answer.",
    questions,
  };
}

export function chunkQuiz(puzzle: QuizPuzzle, size = 5): QuizPuzzle[] {
  const total = Math.max(1, Math.ceil(puzzle.questions.length / size));
  return Array.from({ length: total }, (_, i) => {
    const start = i * size;
    const slice = puzzle.questions.slice(start, start + size);
    return {
      ...puzzle,
      id: `${puzzle.id}-s${i + 1}`,
      title: `${puzzle.title} · ${i + 1}`,
      questions: slice,
    };
  });
}
