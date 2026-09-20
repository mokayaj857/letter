import React, { useState } from "react";
import { QuizPuzzle } from "@/games/types";
import { Check, X, ArrowRight, Zap } from "lucide-react";
import { playPop, playSuccess, playError } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { useUserStore } from "@/lib/userStore";
import { toast } from "sonner";
import { HINT_COST, quizHintText } from "@/lib/hints";
import { HintButton } from "@/components/games/HintButton";

interface Props {
  puzzle: QuizPuzzle;
  onComplete: (xp: number, coins: number) => void;
  onClose: () => void;
}

export const QuizPlayer: React.FC<Props> = ({ puzzle, onComplete, onClose }) => {
  const { settings, spendCoins, user } = useUserStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [eliminated, setEliminated] = useState<Record<number, number[]>>({});
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);

  const currentQ = puzzle.questions[currentIndex];
  if (!currentQ) return null;

  const isAnswered = selectedOption !== null;
  const isCorrect = selectedOption === currentQ.correctIndex;

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
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      playError(settings.soundEnabled);
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIndex < puzzle.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      playPop(settings.soundEnabled);
    } else {
      // Quiz completed!
      const finalScore = score + (isCorrect ? 1 : 0);
      const earnedXp = Math.round((finalScore / puzzle.questions.length) * 100) + 40;
      const earnedCoins = finalScore >= Math.ceil(puzzle.questions.length * 0.7) ? 30 : 15;

      triggerConfetti();
      onComplete(earnedXp, earnedCoins);
    }
  };

  const progressPct = ((currentIndex + 1) / puzzle.questions.length) * 100;

  return (
    <div className="flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-deep">
            {puzzle.topic}
          </span>
          <h2 className="text-base sm:text-lg font-bold font-display text-foreground">
            {puzzle.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <HintButton
            onClick={handleHint}
            used={hintsUsed}
            disabled={isAnswered || unlockedHints.includes(currentIndex)}
          />
          {streak > 1 && (
            <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold animate-bounce">
              <Zap className="size-3.5 fill-amber-500 text-amber-500" />
              <span>{streak} Streak!</span>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-3">
        <div className="flex justify-between text-xs font-bold text-muted-foreground mb-1.5">
          <span>
            Question {currentIndex + 1} of {puzzle.questions.length}
          </span>
          <span className="text-primary-deep">Score: {score}</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Question Text */}
      <div className="my-2 p-4 bg-secondary/40 border border-border/60 rounded-3xl min-h-[90px] flex flex-col justify-center">
        <p className="font-display text-sm sm:text-base font-bold text-foreground leading-snug">
          {currentQ.question}
        </p>
        {unlockedHints.includes(currentIndex) && (
          <p className="mt-2 text-[11px] font-semibold text-primary-deep leading-relaxed">
            💡{" "}
            {currentQ.hint ||
              quizHintText(currentQ.question, currentQ.options[currentQ.correctIndex] || "")}
          </p>
        )}
      </div>

      {/* Options */}
      <div className="space-y-2 mt-2 flex-1">
        {currentQ.options.map((opt, optIdx) => {
          const isEliminated = eliminated[currentIndex]?.includes(optIdx);
          let style = "border-border bg-card hover:border-primary/50 text-foreground";
          if (isEliminated && !isAnswered) {
            style = "border-border/40 opacity-35 bg-muted line-through text-muted-foreground";
          } else if (isAnswered) {
            if (optIdx === currentQ.correctIndex) {
              style = "border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-bold";
            } else if (optIdx === selectedOption) {
              style = "border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-300 font-bold";
            } else {
              style = "border-border/40 opacity-50 bg-card";
            }
          }

          return (
            <button
              key={opt}
              type="button"
              disabled={isAnswered || isEliminated}
              onClick={() => handleSelectOption(optIdx)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 text-left font-display text-xs sm:text-sm transition-all active:scale-[0.98] ${style}`}
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-6 place-items-center rounded-lg bg-muted text-xs font-bold">
                  {String.fromCharCode(65 + optIdx)}
                </span>
                <span className="leading-snug">{opt}</span>
              </div>
              {isAnswered && optIdx === currentQ.correctIndex && (
                <Check className="size-5 text-emerald-600 shrink-0 ml-2" strokeWidth={3} />
              )}
              {isAnswered && optIdx === selectedOption && optIdx !== currentQ.correctIndex && (
                <X className="size-5 text-rose-600 shrink-0 ml-2" strokeWidth={3} />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation & Next Step */}
      {isAnswered && (
        <div className="mt-3 p-3.5 bg-primary-soft/30 border border-primary/20 rounded-2xl animate-pop-in">
          <p className="text-xs font-semibold text-foreground leading-relaxed">
            💡 {currentQ.explanation}
          </p>
          <button
            type="button"
            onClick={handleNext}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 font-display text-sm font-bold text-primary-foreground shadow-pop active:translate-y-1 transition-all"
          >
            <span>
              {currentIndex < puzzle.questions.length - 1 ? "Next Question" : "Complete Quiz"}
            </span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};
