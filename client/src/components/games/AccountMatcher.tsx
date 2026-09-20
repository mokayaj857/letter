import React, { useMemo, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { playPop, playSuccess, playError } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { useUserStore } from "@/lib/userStore";
import { vaultArt, type VaultArtKey } from "@/games/spending-saving/vaultArt";

interface Scenario {
  id: string;
  customer: string;
  art: VaultArtKey | string;
  text: string;
  correctAccount: string;
}

interface Props {
  title: string;
  instruction: string;
  accountTypes: string[];
  scenarios: Scenario[];
  onComplete: (xp: number, coins: number) => void;
}

export const AccountMatcher: React.FC<Props> = ({
  title,
  instruction,
  accountTypes,
  scenarios,
  onComplete,
}) => {
  const { settings } = useUserStore();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);

  const matchedCount = useMemo(
    () => scenarios.filter((s) => answers[s.id] === s.correctAccount).length,
    [answers, scenarios]
  );
  const allDone = scenarios.length > 0 && matchedCount === scenarios.length;
  const sc = scenarios[Math.min(index, Math.max(0, scenarios.length - 1))];
  if (!sc) return null;

  const selected = answers[sc.id] || "";
  const isRight = selected === sc.correctAccount;
  const isWrong = !!selected && !isRight;
  const portrait = vaultArt[sc.art as VaultArtKey] || vaultArt.piggy;

  const pick = (accountName: string) => {
    if (!accountName) return;
    setAnswers((prev) => ({ ...prev, [sc.id]: accountName }));
    if (accountName === sc.correctAccount) {
      playSuccess(settings.soundEnabled);
    } else {
      playError(settings.soundEnabled);
    }
  };

  const goNext = () => {
    playPop(settings.soundEnabled);
    if (index < scenarios.length - 1) {
      setIndex((i) => i + 1);
      return;
    }
    if (allDone) {
      triggerConfetti();
      onComplete(150, 45);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-3 pb-3 border-b border-border/50">
        <img src={vaultArt.piggy} alt="" className="size-11 object-contain" />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold font-display text-foreground leading-tight">
            {title}
          </h2>
          <p className="text-xs font-semibold text-muted-foreground">{instruction}</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary-soft px-3 py-1 font-display text-sm font-bold text-primary-deep">
          {index + 1}/{scenarios.length}
        </span>
      </div>

      <div className="mt-4 flex flex-col items-center text-center px-2">
        <img
          src={portrait}
          alt=""
          className="size-28 object-contain drop-shadow-sm"
        />
        <p className="mt-3 font-display text-sm font-bold text-primary-deep">
          {sc.customer}
        </p>
        <p className="mt-1.5 text-sm font-semibold text-foreground leading-relaxed max-w-sm">
          {sc.text}
        </p>
      </div>

      <label className="mt-5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Matching account
      </label>
      <select
        value={selected}
        onChange={(e) => pick(e.target.value)}
        className="mt-1.5 w-full rounded-2xl border-2 border-border bg-card px-3 py-3 font-display text-sm font-bold text-foreground outline-none focus:border-primary"
      >
        <option value="">Choose one…</option>
        {accountTypes.map((acc) => (
          <option key={acc} value={acc}>
            {acc}
          </option>
        ))}
      </select>

      {isRight && (
        <p className="mt-3 flex items-center gap-2 rounded-2xl bg-primary-soft px-3 py-2.5 text-sm font-bold text-primary-deep">
          <Check className="size-4 shrink-0" strokeWidth={3} />
          {sc.correctAccount}
        </p>
      )}
      {isWrong && (
        <p className="mt-3 rounded-2xl bg-muted px-3 py-2.5 text-sm font-bold text-foreground">
          Not that one. Try again.
        </p>
      )}

      <div className="mt-auto flex gap-2 pt-4">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => {
            playPop(settings.soundEnabled);
            setIndex((i) => Math.max(0, i - 1));
          }}
          className="flex-1 py-3 rounded-2xl border-2 border-border bg-card font-display text-sm font-bold disabled:opacity-35"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!isRight}
          onClick={goNext}
          className="flex-[2] py-3 rounded-2xl bg-primary text-primary-foreground font-display text-sm font-bold shadow-pop disabled:opacity-35 flex items-center justify-center gap-1"
        >
          {index === scenarios.length - 1 && allDone ? "Finish" : "Next"}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
};
