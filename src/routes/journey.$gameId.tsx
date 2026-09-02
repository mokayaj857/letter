import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Lock,
  Play,
  Star,
  Swords,
  Zap,
  X,
  ArrowRight,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";
import { getGame, type Level } from "@/data/games";
import { useUserStore } from "../lib/userStore";
import { Coin } from "@/components/Coin";
import { toast } from "sonner";
import { playPop, playSuccess, playVictory, playError } from "../lib/audio";
import { triggerConfetti } from "../lib/confetti";

export const Route = createFileRoute("/journey/$gameId")({
  loader: ({ params }) => {
    const game = getGame(params.gameId);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Quest not found — Letterbox" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { game } = loaderData;
    const title = `${game.title} Journey — Letterbox`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `${game.blurb} Climb the ${game.title} path level by level and earn XP in Letterbox.`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: game.blurb },
      ],
    };
  },
  component: Journey,
});

const kindLabel: Record<Level["kind"], string> = {
  lesson: "Lesson",
  quiz: "Quiz",
  sim: "Simulation",
  boss: "Boss battle",
};

const QUIZ_DATA = [
  {
    question: "You receive pocket money. What is the smartest first action?",
    options: [
      { text: "Spend all immediately on treats", correct: false },
      { text: "Save a portion in your piggy bank", correct: true },
      { text: "Hide it and forget where it is", correct: false },
    ],
    explanation: "Saving first helps you reach bigger goals over time.",
  },
  {
    question: "Which of the following is an essential NEED?",
    options: [
      { text: "A brand new video game", correct: false },
      { text: "School books and lunch", correct: true },
      { text: "A third pair of sneakers", correct: false },
    ],
    explanation: "Needs are essential items required for learning, health and safety.",
  },
  {
    question: "Store A sells 2 notebooks for KES 100. Store B sells 1 for KES 60. Which is better?",
    options: [
      { text: "Store A (KES 50 each)", correct: true },
      { text: "Store B (KES 60 each)", correct: false },
      { text: "Both are identical", correct: false },
    ],
    explanation: "Comparing unit prices ensures you get the best value.",
  },
];

