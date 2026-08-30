import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Lock, Play, Star, Coins, Flame } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";
import mascot from "@/assets/mascot.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Letterbox — Money Adventures for Kids" },
      {
        name: "description",
        content:
          "Letterbox is a playful money journey for ages 5-7: collect coins, unlock islands and learn to save, spend and share.",
      },
      { property: "og:title", content: "Letterbox — Money Adventures for Kids" },
      {
        property: "og:description",
        content:
          "A colourful money journey for little learners. Unlock islands, earn coins and grow your savings streak.",
      },
    ],
  }),
  component: Journey,
});

type Node = {
  title: string;
  emoji: string;
  state: "done" | "current" | "locked";
  tone: "primary" | "sun" | "berry" | "sky";
};

const nodes: Node[] = [
  { title: "What is Money?", emoji: "🪙", state: "done", tone: "primary" },
  { title: "Coins & Notes", emoji: "💵", state: "done", tone: "sun" },
  { title: "Piggy Bank Power", emoji: "🐷", state: "done", tone: "berry" },
  { title: "Needs or Wants?", emoji: "🍎", state: "current", tone: "primary" },
  { title: "Saving Up", emoji: "🏦", state: "locked", tone: "sky" },
  { title: "Sharing Kindly", emoji: "🎁", state: "locked", tone: "sun" },
  { title: "Little Shop", emoji: "🛒", state: "locked", tone: "berry" },
];

const toneRing: Record<Node["tone"], string> = {
  primary: "bg-primary text-primary-foreground",
  sun: "bg-sun text-sun-foreground",
  berry: "bg-berry text-berry-foreground",
  sky: "bg-sky text-sky-foreground",
};

function Journey() {
  return (
    <>
      <Screen>
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Hi, Amani!</p>
            <h1 className="text-3xl font-bold text-primary-deep">Money Island</h1>
          </div>
          <Link
            to="/profile"
            className="grid size-14 place-items-center rounded-full border-4 border-card bg-primary-soft text-2xl shadow-card"
          >
            🦁
          </Link>
        </header>

        <div className="mt-4 flex gap-2">
          <Stat icon={<Coins className="size-4" />} label="240" tint="bg-sun" />
          <Stat icon={<Flame className="size-4" />} label="5 days" tint="bg-berry" />
          <Stat icon={<Star className="size-4" />} label="12" tint="bg-sky" />
        </div>

        <section className="mt-5 overflow-hidden rounded-3xl border-2 border-border bg-leaf p-5 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="font-display text-lg font-bold text-primary-foreground">
                Today&apos;s adventure
              </p>
              <p className="mt-1 text-sm text-primary-foreground/85">
                Help Boxy sort needs and wants at the market!
              </p>
              <button className="mt-3 rounded-2xl bg-card px-5 py-2 font-display text-sm font-bold text-primary-deep shadow-pop active:translate-y-1 active:shadow-none">
                Let&apos;s go
              </button>
            </div>
            <img
              src={mascot}
              alt="Boxy the letterbox mascot holding coins"
              width={768}
              height={768}
              className="size-28 animate-bob object-contain drop-shadow"
            />
          </div>
        </section>

        <h2 className="mt-7 font-display text-xl font-bold text-primary-deep">
          Your path
        </h2>

        <ol className="relative mt-3 dotty pl-2">
          {nodes.map((node, i) => (
            <li
              key={node.title}
              className="flex items-center gap-4 py-3 animate-pop-in"
              style={{
                marginLeft: `${(i % 3) * 28}px`,
                animationDelay: `${i * 60}ms`,
              }}
            >
              <div
                className={`grid size-16 shrink-0 place-items-center rounded-full border-4 border-card text-2xl shadow-card ${
                  node.state === "locked"
                    ? "bg-muted text-muted-foreground"
                    : toneRing[node.tone]
                } ${node.state === "current" ? "animate-wiggle" : ""}`}
              >
                {node.state === "locked" ? <Lock className="size-6" /> : node.emoji}
              </div>
              <div className="min-w-0">
                <p
                  className={`font-display text-base font-bold ${
                    node.state === "locked"
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {node.title}
                </p>
                <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  {node.state === "done" && (
                    <>
                      <Check className="size-3.5" /> Finished
                    </>
                  )}
                  {node.state === "current" && (
                    <>
                      <Play className="size-3.5" /> Play now
                    </>
                  )}
                  {node.state === "locked" && "Locked"}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Screen>
      <BottomNav />
    </>
  );
}

function Stat({
  icon,
  label,
  tint,
}: {
  icon: React.ReactNode;
  label: string;
  tint: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 border-border bg-card py-2 shadow-card">
      <span className={`grid size-6 place-items-center rounded-full ${tint}`}>
        {icon}
      </span>
      <span className="font-display text-sm font-bold">{label}</span>
    </div>
  );
}
