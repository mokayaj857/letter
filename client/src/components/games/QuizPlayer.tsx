import React, { useRef, useState } from "react";
import { QuizPuzzle } from "@/games/types";
import { Check, X, ArrowRight, Zap, HelpCircle } from "lucide-react";
import { playPop, playSuccess, playError } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { useUserStore } from "@/lib/userStore";
import { toast } from "sonner";
import { HINT_COST, quizHintText } from "@/lib/hints";
import { HintButton } from "@/components/games/HintButton";
import { LessonQuizPlayer } from "@/components/games/LessonQuizPlayer";
import { cn } from "@/lib/utils";

interface Props {
  puzzle: QuizPuzzle;
  onComplete: (xp: number, coins: number) => void;
  onClose: () => void;
}

export const QuizPlayer: React.FC<Props> = ({ puzzle, onComplete, onClose }) => {
  if (puzzle.questions.some((q) => q.lessonBody)) {
    return <LessonQuizPlayer puzzle={puzzle} onComplete={onComplete} onClose={onClose} />;
  }
  return <ClassicQuizPlayer puzzle={puzzle} onComplete={onComplete} onClose={onClose} />;
};

const ClassicQuizPlayer: React.FC<Props> = ({ puzzle, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [lockedCorrect, setLockedCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [streak, setStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [eliminated, setEliminated] = useState<Record<number, number[]>>({});
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
  const [phase, setPhase] = useState<"lesson" | "quiz">("lesson");

  const currentQ = puzzle.questions[currentIndex];
  if (!currentQ) return null;

  const hasLesson = Boolean(currentQ.lessonBody);
  const showLesson = hasLesson && phase === "lesson";
  const retryUntilCorrect = Boolean(currentQ.tryAgain);
  const isAnswered = retryUntilCorrect ? lockedCorrect : selectedOption !== null;
  const isCorrect = selectedOption === currentQ.correctIndex;
  const progressPct = ((currentIndex + (isAnswered ? 1 : 0.35)) / puzzle.questions.length) * 100;

  const handleHint = () => {
    if (isAnswered) return;
    const already = unlockedHints.includes(currentIndex);
    const alreadyEliminated = eliminated[currentIndex]?.length ?? 0;
    if (already && alreadyEliminated > 0) {
      toast.message("Hint already used on this question.");
      return;
    }

    if (user.coins < HINT_COST) {
      playError(settings.soundEnabled);
      toast.error(`Need ${HINT_COST} coins for a hint. You have ${user.coins}.`);
      return;
    }
    if (!spendCoins(HINT_COST)) {
      toast.error("Not enough coins for a hint.");
      return;
    }

    const wrongIndexes = currentQ.options
      .map((_, i) => i)
      .filter((i) => i !== currentQ.correctIndex && !(eliminated[currentIndex] || []).includes(i));
    const drop = wrongIndexes[0];

    if (drop !== undefined) {
      setEliminated((prev) => ({
        ...prev,
        [currentIndex]: [...(prev[currentIndex] || []), drop],
      }));
    }
    setUnlockedHints((prev) => (prev.includes(currentIndex) ? prev : [...prev, currentIndex]));
    setHintsUsed((h) => h + 1);
    playPop(settings.soundEnabled);
    toast.success("Hint unlocked. One wrong option removed.");
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    if (eliminated[currentIndex]?.includes(index)) return;
    setSelectedOption(index);

    if (index === currentQ.correctIndex) {
      playSuccess(settings.soundEnabled);
      setLockedCorrect(true);
      scoreRef.current += 1;
      setScore(scoreRef.current);
      setStreak((st) => st + 1);
    } else {
      playError(settings.soundEnabled);
      setStreak(0);
      if (!retryUntilCorrect) {
        setLockedCorrect(true);
      }
    }
  };

  const goNextQuestion = () => {
    if (currentIndex < puzzle.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setLockedCorrect(false);
      setPhase("lesson");
      playPop(settings.soundEnabled);
      return;
    }

    const finalScore = scoreRef.current;
    const earnedXp = Math.round((finalScore / puzzle.questions.length) * 100) + 40;
    const earnedCoins = finalScore >= Math.ceil(puzzle.questions.length * 0.7) ? 30 : 15;
    triggerConfetti();
    onComplete(earnedXp, earnedCoins);
  };

  if (showLesson) {
    return (
      <div className="flex min-h-[520px] h-full flex-col bg-leaf">
        <div className="flex items-center justify-center gap-1.5 px-5 pt-4 pb-2">
          {puzzle.questions.slice(0, 8).map((_, i) => (
            <span
              key={i}
              className={cn(
                "size-1.5 rounded-full",
                i === Math.min(currentIndex, 7) ? "bg-white" : "bg-white/35",
              )}
            />
          ))}
        </div>
        <div className="relative mx-5 mb-4 flex min-h-0 flex-1 items-center justify-center">
          <div className="absolute inset-x-6 top-4 h-[92%] rotate-[4deg] rounded-[22px] bg-white/55 shadow-sm" />
          <div className="absolute inset-x-4 top-2 h-[94%] -rotate-[3deg] rounded-[22px] bg-white/80 shadow-sm" />
          <button
            type="button"
            onClick={() => {
              playPop(settings.soundEnabled);
              setPhase("quiz");
            }}
            className="relative z-[1] flex h-full w-full flex-col overflow-hidden rounded-[22px] bg-card px-6 py-7 text-left shadow-pop"
          >
            <h2 className="font-display text-2xl font-extrabold leading-tight text-foreground">
              {currentQ.lessonTitle || puzzle.title}
            </h2>
            <p className="mt-4 flex-1 overflow-y-auto text-[15px] leading-relaxed text-muted-foreground">
              {currentQ.lessonBody}
            </p>
            <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-widest text-leaf">
              Tap to continue
            </p>
          </button>
        </div>
      </div>
    );
  }

  if (hasLesson) {
    return (
      <div className="flex min-h-[520px] h-full flex-col bg-background">
        <div className="flex items-center gap-3 px-4 pt-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-leaf transition-all duration-500"
              style={{ width: `${Math.min(100, progressPct)}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4 pt-5">
          <h2 className="font-display text-xl font-extrabold leading-snug text-foreground">
            {currentQ.question}
          </h2>

          <div className="mt-5 space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const isEliminated = eliminated[currentIndex]?.includes(optIdx);
              const picked = selectedOption === optIdx;
              const showRight = isAnswered && optIdx === currentQ.correctIndex;
              const showWrong = picked && !isCorrect && optIdx !== currentQ.correctIndex;

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={isAnswered || isEliminated}
                  onClick={() => handleSelectOption(optIdx)}
                  className={cn(
                    "w-full rounded-2xl border-2 px-4 py-3.5 text-left transition-all active:scale-[0.99]",
                    isEliminated && "opacity-35 line-through",
                    showRight && "border-leaf bg-leaf/10 shadow-[0_0_0_3px_rgba(45,106,79,0.12)]",
                    showWrong && "border-rose-400 bg-rose-50",
                    picked && isCorrect && "border-leaf bg-leaf/10",
                    !picked && !showRight && "border-border bg-card hover:border-leaf/40",
                  )}
                >
                  <div className="flex items-start gap-3">
                    {showRight ? (
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-leaf text-white">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-muted-foreground/25" />
                    )}
                    <span className="font-display text-sm font-semibold leading-snug text-foreground">
                      {opt}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedOption !== null && !isCorrect && retryUntilCorrect && (
          <div className="px-5 pb-3">
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium leading-relaxed text-rose-800">
              {currentQ.tryAgain}
            </p>
          </div>
        )}

        {isAnswered && isCorrect && (
          <div className="mt-auto bg-sky/35 px-5 pb-5 pt-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-lg font-extrabold text-leaf">Great job!</p>
              <button
                type="button"
                onClick={handleHint}
                className="grid size-8 place-items-center rounded-full bg-white/70 text-muted-foreground"
                aria-label="Hint"
              >
                <HelpCircle className="size-4" />
              </button>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-foreground/80">{currentQ.explanation}</p>
            <button
              type="button"
              onClick={goNextQuestion}
              className="w-full rounded-2xl bg-leaf py-3.5 font-display text-sm font-extrabold uppercase tracking-wider text-white shadow-pop active:translate-y-0.5"
            >
              Next
            </button>
          </div>
        )}

        {isAnswered && !isCorrect && !retryUntilCorrect && (
          <div className="mt-auto bg-rose-50 px-5 pb-5 pt-4">
            <p className="mb-3 font-display text-lg font-extrabold text-rose-700">Not quite</p>
            <p className="mb-4 text-sm leading-relaxed text-foreground/80">{currentQ.explanation}</p>
            <button
              type="button"
              onClick={goNextQuestion}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-leaf py-3.5 font-display text-sm font-extrabold uppercase tracking-wider text-white shadow-pop"
            >
              Next
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full select-none flex-col">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-deep">
            {puzzle.topic}
          </span>
          <h2 className="font-display text-base font-bold text-foreground sm:text-lg">{puzzle.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <HintButton
            onClick={handleHint}
            used={hintsUsed}
            disabled={isAnswered || unlockedHints.includes(currentIndex)}
          />
          {streak > 1 && (
            <div className="flex animate-bounce items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              <Zap className="size-3.5 fill-amber-500 text-amber-500" />
              <span>{streak} Streak!</span>
            </div>
          )}
        </div>
      </div>

      <div className="my-3">
        <div className="mb-1.5 flex justify-between text-xs font-bold text-muted-foreground">
          <span>
            Question {currentIndex + 1} of {puzzle.questions.length}
          </span>
          <span className="text-primary-deep">Score: {score}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / puzzle.questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="my-2 flex min-h-[90px] flex-col justify-center rounded-3xl border border-border/60 bg-secondary/40 p-4">
        <p className="font-display text-sm font-bold leading-snug text-foreground sm:text-base">
          {currentQ.question}
        </p>
        {unlockedHints.includes(currentIndex) && (
          <p className="mt-2 text-[11px] font-semibold leading-relaxed text-primary-deep">
            💡 {currentQ.hint || quizHintText(currentQ.question, currentQ.options[currentQ.correctIndex] || "")}
          </p>
        )}
      </div>

      <div className="mt-2 flex-1 space-y-2">
        {currentQ.options.map((opt, optIdx) => {
          const isEliminated = eliminated[currentIndex]?.includes(optIdx);
          let style = "border-border bg-card hover:border-primary/50 text-foreground";
          if (isEliminated && !isAnswered) {
            style = "border-border/40 opacity-35 bg-muted line-through text-muted-foreground";
          } else if (isAnswered) {
            if (optIdx === currentQ.correctIndex) {
              style = "border-emerald-500 bg-emerald-500/10 font-bold text-emerald-900 dark:text-emerald-300";
            } else if (optIdx === selectedOption) {
              style = "border-rose-500 bg-rose-500/10 font-bold text-rose-900 dark:text-rose-300";
            } else {
              style = "border-border/40 bg-card opacity-50";
            }
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={isAnswered || isEliminated}
              onClick={() => handleSelectOption(optIdx)}
              className={`w-full rounded-2xl border-2 p-3.5 text-left font-display text-xs transition-all active:scale-[0.98] sm:text-sm ${style}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-6 place-items-center rounded-lg bg-muted text-xs font-bold">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="leading-snug">{opt}</span>
                </div>
                {isAnswered && optIdx === currentQ.correctIndex && (
                  <Check className="ml-2 size-5 shrink-0 text-emerald-600" strokeWidth={3} />
                )}
                {isAnswered && optIdx === selectedOption && optIdx !== currentQ.correctIndex && (
                  <X className="ml-2 size-5 shrink-0 text-rose-600" strokeWidth={3} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-3 animate-pop-in rounded-2xl border border-primary/20 bg-primary-soft/30 p-3.5">
          <p className="text-xs font-semibold leading-relaxed text-foreground">💡 {currentQ.explanation}</p>
          <button
            type="button"
            onClick={goNextQuestion}
            className="shadow-pop mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-display text-sm font-bold text-primary-foreground transition-all active:translate-y-1"
          >
            <span>{currentIndex < puzzle.questions.length - 1 ? "Next Question" : "Complete Quiz"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};
