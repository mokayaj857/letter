import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — Letterbox" },
      {
        name: "description",
        content:
          "Spend your Letterbox coins on stickers, avatars and badges, and watch your savings goal grow.",
      },
      { property: "og:title", content: "Rewards — Letterbox" },
      {
        property: "og:description",
        content: "Stickers, badges and avatars kids unlock with saved coins.",
      },
    ],
  }),
  component: Rewards,
});

const badges = [
  { emoji: "🥇", name: "First Coin", got: true },
  { emoji: "🐷", name: "Piggy Pro", got: true },
  { emoji: "🔥", name: "5 Day Streak", got: true },
  { emoji: "🌱", name: "Little Saver", got: true },
  { emoji: "🎯", name: "Goal Getter", got: false },
  { emoji: "🚀", name: "Super Saver", got: false },
];

const shop = [
  { emoji: "🦕", name: "Dino hat", cost: 120, tint: "bg-primary-soft" },
  { emoji: "🌈", name: "Rainbow frame", cost: 180, tint: "bg-sky" },
  { emoji: "👑", name: "Gold crown", cost: 300, tint: "bg-sun" },
  { emoji: "🎈", name: "Balloon pet", cost: 250, tint: "bg-berry" },
];

function Rewards() {
  return (
    <>
      <Screen>
        <h1 className="text-3xl font-bold text-primary-deep">Rewards</h1>

        <div className="mt-4 flex items-center gap-3 rounded-3xl border-2 border-border bg-sunny p-4 shadow-card">
          <span className="grid size-14 place-items-center rounded-full bg-card text-3xl">
            🪙
          </span>
          <div>
            <p className="font-display text-2xl font-bold text-sun-foreground">240</p>
            <p className="text-xs font-bold text-sun-foreground/80">
              coins in your box
            </p>
          </div>
        </div>

        <section className="mt-6 rounded-3xl border-2 border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <p className="font-display font-bold">Goal: New football ⚽</p>
            <p className="text-xs font-bold text-muted-foreground">240 / 400</p>
          </div>
          <div className="mt-3 h-5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[60%] rounded-full bg-leaf" />
          </div>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            Only 160 coins to go — you can do it!
          </p>
        </section>

        <h2 className="mt-7 font-display text-xl font-bold text-primary-deep">
          My badges
        </h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {badges.map((b) => (
            <div
              key={b.name}
              className={`flex flex-col items-center gap-1 rounded-3xl border-2 border-border p-3 shadow-card ${
                b.got ? "bg-card" : "bg-muted opacity-70"
              }`}
            >
              <span className="text-3xl">{b.got ? b.emoji : "❔"}</span>
              <span className="text-center text-[11px] font-bold leading-tight">
                {b.name}
              </span>
            </div>
          ))}
        </div>

        <h2 className="mt-7 font-display text-xl font-bold text-primary-deep">
          Coin shop
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {shop.map((item) => {
            const affordable = item.cost <= 240;
            return (
              <div
                key={item.name}
                className="rounded-3xl border-2 border-border bg-card p-3 shadow-card"
              >
                <div
                  className={`grid h-20 place-items-center rounded-2xl text-4xl ${item.tint}`}
                >
                  {item.emoji}
                </div>
                <p className="mt-2 font-display text-sm font-bold">{item.name}</p>
                <button
                  disabled={!affordable}
                  className={`mt-2 flex w-full items-center justify-center gap-1 rounded-2xl px-3 py-2 font-display text-sm font-bold ${
                    affordable
                      ? "bg-primary text-primary-foreground shadow-pop active:translate-y-1 active:shadow-none"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {!affordable && <Lock className="size-3.5" />}
                  {item.cost} 🪙
                </button>
              </div>
            );
          })}
        </div>
      </Screen>
      <BottomNav />
    </>
  );
}
