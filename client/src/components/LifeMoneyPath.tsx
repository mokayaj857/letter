import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Car,
  Coins,
  Dices,
  HeartHandshake,
  Home,
  Lock,
  Scale,
  Star,
  Trophy,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import mascot from "@/assets/mascot.png";
import { avatars, icons } from "@/assets/icons";
import { Coin } from "@/components/Coin";
import { PlayHud } from "@/components/PlayHud";
import type { Level } from "@/data/games";
import { useUserStore } from "@/lib/userStore";
import { cn } from "@/lib/utils";

const TOPIC_META: Record<
  string,
  { icon: LucideIcon; fill: string; ink: string; short: string }
> = {
  "Buying a Car": { icon: Car, fill: "bg-sky", ink: "text-sky-foreground", short: "Buying a Car" },
  "Buying a House": { icon: Home, fill: "bg-leaf", ink: "text-primary-deep", short: "Buying a House" },
  Cryptocurrency: { icon: Coins, fill: "bg-sunny", ink: "text-sun-foreground", short: "Crypto" },
  "Gambling & Sports Betting": { icon: Dices, fill: "bg-berry", ink: "text-berry-foreground", short: "Betting" },
  Philanthropy: { icon: HeartHandshake, fill: "bg-primary-soft", ink: "text-primary-deep", short: "Philanthropy" },
  "Financial Discrimination": { icon: Scale, fill: "bg-sky", ink: "text-sky-foreground", short: "Fair Finance" },
};

const WORLDS = [
  {
    name: "Wheels & Walls",
    motto: "Own the real world",
    keys: ["Buying a Car", "Buying a House"],
  },
  {
    name: "Risk & Hype",
    motto: "Keep your cool",
    keys: ["Cryptocurrency", "Gambling & Sports Betting"],
  },
  {
    name: "Give & Fair",
    motto: "Lift the village",
    keys: ["Philanthropy", "Financial Discrimination"],
  },
];

type Stage = { level: Level; index: number; topic: string; stage: number; stageCount: number };

function topicOf(title: string) {
  return title.split("·")[0]?.trim() ?? title;
}

export function LifeMoneyPath({
  levels,
  progress,
  onPlay,
}: {
  levels: Level[];
  progress: number;
  onPlay: (index: number) => void;
}) {
  const { user } = useUserStore();

  const stages: Stage[] = (() => {
    const counts: Record<string, number> = {};
    for (const level of levels) {
      const t = topicOf(level.title);
      counts[t] = (counts[t] ?? 0) + 1;
    }
    const seen: Record<string, number> = {};
    return levels.map((level, index) => {
      const topic = topicOf(level.title);
      seen[topic] = (seen[topic] ?? 0) + 1;
      return { level, index, topic, stage: seen[topic], stageCount: counts[topic] ?? 1 };
    });
  })();

  const worlds = WORLDS.map((world, wi) => {
    const items = stages.filter((s) => world.keys.includes(s.topic));
    const start = items[0]?.index ?? 0;
    const locked = progress < start;
    const cleared = items.length > 0 && progress > (items.at(-1)?.index ?? 0);
    return { ...world, wi, items, start, locked, cleared };
  }).filter((w) => w.items.length > 0);

      const current = stages[Math.min(progress, stages.length - 1)];
  const firstLocked = worlds.find((w) => w.locked);

  return (
    <div>
      <header className="flex items-center gap-2">
        <Link
          to="/"
          aria-label="Back to games"
          className="flex items-center gap-1 rounded-full border-2 border-border bg-card py-1 pl-1 pr-2 shadow-card active:scale-95"
        >
          <span className="grid size-9 place-items-center rounded-full bg-muted">
            <ArrowLeft className="size-4" />
          </span>
          <img src={avatars[user.avatar]} alt="" className="size-8 rounded-full object-contain" />
        </Link>
        <PlayHud className="min-w-0 flex-1 justify-end" />
      </header>

      <p className="mt-5 text-center font-display text-[11px] font-black uppercase tracking-[0.28em] text-muted-foreground">
        The Life Money Trail
      </p>
      <h1 className="mt-1 text-center font-display text-3xl font-extrabold text-primary-deep">
        Walk the path
      </h1>
      <p className="mx-auto mt-1 max-w-[22rem] text-center text-sm font-semibold text-muted-foreground">
        {progress} of {levels.length} camps cleared. Each stone is a real lesson.
      </p>

      <div className="relative mx-auto mt-8 max-w-[340px] pb-16">
        {worlds
          .filter((world) => !world.locked)
          .map((world) => (
            <OpenWorld
              key={world.name}
              world={world}
              progress={progress}
              currentIndex={current?.index ?? 0}
              onPlay={onPlay}
            />
          ))}
        {firstLocked && (
          <LockedWorld
            world={firstLocked}
            levelNo={firstLocked.wi + 1}
            onContinue={() => onPlay(Math.min(progress, levels.length - 1))}
          />
        )}
      </div>
    </div>
  );
}

