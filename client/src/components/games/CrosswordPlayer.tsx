import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { CrosswordPuzzle, CrosswordClue } from "@/games/types";
import { playPop, playSuccess, playError } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { useUserStore } from "@/lib/userStore";
import { toast } from "sonner";
import { HINT_COST } from "@/lib/hints";
import { HintButton } from "@/components/games/HintButton";

interface Props {
  puzzle: CrosswordPuzzle;
  onComplete: (xp: number, coins: number) => void;
  onClose: () => void;
}

const cellKey = (r: number, c: number) => `${r}-${c}`;

function clueCells(clue: CrosswordClue) {
  const across = clue.direction === "across";
  return Array.from({ length: clue.answer.length }, (_, i) => ({
    r: across ? clue.row : clue.row + i,
    c: across ? clue.col + i : clue.col,
    letter: clue.answer[i] || "",
  }));
}

function sameClue(a: CrosswordClue, b: CrosswordClue) {
  return a.number === b.number && a.direction === b.direction;
}

export const CrosswordPlayer: React.FC<Props> = ({ puzzle, onComplete }) => {
  const { settings, spendCoins, user } = useUserStore();
  const allClues = useMemo(
    () => [...puzzle.acrossClues, ...puzzle.downClues],
    [puzzle.acrossClues, puzzle.downClues],
  );

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

  const [userLetters, setUserLetters] = useState<Record<string, string>>({});
  const [activeClue, setActiveClue] = useState<CrosswordClue>(defaultClue);
  const [activeCell, setActiveCell] = useState(() => {
    const first = clueCells(defaultClue)[0];
    return first ? cellKey(first.r, first.c) : "0-0";
  });
  const [isSolved, setIsSolved] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [keyboardInset, setKeyboardInset] = useState(0);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const activeClueRef = useRef(activeClue);
  const activeCellRef = useRef(activeCell);
  const userLettersRef = useRef(userLetters);

  activeClueRef.current = activeClue;
  activeCellRef.current = activeCell;
  userLettersRef.current = userLetters;

  const validCells = useMemo(() => {
    const cells: Record<string, { answer: string; number?: number }> = {};
    allClues.forEach((clue) => {
      clueCells(clue).forEach(({ r, c, letter }, i) => {
        const key = cellKey(r, c);
        if (!cells[key]) cells[key] = { answer: letter };
        if (i === 0) cells[key].number = clue.number;
      });
    });
    return cells;
  }, [allClues]);

  const bounds = useMemo(() => {
    const keys = Object.keys(validCells);
    if (keys.length === 0) {
      return { minR: 0, maxR: puzzle.rows - 1, minC: 0, maxC: puzzle.cols - 1 };
    }
    let minR = puzzle.rows;
    let minC = puzzle.cols;
    let maxR = 0;
    let maxC = 0;
    keys.forEach((key) => {
      const [rs, cs] = key.split("-");
      const r = Number(rs);
      const c = Number(cs);
      minR = Math.min(minR, r);
      minC = Math.min(minC, c);
      maxR = Math.max(maxR, r);
      maxC = Math.max(maxC, c);
    });
    return { minR, maxR, minC, maxC };
  }, [validCells, puzzle.rows, puzzle.cols]);

  const visibleRows = bounds.maxR - bounds.minR + 1;
  const visibleCols = bounds.maxC - bounds.minC + 1;
  const activePath = useMemo(() => clueCells(activeClue), [activeClue]);
  const activeKeys = useMemo(
    () => new Set(activePath.map(({ r, c }) => cellKey(r, c))),
    [activePath],
  );

  const isClueFilled = (clue: CrosswordClue, letters = userLetters) =>
    clueCells(clue).every(({ r, c, letter }) => letters[cellKey(r, c)] === letter);

  const solvedCount = allClues.filter((clue) => isClueFilled(clue)).length;

  const usedBankWords = useMemo(() => {
    const done = new Set<string>();
    allClues.forEach((clue) => {
      if (isClueFilled(clue)) done.add(clue.answer.toUpperCase());
    });
    return done;
  }, [allClues, userLetters]);

  const checkSolved = (letters: Record<string, string>) =>
    Object.keys(validCells).every((key) => letters[key] === validCells[key]?.answer);

  const finishIfSolved = (letters: Record<string, string>) => {
    if (!checkSolved(letters)) return;
    setIsSolved(true);
    playSuccess(settings.soundEnabled);
    triggerConfetti();
    setTimeout(() => onComplete(120, 35), 700);
  };

  const keepKeyboard = () => {
    hiddenInputRef.current?.focus({ preventScroll: true });
  };

  const cluesAtCell = (r: number, c: number) =>
    allClues.filter((clue) =>
      clueCells(clue).some((cell) => cell.r === r && cell.c === c),
    );

  const selectClue = (clue: CrosswordClue, preferKey?: string) => {
    setActiveClue(clue);
    const letters = userLettersRef.current;
    const path = clueCells(clue);
    const empty = path.find(({ r, c }) => !letters[cellKey(r, c)]);
    const target =
      preferKey && path.some(({ r, c }) => cellKey(r, c) === preferKey)
        ? preferKey
        : empty
          ? cellKey(empty.r, empty.c)
          : path[0]
            ? cellKey(path[0].r, path[0].c)
            : activeCellRef.current;
    setActiveCell(target);
    keepKeyboard();
  };

  const stepClue = (dir: 1 | -1) => {
    const idx = allClues.findIndex((clue) => sameClue(clue, activeClueRef.current));
    const next = allClues[(idx + dir + allClues.length) % allClues.length];
    if (next) selectClue(next);
  };

  const handleCellTap = (r: number, c: number) => {
    const key = cellKey(r, c);
    const matches = cluesAtCell(r, c);
    if (!matches.length) return;
    const current = activeClueRef.current;
    const inCurrent = clueCells(current).some((cell) => cell.r === r && cell.c === c);
    if (inCurrent && matches.length > 1) {
      const other = matches.find((clue) => clue.direction !== current.direction);
      if (other) {
        selectClue(other, key);
        return;
      }
    }
    const keepDir = matches.find((clue) => clue.direction === current.direction);
    selectClue(keepDir || matches[0], key);
  };

  const moveAlongWord = (fromKey: string, dir: 1 | -1, clue = activeClueRef.current) => {
    const path = clueCells(clue);
    const idx = path.findIndex(({ r, c }) => cellKey(r, c) === fromKey);
    const next = path[idx + dir];
    if (next) setActiveCell(cellKey(next.r, next.c));
  };

  const goToNextOpenClue = (letters: Record<string, string>) => {
    const current = activeClueRef.current;
    const nextOpen =
      allClues.find((clue) => !sameClue(clue, current) && !isClueFilled(clue, letters)) ||
      allClues.find((clue) => !isClueFilled(clue, letters));
    if (nextOpen && !sameClue(nextOpen, current)) selectClue(nextOpen);
  };

  const typeLetter = (raw: string) => {
    if (isSolved) return;
    const letter = raw.replace(/[^a-z]/gi, "").slice(-1).toUpperCase();
    if (!letter) return;
    const key = activeCellRef.current;
    const clue = activeClueRef.current;
    const letters = { ...userLettersRef.current, [key]: letter };
    setUserLetters(letters);
    playPop(settings.soundEnabled);
    const justFinished = !isClueFilled(clue, userLettersRef.current) && isClueFilled(clue, letters);
    if (justFinished && !checkSolved(letters)) {
      playSuccess(settings.soundEnabled);
      goToNextOpenClue(letters);
    } else {
      moveAlongWord(key, 1, clue);
    }
    finishIfSolved(letters);
  };

  const deleteLetter = () => {
    const key = activeCellRef.current;
    const letters = { ...userLettersRef.current };
    if (letters[key]) {
      delete letters[key];
      setUserLetters(letters);
    } else {
      moveAlongWord(key, -1);
    }
  };

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const sync = () => {
      const inset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardInset(inset);
    };
    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
    };
  }, []);

  useEffect(() => {
    keepKeyboard();
  }, []);

  const handleHint = () => {
    if (isSolved) return;
    const clue = activeClueRef.current;
    let hintKey: string | null = null;
    let hintChar = "";

    clueCells(clue).forEach(({ r, c, letter }) => {
      if (hintKey || !letter) return;
      const key = cellKey(r, c);
      if (userLettersRef.current[key] !== letter) {
        hintKey = key;
        hintChar = letter;
      }
    });

    if (!hintKey || !hintChar) {
      toast.message("This clue is already filled. Try the next one.");
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

    const nextLetters = { ...userLettersRef.current, [hintKey]: hintChar };
    setUserLetters(nextLetters);
    setHintsUsed((h) => h + 1);
    playPop(settings.soundEnabled);
    setActiveCell(hintKey);
    keepKeyboard();
    toast.success("A letter was filled in for you.");
    if (isClueFilled(clue, nextLetters) && !checkSolved(nextLetters)) {
      goToNextOpenClue(nextLetters);
    }
    finishIfSolved(nextLetters);
  };

  const isAcross = activeClue.direction === "across";
  const keyboardOpen = keyboardInset > 80;

  return (
    <div
      className="flex h-full min-h-0 flex-col select-none"
      style={{ paddingBottom: keyboardOpen ? keyboardInset : undefined }}
    >
      <input
        ref={hiddenInputRef}
        type="text"
        inputMode="text"
        autoCapitalize="characters"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="next"
        aria-label="Crossword letter"
        value=""
        disabled={isSolved}
        onChange={(e) => {
          typeLetter(e.target.value);
          e.target.value = "";
        }}
        onKeyDown={(e) => {
          if (e.key === "Backspace") {
            e.preventDefault();
            deleteLetter();
          }
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            const [rs, cs] = activeCellRef.current.split("-");
            handleCellTap(Number(rs), Number(cs));
          }
          if (e.key === "ArrowRight" || e.key === "ArrowDown") {
            e.preventDefault();
            moveAlongWord(activeCellRef.current, 1);
          }
          if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
            e.preventDefault();
            moveAlongWord(activeCellRef.current, -1);
          }
        }}
        className="pointer-events-none absolute h-px w-px opacity-0"
        style={{ fontSize: 16 }}
      />

      <div className="flex shrink-0 items-start justify-between gap-3 pb-3 pr-8">
        <div>
          <p className="font-display text-lg font-bold leading-tight text-primary-deep">
            {puzzle.title.replace(/: Crossword.*$/i, "")}
          </p>
          <p className="text-xs font-bold text-muted-foreground">
            {solvedCount} of {allClues.length} words
          </p>
        </div>
        <HintButton onClick={handleHint} used={hintsUsed} disabled={isSolved} />
      </div>

      <div className="shrink-0 rounded-3xl bg-ivory-deep p-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              stepClue(-1);
            }}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-primary-deep shadow-xs sm:size-9"
            aria-label="Previous clue"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="grid size-7 place-items-center rounded-lg bg-primary font-display text-sm font-black text-primary-foreground">
                {activeClue.number}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-sun px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-sun-foreground">
                {isAcross ? <ArrowRight className="size-3" /> : <ArrowDown className="size-3" />}
                {isAcross ? "Across" : "Down"}
              </span>
              <span className="text-[11px] font-bold text-muted-foreground">
                {activeClue.answer.length} letters
              </span>
            </div>
            <p className="mt-1.5 font-sans text-sm font-semibold leading-snug text-foreground">
              {activeClue.clue}
            </p>
          </div>
          <button
            type="button"
            onPointerDown={(e) => {
              e.preventDefault();
              stepClue(1);
            }}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-card text-primary-deep shadow-xs sm:size-9"
            aria-label="Next clue"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div
        className="mx-auto mt-3 w-full max-w-[360px] shrink-0 rounded-2xl bg-secondary p-1.5"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${visibleCols}, minmax(0, 1fr))`,
          gap: 2,
          touchAction: "manipulation",
        }}
      >
        {Array.from({ length: visibleRows }).map((_, vr) =>
          Array.from({ length: visibleCols }).map((_, vc) => {
            const r = bounds.minR + vr;
            const c = bounds.minC + vc;
            const key = cellKey(r, c);
            const cellInfo = validCells[key];

            if (!cellInfo) {
              return <div key={key} className="aspect-square rounded-sm bg-secondary" />;
            }

            const currentVal = userLetters[key] || "";
            const inWord = activeKeys.has(key);
            const isHere = activeCell === key;

            return (
              <button
                key={key}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleCellTap(r, c);
                }}
                className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-md border font-display text-base font-bold uppercase text-primary-deep ${
                  isHere
                    ? "border-sun-foreground/30 bg-sun"
                    : inWord
                      ? "border-primary/30 bg-primary-soft"
                      : "border-border bg-card"
                }`}
                aria-label={`Square ${cellInfo.number ?? ""} ${isAcross ? "across" : "down"}`}
              >
                {cellInfo.number ? (
                  <span className="pointer-events-none absolute left-0.5 top-0 z-[1] text-[9px] font-black leading-none text-primary-deep">
                    {cellInfo.number}
                  </span>
                ) : null}
                {currentVal}
              </button>
            );
          }),
        )}
      </div>

      {!keyboardOpen ? (
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-2">
          <p className="text-center text-[11px] font-semibold text-muted-foreground">
            Tap a square again to switch across or down.
          </p>

          {puzzle.wordBank && puzzle.wordBank.length > 0 ? (
            <div className="mt-3">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Words you can use
              </p>
              <div className="flex flex-wrap gap-1.5">
                {puzzle.wordBank.map((word) => {
                  const used = usedBankWords.has(word.replace(/\s+/g, "").toUpperCase());
                  return (
                    <span
                      key={word}
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        used
                          ? "bg-primary-soft text-primary-deep line-through"
                          : "bg-sun/70 text-sun-foreground"
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-primary-deep">
                <ArrowRight className="size-3.5" /> Across
              </p>
              <ul className="space-y-1">
                {puzzle.acrossClues.map((clue) => {
                  const done = isClueFilled(clue);
                  const active = sameClue(clue, activeClue);
                  return (
                    <li key={`across-${clue.number}`}>
                      <button
                        type="button"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          selectClue(clue);
                        }}
                        className={`min-h-11 w-full rounded-xl px-2 py-2 text-left text-sm leading-snug sm:min-h-0 sm:py-1.5 sm:text-xs ${
                          active
                            ? "bg-primary-soft font-bold text-primary-deep"
                            : done
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                        }`}
                      >
                        <span className="font-black">{clue.number}.</span> {clue.clue}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <p className="mb-1.5 flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-primary-deep">
                <ArrowDown className="size-3.5" /> Down
              </p>
              <ul className="space-y-1">
                {puzzle.downClues.map((clue) => {
                  const done = isClueFilled(clue);
                  const active = sameClue(clue, activeClue);
                  return (
                    <li key={`down-${clue.number}`}>
                      <button
                        type="button"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          selectClue(clue);
                        }}
                        className={`min-h-11 w-full rounded-xl px-2 py-2 text-left text-sm leading-snug sm:min-h-0 sm:py-1.5 sm:text-xs ${
                          active
                            ? "bg-primary-soft font-bold text-primary-deep"
                            : done
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                        }`}
                      >
                        <span className="font-black">{clue.number}.</span> {clue.clue}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
