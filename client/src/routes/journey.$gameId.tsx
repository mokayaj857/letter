import { useState, useEffect, useMemo, useRef } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
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
  Brain,
  Grid3x3,
  Search,
  KeyRound,
  Sparkles,
  BookOpen,
  Trophy,
  RotateCcw,
  Flame,
  type LucideIcon,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";
import { getGame, type Level } from "@/data/games";
import { useUserStore } from "../lib/userStore";
import { Coin } from "@/components/Coin";
import { PlayHud } from "@/components/PlayHud";
import { icons } from "@/assets/icons";
import mascot from "@/assets/mascot.png";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  playPop,
  playSuccess,
  playVictory,
  playError,
  startBackgroundMusic,
  stopBackgroundMusic,
  unlockAudio,
} from "../lib/audio";
import { triggerConfetti } from "../lib/confetti";
import { WordSearchPlayer } from "@/components/games/WordSearchPlayer";
import { CrosswordPlayer } from "@/components/games/CrosswordPlayer";
import { QuizPlayer } from "@/components/games/QuizPlayer";
import { CryptogramPlayer } from "@/components/games/CryptogramPlayer";
import { SpecialActivitiesPlayer } from "@/components/games/SpecialActivitiesPlayer";

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

const KIND_META: Record<
  Level["kind"],
  { label: string; Icon: LucideIcon }
> = {
  wordsearch: { label: "Word Search", Icon: Search },
  crossword: { label: "Crossword", Icon: Grid3x3 },
  quiz: { label: "Quiz", Icon: Brain },
  cryptogram: { label: "Cryptogram", Icon: KeyRound },
  activity: { label: "Special Activity", Icon: Sparkles },
  sim: { label: "Simulation", Icon: Sparkles },
  lesson: { label: "Lesson", Icon: BookOpen },
  boss: { label: "Boss Battle", Icon: Swords },
};

// Duolingo Unit Chapter Palettes (authentic solid Duolingo colors with tactile 3D bevels)
const UNIT_THEMES = [
  {
    bg: "bg-[#58cc02]",
    bottomBorderColor: "#46a302",
    borderClass: "border-b-[8px] border-[#46a302]",
    name: "leaf",
    colorName: "emerald",
  },
  {
    bg: "bg-[#1cb0f6]",
    bottomBorderColor: "#1899d6",
    borderClass: "border-b-[8px] border-[#1899d6]",
    name: "sky",
    colorName: "sky",
  },
  {
    bg: "bg-[#ff9600]",
    bottomBorderColor: "#e57800",
    borderClass: "border-b-[8px] border-[#e57800]",
    name: "sun",
    colorName: "amber",
  },
  {
    bg: "bg-[#ff4b4b]",
    bottomBorderColor: "#ea2b2b",
    borderClass: "border-b-[8px] border-[#ea2b2b]",
    name: "berry",
    colorName: "rose",
  },
  {
    bg: "bg-[#ce82ff]",
    bottomBorderColor: "#a545e0",
    borderClass: "border-b-[8px] border-[#a545e0]",
    name: "grape",
    colorName: "purple",
  },
  {
    bg: "bg-[#2ce1b4]",
    bottomBorderColor: "#1eb892",
    borderClass: "border-b-[8px] border-[#1eb892]",
    name: "teal",
    colorName: "teal",
  },
];

// Duolingo serpentine S-curve horizontal offsets (in px)
const S_CURVE_OFFSETS = [0, -48, -78, -48, 0, 48, 78, 48];

// Mascot motivational cheers
const BOXY_CHEERS = [
  "You're on fire! Keep that streak alive! 🔥",
  "Every level makes you smarter with money! 💡",
  "One step closer to becoming a Money Master! 💰",
  "Practice makes profit! Keep climbing! 🚀",
  "You've got this! Boxy is cheering for you! 🌟",
];

const QUIZ_DATA = [
  {
    question: "You receive pocket money. What is the smartest first action?",
    options: [
      { text: "Spend all immediately on treats", correct: false },
      { text: "Hide it and forget where it is", correct: false },
      { text: "Save a portion in your piggy bank", correct: true },
    ],
    explanation: "Saving first helps you reach bigger goals over time.",
  },
  {
    question: "Which of the following is an essential NEED?",
    options: [
      { text: "A brand new video game", correct: false },
      { text: "A third pair of sneakers", correct: false },
      { text: "School books and lunch", correct: true },
    ],
    explanation: "Needs are essential items required for learning, health and safety.",
  },
  {
    question: "Store A sells 2 notebooks for KES 100. Store B sells 1 for KES 60. Which is better?",
    options: [
      { text: "Store B (KES 60 each)", correct: false },
      { text: "Store A (KES 50 each)", correct: true },
      { text: "Both are identical", correct: false },
    ],
    explanation: "Comparing unit prices ensures you get the best value.",
  },
];

