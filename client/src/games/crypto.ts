export function cryptoItem(
  number: number,
  prompt: string,
  solution: string,
  hint?: string
) {
  const clean = solution.replace(/\s+/g, "").toUpperCase();
  return {
    number,
    prompt,
    cipherSequence: [...clean].map((ch) => ch.charCodeAt(0) - 64),
    solution: clean,
    hint,
  };
}
