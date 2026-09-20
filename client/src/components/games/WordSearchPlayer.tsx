import React, { useState, useRef } from "react";
import { WordSearchPuzzle } from "@/games/types";
import { playPop, playSuccess, playError } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { useUserStore } from "@/lib/userStore";
import { toast } from "sonner";
import { HINT_COST, findWordInGrid } from "@/lib/hints";
import { HintButton } from "@/components/games/HintButton";

interface Props {
  puzzle: WordSearchPuzzle;
  onComplete: (xp: number, coins: number) => void;
  onClose: () => void;
}

interface CellCoord {
  r: number;
  c: number;
}

export const WordSearchPlayer: React.FC<Props> = ({ puzzle, onComplete, onClose }) => {
  const { settings, spendCoins, user } = useUserStore();
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<CellCoord[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCoord, setStartCoord] = useState<CellCoord | null>(null);
  const [highlightedCells, setHighlightedCells] = useState<{ [key: string]: string }>({});
  const [activeWordLetters, setActiveWordLetters] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);

  const gridRef = useRef<HTMLDivElement>(null);

  // Palette of fun highlight colors for found words
  const COLORS = [
    "bg-amber-400/40 border-amber-500 text-amber-950 font-black",
    "bg-emerald-400/40 border-emerald-500 text-emerald-950 font-black",
    "bg-sky-400/40 border-sky-500 text-sky-950 font-black",
    "bg-fuchsia-400/40 border-fuchsia-500 text-fuchsia-950 font-black",
    "bg-rose-400/40 border-rose-500 text-rose-950 font-black",
    "bg-indigo-400/40 border-indigo-500 text-indigo-950 font-black",
    "bg-teal-400/40 border-teal-500 text-teal-950 font-black",
    "bg-orange-400/40 border-orange-500 text-orange-950 font-black",
  ];

  const getCellKey = (r: number, c: number) => `${r}-${c}`;

  const getLineCoords = (start: CellCoord, end: CellCoord): CellCoord[] => {
    const dr = end.r - start.r;
    const dc = end.c - start.c;
    const stepR = dr === 0 ? 0 : dr > 0 ? 1 : -1;
    const stepC = dc === 0 ? 0 : dc > 0 ? 1 : -1;

    // Check if valid straight line (horizontal, vertical, diagonal)
    const isHorizontal = dr === 0 && dc !== 0;
    const isVertical = dc === 0 && dr !== 0;
    const isDiagonal = Math.abs(dr) === Math.abs(dc) && dr !== 0;

    if (!isHorizontal && !isVertical && !isDiagonal) {
      return [start];
    }

    const length = Math.max(Math.abs(dr), Math.abs(dc));
    const coords: CellCoord[] = [];
    for (let i = 0; i <= length; i++) {
      coords.push({ r: start.r + i * stepR, c: start.c + i * stepC });
    }
    return coords;
  };

  const handleCellMouseDown = (r: number, c: number) => {
    setIsSelecting(true);
    setStartCoord({ r, c });
    setSelectedCoords([{ r, c }]);
    const char = puzzle.grid[r]?.[c] || "";
    setActiveWordLetters(char);
    playPop(settings.soundEnabled);
  };

  const handleCellMouseEnter = (r: number, c: number) => {
    if (!isSelecting || !startCoord) return;
    const line = getLineCoords(startCoord, { r, c });
    setSelectedCoords(line);
    const word = line.map((p) => puzzle.grid[p.r]?.[p.c] || "").join("");
    setActiveWordLetters(word);
  };

  const checkSelectedWord = () => {
    if (!isSelecting || selectedCoords.length === 0) {
      setIsSelecting(false);
      setStartCoord(null);
      setSelectedCoords([]);
      setActiveWordLetters("");
      return;
    }

    const forwardWord = selectedCoords.map((p) => puzzle.grid[p.r]?.[p.c] || "").join("");
    const backwardWord = [...selectedCoords].reverse().map((p) => puzzle.grid[p.r]?.[p.c] || "").join("");

    // Normalize words by removing spaces to match grid
    const targetMatch = puzzle.words.find((w) => {
      const cleanTarget = w.replace(/\s+/g, "").toUpperCase();
      return (
        (cleanTarget === forwardWord || cleanTarget === backwardWord) &&
        !foundWords.includes(w)
      );
    });

    if (targetMatch) {
      playSuccess(settings.soundEnabled);
      const colorIndex = foundWords.length % COLORS.length;
      const newHighlights = { ...highlightedCells };
      selectedCoords.forEach((p) => {
        newHighlights[getCellKey(p.r, p.c)] = COLORS[colorIndex] || "";
      });
      setHighlightedCells(newHighlights);
      const newFound = [...foundWords, targetMatch];
      setFoundWords(newFound);

      if (newFound.length === puzzle.words.length) {
        // Complete!
        triggerConfetti();
        setTimeout(() => {
          onComplete(100, 30);
        }, 600);
      }
    } else {
      playError(settings.soundEnabled);
    }

    setIsSelecting(false);
    setStartCoord(null);
    setSelectedCoords([]);
    setActiveWordLetters("");
  };

  // Hint: locate the actual hidden word, then reveal the next unfilled letter.
  const handleGiveHint = () => {
    const unFound = puzzle.words.filter((w) => !foundWords.includes(w));
    if (unFound.length === 0) return;

    const target = unFound[0];
    if (!target) return;
    const located = findWordInGrid(puzzle.grid, target);
    if (!located) {
      toast.error("Could not place that word on this grid.");
      return;
    }

    const nextCell = located.coords.find((p) => !highlightedCells[getCellKey(p.r, p.c)]);
    if (!nextCell) {
      toast.message(`“${target}” runs ${located.direction} from its highlighted start.`);
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

    const key = getCellKey(nextCell.r, nextCell.c);
    const letterIndex = located.coords.findIndex((p) => p.r === nextCell.r && p.c === nextCell.c);
    setHighlightedCells((prev) => ({
      ...prev,
      [key]: "bg-amber-300 animate-pulse border-amber-600 text-amber-950 font-black",
    }));
    setHintsUsed((h) => h + 1);
    playPop(settings.soundEnabled);
    toast.success(
      letterIndex === 0
        ? `Hint: “${target}” starts here and runs ${located.direction}.`
        : `Hint: next letter of “${target}” (${located.direction}).`
    );
  };

  const isSelected = (r: number, c: number) => {
    return selectedCoords.some((p) => p.r === r && p.c === c);
  };

  return (
    <div
      className="flex flex-col h-full select-none"
      onMouseUp={checkSelectedWord}
      onTouchEnd={checkSelectedWord}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-deep">
            {puzzle.theme || puzzle.topic}
          </span>
          <h2 className="text-base sm:text-lg font-bold font-display text-foreground">
            {puzzle.title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <HintButton onClick={handleGiveHint} used={hintsUsed} disabled={foundWords.length === puzzle.words.length} />
        </div>
      </div>

      {/* Word finding status */}
      <div className="flex items-center justify-between my-2 text-xs font-semibold text-muted-foreground">
        <span>
          Found: <strong className="text-primary-deep">{foundWords.length}</strong> /{" "}
          {puzzle.words.length} words
        </span>
        {activeWordLetters && (
          <span className="font-mono tracking-widest text-primary font-bold bg-primary-soft/50 px-2.5 py-0.5 rounded-lg">
            {activeWordLetters}
          </span>
        )}
      </div>

      {/* Grid Container */}
      <div
        ref={gridRef}
        className="my-auto mx-auto grid bg-card/60 p-2 sm:p-3 rounded-2xl border-2 border-border shadow-sm touch-none"
        style={{
          gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`,
          maxWidth: "420px",
          width: "100%",
          aspectRatio: "1/1",
        }}
      >
        {puzzle.grid.map((row, r) =>
          row.map((letter, c) => {
            const key = getCellKey(r, c);
            const isHighlighted = highlightedCells[key];
            const selected = isSelected(r, c);

            return (
              <div
                key={key}
                onMouseDown={() => handleCellMouseDown(r, c)}
                onMouseEnter={() => handleCellMouseEnter(r, c)}
                onTouchStart={() => handleCellMouseDown(r, c)}
                className={`flex items-center justify-center font-mono font-bold text-xs sm:text-sm rounded-lg border transition-colors cursor-pointer select-none ${selected
                    ? "bg-primary text-primary-foreground border-primary scale-95 shadow-sm font-black"
                    : isHighlighted
                      ? `${isHighlighted}`
                      : "border-transparent text-foreground/80 hover:bg-muted/50"
                  }`}
              >
                {letter}
              </div>
            );
          })
        )}
      </div>

      {/* Word Bank */}
      <div className="mt-3 p-3 bg-secondary/50 rounded-2xl border border-border/60">
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Word Bank ({puzzle.words.length})
        </p>
        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
          {puzzle.words.map((word) => {
            const isDone = foundWords.includes(word);
            return (
              <span
                key={word}
                className={`text-xs px-2 py-0.5 rounded-lg font-medium transition-all ${isDone
                    ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 line-through opacity-70 border border-emerald-300/50"
                    : "bg-card border border-border/80 text-foreground"
                  }`}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