function OpenWorld({
  world,
  progress,
  currentIndex,
  onPlay,
}: {
  world: { name: string; motto: string; wi: number; items: Stage[]; cleared: boolean };
  progress: number;
  currentIndex: number;
  onPlay: (index: number) => void;
}) {
  const W = 320;
  const GAP = 108;
  const coords = world.items.map((item, i) => {
    const wave = Math.sin(i * 0.92 + world.wi) * 86;
    return { x: W / 2 + wave, y: 72 + i * GAP, item };
  });
  const height = 72 + Math.max(0, world.items.length - 1) * GAP + 100;
  const d = coords.reduce((acc, c, i) => {
    if (i === 0) return `M ${c.x} ${c.y}`;
    const prev = coords[i - 1];
    const midY = (prev.y + c.y) / 2;
    return `${acc} Q ${prev.x} ${midY}, ${c.x} ${c.y}`;
  }, "");

  return (
    <section className="relative mb-4">
      <div className="mb-3 flex items-center justify-center gap-2">
        <span className="h-px flex-1 bg-primary-soft" />
        <div className="flex items-center gap-2 rounded-2xl bg-foreground px-3 py-1.5 text-card shadow-pop">
          <img src={icons.trophy} alt="" className="size-5 object-contain" />
          <div>
            <p className="font-display text-[9px] font-black uppercase tracking-[0.2em] text-sun">
              Level {world.wi + 1}
            </p>
            <p className="font-display text-sm font-bold leading-none">{world.name}</p>
          </div>
        </div>
        <span className="h-px flex-1 bg-primary-soft" />
      </div>
      <p className="mb-1 text-center text-[12px] font-bold text-muted-foreground">{world.motto}</p>

      <div className="relative mx-auto" style={{ width: W, height }}>
        <svg
          className="pointer-events-none absolute inset-0"
          viewBox={`0 0 ${W} ${height}`}
          width={W}
          height={height}
          aria-hidden
        >
          <path
            d={d}
            fill="none"
            stroke="currentColor"
            className="text-primary-soft"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d={d}
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="3"
            strokeDasharray="7 11"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>

        {coords.map(({ x, y, item }, i) => {
          const state = item.index < progress ? "done" : item.index === progress ? "current" : "locked";
          const isHead = item.stage === 1 || i === 0;
          const meta = TOPIC_META[item.topic] ?? TOPIC_META["Buying a Car"];
          return (
            <div
              key={item.level.title}
              className="absolute z-[1] -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              {item.index === currentIndex && (
                <img
                  src={mascot}
                  alt=""
                  className="absolute -left-14 top-1 size-12 animate-bob object-contain drop-shadow-md"
                />
              )}
              <button
                type="button"
                disabled={state === "locked"}
                onClick={() => onPlay(item.index)}
                className="flex flex-col items-center disabled:cursor-not-allowed"
              >
                <span
                  className={cn(
                    "relative grid place-items-center rounded-full ring-[5px] ring-background transition-transform active:scale-95",
                    isHead ? "size-24" : "size-[62px]",
                    state === "done" && "bg-leaf",
                    state === "current" && cn(meta.fill, "animate-trail-pulse"),
                    state === "locked" && "bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "grid place-items-center rounded-full bg-card shadow-card",
                      isHead ? "size-[70px]" : "size-11",
                      state === "locked" && "bg-muted/80",
                    )}
                  >
                    {state === "locked" ? (
                      <Lock className="size-5 text-muted-foreground" />
                    ) : isHead ? (
                      <meta.icon className={cn("size-8", meta.ink)} strokeWidth={1.7} />
                    ) : (
                      <span className="font-display text-lg font-black text-primary-deep">{item.stage}</span>
                    )}
                  </span>
                  {state !== "locked" && (
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 grid place-items-center rounded-full border-[3px] border-background",
                        isHead ? "size-7" : "size-6",
                        state === "current" ? "bg-sun" : "bg-sun/90",
                      )}
                    >
                      <Star
                        className={cn(
                          "fill-sun-foreground text-sun-foreground",
                          isHead ? "size-3.5" : "size-3",
                        )}
                      />
                    </span>
                  )}
                </span>
                {isHead && (
                  <span
                    className={cn(
                      "mt-2 max-w-[120px] text-center font-display text-[13px] font-bold leading-tight",
                      state === "locked" ? "text-muted-foreground" : "text-foreground",
                    )}
                  >
                    {meta.short}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LockedWorld({
  world,
  levelNo,
  onContinue,
}: {
  world: { name: string; motto: string; keys: string[]; items: Stage[] };
  levelNo: number;
  onContinue: () => void;
}) {
  const heads = world.keys
    .map((key) => world.items.find((s) => s.topic === key && s.stage === 1))
    .filter(Boolean) as Stage[];

  return (
    <section className="relative mt-6">
      <div className="absolute left-1/2 top-0 z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-2xl bg-foreground px-3 py-1.5 text-card shadow-pop">
        <Trophy className="size-4 fill-sun text-sun" />
        <span className="font-display text-[11px] font-black uppercase tracking-[0.16em]">
          Level {levelNo}
        </span>
      </div>
      <div className="rounded-[42px] bg-muted/80 px-6 pb-10 pt-12">
        <p className="text-center font-display text-[11px] font-black uppercase tracking-[0.32em] text-muted-foreground">
          {world.name}
        </p>
        <p className="mt-1 text-center text-xs font-semibold text-muted-foreground">{world.motto}</p>
        <div className="mt-6 flex justify-center gap-8">
          {heads.slice(0, 2).map((head) => {
            const meta = TOPIC_META[head.topic];
            return (
              <div key={head.topic} className="flex flex-col items-center opacity-50">
                <span className="grid size-[84px] place-items-center rounded-full bg-card/70 ring-4 ring-white">
                  <Lock className="size-7 text-muted-foreground" />
                </span>
                <span className="mt-2 max-w-[92px] text-center font-display text-[12px] font-bold text-muted-foreground">
                  {meta?.short ?? head.topic}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="absolute -bottom-4 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-foreground px-4 py-2 font-display text-sm font-bold text-card shadow-float active:scale-95"
      >
        <Coin className="size-4" />
        Earn coins
      </button>
    </section>
  );
}
