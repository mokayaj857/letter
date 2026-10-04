import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { Bookmark, HelpCircle, Share2, Volume2, VolumeX, X } from "lucide-react";
import { PlayHud } from "@/components/PlayHud";
import { useUserStore } from "@/lib/userStore";
import { playError, playPop, playSuccess } from "@/lib/audio";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  WEEKLY_GAME_ID,
  answersMatch,
  getChapterForWeek,
  getWeek,
  typedPrompt,
} from "@/data/weeklyChallenges";

export const Route = createFileRoute("/challenge/$week")({
  loader: ({ params }) => {
    const weekNum = Number(params.week);
    const week = getWeek(weekNum);
    if (!week) throw notFound();
    return { week, chapter: getChapterForWeek(weekNum) };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `Week ${loaderData.week.week} — ${loaderData.week.title} — Letterbox`
          : "Week not found — Letterbox",
      },
    ],
  }),
  component: WeekFlow,
});

function WeekFlow() {
  const { week } = Route.useLoaderData();
  const navigate = useNavigate();
  const { auth, gameProgress, completeLevel, saveWeeklyAnswer, weeklyAnswers, settings, toggleSound } =
    useUserStore();
  const done = gameProgress[WEEKLY_GAME_ID] ?? 0;
  const locked = week.week > done + 1;
  const alreadyDone = week.week <= done;
  const typed = typedPrompt(week);
  const saved = weeklyAnswers?.[String(week.week)] ?? "";

  const pages = useMemo(() => {
    const list = [{ title: week.title, body: week.prompt }];
    if (week.tip) list.push({ title: "Keep this in your pocket", body: week.tip });
    return list;
  }, [week]);

  const [phase, setPhase] = useState<"lesson" | "answer">("lesson");
  const [page, setPage] = useState(0);
  const [draft, setDraft] = useState(saved);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (!auth?.isLoggedIn) navigate({ to: "/signup", replace: true });
  }, [auth?.isLoggedIn, navigate]);

  useEffect(() => {
    setPhase("lesson");
    setPage(0);
    setDraft(saved);
    setChecked(false);
    setCorrect(false);
  }, [week.week, saved]);

  if (!auth?.isLoggedIn) return null;

  const shareLesson = async () => {
    playPop(settings.soundEnabled);
    const text = `${week.title} — ${week.prompt}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied the mission.");
    } catch {
      toast.info(text);
    }
  };

  const close = () => navigate({ to: "/" });

  const advanceLesson = () => {
    playPop(settings.soundEnabled);
    if (page < pages.length - 1) {
      setPage((p) => p + 1);
      return;
    }
    setPhase("answer");
  };

  const submit = () => {
    if (locked) {
      playError(settings.soundEnabled);
      toast.info("Finish the earlier weeks first.");
      return;
    }
    const value = draft.trim();
    if (value.length < 2) {
      playError(settings.soundEnabled);
      toast.info("Key in your answer first.");
      return;
    }
    if (typed.mode === "journal" && value.length < 12) {
      playError(settings.soundEnabled);
      toast.info("Give a bit more detail — at least a sentence.");
      return;
    }
    if (typed.mode === "check") {
      const ok = answersMatch(value, typed.expected);
      setChecked(true);
      setCorrect(ok);
      if (!ok) {
        playError(settings.soundEnabled);
        return;
      }
    } else {
      setChecked(true);
      setCorrect(true);
    }

    saveWeeklyAnswer(week.week, value);
    if (!alreadyDone) {
      completeLevel(WEEKLY_GAME_ID, week.week - 1, week.xp, week.coins);
    } else {
      playSuccess(settings.soundEnabled);
    }
  };

  const goNext = () => {
    if (!checked) {
      submit();
      return;
    }
    if (typed.mode === "check" && !correct) {
      setChecked(false);
      return;
    }
    playPop(settings.soundEnabled);
    const latest = gameProgress[WEEKLY_GAME_ID] ?? 0;
    const nxt = week.week < 104 ? week.week + 1 : null;
    if (nxt && nxt <= latest + 1) {
      navigate({ to: "/challenge/$week", params: { week: String(nxt) } });
      return;
    }
    navigate({ to: "/" });
  };

  const sheet = pages[page];

  if (phase === "lesson") {
    return (
      <div className="fixed inset-0 z-[70] bg-leaf">
        <div className="mx-auto flex h-dvh w-full max-w-md flex-col px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:max-w-xl">
          <div className="relative mb-2 flex h-10 items-center justify-center">
            <Link
              to="/"
              aria-label="Close"
              className="absolute left-0 grid size-10 place-items-center rounded-full text-white/90 active:scale-95"
            >
              <X className="size-6" strokeWidth={2.4} />
            </Link>
            <div className="flex items-center gap-1.5">
              {pages.map((_, i) => (
                <span
                  key={i}
                  className={cn("size-[7px] rounded-full", i === page ? "bg-white" : "bg-white/35")}
                />
              ))}
            </div>
          </div>

          <button type="button" onClick={advanceLesson} className="relative min-h-0 flex-1">
            <span className="absolute inset-x-[18px] top-5 bottom-2 rotate-[7deg] rounded-[28px] bg-white/45 shadow-sm" />
            <span className="absolute inset-x-[10px] top-3 bottom-1 -rotate-[5deg] rounded-[28px] bg-white/80 shadow-md" />
            <span className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] bg-card px-7 py-8 text-left shadow-float">
              <h2 className="font-display text-[28px] font-extrabold leading-[1.15] text-foreground">
                {sheet.title}
              </h2>
              <p className="mt-5 flex-1 overflow-y-auto text-[16px] font-medium leading-relaxed text-muted-foreground">
                {sheet.body}
              </p>
            </span>
          </button>

          <div className="mt-5 flex items-center justify-center gap-5 pb-2">
            <RoundTool label="Share" onClick={shareLesson}>
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
                setBookmarked((b) => !b);
                playPop(settings.soundEnabled);
              }}
            >
              <Bookmark className={cn("size-5", bookmarked && "fill-white")} />
            </RoundTool>
          </div>
        </div>
      </div>
    );
  }

  const revealed = checked && correct;

  return (
    <div className="fixed inset-0 z-[70] bg-background">
      <div className="mx-auto flex h-dvh w-full max-w-md flex-col sm:max-w-xl">
        <div className="px-4 pt-[max(0.6rem,env(safe-area-inset-top))]">
          <PlayHud />
        </div>

        <div className="mt-3 flex items-center gap-3 px-4">
          <button
            type="button"
            onClick={close}
            className="grid size-9 place-items-center rounded-full text-muted-foreground active:scale-95"
            aria-label="Close"
          >
            <X className="size-6" strokeWidth={2.2} />
          </button>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-leaf transition-all duration-500"
              style={{ width: revealed ? "100%" : "35%" }}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 pt-6">
          <h2 className="font-display text-[22px] font-extrabold leading-snug text-foreground">
            {typed.question}
          </h2>

          <label className="mt-6 block">
            <span className="sr-only">Your answer</span>
            {typed.mode === "check" ? (
              <input
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setChecked(false);
                }}
                placeholder={typed.placeholder}
                autoComplete="off"
                className={cn(
                  "w-full rounded-2xl border bg-card px-4 py-3.5 font-display text-[15px] font-semibold text-foreground outline-none",
                  revealed && "border-2 border-leaf bg-sky/30",
                  checked && !correct && "border-rose-300 bg-rose-50",
                  !checked && "border-border",
                )}
              />
            ) : (
              <textarea
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  setChecked(false);
                }}
                placeholder={typed.placeholder}
                rows={6}
                className={cn(
                  "w-full resize-none rounded-2xl border bg-card px-4 py-3.5 font-display text-[15px] font-semibold leading-relaxed text-foreground outline-none",
                  revealed && "border-2 border-leaf bg-sky/30",
                  checked && !correct && "border-rose-300 bg-rose-50",
                  !checked && "border-border",
                )}
              />
            )}
          </label>

          {checked && !correct && (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold leading-relaxed text-rose-800">
              Not quite. Try again — type the amount or the choice in your own words.
            </p>
          )}
        </div>

        {revealed ? (
          <div className="mt-auto bg-sky/40 px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-display text-[22px] font-extrabold text-leaf">Great job!</p>
              <span className="grid size-8 place-items-center rounded-full bg-white/70 text-muted-foreground">
                <HelpCircle className="size-4" />
              </span>
            </div>
            {typed.mode === "check" && typed.explanation ? (
              <p className="mb-3 text-sm font-medium leading-relaxed text-foreground/80">{typed.explanation}</p>
            ) : null}
            <button
              type="button"
              onClick={goNext}
              className="w-full rounded-2xl bg-leaf py-3.5 font-display text-[15px] font-extrabold uppercase tracking-[0.18em] text-white shadow-pop active:translate-y-0.5"
            >
              Next
            </button>
          </div>
        ) : (
          <div className="mt-auto px-5 pb-[max(1.1rem,env(safe-area-inset-bottom))] pt-2">
            <button
              type="button"
              onClick={goNext}
              className="w-full rounded-2xl bg-leaf py-3.5 font-display text-[15px] font-extrabold uppercase tracking-[0.18em] text-white shadow-pop active:translate-y-0.5"
            >
              {checked && !correct ? "Try again" : "Check"}
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
