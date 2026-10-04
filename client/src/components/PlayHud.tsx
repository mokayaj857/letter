import { Coin } from "@/components/Coin";
import { Flame, Heart, Zap } from "lucide-react";
import { useUserStore } from "@/lib/userStore";
import { cn } from "@/lib/utils";

export function PlayHud({ className }: { className?: string }) {
  const { user } = useUserStore();

  return (
    <div className={cn("flex items-center justify-end gap-1", className)}>
      <Chip>
        <Coin className="size-4" />
        <span>{user.coins.toLocaleString()}</span>
      </Chip>
      <Chip>
        <Flame className="size-3.5 fill-sun text-sun" />
        <span>{user.streak}</span>
      </Chip>
      <Chip>
        <Heart className="size-3.5 fill-berry text-berry" />
        <span>5</span>
      </Chip>
      <Chip>
        <span className="rounded-md bg-sky px-1 py-px font-black text-[8px] tracking-wide text-sky-foreground">
          XP
        </span>
        <span>{user.xp.toLocaleString()}</span>
      </Chip>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-card px-1.5 py-1 font-display text-[11px] font-extrabold text-foreground">
      {children}
    </div>
  );
}
