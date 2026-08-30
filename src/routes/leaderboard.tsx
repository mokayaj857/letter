import { createFileRoute } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Star Board — Letterbox" },
      {
        name: "description",
        content:
          "See which little savers collected the most coins this week on the Letterbox star board.",
      },
      { property: "og:title", content: "Star Board — Letterbox" },
      {
        property: "og:description",
        content: "Weekly coin champions in the Letterbox kids money adventure.",
      },
    ],
  }),
  component: Leaderboard,
});

const kids = [
  { name: "Zawadi", avatar: "🐨", coins: 480 },
  { name: "Amani", avatar: "🦁", coins: 420, me: true },
  { name: "Neema", avatar: "🐰", coins: 390 },
  { name: "Juma", avatar: "🐵", coins: 310 },
  { name: "Sifa", avatar: "🦊", coins: 280 },
  { name: "Baraka", avatar: "🐼", coins: 240 },
  { name: "Imani", avatar: "🐧", coins: 190 },
];

const podiumTone = ["bg-sun", "bg-primary-soft", "bg-berry"];

function Leaderboard() {
  const [first, second, third, ...rest] = kids;
  const podium = [second, first, third];

  return (
    <>
      <Screen>
        <h1 className="text-center text-3xl font-bold text-primary-deep">
          Star Board
        </h1>
        <p className="mt-1 text-center text-sm font-semibold text-muted-foreground">
          This week&apos;s top coin collectors 🎉
        </p>

        <div className="mt-6 flex items-end justify-center gap-3">
          {podium.map((kid, i) => {
            const heights = ["h-24", "h-32", "h-20"];
            const places = [2, 1, 3];
            return (
              <div key={kid.name} className="flex w-24 flex-col items-center">
                {places[i] === 1 && (
                  <Crown className="mb-1 size-6 text-sun" strokeWidth={2.4} />
                )}
                <div className="grid size-14 place-items-center rounded-full border-4 border-card bg-card text-2xl shadow-card">
                  {kid.avatar}
                </div>
                <p className="mt-1 truncate font-display text-sm font-bold">
                  {kid.name}
                </p>
                <div
                  className={`mt-1 flex w-full ${heights[i]} flex-col items-center justify-center rounded-t-3xl border-2 border-b-0 border-border ${podiumTone[places[i] - 1]}`}
                >
                  <span className="font-display text-2xl font-bold">
                    {places[i]}
                  </span>
                  <span className="text-xs font-bold">{kid.coins} 🪙</span>
                </div>
              </div>
            );
          })}
        </div>

        <ul className="mt-6 space-y-3">
          {rest.map((kid, i) => (
            <li
              key={kid.name}
              className={`flex items-center gap-3 rounded-3xl border-2 px-4 py-3 shadow-card ${
                kid.me
                  ? "border-primary bg-primary-soft"
                  : "border-border bg-card"
              }`}
            >
              <span className="w-6 font-display text-lg font-bold text-muted-foreground">
                {i + 4}
              </span>
              <span className="grid size-11 place-items-center rounded-full bg-secondary text-xl">
                {kid.avatar}
              </span>
              <span className="flex-1 font-display font-bold">{kid.name}</span>
              <span className="rounded-full bg-sun px-3 py-1 text-xs font-bold text-sun-foreground">
                {kid.coins} 🪙
              </span>
            </li>
          ))}
        </ul>
      </Screen>
      <BottomNav />
    </>
  );
}
