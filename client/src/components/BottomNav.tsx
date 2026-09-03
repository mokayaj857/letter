import { Link } from "@tanstack/react-router";
import { Gamepad2, Trophy, Gift, User } from "lucide-react";

const items = [
  { to: "/", label: "Games", Icon: Gamepad2 },
  { to: "/leaderboard", label: "League", Icon: Trophy },
  { to: "/rewards", label: "Rewards", Icon: Gift },
  { to: "/profile", label: "Me", Icon: User },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-md sm:max-w-xl md:max-w-2xl px-3 sm:px-6 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] pointer-events-none">
      <div className="flex items-center justify-between rounded-3xl border-2 border-border bg-card/95 backdrop-blur-md px-2 py-2 shadow-float pointer-events-auto">
        {items.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-muted-foreground transition-transform active:scale-95 hover:text-foreground"
            activeProps={{
              className: "bg-primary-soft text-primary-deep font-bold",
            }}
          >
            <Icon className="size-6" strokeWidth={2.4} aria-hidden />
            <span className="font-display text-[11px] font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
