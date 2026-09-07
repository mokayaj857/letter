import React, { useState } from "react";
import { CryptogramPuzzle } from "@/games/types";
import { Check, Lightbulb, Sparkles, Key } from "lucide-react";
import { playPop, playSuccess, playError } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { useUserStore } from "@/lib/userStore";

interface Props {
  puzzle: CryptogramPuzzle;
  onComplete: (xp: number, coins: number) => void;
  onClose: () => void;
}

export const CryptogramPlayer: React.FC<Props> = ({ puzzle, onComplete, onClose }) => {
  const { settings } = useUserStore();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<{ [itemIdx: number]: string[] }>({
    0: Array(puzzle.items[0]?.cipherSequence?.length || 0).fill(""),
  });
  const [solvedItems, setSolvedItems] = useState<number[]>([]);
  const [showAlphabetKey, setShowAlphabetKey] = useState(true);

  const currentItem = puzzle.items[activeItemIndex];

  const handleCharChange = (charIndex: number, char: string) => {
    if (!currentItem) return;
    const upper = char.slice(-1).toUpperCase();
    const currentList = [
      ...(userInputs[activeItemIndex] ||
        Array(currentItem.cipherSequence.length).fill("")),
    ];
    currentList[charIndex] = upper;

    setUserInputs({
      ...userInputs,
      [activeItemIndex]: currentList,
    });
    playPop(settings.soundEnabled);

    // Auto-advance input focus or check word
    const enteredWord = currentList.join("");
    const targetWord = currentItem.solution.toUpperCase().replace(/\s+/g, "");

    if (enteredWord === targetWord) {
      playSuccess(settings.soundEnabled);
      if (!solvedItems.includes(activeItemIndex)) {
        const newSolved = [...solvedItems, activeItemIndex];
        setSolvedItems(newSolved);

        if (newSolved.length === puzzle.items.length) {
          triggerConfetti();
          setTimeout(() => {
            onComplete(150, 40);
          }, 600);
        } else if (activeItemIndex < puzzle.items.length - 1) {
          setTimeout(() => {
            setActiveItemIndex((i) => i + 1);
          }, 400);
        }
      }
    }
  };

  const handleHint = () => {
    if (!currentItem) return;
    const target = currentItem.solution.toUpperCase().replace(/\s+/g, "");
    const currentList = [
      ...(userInputs[activeItemIndex] ||
        Array(currentItem.cipherSequence.length).fill("")),
    ];

    for (let i = 0; i < target.length; i++) {
      if (currentList[i] !== target[i]) {
        currentList[i] = target[i];
        setUserInputs({
          ...userInputs,
          [activeItemIndex]: currentList,
        });
        playPop(settings.soundEnabled);
        return;
      }
    }
  };

  // Alphabet A1Z26 mapping array
  const alphabetKey = Array.from({ length: 26 }, (_, i) => ({
    letter: String.fromCharCode(65 + i),
    num: i + 1,
  }));

  if (!currentItem) return null;

  return (
    <div className="flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-deep">
            {puzzle.topic} · A1Z26 Cipher
          </span>
          <h2 className="text-base sm:text-lg font-bold font-display text-foreground">
            {puzzle.title}
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleHint}
            className="flex items-center gap-1 text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 px-2.5 py-1.5 rounded-xl active:scale-95"
          >
            <Lightbulb className="size-3.5" />
            <span>Hint</span>
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="my-2.5 flex items-center justify-between text-xs font-bold text-muted-foreground">
        <span>
          Word {activeItemIndex + 1} of {puzzle.items.length}
        </span>
        <span className="text-emerald-600 font-black">
          {solvedItems.length} / {puzzle.items.length} Decoded
        </span>
      </div>

      {/* Cipher Prompt Box */}
      <div className="my-2 p-3.5 bg-secondary/40 border border-border/60 rounded-3xl">
        <p className="text-xs font-bold text-muted-foreground mb-1">Clue / Meaning:</p>
        <p className="font-display text-sm font-bold text-foreground">{currentItem.prompt}</p>
        {currentItem.hint && (
          <p className="text-[11px] text-primary-deep font-semibold mt-1">
            💡 {currentItem.hint}
          </p>
        )}
      </div>

      {/* Decoder Interactive Boxes */}
      <div className="my-4 flex flex-wrap justify-center gap-2">
        {currentItem.cipherSequence.map((num, idx) => {
          const currentVal = (userInputs[activeItemIndex] || [])[idx] || "";
          const isDone = solvedItems.includes(activeItemIndex);

          return (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-xs font-mono font-black text-primary-deep mb-1 bg-primary-soft/50 px-2 py-0.5 rounded-md">
                {num}
              </span>
              <input
                type="text"
                maxLength={1}
                value={currentVal}
                disabled={isDone}
                onChange={(e) => handleCharChange(idx, e.target.value)}
                className={`size-11 sm:size-12 rounded-xl border-2 text-center font-mono font-black text-lg uppercase outline-none shadow-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 ${isDone
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                    : "border-border bg-card text-foreground"
                  }`}
              />
            </div>
          );
        })}
      </div>

      {/* Alphabet Code Key Toggle & Drawer */}
      <div className="mt-auto p-2.5 bg-card border border-border rounded-2xl">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Key className="size-3" /> A1Z26 Cipher Decoder Chart
          </span>
          <button
            type="button"
            onClick={() => setShowAlphabetKey(!showAlphabetKey)}
            className="text-[10px] font-bold text-primary hover:underline"
          >
            {showAlphabetKey ? "Hide" : "Show"}
          </button>
        </div>

        {showAlphabetKey && (
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-1 max-h-24 overflow-y-auto">
            {alphabetKey.map((k) => (
              <div
                key={k.letter}
                className="flex items-center justify-between px-1.5 py-0.5 bg-muted/40 rounded border text-[11px] font-mono"
              >
                <span className="font-bold text-foreground">{k.letter}</span>
                <span className="text-primary font-bold">{k.num}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Next Item Button */}
      <div className="mt-3 flex justify-between gap-2">
        <button
          type="button"
          disabled={activeItemIndex === 0}
          onClick={() => setActiveItemIndex((i) => Math.max(0, i - 1))}
          className="flex-1 py-2 rounded-xl border border-border bg-secondary font-display text-xs font-bold disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={activeItemIndex >= puzzle.items.length - 1}
          onClick={() => setActiveItemIndex((i) => Math.min(puzzle.items.length - 1, i + 1))}
          className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground font-display text-xs font-bold disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
};
