import { useMemo, useRef, useState } from "react";
import { Bookmark, Check, HelpCircle, Share2, Volume2, VolumeX, X } from "lucide-react";
import type { QuizPuzzle } from "@/games/types";
import { PlayHud } from "@/components/PlayHud";
import { playError, playPop, playSuccess } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { useUserStore } from "@/lib/userStore";
import { cn } from "@/lib/utils";

interface Props {
  puzzle: QuizPuzzle;
  onComplete: (xp: number, coins: number) => void;
  onClose: () => void;
}

function crowdShares(seed: number, count: number, winner: number) {
  const raw = Array.from({ length: count }, (_, i) => {
    const n = Math.sin((seed + 1) * (i + 3) * 12.9898) * 43758.5453;
    return 8 + (n - Math.floor(n)) * 22;
  });
  raw[winner] += 18;
  const total = raw.reduce((a, b) => a + b, 0);
  return raw.map((n) => Math.round((n / total) * 1000) / 10);
}

export function LessonQuizPlayer({ puzzle, onComplete, onClose }: Props) {
  const { settings, toggleSound } = useUserStore();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"lesson" | "quiz">("lesson");
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [saved, setSaved] = useState(false);
  const scoreRef = useRef(0);
  const q = puzzle.questions[index];
  const shares = useMemo(
    () => (q ? crowdShares(q.id, q.options.length, q.correctIndex) : []),
    [q],
  );

  if (!q) return null;

  const right = picked === q.correctIndex;
  const revealed = locked;

  const pick = (opt: number) => {
    if (locked) return;
    setPicked(opt);
    if (opt === q.correctIndex) {
      playSuccess(settings.soundEnabled);
      scoreRef.current += 1;
      setLocked(true);
    } else {
      playError(settings.soundEnabled);
    }
  };

  const next = () => {
    if (index < puzzle.questions.length - 1) {
      setIndex((i) => i + 1);
      setPicked(null);
      setLocked(false);
      setPhase("lesson");
      playPop(settings.soundEnabled);
      return;
    }
    const score = scoreRef.current;
    triggerConfetti();
    onComplete(Math.round((score / puzzle.questions.length) * 100) + 40, score >= puzzle.questions.length * 0.7 ? 30 : 15);
  };

  if (phase === "lesson") {
    return (
      <div className="fixed inset-0 z-[70] bg-leaf">
        <div className="mx-auto flex h-dvh w-full max-w-md flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:max-w-xl">
          <div className="relative mb-2 flex h-10 items-center justify-center">
            <button
              type="button"
              onClick={onClose}
              className="absolute left-0 grid size-10 place-items-center rounded-full text-white/90 active:scale-95"
              aria-label="Close"
            >
              <X className="size-6" strokeWidth={2.4} />
            </button>
            <div className="flex items-center gap-1.5">
              {puzzle.questions.slice(0, 6).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "size-[7px] rounded-full",
                    i === Math.min(index, 5) ? "bg-white" : "bg-white/35",
                  )}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playPop(settings.soundEnabled);
              setPhase("quiz");
            }}
            className="relative min-h-0 flex-1"
          >
            <span className="absolute inset-x-[18px] top-5 bottom-2 rotate-[7deg] rounded-[28px] bg-white/45 shadow-sm" />
            <span className="absolute inset-x-[10px] top-3 bottom-1 -rotate-[5deg] rounded-[28px] bg-white/80 shadow-md" />
            <span className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] bg-card px-7 py-8 text-left shadow-float">
              <h2 className="font-display text-[28px] font-extrabold leading-[1.15] text-foreground">
                {q.lessonTitle || puzzle.title}
              </h2>
              <p className="mt-5 flex-1 overflow-y-auto text-[16px] font-medium leading-relaxed text-muted-foreground">
                {q.lessonBody}
              </p>
            </span>
          </button>

          <div className="mt-5 flex items-center justify-center gap-5 pb-2">
            <RoundTool
              label="Share"
              onClick={() => {
                playPop(settings.soundEnabled);
                void navigator.clipboard?.writeText(`${q.lessonTitle}: ${q.lessonBody ?? ""}`.slice(0, 280));
              }}
            >
              <Share2 className="size-5" />
            </RoundTool>
            <RoundTool
              label={settings.soundEnabled ? "Mute" : "Sound on"}
              onClick={() => toggleSound()}
            >
              {settings.soundEnabled ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
            </RoundTool>
            <RoundTool
              label="Save"
              onClick={() => {
                setSaved((s) => !s);
                playPop(settings.soundEnabled);
              }}
            >
              <Bookmark className={cn("size-5", saved && "fill-white")} />
            </RoundTool>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-background">
      <div className="mx-auto flex h-dvh w-full max-w-md flex-col sm:max-w-xl">
        <div className="px-4 pt-[max(0.6rem,env(safe-area-inset-top))]">
          <PlayHud />
        </div>

        <div className="mt-3 flex items-center gap-3 px-4">
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full text-muted-foreground active:scale-95"
            aria-label="Close"
          >
            <X className="size-6" strokeWidth={2.2} />
          </button>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-leaf transition-all duration-500"
              style={{
                width: `${((index + (revealed ? 1 : 0.28)) / puzzle.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-6">
          <h2 className="font-display text-[22px] font-extrabold leading-snug text-foreground">
            {q.question}
          </h2>

          <div className="mt-6 space-y-3">
            {q.options.map((opt, i) => {
              const isWin = revealed && i === q.correctIndex;
              const isFail = picked === i && !right;
                  const showBar = revealed;
              return (
                <button
                  key={opt}
                  type="button"
                  disabled={revealed}
                  onClick={() => pick(i)}
                  className={cn(
                    "relative w-full overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all active:scale-[0.99]",
                    isWin && "border-2 border-leaf bg-sky/30",
                    isFail && "border-rose-300 bg-rose-50",
                    !isWin && !isFail && "border border-border bg-card",
                  )}
                >
                  <div className="relative z-[1] flex items-start gap-2.5">
                    {isWin ? (
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-leaf text-white">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                    ) : null}
                    <span className="min-w-0 flex-1 whitespace-normal break-words font-display text-[15px] font-semibold leading-snug text-foreground">
                      {opt}
                    </span>
                    {showBar && (
                      <span className="shrink-0 text-[12px] font-bold tabular-nums text-muted-foreground">
                        {shares[i]?.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="relative z-[1] mt-2.5 h-[6px] overflow-hidden rounded-full bg-muted">
                    <span
                      className={cn(
                        "block h-full rounded-full transition-all duration-700",
                        isWin ? "bg-leaf" : "bg-leaf/45",
                      )}
                      style={{ width: showBar ? `${shares[i] ?? 0}%` : "0%" }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {picked !== null && !right && (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold leading-relaxed text-rose-800">
              {q.tryAgain}
            </p>
          )}
        </div>

        {revealed && (
          <div className="mt-auto bg-sky/40 px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-[22px] font-extrabold text-leaf">Great job!</p>
              <span className="grid size-8 place-items-center rounded-full bg-white/70 text-muted-foreground">
                <HelpCircle className="size-4" />
              </span>
            </div>
            <button
              type="button"
              onClick={next}
              className="w-full rounded-2xl bg-leaf py-3.5 font-display text-[15px] font-extrabold uppercase tracking-[0.18em] text-white shadow-pop active:translate-y-0.5"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RoundTool({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-12 place-items-center rounded-full bg-primary-deep/25 text-white backdrop-blur-sm active:scale-95"
    >
      {children}
    </button>
  );
}
