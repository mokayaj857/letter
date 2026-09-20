export const HINT_COST = 10;

export interface CellCoord {
  r: number;
  c: number;
}

const GRID_DIRS: { dr: number; dc: number; label: string }[] = [
  { dr: 0, dc: 1, label: "right" },
  { dr: 0, dc: -1, label: "left" },
  { dr: 1, dc: 0, label: "down" },
  { dr: -1, dc: 0, label: "up" },
  { dr: 1, dc: 1, label: "down-right" },
  { dr: 1, dc: -1, label: "down-left" },
  { dr: -1, dc: 1, label: "up-right" },
  { dr: -1, dc: -1, label: "up-left" },
];

export function findWordInGrid(grid: string[][], rawWord: string) {
  const word = rawWord.replace(/\s+/g, "").toUpperCase();
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      for (const dir of GRID_DIRS) {
        const coords: CellCoord[] = [];
        let ok = true;
        for (let i = 0; i < word.length; i++) {
          const nr = r + dir.dr * i;
          const nc = c + dir.dc * i;
          const cell = grid[nr]?.[nc];
          if (nr < 0 || nc < 0 || nr >= rows || nc >= cols || cell !== word[i]) {
            ok = false;
            break;
          }
          coords.push({ r: nr, c: nc });
        }
        if (ok) {
          return { word: rawWord, coords, direction: dir.label };
        }
      }
    }
  }
  return null;
}

export function quizHintText(question: string, correctOption: string): string {
  const clean = correctOption.trim();
  if (clean.length <= 3) {
    return `The correct answer is a short term (${clean.length} letters). Re-read the question and drop the options that do not fit.`;
  }
  return `Hint: the right choice starts with “${clean[0]}” and has ${clean.length} characters (including spaces).`;
}