function Journey() {
  const { game } = Route.useLoaderData();
  const { gameProgress, completeLevel, settings, user } = useUserStore();

  const currentProgress = gameProgress[game.id] ?? game.done;
  const total = game.levels.length;
  const pct = Math.min(100, Math.round((currentProgress / total) * 100));

  // Interactive Level Player Modal State
  const [playingLevelIndex, setPlayingLevelIndex] = useState<number | null>(null);
  const [lessonSlide, setLessonSlide] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [bossHp, setBossHp] = useState(100);
  const [simNeeds, setSimNeeds] = useState<string[]>([]);
  const [simWants, setSimWants] = useState<string[]>([]);
  const [victoryModal, setVictoryModal] = useState(false);

  const activeLevel = playingLevelIndex !== null ? game.levels[playingLevelIndex] : null;

  const startLevel = (idx: number) => {
    const isUnlocked = idx <= currentProgress;
    if (!isUnlocked) {
      playError(settings.soundEnabled);
      toast.info("Clear earlier levels to unlock this quest.");
      return;
    }
    playPop(settings.soundEnabled);
    setPlayingLevelIndex(idx);
    setLessonSlide(0);
    setQuizIndex(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setBossHp(100);
    setSimNeeds([]);
    setSimWants([]);
    setVictoryModal(false);
  };

  const handleFinishLevel = () => {
    if (playingLevelIndex === null) return;
    const xpReward = activeLevel?.xp || 50;
    const coinReward = activeLevel?.kind === "boss" ? 40 : 20;

    completeLevel(game.id, playingLevelIndex, xpReward, coinReward);
    setVictoryModal(true);
    playVictory(settings.soundEnabled);
    triggerConfetti();
  };

  const handleQuizAnswer = (idx: number, isCorrect: boolean) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);

    if (isCorrect) {
      playSuccess(settings.soundEnabled);
      setQuizScore((s) => s + 1);
      if (activeLevel?.kind === "boss") {
        setBossHp((hp) => Math.max(0, hp - 35));
      }
    } else {
      playError(settings.soundEnabled);
    }
  };

  const handleNextQuiz = () => {
    setSelectedAnswer(null);
    if (quizIndex < QUIZ_DATA.length - 1) {
      setQuizIndex((i) => i + 1);
      playPop(settings.soundEnabled);
    } else {
      handleFinishLevel();
    }
  };

  return (
    <>
      <Screen>
        <header className="flex items-center gap-3">
          <Link
            to="/"
            aria-label="Back to games"
            className="grid size-11 place-items-center rounded-2xl border-2 border-border bg-card shadow-card active:scale-95"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Journey
            </p>
            <h1 className="truncate text-2xl font-bold text-primary-deep">
              {game.title}
            </h1>
          </div>
          <span className={`grid size-12 place-items-center rounded-2xl ${game.tint}`}>
            <img
              src={game.art}
              alt=""
              aria-hidden
              width={384}
              height={384}
              className="size-9 animate-float-soft object-contain"
            />
          </span>
        </header>

        <section className="mt-4 rounded-3xl border-2 border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-muted-foreground">
              {currentProgress} of {total} levels cleared
            </span>
            <span className="text-primary-deep">{pct}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-leaf transition-all duration-700 ease-out" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 text-sm font-semibold text-muted-foreground">{game.blurb}</p>
        </section>

        {/* Level Path */}
        <ol className="relative mt-6 dotty pl-2 pb-6">
          {game.levels.map((level, i) => {
            const isDone = i < currentProgress;
            const isCurrent = i === currentProgress;
            const isLocked = i > currentProgress;

            return (
              <li
                key={level.title}
                className="flex items-center gap-4 py-3 animate-pop-in"
                style={{
                  marginLeft: `${[0, 34, 60, 34][i % 4]}px`,
                  animationDelay: `${i * 55}ms`,
                }}
              >
                <button
                  type="button"
                  onClick={() => startLevel(i)}
                  className={`press grid size-16 shrink-0 place-items-center rounded-3xl border-4 border-card shadow-card active:scale-95 transition-all ${
                    isLocked
                      ? "bg-muted text-muted-foreground cursor-not-allowed"
                      : isDone
                        ? "bg-primary text-primary-foreground"
                        : "bg-sunny text-sun-foreground animate-wiggle ring-4 ring-primary/40"
                  }`}
                >
                  {isLocked ? (
                    <Lock className="size-6" />
                  ) : isDone ? (
                    <Check className="size-7" strokeWidth={3} />
                  ) : level.kind === "boss" ? (
                    <Swords className="size-7" strokeWidth={2.6} />
                  ) : (
                    <Play className="size-7" strokeWidth={2.6} />
                  )}
                </button>
                <div className="min-w-0" onClick={() => !isLocked && startLevel(i)}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {kindLabel[level.kind]}
                  </p>
                  <p
                    className={`font-display text-base font-bold leading-tight ${
                      isLocked ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {level.title}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-muted-foreground">
                    {isDone ? (
                      <>
                        <Star className="size-3.5 text-sun fill-sun" /> Cleared · +{level.xp} XP
                      </>
                    ) : (
                      <>
                        <Zap className="size-3.5 text-sky fill-sky" /> {level.xp} XP
                      </>
                    )}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <button
          type="button"
          onClick={() => startLevel(Math.min(currentProgress, total - 1))}
          className="press mt-4 w-full rounded-3xl bg-primary py-4 font-display text-base font-bold text-primary-foreground shadow-pop active:translate-y-1 active:shadow-none"
        >
          {currentProgress === 0 ? "Start journey" : "Continue journey"}
        </button>
      </Screen>

      {/* Playable Level Runner Modal */}
      {playingLevelIndex !== null && activeLevel && !victoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-4xl border-2 border-border bg-card p-6 shadow-float animate-pop-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-primary-deep">
                  Level {playingLevelIndex + 1} · {kindLabel[activeLevel.kind]}
                </p>
                <h2 className="font-display text-lg font-bold text-foreground truncate">
                  {activeLevel.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPlayingLevelIndex(null)}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Lesson Mode */}
            {activeLevel.kind === "lesson" && (
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl border-2 border-border bg-muted/30 p-5 text-center">
                  <h3 className="font-display text-base font-bold text-primary-deep">
                    {lessonSlide === 0
                      ? "Understanding Money"
                      : lessonSlide === 1
                        ? "Needs vs Wants"
                        : "The 24-Hour Rule"}
                  </h3>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground leading-relaxed">
                    {lessonSlide === 0
                      ? "Money is a store of value and medium of exchange. It allows people to trade work and goods fairly."
                      : lessonSlide === 1
                        ? "Needs are essentials like food, shelter, and school supplies. Wants are extras that make life fun but can wait."
                        : "When tempted by an impulse buy, wait 24 hours. If you still need it, plan it into your monthly budget."}
                  </p>
                </div>

                <div className="flex justify-center gap-1.5">
                  {[0, 1, 2].map((s) => (
                    <span
                      key={s}
                      className={`h-2 rounded-full transition-all ${
                        lessonSlide === s ? "w-6 bg-primary" : "w-2 bg-muted"
                      }`}
                    />
                  ))}
                </div>

                {lessonSlide < 2 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setLessonSlide((s) => s + 1);
                      playPop(settings.soundEnabled);
                    }}
                    className="press flex w-full items-center justify-center gap-2 rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
                  >
                    <span>Next</span>
                    <ArrowRight className="size-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishLevel}
                    className="press w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
                  >
                    Complete Lesson (+{activeLevel.xp} XP)
                  </button>
                )}
              </div>
            )}

            {/* Quiz & Boss Battle Mode */}
            {(activeLevel.kind === "quiz" || activeLevel.kind === "boss") && (
              <div className="mt-4 space-y-3">
                {activeLevel.kind === "boss" && (
                  <div className="rounded-2xl border-2 border-border bg-muted/40 p-3">
                    <div className="flex justify-between text-xs font-bold text-destructive">
                      <span>Boss Resistance</span>
                      <span>{bossHp} / 100</span>
                    </div>
                    <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-destructive transition-all duration-500"
                        style={{ width: `${bossHp}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>Question {quizIndex + 1} of {QUIZ_DATA.length}</span>
                  <span className="text-primary-deep">Score: {quizScore}</span>
                </div>

                <p className="font-display text-sm font-bold text-foreground">
                  {QUIZ_DATA[quizIndex]?.question}
                </p>

                <div className="space-y-2">
                  {QUIZ_DATA[quizIndex]?.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswer === optIdx;
                    let style = "border-border bg-card hover:border-primary/50";
                    if (selectedAnswer !== null) {
                      if (opt.correct) {
                        style = "border-primary bg-primary-soft text-primary-deep font-bold";
                      } else if (isSelected) {
                        style = "border-destructive bg-destructive/10 text-destructive font-bold";
                      }
                    }

                    return (
                      <button
                        key={opt.text}
                        type="button"
                        onClick={() => handleQuizAnswer(optIdx, opt.correct)}
                        className={`press flex w-full items-center justify-between rounded-2xl border-2 p-3 text-left font-display text-xs transition-all active:scale-[0.98] ${style}`}
                      >
                        <span>{opt.text}</span>
                        {selectedAnswer !== null && opt.correct && (
                          <Check className="size-4 text-primary" strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedAnswer !== null && (
                  <div>
                    <p className="text-xs text-muted-foreground bg-secondary p-3 rounded-2xl">
                      {QUIZ_DATA[quizIndex]?.explanation}
                    </p>
                    <button
                      type="button"
                      onClick={handleNextQuiz}
                      className="press mt-3 w-full rounded-3xl bg-primary py-3 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
                    >
                      {quizIndex < QUIZ_DATA.length - 1 ? "Next Question" : "Finish Quest"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Simulation Mode */}
            {activeLevel.kind === "sim" && (
              <div className="mt-4 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground">
                  Sort items into Needs vs Wants:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-2xl border-2 border-primary bg-primary-soft/30 p-3 min-h-[90px]">
                    <p className="font-display text-xs font-bold text-primary-deep text-center">
                      Needs
                    </p>
                    <div className="mt-2 space-y-1 text-xs">
                      {simNeeds.map((item) => (
                        <div key={item} className="rounded-lg bg-card p-1.5 text-center font-semibold shadow-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border-2 border-berry bg-berry/10 p-3 min-h-[90px]">
                    <p className="font-display text-xs font-bold text-berry text-center">
                      Wants
                    </p>
                    <div className="mt-2 space-y-1 text-xs">
                      {simWants.map((item) => (
                        <div key={item} className="rounded-lg bg-card p-1.5 text-center font-semibold shadow-sm">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  {[
                    { name: "School Lunch (KES 50)", type: "needs" },
                    { name: "Video Game Pass (KES 150)", type: "wants" },
                    { name: "Math Textbook (KES 100)", type: "needs" },
                  ].map((item) => {
                    const isSorted = simNeeds.includes(item.name) || simWants.includes(item.name);
                    if (isSorted) return null;

                    return (
                      <div key={item.name} className="flex items-center justify-between rounded-2xl bg-secondary p-2.5">
                        <span className="text-xs font-bold">{item.name}</span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              playPop(settings.soundEnabled);
                              setSimNeeds((s) => [...s, item.name]);
                            }}
                            className="rounded-xl bg-primary px-3 py-1 font-display text-xs font-bold text-primary-foreground"
                          >
                            Need
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              playPop(settings.soundEnabled);
                              setSimWants((s) => [...s, item.name]);
                            }}
                            className="rounded-xl bg-berry px-3 py-1 font-display text-xs font-bold text-berry-foreground"
                          >
                            Want
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {simNeeds.length + simWants.length === 3 && (
                  <button
                    type="button"
                    onClick={handleFinishLevel}
                    className="press mt-3 w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
                  >
                    Simulation Complete (+{activeLevel.xp} XP)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Victory Level Complete Modal */}
      {victoryModal && activeLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-4xl border-2 border-border bg-card p-6 shadow-float animate-pop-in text-center">
            <h2 className="mt-2 font-display text-2xl font-bold text-primary-deep">
              Level Complete!
            </h2>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              You mastered &apos;{activeLevel.title}&apos;.
            </p>

            <div className="my-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border-2 border-border bg-secondary p-3">
                <p className="text-[11px] font-bold text-muted-foreground">XP Earned</p>
                <p className="mt-1 font-display text-2xl font-bold text-primary-deep">
                  +{activeLevel.xp}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-border bg-sunny p-3">
                <p className="text-[11px] font-bold text-sun-foreground">Coins Added</p>
                <p className="mt-1 flex items-center justify-center gap-1 font-display text-2xl font-bold text-sun-foreground">
                  +{activeLevel.kind === "boss" ? 40 : 20} <Coin className="size-4" />
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setVictoryModal(false);
                setPlayingLevelIndex(null);
              }}
              className="press w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}