function getCanonicalTopic(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("trade") || t.includes("saharan") || t.includes("maritime")) {
    return "History of Trade in Africa";
  }
  if (t.includes("currencies of africa") || t.includes("afro note") || t.includes("notable cities")) {
    return "Currencies of Africa";
  }
  if (t.includes("currencies of the americas") || t.includes("three-nation") || t.includes("ticket budget")) {
    return "Currencies of the Americas";
  }
  if (t.includes("currencies of europe") || t.includes("daily cap")) {
    return "Currencies of Europe";
  }
  if (t.includes("middle east")) {
    return "Currencies of the Middle East";
  }
  if (t.includes("currencies of asia") || t.includes("currencies asia")) {
    return "Currencies of Asia";
  }
  if (t.includes("export")) {
    return "Kenyan & African Exports";
  }
  if (t.includes("import")) {
    return "Kenyan Imports";
  }
  if (t.includes("foundations of money")) {
    return "Foundations of Money";
  }
  if (t.includes("features of kenyan currency") || t.includes("tactile")) {
    return "Features of Kenyan Currency";
  }
  if (t.includes("characteristics of m-pesa") || t.includes("m-pesa") || t.includes("mpesa")) {
    return "Characteristics of M-Pesa";
  }
  if (t.includes("currencies of kenya")) {
    return "Currencies of Kenya";
  }
  if (t.includes("budgeting") || t.includes("expense") || t.includes("fixed vs variable") || t.includes("school shopping") || t.includes("treasure hunt")) {
    return "Budgeting Foundations";
  }
  if (t.includes("savvy shopper")) {
    return "Savvy Shopper";
  }
  if (t.includes("video games") || t.includes("squad outing")) {
    return "Wants & Squad Outings";
  }
  if (t.includes("consumer skills") || t.includes("bargaining")) {
    return "Consumer Skills & Bargaining";
  }
  if (t.includes("saving") || t.includes("piggy")) {
    return "Saving & Compounding";
  }
  if (t.includes("banking") || t.includes("deposit") || t.includes("teen account")) {
    return "Banking & Accounts";
  }
  if (t.includes("types of income") || t.includes("earned vs passive")) {
    return "Types of Income";
  }
  if (t.includes("careers") || t.includes("workplace") || t.includes("ethics") || t.includes("employab")) {
    return "Careers & Workplace Skills";
  }
  if (t.includes("startup") || t.includes("branding") || t.includes("business") || t.includes("photographer")) {
    return "Startup Foundations";
  }
  const parts = title.split(/[:·–]/);
  if (parts.length > 1 && parts[0].trim().length >= 3) {
    return parts[0].trim();
  }
  return title;
}

function getUnitDescription(title: string, gameTitle: string): string {
  const t = title.toLowerCase();
  if (t.includes("trade") || t.includes("history")) {
    return "Explore ancient African trade routes, cowrie shells, caravans and barter systems.";
  }
  if (t.includes("currency") || t.includes("note") || t.includes("coin")) {
    return "Learn how coins, banknotes, security features, and digital cash work.";
  }
  if (t.includes("mpesa") || t.includes("m-pesa") || t.includes("digital")) {
    return "Master mobile money, PIN protection, spending limits, and safe transfers.";
  }
  if (t.includes("budget")) {
    return "Apply the 50/30/20 rule to balance Needs, Wants, and Piggy Vault savings.";
  }
  if (t.includes("earn") || t.includes("career") || t.includes("job") || t.includes("work")) {
    return "Discover active wages, side hustles, future careers, and creating value.";
  }
  if (t.includes("sav") || t.includes("bank") || t.includes("account")) {
    return "Build emergency funds, unlock compounding power, and open teen accounts.";
  }
  if (t.includes("invest") || t.includes("stock") || t.includes("market")) {
    return "Put your money to work in the capital markets, shares, and the NSE.";
  }
  if (t.includes("entrepreneur") || t.includes("business") || t.includes("founder")) {
    return "Pitch ventures, calculate profit margins, and launch like a founder.";
  }
  return `Master key skills in ${gameTitle} and earn XP to unlock new paths.`;
}

function getUnitVocab(title: string): string[] {
  const t = title.toLowerCase();
  if (t.includes("trade") || t.includes("history")) {
    return ["Cowrie Shells", "Barter Trade", "Caravans", "Commodity", "Merchant"];
  }
  if (t.includes("currency") || t.includes("note") || t.includes("coin")) {
    return ["Banknote", "Tactile Bars", "Watermark", "M-Pesa", "Central Bank"];
  }
  if (t.includes("mpesa") || t.includes("m-pesa")) {
    return ["PIN Security", "Paybill", "Till Number", "Spending Cap", "Reversal"];
  }
  if (t.includes("budget")) {
    return ["50/30/20 Rule", "Needs vs Wants", "Fixed Costs", "Discretionary", "Emergency Fund"];
  }
  if (t.includes("earn") || t.includes("career")) {
    return ["Active Income", "Salary", "Wages", "Commission", "Freelancing"];
  }
  if (t.includes("sav") || t.includes("bank")) {
    return ["Piggy Vault", "Interest Rate", "Compounding", "Delayed Gratification", "Savings Account"];
  }
  if (t.includes("invest")) {
    return ["Shares & Stocks", "Dividends", "NSE", "Capital Growth", "Portfolio"];
  }
  return ["Smart Money", "Budgeting", "Saving", "Growth", "Literacy"];
}

