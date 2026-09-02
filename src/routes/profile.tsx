import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ChevronRight, ShieldCheck, Users, Volume2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";
import { avatars, avatarList } from "@/assets/icons";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Letterbox" },
      {
        name: "description",
        content:
          "Your Letterbox profile: avatar, coins, XP, streak and badges.",
      },
      { property: "og:title", content: "My Profile — Letterbox" },
      {
        property: "og:description",
        content: "Kid profile with avatar picker, progress stats and parent zone.",
      },
    ],
  }),
  component: Profile,
});



const settings = [
  { Icon: Volume2, label: "Sounds & music" },
  { Icon: Bell, label: "Reminders" },
  { Icon: Users, label: "Grown-up zone" },
  { Icon: ShieldCheck, label: "Safety & privacy" },
];

function Profile() {
  return (
    <>
      <Screen>
        <div className="rounded-3xl border-2 border-border bg-leaf p-5 text-center shadow-card">
          <div className="mx-auto grid size-24 animate-float-soft place-items-center rounded-full border-4 border-card bg-card p-2 shadow-card">
            <img
              src={avatars.lion}
              alt="Your lion avatar"
              width={384}
              height={384}
              className="size-full object-contain"
            />
          </div>
          <h1 className="mt-3 text-2xl font-bold text-primary-foreground">Amani</h1>
          <p className="text-sm font-semibold text-primary-foreground/85">
            Level 12 · Budget Boss
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["1,240", "coins"],
              ["12", "day streak"],
              ["3,860", "XP"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-card/90 py-2">
                <p className="font-display text-lg font-bold text-primary-deep">{v}</p>
                <p className="text-[11px] font-bold text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="mt-7 font-display text-xl font-bold text-primary-deep">
          Pick your avatar
        </h2>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {avatarList.map(([key, src], i) => (
            <button
              key={key}
              type="button"
              aria-label={key}
              className={`press grid aspect-square animate-pop-in place-items-center rounded-3xl border-2 p-2 shadow-card hover:-translate-y-1 active:scale-95 ${
                i === 0 ? "border-primary bg-primary-soft" : "border-border bg-card"
              }`}
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <img
                src={src}
                alt=""
                aria-hidden
                loading="lazy"
                width={384}
                height={384}
                className="size-full object-contain"
              />
            </button>
          ))}
        </div>

        <h2 className="mt-7 font-display text-xl font-bold text-primary-deep">
          Settings
        </h2>
        <ul className="mt-3 space-y-3">
          {settings.map(({ Icon, label }) => (
            <li key={label}>
              <button className="flex w-full items-center gap-3 rounded-3xl border-2 border-border bg-card px-4 py-3 shadow-card">
                <span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary-deep">
                  <Icon className="size-5" strokeWidth={2.4} />
                </span>
                <span className="flex-1 text-left font-display font-bold">
                  {label}
                </span>
                <ChevronRight className="size-5 text-muted-foreground" />
              </button>
            </li>
          ))}
        </ul>

        <Link
          to="/login"
          className="mt-5 block rounded-3xl border-2 border-border bg-card py-3 text-center font-display font-bold text-muted-foreground"
        >
          Log out
        </Link>
      </Screen>
      <BottomNav />
    </>
  );
}
