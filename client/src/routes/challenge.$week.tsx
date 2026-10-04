import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  Bookmark,
  Check,
  HelpCircle,
  Share2,
  Volume2,
  X,
  Flame,
  Zap,
} from "lucide-react";
import { Screen } from "@/components/PhoneFrame";
import { Coin } from "@/components/Coin";
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
  const { week, chapter } = Route.useLoaderData();
  const navigate = useNavigate();
  const { auth, gameProgress, completeLevel, saveWeeklyAnswer, weeklyAnswers, settings, user } =
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

  const speak = (text: string) => {
    playPop(settings.soundEnabled);
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      toast.info("Voice isn’t available on this device.");
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  };

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

  if (phase === "lesson") {
    const sheet = pages[page];
    return (
      <div className="min-h-dvh w-full overflow-x-hidden bg-leaf text-primary-foreground">
        <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-8 pt-4 sm:max-w-xl sm:px-6 sm:pt-6 md:max-w-2xl">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              aria-label="Close"
              className="grid size-11 place-items-center rounded-2xl border-2 border-primary-foreground/20 bg-primary-deep/20"
            >
              <X className="size-5" />
            </Link>
            <div className="flex items-center gap-2">
              {pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Page ${i + 1}`}
                  onClick={() => setPage(i)}
                  className={cn(
                    "h-2.5 rounded-full transition-all",
                    i === page ? "w-7 bg-primary-foreground" : "w-2.5 bg-primary-foreground/35",
                  )}
                />
              ))}
            </div>
            <span className="grid size-11 place-items-center rounded-2xl bg-card/15 font-display text-xs font-black">
              W{week.week}
            </span>
          </div>

          <button
            type="button"
            onClick={advanceLesson}
            className="relative mx-auto mt-8 w-full max-w-lg flex-1"
          >
            <span className="absolute inset-x-8 -bottom-3 top-6 rotate-[-4deg] rounded-3xl bg-card/35" />
            <span className="absolute inset-x-4 -bottom-1.5 top-3 rotate-[3deg] rounded-3xl bg-card/55" />
            <article className="relative min-h-[58dvh] rounded-3xl border-2 border-border bg-card p-6 text-left text-foreground shadow-float sm:min-h-[62dvh] sm:p-8">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                {chapter?.title} · Week {week.week}
              </p>
              <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-primary-deep">
                {sheet.title}
              </h1>
              <p className="mt-4 text-base font-semibold leading-relaxed text-foreground/90 sm:text-lg">
                {sheet.body}
              </p>
              <p className="absolute bottom-6 left-0 right-0 text-center text-xs font-bold text-muted-foreground">
                Tap the page to continue
              </p>
            </article>
          </button>

          <div className="mx-auto mt-8 flex items-center gap-8 rounded-3xl border-2 border-primary-foreground/15 bg-primary-deep/20 px-8 py-3.5">
            <button type="button" aria-label="Share" onClick={shareLesson}>
              <Share2 className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Read aloud"
              onClick={() => speak(`${sheet.title}. ${sheet.body}`)}
            >
              <Volume2 className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Bookmark"
              onClick={() => {
                setBookmarked((b) => !b);
                playPop(settings.soundEnabled);
              }}
            >
              <Bookmark className={cn("size-5", bookmarked && "fill-current")} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Screen withNav={false}>
      <div className="flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border-2 border-border bg-card px-2 py-2 shadow-card">
          <span className="grid size-7 place-items-center rounded-xl bg-sun">
            <Coin className="size-5" />
          </span>
          <span>
            <span className="block font-display text-sm font-bold leading-none">{user.coins.toLocaleString()}</span>
            <span className="block text-[10px] font-bold text-muted-foreground">coins</span>
          </span>
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-2xl border-2 border-border bg-card px-2 py-2 shadow-card">
          <span className="grid size-7 place-items-center rounded-xl bg-berry">
            <Flame className="size-4" />
          </span>
          <span>
            <span className="block font-display text-sm font-bold leading-none">{user.streak}</span>
            <span className="block text-[10px] font-bold text-muted-foreground">day streak</span>
          </span>
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-2xl border-2 border-border bg-card px-2 py-2 shadow-card">
          <span className="grid size-7 place-items-center rounded-xl bg-sky">
            <Zap className="size-4" />
          </span>
          <span>
            <span className="block font-display text-sm font-bold leading-none">{user.xp.toLocaleString()}</span>
            <span className="block text-[10px] font-bold text-muted-foreground">XP</span>
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <Link
          to="/"
          aria-label="Close"
          className="grid size-11 place-items-center rounded-2xl border-2 border-border bg-card shadow-card"
        >
          <X className="size-5" />
        </Link>
        <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-border bg-muted">
          <div
            className="h-full rounded-full bg-leaf transition-all"
            style={{ width: checked && correct ? "100%" : "52%" }}
          />
        </div>
      </div>

      <h1 className="mt-6 font-display text-2xl font-bold leading-tight text-primary-deep sm:text-3xl">
        {typed.question}
      </h1>
      <p className="mt-1 text-sm font-semibold text-muted-foreground">
        Week {week.week} · type your answer below
      </p>

      <label className="mt-5 block">
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
              "h-16 w-full rounded-3xl border-2 bg-card px-5 font-display text-lg font-bold shadow-card outline-none",
              checked && correct && "border-primary bg-primary-soft",
              checked && !correct && "border-destructive",
              !checked && "border-border focus:border-primary",
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
            rows={7}
            className={cn(
              "w-full resize-none rounded-3xl border-2 bg-card px-5 py-4 font-sans text-base font-semibold leading-relaxed shadow-card outline-none",
              checked && correct && "border-primary bg-primary-soft",
              checked && !correct && "border-destructive",
              !checked && "border-border focus:border-primary",
            )}
          />
        )}
      </label>

      {checked && typed.mode === "check" && (
        <p className={cn("mt-3 text-sm font-bold", correct ? "text-primary-deep" : "text-destructive")}>
          {correct ? typed.explanation : "Not quite. Try again — type the amount or the choice in your own words."}
        </p>
      )}

      <div className="mt-8">
        {checked && correct && (
          <div className="mb-0 flex items-center justify-between rounded-t-3xl border-2 border-b-0 border-border bg-primary-soft px-4 py-3">
            <p className="font-display text-xl font-bold text-primary-deep">Great job!</p>
            <HelpCircle className="size-5 text-primary-deep/50" />
          </div>
        )}
        <button
          type="button"
          onClick={goNext}
          disabled={locked}
          className={cn(
            "press w-full rounded-3xl bg-primary py-4 font-display text-base font-bold text-primary-foreground shadow-pop active:translate-y-1 active:shadow-none disabled:opacity-50",
            checked && correct && "rounded-t-none",
          )}
        >
          {checked && correct ? (
            "Next"
          ) : checked && !correct ? (
            "Try again"
          ) : (
            <span className="inline-flex items-center gap-2">
              <Check className="size-5" strokeWidth={3} />
              Check
            </span>
          )}
        </button>
      </div>
    </Screen>
  );
}
