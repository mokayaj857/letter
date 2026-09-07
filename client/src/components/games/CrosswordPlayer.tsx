import React, { useState } from "react";
import { CrosswordPuzzle, CrosswordClue } from "@/games/types";
import { Check, Lightbulb } from "lucide-react";
import { playPop, playSuccess, playError } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { useUserStore } from "@/lib/userStore";

interface Props {
  puzzle: CrosswordPuzzle;
  onComplete: (xp: number, coins: number) => void;
  onClose: () => void;
}

export const CrosswordPlayer: React.FC<Props> = ({ puzzle, onComplete, onClose }) => {
  const { settings } = useUserStore();

  // Pre-calculate clues
  const allClues = [...puzzle.acrossClues, ...puzzle.downClues];
  const defaultClue: CrosswordClue =
    puzzle.acrossClues[0] ||
    puzzle.downClues[0] || {
      number: 1,
      clue: "",
      answer: "",
      row: 0,
      col: 0,
      direction: "across",
    };

  // Grid user inputs
  const [userLetters, setUserLetters] = useState<{ [key: string]: string }>({});
  const [activeClue, setActiveClue] = useState<CrosswordClue>(defaultClue);
  const [isSolved, setIsSolved] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const getCellKey = (r: number, c: number) => `${r}-${c}`;

  // Find all active cell coords for the crossword
  const validCells: { [key: string]: { answer: string; number?: number } } = {};

  allClues.forEach((clue) => {
    const isAcross = clue.direction === "across";
    for (let i = 0; i < clue.answer.length; i++) {
      const r = isAcross ? clue.row : clue.row + i;
      const c = isAcross ? clue.col + i : clue.col;
      const key = getCellKey(r, c);
      const char = clue.answer[i] || "";
      if (!validCells[key]) {
        validCells[key] = { answer: char };
      }
      if (i === 0) {
        const cell = validCells[key];
        if (cell) {
          cell.number = clue.number;
        }
      }
    }
  });

  const handleInputChange = (r: number, c: number, char: string) => {
    const upper = char.slice(-1).toUpperCase();
    const key = getCellKey(r, c);
    const newLetters = { ...userLetters, [key]: upper };
    setUserLetters(newLetters);
    playPop(settings.soundEnabled);

    // Check if entire puzzle is solved
    let allCorrect = true;
    for (const k of Object.keys(validCells)) {
      const cell = validCells[k];
      if (!cell || newLetters[k] !== cell.answer) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      setIsSolved(true);
      playSuccess(settings.soundEnabled);
      triggerConfetti();
      setTimeout(() => {
        onComplete(120, 35);
      }, 700);
    }
  };

  const handleHint = () => {
    if (!activeClue) return;
    const isAcross = activeClue.direction === "across";
    for (let i = 0; i < activeClue.answer.length; i++) {
      const r = isAcross ? activeClue.row : activeClue.row + i;
      const c = isAcross ? activeClue.col + i : activeClue.col;
      const key = getCellKey(r, c);
      const expectedChar = activeClue.answer[i];
      if (expectedChar && userLetters[key] !== expectedChar) {
        setUserLetters((prev) => ({ ...prev, [key]: expectedChar }));
        setHintsUsed((h) => h + 1);
        playPop(settings.soundEnabled);
        return;
      }
    }
  };

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
        <button
          type="button"
          onClick={handleHint}
          className="flex items-center gap-1 text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 px-2.5 py-1.5 rounded-xl active:scale-95"
        >
          <Lightbulb className="size-3.5" />
          <span>Hint ({hintsUsed})</span>
        </button>
      </div>

      {/* Active Clue Banner */}
      {activeClue && (
        <div className="my-2 p-3 bg-primary-soft/40 border border-primary/30 rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary-deep">
            {activeClue.number} {activeClue.direction.toUpperCase()} ({activeClue.answer.length} letters)
          </span>
          <p className="text-xs font-bold text-foreground mt-0.5">{activeClue.clue}</p>
        </div>
      )}

      {/* Grid Container */}
      <div
        className="my-auto mx-auto grid bg-muted/40 p-2 sm:p-3 rounded-2xl border-2 border-border shadow-sm overflow-auto"
        style={{
          gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))`,
          maxWidth: "380px",
          width: "100%",
        }}
      >
        {Array.from({ length: puzzle.rows }).map((_, r) =>
          Array.from({ length: puzzle.cols }).map((_, c) => {
            const key = getCellKey(r, c);
            const cellInfo = validCells[key];

            if (!cellInfo) {
              return (
                <div
                  key={key}
                  className="aspect-square bg-muted-foreground/10 rounded-md m-0.5"
                />
              );
            }

            const currentVal = userLetters[key] || "";
            const isCorrect = currentVal === cellInfo.answer;

            return (
              <div
                key={key}
                className="relative aspect-square bg-card border-2 border-border rounded-lg m-0.5 shadow-xs flex items-center justify-center focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
              >
                {cellInfo.number && (
                  <span className="absolute top-0.5 left-1 text-[9px] font-bold text-muted-foreground leading-none">
                    {cellInfo.number}
                  </span>
                )}
                <input
                  type="text"
                  maxLength={1}
                  value={currentVal}
                  onChange={(e) => handleInputChange(r, c, e.target.value)}
                  className={`w-full h-full text-center font-mono font-black text-sm uppercase bg-transparent outline-none ${isCorrect && currentVal ? "text-emerald-600 font-black" : "text-foreground"
                    }`}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Clues Accordion */}
      <div className="mt-3 grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
        <div className="bg-secondary/40 p-2.5 rounded-2xl border border-border/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary-deep mb-1">
            Across
          </p>
          <div className="space-y-1 text-xs">
            {puzzle.acrossClues.map((c) => (
              <button
                key={c.number}
                type="button"
                onClick={() => setActiveClue(c)}
                className={`w-full text-left p-1 rounded-lg transition-colors ${activeClue?.number === c.number && activeClue?.direction === "across"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-foreground hover:bg-card"
                  }`}
              >
                <strong>{c.number}.</strong> {c.clue}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-secondary/40 p-2.5 rounded-2xl border border-border/60">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary-deep mb-1">
            Down
          </p>
          <div className="space-y-1 text-xs">
            {puzzle.downClues.map((c) => (
              <button
                key={c.number}
                type="button"
                onClick={() => setActiveClue(c)}
                className={`w-full text-left p-1 rounded-lg transition-colors ${activeClue?.number === c.number && activeClue?.direction === "down"
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-foreground hover:bg-card"
                  }`}
              >
                <strong>{c.number}.</strong> {c.clue}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
