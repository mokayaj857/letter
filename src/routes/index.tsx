import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Zap, ChevronRight, Lock, Play } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";
import { Coin } from "@/components/Coin";
import mascot from "@/assets/mascot.png";
import { avatars, icons } from "@/assets/icons";
import { games } from "@/data/games";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Letterbox — Money Games for Smart Kids" },
      {
        name: "description",
        content:
          "Letterbox turns financial literacy into a game for ages 10+. Pick a quest, climb the path, earn XP and become money-smart.",
      },
      { property: "og:title", content: "Letterbox — Money Games for Smart Kids" },
      {
        property: "og:description",
        content:
          "Pick a money quest, unlock levels, earn XP and coins. Financial literacy built like your favourite game.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GamesHub,
});

function GamesHub() {
  return (
    <>
      <Screen>
        <header className="flex animate-slide-up items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Welcome back, Amani
            </p>
            <h1 className="text-3xl font-bold text-primary-deep">Choose your quest</h1>
          </div>
          <Link
            to="/profile"
            aria-label="Open profile"
            className="lift grid size-14 place-items-center overflow-hidden rounded-2xl border-2 border-border bg-primary-soft shadow-card hover:-translate-y-0.5 active:scale-95"
          >
            <img
              src={avatars.lion}
              alt="Your lion avatar"
              width={384}
              height={384}
              className="size-11 object-contain"
            />
          </Link>
        </header>

        <div className="mt-4 flex gap-2">
          <Stat
            icon={<Coin className="size-5" />}
            label="1,240"
            sub="coins"
            tint="bg-sun"
            delay={60}
          />
          <Stat
            icon={<Flame className="size-4" />}
            label="12"
            sub="day streak"
            tint="bg-berry"
            delay={120}
          />
          <Stat
            icon={<Zap className="size-4" />}
            label="3,860"
            sub="XP"
            tint="bg-sky"
            delay={180}
          />
        </div>

        <section
          className="mt-5 animate-slide-up overflow-hidden rounded-3xl border-2 border-border bg-leaf p-5 shadow-card"
          style={{ animationDelay: "220ms" }}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-widest text-primary-foreground/75">
                Daily challenge
              </p>
              <p className="mt-1 font-display text-lg font-bold text-primary-foreground">
                Build a KES 5,000 monthly budget
              </p>
              <p className="mt-1 text-sm text-primary-foreground/85">
                Beat it today for +150 XP and keep your streak alive.
              </p>
              <Link
                to="/journey/$gameId"
                params={{ gameId: "budget-boss" }}
                className="press mt-3 inline-block rounded-2xl bg-card px-5 py-2 font-display text-sm font-bold text-primary-deep shadow-pop hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
              >
                Start challenge
              </Link>
            </div>
            <img
              src={mascot}
              alt="Boxy the Letterbox mascot"
              width={768}
              height={768}
              className="size-24 animate-bob object-contain drop-shadow"
            />
          </div>
        </section>

        <div className="mt-7 flex items-baseline justify-between">
          <h2 className="font-display text-xl font-bold text-primary-deep">Games</h2>
          <span className="text-xs font-bold text-muted-foreground">
            {games.filter((g) => !g.locked).length} unlocked
          </span>
        </div>

        <ul className="mt-3 grid grid-cols-2 gap-3">
          {games.map((game, i) => {
            const card = (
              <div
                className={`lift flex h-full flex-col rounded-3xl border-2 border-border p-4 shadow-card ${
                  game.locked
                    ? "bg-muted/60"
                    : "bg-card hover:-translate-y-1 hover:shadow-float active:scale-[0.97]"
                }`}
              >
                <span
                  className={`grid size-14 place-items-center rounded-2xl ${
                    game.locked ? "bg-muted text-muted-foreground" : game.tint
                  }`}
                >
                  {game.locked ? (
                    <Lock className="size-5" />
                  ) : (
                    <img
                      src={game.art}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      width={384}
                      height={384}
                      className="size-11 animate-float-soft object-contain"
                      style={{ animationDelay: `${i * 240}ms` }}
                    />
                  )}
                </span>
                <p className="mt-3 font-display text-base font-bold leading-tight">
                  {game.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs font-semibold text-muted-foreground">
                  {game.blurb}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {game.locked
                      ? `${game.unlockXp} XP to unlock`
                      : `${game.done}/${game.levels.length} levels`}
                  </span>
                  {!game.locked && <Play className="size-4 text-primary" />}
                </div>
                {!game.locked && (
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                      style={{
                        width: `${(game.done / game.levels.length) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            );

            return (
              <li
                key={game.id}
                className="animate-pop-in"
                style={{ animationDelay: `${260 + i * 60}ms` }}
              >
                {game.locked ? (
                  card
                ) : (
                  <Link to="/journey/$gameId" params={{ gameId: game.id }} className="block h-full">
                    {card}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        <Link
          to="/leaderboard"
          className="lift mt-6 flex items-center gap-3 rounded-3xl border-2 border-border bg-card px-4 py-3 shadow-card hover:-translate-y-0.5 hover:shadow-float"
        >
          <span className="grid size-11 place-items-center rounded-2xl bg-sun">
            <img
              src={icons.trophy}
              alt=""
              aria-hidden
              loading="lazy"
              width={384}
              height={384}
              className="size-8 animate-float-soft object-contain"
            />
          </span>
          <span className="flex-1 font-display font-bold">
            You&apos;re #2 in the weekly league
          </span>
          <ChevronRight className="size-5 text-muted-foreground" />
        </Link>
      </Screen>
      <BottomNav />
    </>
  );
}

function Stat({
  icon,
  label,
  sub,
  tint,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  tint: string;
  delay: number;
}) {
  return (
    <div
      className="flex flex-1 animate-slide-up items-center gap-2 rounded-2xl border-2 border-border bg-card px-2 py-2 shadow-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className={`grid size-7 shrink-0 place-items-center rounded-xl ${tint}`}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-display text-sm font-bold leading-none">{label}</span>
        <span className="block text-[10px] font-bold text-muted-foreground">{sub}</span>
      </span>
    </div>
  );
}
