import { Link } from "@tanstack/react-router";
import { ArrowLeft, Star } from "lucide-react";
import { avatars, gameArt, icons } from "@/assets/icons";
import { Coin } from "@/components/Coin";
import { PlayHud } from "@/components/PlayHud";
import type { Level } from "@/data/games";
import { useUserStore } from "@/lib/userStore";
import { cn } from "@/lib/utils";

type Stage = { level: Level; index: number; topic: string };

const TOPICS: {
  key: string;
  label: string;
  art: string;
  ring: string;
}[] = [
  { key: "Buying a Car", label: "Buying a Car", art: gameArt["smart-spender"], ring: "bg-sky" },
  { key: "Buying a House", label: "Buying a House", art: gameArt["save-invest"], ring: "bg-leaf" },
  { key: "Cryptocurrency", label: "Cryptocurrency", art: gameArt["digital-money"], ring: "bg-sunny" },
  { key: "Gambling & Sports Betting", label: "Betting", art: icons.badgeFlame, ring: "bg-berry" },
  { key: "Philanthropy", label: "Philanthropy", art: icons.badgeSprout, ring: "bg-primary-soft" },
  { key: "Financial Discrimination", label: "Fair Finance", art: icons.badgeMedal, ring: "bg-sky" },
];

const CHAPTERS = [
  { label: "Buying", keys: ["Buying a Car", "Buying a House"] },
  { label: "Risk", keys: ["Cryptocurrency", "Gambling & Sports Betting"] },
  { label: "Giving", keys: ["Philanthropy", "Financial Discrimination"] },
];

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

  const stages: Stage[] = levels.map((level, index) => ({
    level,
    index,
    topic: topicOf(level.title),
  }));

  const topicState = TOPICS.map((meta) => {
    const pack = stages.filter((s) => s.topic === meta.key);
    const start = pack[0]?.index ?? 999;
    const next = pack.find((s) => s.index >= progress) ?? pack.at(-1);
    const done = pack.length > 0 && pack.every((s) => s.index < progress);
    const current = pack.some((s) => s.index === progress);
    const locked = progress < start;
    return { ...meta, pack, start, playIndex: next?.index ?? start, done, current, locked };
  }).filter((t) => t.pack.length);

  const chapters = CHAPTERS.map((ch, i) => {
    const items = topicState.filter((t) => ch.keys.includes(t.key));
    const start = items[0]?.start ?? 999;
    return { ...ch, i, items, locked: progress < start };
  }).filter((c) => c.items.length);

  const openChapter = [...chapters].reverse().find((c) => !c.locked) ?? chapters[0];
  const sealed = chapters.find((c) => c.locked);

  const playTopic = (topic: (typeof topicState)[number]) => {
    if (topic.locked) return;
    onPlay(topic.playIndex);
  };

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

      <div className="mx-auto mt-8 flex max-w-[240px] flex-col items-center pb-10">
        {openChapter?.items.map((topic) => (
          <div key={topic.key} className="flex flex-col items-center py-5">
            <SkillOrb
              art={topic.art}
              ring={topic.ring}
              label={topic.label}
              done={topic.done}
              current={topic.current}
              muted={topic.locked || (!topic.current && !topic.done)}
              onClick={() => playTopic(topic)}
            />
          </div>
        ))}

        {sealed && (
          <div className="relative mt-6 w-[min(100%,280px)]">
            <div className="absolute left-1/2 top-0 z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1 rounded-xl bg-foreground px-3 py-1.5 text-card shadow-pop">
              <img src={icons.trophy} alt="" className="size-4 object-contain" />
              <span className="font-display text-[10px] font-black uppercase tracking-[0.18em]">
                Level {sealed.i + 1}
              </span>
            </div>
            <div className="rounded-[40px] bg-muted/90 px-5 pb-8 pt-11">
              <p className="mb-5 text-center font-display text-[11px] font-black uppercase tracking-[0.28em] text-muted-foreground">
                {sealed.label}
              </p>
              <div className="flex justify-center gap-8">
                {sealed.items.map((topic) => (
                  <SkillOrb
                    key={topic.key}
                    art={topic.art}
                    ring="bg-card"
                    label={topic.label}
                    done={false}
                    current={false}
                    muted
                    small
                  />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onPlay(Math.min(progress, levels.length - 1))}
              className="absolute -bottom-4 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-foreground px-3.5 py-2 font-display text-[13px] font-bold text-card shadow-float active:scale-95"
            >
              <Coin className="size-4" />
              Earn coins
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SkillOrb({
  art,
  ring,
  label,
  done,
  current,
  muted,
  small,
  onClick,
}: {
  art: string;
  ring: string;
  label: string;
  done: boolean;
  current: boolean;
  muted?: boolean;
  small?: boolean;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span
        className={cn(
          "relative grid place-items-center rounded-full ring-[6px] ring-background",
          small ? "size-[88px]" : "size-[118px]",
          muted ? "bg-muted" : current || done ? ring : "bg-primary-soft",
          current && "animate-float-soft",
        )}
      >
        <span
          className={cn(
            "grid place-items-center rounded-full bg-card shadow-card",
            small ? "size-[64px]" : "size-[86px]",
            muted && "bg-muted/80",
          )}
        >
          <img
            src={art}
            alt=""
            className={cn(
              "object-contain",
              small ? "size-10" : "size-[54px]",
              muted && "grayscale opacity-50",
            )}
          />
        </span>
        {!muted && (
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 grid place-items-center rounded-full border-[4px] border-background",
              small ? "size-7" : "size-8",
              current || done ? "bg-sun" : "bg-muted",
            )}
          >
            <Star
              className={cn(
                small ? "size-3" : "size-3.5",
                current || done
                  ? "fill-sun-foreground text-sun-foreground"
                  : "fill-muted-foreground text-muted-foreground",
              )}
            />
          </span>
        )}
      </span>
      <span
        className={cn(
          "mt-3 max-w-[140px] text-center font-display font-bold leading-tight",
          small ? "text-[13px]" : "text-[16px]",
          muted ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {label}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="flex flex-col items-center">
        {inner}
      </button>
    );
  }
  return <div className="flex flex-col items-center">{inner}</div>;
}