interface UnitSection {
  id: string;
  unitIndex: number;
  title: string;
  theme: (typeof UNIT_THEMES)[number];
  levels: {
    level: Level;
    globalIndex: number;
    indexInUnit: number;
  }[];
  completedCount: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isLocked: boolean;
}

function Journey() {
  const { game } = Route.useLoaderData();
  const { gameProgress, completeLevel, settings, user, auth } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.isLoggedIn) {
      navigate({ to: "/signup", replace: true });
    }
  }, [auth?.isLoggedIn, navigate]);

  if (!auth?.isLoggedIn) {
    return null;
  }

  useEffect(() => {
    if (settings.musicEnabled && settings.soundEnabled && (settings.musicVolume ?? 70) > 0) {
      startBackgroundMusic(true, true, settings.musicVolume ?? 70);
    } else {
      stopBackgroundMusic();
    }
    return () => {
      stopBackgroundMusic();
    };
  }, [settings.musicEnabled, settings.soundEnabled, settings.musicVolume, settings.bgmTrack]);

  const currentProgress = gameProgress[game.id] ?? game.done;
  const total = game.levels.length;
  const pct = Math.min(100, Math.round((currentProgress / total) * 100));

  // Duolingo interactive node modal & guidebook modal
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);
  const [selectedGuidebookUnit, setSelectedGuidebookUnit] = useState<UnitSection | null>(null);

  // Boxy cheer index
  const [boxySpeechIndex, setBoxySpeechIndex] = useState(0);

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
  const [earnedRewards, setEarnedRewards] = useState({ xp: 50, coins: 20 });

  const activeLevel = playingLevelIndex !== null ? game.levels[playingLevelIndex] : null;
  const isPaperQuiz =
    activeLevel?.gameData?.type === "quiz" && Boolean(activeLevel.gameData.questions[0]?.lessonBody);

  // Group levels into authentic Duolingo Unit Chapters
  const units: UnitSection[] = useMemo(() => {
    const list: {
      id: string;
      unitIndex: number;
      title: string;
      theme: (typeof UNIT_THEMES)[number];
      levels: { level: Level; globalIndex: number; indexInUnit: number }[];
    }[] = [];
    let current: (typeof list)[number] | null = null;

    game.levels.forEach((level, idx) => {
      const topic = getCanonicalTopic(level.title) || `Unit ${list.length + 1}`;
      const shouldBreak =
        !current ||
        current.title !== topic ||
        current.levels.length >= 6;

      if (shouldBreak) {
        if (current) list.push(current);
        const unitIndex = list.length;
        const theme = UNIT_THEMES[unitIndex % UNIT_THEMES.length];
        current = {
          id: `unit-${unitIndex}`,
          unitIndex,
          title: topic,
          theme,
          levels: [{ level, globalIndex: idx, indexInUnit: 0 }],
        };
      } else {
        current.levels.push({
          level,
          globalIndex: idx,
          indexInUnit: current.levels.length,
        });
      }
    });

    if (current) list.push(current);

    // Compute unit state
    return list.map((unit) => {
      const completedCount = unit.levels.filter((l) => l.globalIndex < currentProgress).length;
      const isCompleted = completedCount === unit.levels.length;
      const isCurrent = unit.levels.some((l) => l.globalIndex === currentProgress);
      const isLocked = unit.levels.every((l) => l.globalIndex > currentProgress);
      return { ...unit, completedCount, isCompleted, isCurrent, isLocked };
    });
  }, [game.levels, currentProgress]);

  // Duolingo Dynamic Sticky Unit Header:
  // Tracks scroll position so that only ONE single permanent unit header exists at the top,
  // dynamically updating its title, color, progress, and guidebook as you scroll to different units!
  const stickyHeaderRef = useRef<HTMLDivElement | null>(null);
  const unitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  // Initialize active unit index based on current level progress
  useEffect(() => {
    const currentUnitIdx = units.findIndex((u) => u.isCurrent);
    if (currentUnitIdx !== -1) {
      setActiveUnitIndex(currentUnitIdx);
    }
  }, [units]);

  // Robust Duolingo Scroll tracking:
  // Evaluates every unit section on the path and checks if its top has passed beneath
  // the permanent sticky header, instantly morphing the header in real-time as you scroll!
  useEffect(() => {
    const updateActiveUnit = () => {
      if (!units.length) return;
      const headerEl = stickyHeaderRef.current;
      const headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom + 40 : 240;

      let foundIndex = 0;
      for (let i = 0; i < units.length; i++) {
        const el = unitRefs.current[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerBottom) {
            foundIndex = i;
          }
        }
      }
      setActiveUnitIndex((prev) => (prev !== foundIndex ? foundIndex : prev));
    };

    window.addEventListener("scroll", updateActiveUnit, { passive: true });
    window.addEventListener("resize", updateActiveUnit, { passive: true });
    updateActiveUnit();
    const rafId = requestAnimationFrame(updateActiveUnit);
    const timer = setTimeout(updateActiveUnit, 100);

    return () => {
      window.removeEventListener("scroll", updateActiveUnit);
      window.removeEventListener("resize", updateActiveUnit);
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [units.length]);

  const activeUnit = units[activeUnitIndex] || units[0];

  const scrollToUnit = (idx: number) => {
    const el = unitRefs.current[idx];
    if (el) {
      const headerEl = stickyHeaderRef.current;
      const offset = headerEl ? headerEl.offsetHeight + 40 : 260;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const startLevel = (idx: number) => {
    unlockAudio();
    const isUnlocked = idx <= currentProgress;
    if (!isUnlocked) {
      playError(settings.soundEnabled);
      toast.info("Complete previous levels to unlock this quest.");
      return;
    }
    if (settings.musicEnabled && settings.soundEnabled) {
      startBackgroundMusic(true, true, settings.musicVolume ?? 70);
    }
    playPop(settings.soundEnabled);
    setSelectedNodeIndex(null);
    setSelectedGuidebookUnit(null);
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

  const handleFinishLevel = (customXp?: number, customCoins?: number) => {
    if (playingLevelIndex === null) return;
    const xpReward = customXp || activeLevel?.xp || 50;
    const coinReward = customCoins || (activeLevel?.kind === "boss" ? 40 : 20);

    setEarnedRewards({ xp: xpReward, coins: coinReward });
    completeLevel(game.id, playingLevelIndex, xpReward, coinReward);
    setVictoryModal(true);
    playVictory(settings.soundEnabled);
    triggerConfetti();
  };

  const handleNodeClick = (globalIdx: number) => {
    if (globalIdx > currentProgress) {
      playError(settings.soundEnabled);
      toast.info(`Complete level ${currentProgress + 1} to unlock this node!`);
      return;
    }
    playPop(settings.soundEnabled);
    setSelectedNodeIndex(globalIdx);
  };

  const handleMilestoneClick = (unit: UnitSection) => {
    if (unit.isCompleted) {
      playSuccess(settings.soundEnabled);
      triggerConfetti();
      toast.success(`Unit ${unit.unitIndex + 1} Cleared! You've mastered "${unit.title}"! 🎉`);
    } else {
      playPop(settings.soundEnabled);
      toast.info(`Complete all levels in Unit ${unit.unitIndex + 1} to unlock this milestone chest! 🎁`);
    }
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

  const selectedLevel = selectedNodeIndex !== null ? game.levels[selectedNodeIndex] : null;

  return (
    <>
      <Screen>
        {/* STICKY DUOLINGO TOP STACK: Top Navigation HUD + THE ONLY DYNAMIC UNIT HEADER */}
        <div
          ref={stickyHeaderRef}
          className="sticky top-0 z-30 -mx-4 -mt-4 mb-3 bg-background/95 backdrop-blur-md pb-2 border-b border-border/70 shadow-xs"
        >
          {/* Top HUD */}
          <header className="flex items-center justify-between gap-2 px-4 py-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                to="/"
                aria-label="Back to quests"
                className="press grid size-9 sm:size-10 place-items-center rounded-2xl border-2 border-border bg-card shadow-xs hover:bg-muted active:scale-95"
                onClick={() => playPop(settings.soundEnabled)}
              >
                <ArrowLeft className="size-5 text-foreground" />
              </Link>
              <div className="min-w-0">
                <h1 className="truncate font-display text-base sm:text-lg font-bold text-primary-deep leading-tight">
                  {game.title}
                </h1>
                <p className="text-[11px] font-bold text-muted-foreground">
                  Level {Math.min(currentProgress + 1, total)} of {total}
                </p>
              </div>
            </div>
            <PlayHud />
          </header>

          {/* THE SINGLE DYNAMIC DUOLINGO UNIT HEADER (Changes as you scroll to different units!) */}
          {activeUnit && (
            <div className="px-4 pt-1">
              <div
                className={cn(
                  "relative overflow-visible rounded-3xl p-4 sm:p-5 text-white shadow-float transition-all duration-300 ease-out",
                  activeUnit.theme.bg,
                  activeUnit.theme.borderClass,
                )}
              >
                {/* Top Row: Unit Badge, Title & Guidebook Button */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-xs sm:text-sm font-black uppercase tracking-widest text-white/80">
                        UNIT {activeUnit.unitIndex + 1}
                      </span>
                      {activeUnit.isCompleted && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                          <Check className="size-3 stroke-[3]" /> Mastered
                        </span>
                      )}
                    </div>
                    <h2 className="mt-0.5 font-display text-xl sm:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-xs truncate">
                      {activeUnit.title}
                    </h2>
                    <p className="mt-1 text-xs sm:text-[13px] font-semibold text-white/90 leading-snug line-clamp-1 max-w-md">
                      {getUnitDescription(activeUnit.title, game.title)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playPop(settings.soundEnabled);
                      setSelectedGuidebookUnit(activeUnit);
                    }}
                    aria-label={`Open Guidebook for Unit ${activeUnit.unitIndex + 1}`}
                    className="press shrink-0 flex items-center gap-2 rounded-2xl border-2 border-white/40 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white font-display text-xs sm:text-sm font-black uppercase tracking-wider px-3 sm:px-4 py-2 border-b-4 border-black/25 shadow-xs active:translate-y-1 transition-all"
                  >
                    <BookOpen className="size-4.5 stroke-[2.5]" />
                    <span>Guidebook</span>
                  </button>
                </div>

                {/* Duolingo Progress Indicator: "0 of 3 completed" */}
                <div className="mt-3 pt-2.5 border-t border-white/20 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-white">
                    <span className="flex items-center gap-1.5">
                      <Trophy className="size-3.5 text-amber-300 drop-shadow-xs" />
                      <span>{activeUnit.completedCount} of {activeUnit.levels.length} completed</span>
                    </span>
                    <span className="text-white/90 font-bold">
                      {Math.round((activeUnit.completedCount / activeUnit.levels.length) * 100)}%
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-black/25 p-0.5 shadow-inner">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-500 ease-out shadow-xs"
                      style={{
                        width: `${(activeUnit.completedCount / activeUnit.levels.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Authentic Duolingo Downward Pointer Triangle */}
                <div
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 size-0 pointer-events-none transition-colors duration-300"
                  style={{
                    borderLeft: "14px solid transparent",
                    borderRight: "14px solid transparent",
                    borderTop: `14px solid ${activeUnit.theme.bottomBorderColor}`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Continuous Duolingo Winding Path Journey (Zero text description on path) */}
        <div className="relative pb-24 dotty pt-4">
          {units.map((unit, uIdx) => (
            <div
              key={unit.id}
              ref={(el) => {
                unitRefs.current[uIdx] = el;
              }}
              className="relative mb-8"
            >
              {/* Unit Checkpoint Divider on the path */}
              {uIdx > 0 && (
                <div
                  onClick={() => scrollToUnit(uIdx)}
                  role="button"
                  tabIndex={0}
                  className="my-8 flex items-center justify-center gap-3 cursor-pointer select-none group"
                >
                  <div className="h-0.5 flex-1 bg-border/60 group-hover:bg-primary/40 transition-colors" />
                  <div className="flex items-center gap-2 rounded-full border-2 border-border bg-card px-4 py-1.5 shadow-xs group-hover:border-primary/50 group-hover:scale-105 active:scale-95 transition-all">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: unit.theme.bottomBorderColor }}
                    />
                    <span className="font-display text-xs font-black uppercase tracking-wider text-muted-foreground group-hover:text-foreground">
                      Unit {uIdx + 1} Checkpoint · {unit.title}
                    </span>
                  </div>
                  <div className="h-0.5 flex-1 bg-border/60 group-hover:bg-primary/40 transition-colors" />
                </div>
              )}

              {/* Serpentine Node Trail (Duolingo S-Curve) */}
              <div className="relative flex flex-col items-center">
                {unit.levels.map((item, itemIdx) => {
                  const globalIdx = item.globalIndex;
                  const isDone = globalIdx < currentProgress;
                  const isCurrent = globalIdx === currentProgress;
                  const isLocked = globalIdx > currentProgress;

                  const kindConfig = KIND_META[item.level.kind] || {
                    label: "Quest",
                    Icon: Star,
                  };
                  const KindIcon = kindConfig.Icon;

                  // S-curve offset in pixels
                  const xOffset = S_CURVE_OFFSETS[itemIdx % S_CURVE_OFFSETS.length];
                  const nextItem = unit.levels[itemIdx + 1];

                  return (
                    <div
                      key={item.level.title + globalIdx}
                      className="relative my-3 flex flex-col items-center"
                      style={{
                        transform: `translateX(${xOffset}px)`,
                      }}
                    >
                      {/* Stepper Dots to Next Node */}
                      {nextItem && (
                        <div className="pointer-events-none absolute top-full left-1/2 z-0 my-1 flex -translate-x-1/2 flex-col items-center gap-1.5">
                          <span
                            className={cn(
                              "size-2.5 rounded-full transition-colors",
                              isDone ? "bg-[#58cc02]" : "bg-border",
                            )}
                          />
                          <span
                            className={cn(
                              "size-2 rounded-full transition-colors",
                              isDone ? "bg-[#58cc02]" : "bg-border",
                            )}
                          />
                        </div>
                      )}

                      {/* Duolingo Floating "START" Bubble above current active node */}
                      {isCurrent && (
                        <div className="absolute -top-12 z-20 flex flex-col items-center animate-bob pointer-events-none select-none">
                          <div className="flex items-center gap-1.5 rounded-2xl bg-foreground px-4 py-1.5 font-display text-xs font-black uppercase tracking-wider text-card shadow-pop">
                            <Play className="size-3.5 fill-card text-card" />
                            <span>START</span>
                          </div>
                          <div className="size-0 border-x-[7px] border-x-transparent border-t-[7px] border-t-foreground -mt-0.5" />
                        </div>
                      )}

                      {/* Duolingo 3D Tactile Stepping Stone Button (No text description) */}
                      <button
                        type="button"
                        onClick={() => handleNodeClick(globalIdx)}
                        aria-label={`Level ${globalIdx + 1}: ${item.level.title}`}
                        className={cn(
                          "press relative grid size-[76px] sm:size-[82px] place-items-center rounded-full transition-transform active:translate-y-2 duration-150",
                          isDone &&
                            "bg-[#58cc02] text-white border-b-[8px] border-[#46a302] shadow-card hover:brightness-105 active:border-b-2",
                          isCurrent &&
                            "bg-[#ffc800] text-amber-950 border-b-[8px] border-[#e5a500] shadow-card hover:brightness-105 active:border-b-2 ring-[6px] ring-amber-400/40 ring-offset-4 ring-offset-background animate-wiggle",
                          isLocked &&
                            "bg-[#e5e5e5] text-[#afafaf] border-b-[8px] border-[#cfcfcf] shadow-xs active:border-b-2",
                        )}
                      >
                        {isLocked ? (
                          <Lock className="size-7 text-[#afafaf]" strokeWidth={2.5} />
                        ) : isDone ? (
                          <Check className="size-9 text-white drop-shadow-sm" strokeWidth={3.5} />
                        ) : (
                          <KindIcon className="size-8 fill-current text-current drop-shadow-sm" />
                        )}

                        {/* Completed Star Badge on Top Right */}
                        {isDone && (
                          <span className="absolute -top-1 -right-1 grid size-7 place-items-center rounded-full bg-[#ffc800] text-amber-950 border-2 border-white shadow-xs">
                            <Star className="size-4 fill-current text-amber-950" />
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}

                {/* Milestone Chest Node at End of Unit */}
                <div className="mt-8 mb-2 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleMilestoneClick(unit)}
                    aria-label={`Milestone for Unit ${uIdx + 1}`}
                    className={cn(
                      "press group relative grid size-20 place-items-center rounded-4xl border-2 border-border bg-card shadow-card hover:scale-105 active:scale-95 transition-all",
                      unit.isCompleted ? "ring-4 ring-amber-400/40 bg-sunny/20" : "bg-card",
                    )}
                  >
                    <img
                      src={unit.isCompleted ? icons.trophy : icons.badgeMedal}
                      alt="Milestone"
                      className={cn(
                        "size-12 object-contain drop-shadow transition-transform",
                        unit.isCompleted ? "animate-bob" : "grayscale opacity-40",
                      )}
                    />
                    {unit.isCompleted && (
                      <span className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-white shadow-xs">
                        ✓
                      </span>
                    )}
                  </button>
                  <span className="mt-2 font-display text-xs font-bold text-foreground">
                    {unit.isCompleted ? "Unit Milestone Cleared! 🏆" : `Unit ${uIdx + 1} Chest 🔒`}
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    {unit.isCompleted
                      ? "Tap to celebrate"
                      : `${unit.levels.length - unit.completedCount} lessons left`}
                  </span>
                </div>
              </div>

              {/* Boxy Mascot Cheering alongside the Active Unit (Like Duo Owl) */}
              {unit.isCurrent && (
                <div className="my-8 flex items-center gap-3.5 rounded-3xl border-2 border-primary/30 bg-primary-soft/50 p-3.5 shadow-card">
                  <div
                    onClick={() => {
                      playPop(settings.soundEnabled);
                      setBoxySpeechIndex((prev) => (prev + 1) % BOXY_CHEERS.length);
                    }}
                    role="button"
                    tabIndex={0}
                    className="cursor-pointer shrink-0 transition-transform hover:scale-105 active:scale-95"
                    aria-label="Boxy Mascot"
                  >
                    <img
                      src={mascot}
                      alt="Boxy"
                      className="size-16 animate-bob object-contain drop-shadow"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-primary-deep">
                      <Sparkles className="size-3" />
                      <span>Boxy Mascot</span>
                    </div>
                    <p className="mt-0.5 font-display text-sm font-bold text-foreground leading-snug">
                      &ldquo;{BOXY_CHEERS[boxySpeechIndex]}&rdquo;
                    </p>
                    <span className="text-[10px] font-bold text-muted-foreground">Tap Boxy for cheers!</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Duolingo "CONTINUE JOURNEY" Action Button */}
        <div className="sticky bottom-4 z-20 mx-auto max-w-sm px-2">
          <button
            type="button"
            onClick={() => startLevel(Math.min(currentProgress, total - 1))}
            className="press flex w-full items-center justify-center gap-2 rounded-3xl bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#3c8c02] py-3.5 font-display text-base font-black uppercase tracking-wider text-white shadow-pop active:translate-y-1 active:border-b-0 hover:brightness-105"
          >
            <Play className="size-5 fill-current" />
            <span>
              {currentProgress === 0
                ? "Start Journey"
                : `Continue Level ${Math.min(currentProgress + 1, total)}`}
            </span>
          </button>
        </div>
      </Screen>

      {/* DUOLINGO GUIDEBOOK MODAL (Opened from Unit Banner) */}
      {selectedGuidebookUnit && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedGuidebookUnit(null)}
        >
          <div
            className="relative w-full max-w-md max-h-[85dvh] overflow-y-auto rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                playPop(settings.soundEnabled);
                setSelectedGuidebookUnit(null);
              }}
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="size-4" />
            </button>

            {/* Guidebook Header */}
            <div className="flex items-center gap-2.5">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary-deep">
                <BookOpen className="size-6 text-primary" />
              </span>
              <div>
                <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  Unit {selectedGuidebookUnit.unitIndex + 1} Guidebook
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold text-primary-deep leading-tight mt-0.5">
                  {selectedGuidebookUnit.title}
                </h3>
              </div>
            </div>

            {/* Overview Card */}
            <div className="mt-4 rounded-2xl border-2 border-border bg-secondary/50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Chapter Objective
              </p>
              <p className="mt-1 font-display text-sm font-bold text-foreground">
                {getUnitDescription(selectedGuidebookUnit.title, game.title)}
              </p>
            </div>

            {/* Key Vocabulary Pills */}
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Key Terms & Concepts
              </p>
              <div className="flex flex-wrap gap-1.5">
                {getUnitVocab(selectedGuidebookUnit.title).map((term) => (
                  <span
                    key={term}
                    className="rounded-xl border border-primary/20 bg-primary-soft/60 px-2.5 py-1 text-xs font-bold text-primary-deep"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTA */}
            <button
              type="button"
              onClick={() => {
                const targetIdx = selectedGuidebookUnit.unitIndex;
                setSelectedGuidebookUnit(null);
                scrollToUnit(targetIdx);
                const nextLevel =
                  selectedGuidebookUnit.levels.find((l) => l.globalIndex >= currentProgress) ||
                  selectedGuidebookUnit.levels[0];
                startLevel(nextLevel.globalIndex);
              }}
              className="press mt-6 flex w-full items-center justify-center gap-2 rounded-3xl bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#3c8c02] py-3.5 font-display text-base font-black uppercase tracking-wider text-white shadow-card hover:brightness-105 active:translate-y-1 active:border-b-0"
            >
              <Play className="size-4.5 fill-current stroke-[2.5]" />
              <span>Jump into Unit Lessons</span>
            </button>
          </div>
        </div>
      )}

      {/* DUOLINGO NODE POPUP CARD (Appears only when tapping a stone) */}
      {selectedNodeIndex !== null && selectedLevel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setSelectedNodeIndex(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in text-foreground"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                playPop(settings.soundEnabled);
                setSelectedNodeIndex(null);
              }}
              className="absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="size-4" />
            </button>

            {/* Level Icon & Header */}
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary-deep">
                {selectedNodeIndex < currentProgress ? (
                  <Check className="size-6 text-primary" strokeWidth={3.5} />
                ) : (
                  <Play className="size-6 fill-primary text-primary" />
                )}
              </span>
              <div>
                <span className="inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  {KIND_META[selectedLevel.kind]?.label || "Quest"} · Level {selectedNodeIndex + 1}
                </span>
                <h3 className="font-display text-base sm:text-lg font-bold text-primary-deep leading-tight mt-0.5">
                  {selectedLevel.title}
                </h3>
              </div>
            </div>

            {/* Reward Pill */}
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-secondary/80 p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary-deep">
                <Zap className="size-4 text-sky fill-sky" />
                <span>+{selectedLevel.xp} XP</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-sun-foreground">
                <Coin className="size-4" />
                <span>+20 Coins</span>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-black",
                  selectedNodeIndex < currentProgress
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-amber-400/20 text-amber-700 dark:text-amber-400",
                )}
              >
                {selectedNodeIndex < currentProgress ? "Cleared ✓" : "Up Next"}
              </span>
            </div>

            {/* Big 3D Duolingo Action Button */}
            <button
              type="button"
              onClick={() => startLevel(selectedNodeIndex)}
              className="press mt-5 flex w-full items-center justify-center gap-2 rounded-3xl bg-[#58cc02] hover:bg-[#46a302] border-b-4 border-[#3c8c02] py-3.5 font-display text-base font-black uppercase tracking-wider text-white shadow-card hover:brightness-105 active:translate-y-1 active:border-b-0"
            >
              {selectedNodeIndex < currentProgress ? (
                <>
                  <RotateCcw className="size-4.5 stroke-[2.5]" />
                  <span>Practice Level (+{selectedLevel.xp} XP)</span>
                </>
              ) : (
                <>
                  <Play className="size-4.5 fill-current stroke-[2.5]" />
                  <span>Start Level (+{selectedLevel.xp} XP)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* PAPER QUIZ RUNNER */}
      {playingLevelIndex !== null && activeLevel && !victoryModal && isPaperQuiz && (
        <QuizPlayer
          puzzle={activeLevel.gameData as Extract<NonNullable<typeof activeLevel.gameData>, { type: "quiz" }>}
          onComplete={(xp, coins) => handleFinishLevel(xp, coins)}
          onClose={() => setPlayingLevelIndex(null)}
        />
      )}

      {/* EMBEDDED LEVEL PLAYER MODAL */}
      {playingLevelIndex !== null && activeLevel && !victoryModal && !isPaperQuiz && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/60 backdrop-blur-md animate-in fade-in duration-200 ${
            activeLevel.gameData?.type === "crossword" ? "p-0 sm:p-5" : "overflow-y-auto p-3 sm:p-5"
          }`}
        >
          <div
            className={`relative w-full overflow-y-auto rounded-4xl border-2 border-border bg-card shadow-float animate-pop-in overscroll-contain my-auto flex flex-col min-h-0 ${
              activeLevel.gameData?.type === "crossword"
                ? "max-w-lg h-[min(100dvh,100svh)] max-h-[min(100dvh,100svh)] sm:h-auto sm:max-h-[calc(100dvh-1.5rem)] p-3 sm:p-6"
                : activeLevel.gameData?.type === "quiz" && activeLevel.gameData.questions[0]?.lessonBody
                  ? "max-w-[380px] h-[min(90dvh,720px)] max-h-[calc(100dvh-1.5rem)] overflow-hidden p-0"
                : "max-w-sm sm:max-w-lg max-h-[calc(100dvh-1.5rem)] p-4 sm:p-6"
            }`}
            style={
              activeLevel.gameData?.type === "wordsearch"
                ? { overscrollBehavior: "contain" }
                : undefined
            }
          >
            <button
              type="button"
              onClick={() => setPlayingLevelIndex(null)}
              className="absolute top-4 right-4 z-10 grid size-8 place-items-center rounded-full bg-muted/80 text-muted-foreground hover:text-foreground transition-all"
            >
              <X className="size-4" />
            </button>

            {/* Word Search */}
            {activeLevel.gameData?.type === "wordsearch" && (
              <WordSearchPlayer
                puzzle={activeLevel.gameData}
                onComplete={(xp, coins) => handleFinishLevel(xp, coins)}
                onClose={() => setPlayingLevelIndex(null)}
              />
            )}

            {/* Crossword */}
            {activeLevel.gameData?.type === "crossword" && (
              <CrosswordPlayer
                puzzle={activeLevel.gameData}
                onComplete={(xp, coins) => handleFinishLevel(xp, coins)}
                onClose={() => setPlayingLevelIndex(null)}
              />
            )}

            {/* Quiz */}
            {activeLevel.gameData?.type === "quiz" && (
              <QuizPlayer
                puzzle={activeLevel.gameData}
                onComplete={(xp, coins) => handleFinishLevel(xp, coins)}
                onClose={() => setPlayingLevelIndex(null)}
              />
            )}

            {/* Cryptogram */}
            {activeLevel.gameData?.type === "cryptogram" && (
              <CryptogramPlayer
                puzzle={activeLevel.gameData}
                onComplete={(xp, coins) => handleFinishLevel(xp, coins)}
                onClose={() => setPlayingLevelIndex(null)}
              />
            )}

            {/* Activity */}
            {activeLevel.gameData?.type === "activity" && (
              <SpecialActivitiesPlayer
                activity={activeLevel.gameData}
                onComplete={(xp, coins) => handleFinishLevel(xp, coins)}
                onClose={() => setPlayingLevelIndex(null)}
              />
            )}

            {/* Fallback Legacy Lesson */}
            {!activeLevel.gameData && activeLevel.kind === "lesson" && (
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
                    onClick={() => handleFinishLevel()}
                    className="press w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
                  >
                    Complete Lesson (+{activeLevel.xp} XP)
                  </button>
                )}
              </div>
            )}

            {/* Fallback Legacy Quiz / Boss */}
            {!activeLevel.gameData && (activeLevel.kind === "quiz" || activeLevel.kind === "boss") && (
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

            {/* Fallback Legacy Sim */}
            {!activeLevel.gameData && activeLevel.kind === "sim" && (
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
                    onClick={() => handleFinishLevel()}
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

      {/* VICTORY LEVEL COMPLETE MODAL */}
      {victoryModal && activeLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 sm:p-6 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in overscroll-contain my-auto text-center">
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
                  +{earnedRewards.xp}
                </p>
              </div>
              <div className="rounded-2xl border-2 border-border bg-sunny p-3">
                <p className="text-[11px] font-bold text-sun-foreground">Coins Added</p>
                <p className="mt-1 flex items-center justify-center gap-1 font-display text-2xl font-bold text-sun-foreground">
                  +{earnedRewards.coins} <Coin className="size-4" />
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
              Continue Journey
            </button>
          </div>
        </div>
      )}

      {!isPaperQuiz && <BottomNav />}
    </>
  );
}
