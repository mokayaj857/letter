import { createFileRoute } from "@tanstack/react-router";
import { HelpCircle, Lock } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";
import { Coin } from "@/components/Coin";
import { icons } from "@/assets/icons";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — Letterbox" },
      {
        name: "description",
        content:
          "Spend your Letterbox coins on gear, avatars and badges, and watch your savings goal grow.",
      },
      { property: "og:title", content: "Rewards — Letterbox" },
      {
        property: "og:description",
        content: "Gear, badges and avatars you unlock with saved coins.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Rewards,
});

const badges = [
  { art: icons.badgeMedal, name: "First Coin", got: true },
  { art: icons.badgePiggy, name: "Piggy Pro", got: true },
  { art: icons.badgeFlame, name: "5 Day Streak", got: true },
  { art: icons.badgeSprout, name: "Smart Saver", got: true },
  { art: icons.badgeTarget, name: "Goal Getter", got: false },
  { art: icons.badgeRocket, name: "Super Saver", got: false },
];

const shop = [
  { art: icons.shopDino, name: "Dino hat", cost: 120, tint: "bg-primary-soft" },
  { art: icons.shopRainbow, name: "Rainbow frame", cost: 180, tint: "bg-sky" },
  { art: icons.shopCrown, name: "Gold crown", cost: 300, tint: "bg-sun" },
  { art: icons.shopBalloon, name: "Balloon pet", cost: 250, tint: "bg-berry" },
];

function Rewards() {
  return (
    <>
      <Screen>
        <h1 className="animate-slide-up text-3xl font-bold text-primary-deep">Rewards</h1>

        <div
          className="mt-4 flex animate-slide-up items-center gap-3 rounded-3xl border-2 border-border bg-sunny p-4 shadow-card"
          style={{ animationDelay: "70ms" }}
        >
          <span className="grid size-14 place-items-center rounded-full bg-card">
            <Coin className="size-10 animate-float-soft" />
          </span>
          <div>
            <p className="font-display text-2xl font-bold text-sun-foreground">240</p>
            <p className="text-xs font-bold text-sun-foreground/80">coins in your box</p>
          </div>
        </div>

        <section
          className="mt-6 animate-slide-up rounded-3xl border-2 border-border bg-card p-4 shadow-card"
          style={{ animationDelay: "140ms" }}
        >
          <div className="flex items-center justify-between">
            <p className="font-display font-bold">Goal: New football boots</p>
            <p className="text-xs font-bold text-muted-foreground">240 / 400</p>
          </div>
          <div className="mt-3 h-5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[60%] rounded-full bg-leaf transition-[width] duration-700 ease-out" />
          </div>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            Only 160 coins to go — you can do it!
          </p>
        </section>

        <h2 className="mt-7 font-display text-xl font-bold text-primary-deep">My badges</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {badges.map((b, i) => (
            <div
              key={b.name}
              className={`lift flex animate-pop-in flex-col items-center gap-1 rounded-3xl border-2 border-border p-3 shadow-card hover:-translate-y-1 hover:shadow-float ${
                b.got ? "bg-card" : "bg-muted opacity-70"
              }`}
              style={{ animationDelay: `${180 + i * 55}ms` }}
            >
              {b.got ? (
                <img
                  src={b.art}
                  alt={b.name}
                  loading="lazy"
                  width={384}
                  height={384}
                  className="size-12 object-contain"
                />
              ) : (
                <HelpCircle className="size-12 text-muted-foreground" strokeWidth={1.8} />
              )}
              <span className="text-center text-[11px] font-bold leading-tight">
                {b.name}
              </span>
            </div>
          ))}
        </div>

        <h2 className="mt-7 font-display text-xl font-bold text-primary-deep">Coin shop</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {shop.map((item, i) => {
            const affordable = item.cost <= 240;
            return (
              <div
                key={item.name}
                className="lift animate-pop-in rounded-3xl border-2 border-border bg-card p-3 shadow-card hover:-translate-y-1 hover:shadow-float"
                style={{ animationDelay: `${520 + i * 70}ms` }}
              >
                <div className={`grid h-20 place-items-center rounded-2xl ${item.tint}`}>
                  <img
                    src={item.art}
                    alt={item.name}
                    loading="lazy"
                    width={384}
                    height={384}
                    className="size-16 animate-float-soft object-contain"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                </div>
                <p className="mt-2 font-display text-sm font-bold">{item.name}</p>
                <button
                  disabled={!affordable}
                  className={`press mt-2 flex w-full items-center justify-center gap-1 rounded-2xl px-3 py-2 font-display text-sm font-bold ${
                    affordable
                      ? "bg-primary text-primary-foreground shadow-pop hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {!affordable && <Lock className="size-3.5" />}
                  {item.cost} <Coin className="size-4" />
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
