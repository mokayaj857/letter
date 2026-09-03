import { createFileRoute } from "@tanstack/react-router";
import { Crown } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";
import { Coin } from "@/components/Coin";
import { avatars, type AvatarKey } from "@/assets/icons";
import { useUserStore } from "../lib/userStore";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Star Board — Letterbox" },
      {
        name: "description",
        content:
          "See which players collected the most coins this week on the Letterbox star board.",
      },
      { property: "og:title", content: "Star Board — Letterbox" },
      {
        property: "og:description",
        content: "Weekly coin champions in the Letterbox money game.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Leaderboard,
});

type Kid = { name: string; avatar: AvatarKey; coins: number; me?: boolean };

const baseTop: Kid[] = [
  { name: "Zawadi", avatar: "koala", coins: 480 },
  { name: "Amani", avatar: "lion", coins: 420, me: true },
  { name: "Neema", avatar: "rabbit", coins: 390 },
];

const baseRest: Kid[] = [
  { name: "Juma", avatar: "monkey", coins: 310 },
  { name: "Sifa", avatar: "fox", coins: 280 },
  { name: "Baraka", avatar: "panda", coins: 240 },
  { name: "Imani", avatar: "penguin", coins: 190 },
];

function Leaderboard() {
  const { user } = useUserStore();

  const top: Kid[] = baseTop.map((k) =>
    k.me
      ? { ...k, name: user.name, avatar: user.avatar }
      : k
  );

  const podium = [
    { kid: top[1]!, place: 2, height: "h-24", tone: "bg-primary-soft" },
    { kid: top[0]!, place: 1, height: "h-32", tone: "bg-sun" },
    { kid: top[2]!, place: 3, height: "h-20", tone: "bg-berry" },
  ];

  return (
    <>
      <Screen>
        <h1 className="animate-slide-up text-center text-3xl font-bold text-primary-deep">
          Star Board
        </h1>
        <p className="mt-1 text-center text-sm font-semibold text-muted-foreground">
          This week&apos;s top coin collectors
        </p>

        <div className="mt-6 flex items-end justify-center gap-3 sm:gap-6">
          {podium.map(({ kid, place, height, tone }, i) => (
            <div
              key={kid.name}
              className="flex w-24 sm:w-28 md:w-32 animate-slide-up flex-col items-center"
              style={{ animationDelay: `${i * 110}ms` }}
            >
              {place === 1 && (
                <Crown className="mb-1 size-6 animate-float-soft text-sun" strokeWidth={2.4} />
              )}
              <div className="grid size-14 sm:size-16 place-items-center overflow-hidden rounded-full border-4 border-card bg-card shadow-card">
                <img
                  src={avatars[kid.avatar]}
                  alt={`${kid.name} avatar`}
                  loading="lazy"
                  width={384}
                  height={384}
                  className="size-11 sm:size-12 object-contain"
                />
              </div>
              <p className="mt-1 truncate font-display text-sm font-bold">{kid.name}</p>
              <div
                className={`mt-1 flex w-full ${height} flex-col items-center justify-center rounded-t-3xl border-2 border-b-0 border-border ${tone}`}
              >
                <span className="font-display text-2xl font-bold">{place}</span>
                <span className="flex items-center gap-1 text-xs font-bold">
                  {kid.coins} <Coin className="size-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <ul className="mt-6 space-y-3">
          {baseRest.map((kid, i) => (
            <li
              key={kid.name}
              className={`lift flex animate-slide-up items-center gap-3 rounded-3xl border-2 px-4 py-3 shadow-card hover:-translate-y-0.5 hover:shadow-float ${
                kid.me ? "border-primary bg-primary-soft" : "border-border bg-card"
              }`}
              style={{ animationDelay: `${340 + i * 70}ms` }}
            >
              <span className="w-6 font-display text-lg font-bold text-muted-foreground">
                {i + 4}
              </span>
              <span className="grid size-11 place-items-center overflow-hidden rounded-full bg-secondary">
                <img
                  src={avatars[kid.avatar]}
                  alt={`${kid.name} avatar`}
                  loading="lazy"
                  width={384}
                  height={384}
                  className="size-9 object-contain"
                />
              </span>
              <span className="flex-1 font-display font-bold">{kid.name}</span>
              <span className="flex items-center gap-1 rounded-full bg-sun px-3 py-1 text-xs font-bold text-sun-foreground">
                {kid.coins} <Coin className="size-3.5" />
              </span>
            </li>
          ))}
        </ul>
      </Screen>
      <BottomNav />
    </>
  );
}
