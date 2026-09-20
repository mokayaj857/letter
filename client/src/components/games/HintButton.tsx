import React from "react";
import { Lightbulb } from "lucide-react";
import { Coin } from "@/components/Coin";
import { HINT_COST } from "@/lib/hints";
import { useUserStore } from "@/lib/userStore";

interface Props {
  onClick: () => void;
  used?: number;
  disabled?: boolean;
  label?: string;
}

export const HintButton: React.FC<Props> = ({
  onClick,
  used = 0,
  disabled = false,
  label = "Hint",
}) => {
  const { user } = useUserStore();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={`Use a hint for ${HINT_COST} coins (you have ${user.coins})`}
      className="flex items-center gap-1.5 text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 px-2.5 py-1.5 rounded-xl active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none"
    >
      <Lightbulb className="size-3.5 shrink-0" />
      <span>
        {label}
        {used > 0 ? ` (${used})` : ""}
      </span>
      <span className="inline-flex items-center gap-0.5 rounded-lg bg-amber-200/80 dark:bg-amber-900/70 px-1.5 py-0.5 font-black">
        -{HINT_COST}
        <Coin className="size-3" />
      </span>
    </button>
  );
};
