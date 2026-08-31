import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Lock, Play, Star, Swords, Zap } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";
import { getGame, type Level } from "@/data/games";

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
        { name: "description", content: `${game.blurb} Climb the ${game.title} path level by level and earn XP in Letterbox.` },
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

function Journey() {
  const { game } = Route.useLoaderData();
  const total = game.levels.length;
  const pct = Math.round((game.done / total) * 100);

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
          <span className={`grid size-11 place-items-center rounded-2xl text-xl ${game.tint}`}>
            {game.emoji}
          </span>
        </header>

        <section className="mt-4 rounded-3xl border-2 border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-muted-foreground">
              {game.done} of {total} levels cleared
            </span>
            <span className="text-primary-deep">{pct}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-leaf" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 text-sm font-semibold text-muted-foreground">{game.blurb}</p>
        </section>

        <ol className="relative mt-6 dotty pl-2">
          {game.levels.map((level, i) => (
            <li
              key={level.title}
              className="flex items-center gap-4 py-3 animate-pop-in"
              style={{
                marginLeft: `${[0, 34, 60, 34][i % 4]}px`,
                animationDelay: `${i * 55}ms`,
              }}
            >
              <div
                className={`grid size-16 shrink-0 place-items-center rounded-3xl border-4 border-card shadow-card ${
                  level.state === "locked"
                    ? "bg-muted text-muted-foreground"
                    : level.state === "done"
                      ? "bg-primary text-primary-foreground"
                      : "bg-sunny text-sun-foreground animate-wiggle"
                }`}
              >
                {level.state === "locked" ? (
                  <Lock className="size-6" />
                ) : level.state === "done" ? (
                  <Check className="size-7" strokeWidth={3} />
                ) : level.kind === "boss" ? (
                  <Swords className="size-7" strokeWidth={2.6} />
                ) : (
                  <Play className="size-7" strokeWidth={2.6} />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {kindLabel[level.kind]}
                </p>
                <p
                  className={`font-display text-base font-bold leading-tight ${
                    level.state === "locked" ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {level.title}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs font-bold text-muted-foreground">
                  {level.state === "done" ? (
                    <>
                      <Star className="size-3.5" /> Cleared · +{level.xp} XP
                    </>
                  ) : (
                    <>
                      <Zap className="size-3.5" /> {level.xp} XP
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <button className="mt-6 w-full rounded-3xl bg-primary py-4 font-display text-base font-bold text-primary-foreground shadow-pop active:translate-y-1 active:shadow-none">
          {game.done === 0 ? "Start journey" : "Continue journey"}
        </button>
      </Screen>
      <BottomNav />
    </>
  );
}
