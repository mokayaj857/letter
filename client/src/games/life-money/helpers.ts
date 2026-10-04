import type { QuizPuzzle, QuizQuestion } from "../types";

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
  return {
    id,
    lessonTitle,
    lessonBody,
    question,
    options,
    correctIndex,
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
