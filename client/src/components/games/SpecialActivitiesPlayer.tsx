import React, { useState } from "react";
import { ActivityPuzzle } from "@/games/types";
import { Check, ShoppingBag, Award, Sparkles, ArrowRight, ShieldCheck, DollarSign, Compass } from "lucide-react";
import { playPop, playSuccess, playError } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { useUserStore } from "@/lib/userStore";

interface Props {
  activity: ActivityPuzzle;
  onComplete: (xp: number, coins: number) => void;
  onClose: () => void;
}

export const SpecialActivitiesPlayer: React.FC<Props> = ({
  activity,
  onComplete,
  onClose,
}) => {
  const { settings, user } = useUserStore();

  // Subtype 1: KSh 8,000 School Budget Challenge
  const [selectedItems, setSelectedItems] = useState<{ [category: string]: any }>({});

  // Subtype 2: Account Matcher
  const [matcherAnswers, setMatcherAnswers] = useState<{ [scenarioId: string]: string }>({});

  // Subtype 3: Would You Rather
  const [wyrChoices, setWyrChoices] = useState<{ [scenarioId: string]: "A" | "B" }>({});

  // Subtype 4: Photographer Gig
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  // Subtype 5: Smart Money Pledge
  const [signedPledges, setSignedPledges] = useState<number[]>([]);
  const [signerName, setSignerName] = useState(user?.name || "Money Champion");

  // Subtype 6: Home Treasure Hunt & Practical Activities
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // 1. Budget Challenge Logic
  const categories = activity.config?.categories || [];
  const maxBudget = activity.config?.budget || 8000;
  const currentTotalSpent = Object.values(selectedItems).reduce(
    (acc: number, item: any) => acc + (item?.price || 0),
    0
  );
  const remainingBudget = maxBudget - currentTotalSpent;
  const isBudgetValid =
    remainingBudget >= 0 &&
    categories
      .filter((c: any) => c.required)
      .every((c: any) => !!selectedItems[c.name]);

  const handleFinishBudgetChallenge = () => {
    if (!isBudgetValid) return;
    playSuccess(settings.soundEnabled);
    triggerConfetti();
    onComplete(130, 40);
  };

  // 2. Account Matcher Logic
  const scenarios = activity.config?.scenarios || [];
  const accountTypes = activity.config?.accountTypes || [];
  const isMatcherDone =
    scenarios.length > 0 &&
    scenarios.every((s: any) => matcherAnswers[s.id] === s.correctAccount);

  const handleMatcherSelect = (scenarioId: string, accountName: string) => {
    setMatcherAnswers((prev) => ({ ...prev, [scenarioId]: accountName }));
    playPop(settings.soundEnabled);

    // Check if correct
    const targetScenario = scenarios.find((s: any) => s.id === scenarioId);
    if (targetScenario?.correctAccount === accountName) {
      playSuccess(settings.soundEnabled);
    } else {
      playError(settings.soundEnabled);
    }
  };

  // 3. Would You Rather Logic
  const wyrScenarios = activity.config?.scenarios || [];
  const handleWyrChoice = (id: string, opt: "A" | "B") => {
    setWyrChoices((prev) => ({ ...prev, [id]: opt }));
    playPop(settings.soundEnabled);
  };

  const isWyrDone =
    wyrScenarios.length > 0 &&
    wyrScenarios.every((s: any) => !!wyrChoices[s.id]);

  // 4. Photographer Packages
  const packagesList = activity.config?.packages || activity.config?.pricingOptions || [];

  // 5. Smart Money Pledge Logic
  const pledges = activity.config?.pledges || [];
  const togglePledge = (idx: number) => {
    playPop(settings.soundEnabled);
    setSignedPledges((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };
  const isPledgeReady = signedPledges.length === pledges.length && signerName.trim().length > 0;

  // 6. Practical Steps Logic
  const stepsList = activity.config?.steps || [];
  const toggleStep = (stepIdx: number) => {
    playPop(settings.soundEnabled);
    setCompletedSteps((prev) =>
      prev.includes(stepIdx) ? prev.filter((s) => s !== stepIdx) : [...prev, stepIdx]
    );
  };
  const isStepsDone = stepsList.length > 0 && completedSteps.length === stepsList.length;

  return (
    <div className="flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border/50">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-deep">
            {activity.topic} · Practical Activity
          </span>
          <h2 className="text-base sm:text-lg font-bold font-display text-foreground">
            {activity.title}
          </h2>
        </div>
        <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-primary-deep">
          <Sparkles className="size-4" />
        </span>
      </div>

      <p className="my-2.5 text-xs font-semibold text-muted-foreground leading-relaxed">
        {activity.instruction}
      </p>

      {/* --- SUBTYPE 1: Back to School KSh 8,000 Budget Challenge --- */}
      {activity.subtype === "budget_challenge" && (
        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-1">
          {/* Budget Gauge */}
          <div className="p-3 bg-card border-2 border-border rounded-2xl flex items-center justify-between shadow-xs">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Budget
              </p>
              <p className="font-display text-base font-bold text-foreground">
                KSh {maxBudget.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Total Spent
              </p>
              <p className="font-display text-base font-bold text-primary">
                KSh {currentTotalSpent.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Surplus Savings
              </p>
              <p
                className={`font-display text-base font-bold ${
                  remainingBudget >= 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                KSh {remainingBudget.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2.5 flex-1">
            {categories.map((cat: any) => {
              const options = cat.options || cat.items || [];
              return (
                <div key={cat.name} className="p-3 bg-secondary/40 border border-border/60 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display text-xs font-bold text-foreground">
                      {cat.name} {cat.required && <span className="text-rose-500">*</span>}
                    </span>
                    {selectedItems[cat.name] && (
                      <span className="text-[11px] font-bold text-primary-deep bg-primary-soft/50 px-2 py-0.5 rounded-md">
                        KSh {selectedItems[cat.name].price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {options.map((item: any, itemIdx: number) => {
                      const isSelected = selectedItems[cat.name]?.name === item.name;
                      return (
                        <button
                          key={itemIdx}
                          type="button"
                          onClick={() => {
                            playPop(settings.soundEnabled);
                            setSelectedItems((prev) => ({ ...prev, [cat.name]: item }));
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground font-bold shadow-xs"
                              : "bg-card border border-border/70 text-foreground hover:bg-muted/40"
                          }`}
                        >
                          <span className="truncate pr-2">{item.name}</span>
                          <span className="shrink-0">KSh {item.price.toLocaleString()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!isBudgetValid}
            onClick={handleFinishBudgetChallenge}
            className="press mt-2 w-full rounded-2xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground shadow-pop disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-1"
          >
            Submit Shopping Plan (+130 XP)
          </button>
        </div>
      )}

      {/* --- SUBTYPE 2: 21-Scenario Account Matcher --- */}
      {activity.subtype === "account_matcher" && (
        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-1">
          {scenarios.map((sc: any, sIdx: number) => {
            const currentSelected = matcherAnswers[sc.id];
            const isRight = currentSelected === sc.correctAccount;
            const scenarioText = sc.text || sc.need || "";
            const customerTitle = sc.customer || `Scenario #${sIdx + 1}`;

            return (
              <div
                key={sc.id}
                className={`p-3 rounded-2xl border-2 transition-all ${
                  isRight
                    ? "border-emerald-500 bg-emerald-500/5"
                    : currentSelected
                    ? "border-rose-500/60 bg-rose-500/5"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-display text-xs font-bold text-primary-deep">{customerTitle}</p>
                  {isRight && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="size-3" strokeWidth={3} /> Matched
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground/90 font-medium mt-1 leading-snug">{scenarioText}</p>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {accountTypes.map((acc: string) => (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => handleMatcherSelect(sc.id, acc)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                        currentSelected === acc
                          ? acc === sc.correctAccount
                            ? "bg-emerald-600 border-emerald-600 text-white font-bold"
                            : "bg-rose-600 border-rose-600 text-white font-bold"
                          : "bg-secondary/70 border-border text-foreground hover:border-primary/50"
                      }`}
                    >
                      {acc}
                    </button>
                  ))}
                </div>

                {isRight && sc.explanation && (
                  <p className="mt-2 text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl">
                    💡 {sc.explanation}
                  </p>
                )}
              </div>
            );
          })}

          {isMatcherDone && (
            <button
              type="button"
              onClick={() => {
                playSuccess(settings.soundEnabled);
                triggerConfetti();
                onComplete(150, 45);
              }}
              className="press mt-2 w-full rounded-2xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground shadow-pop active:translate-y-1"
            >
              Complete Account Matcher (+150 XP)
            </button>
          )}
        </div>
      )}

      {/* --- SUBTYPE 3: Would You Rather Mindset --- */}
      {activity.subtype === "would_you_rather" && (
        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-1">
          {wyrScenarios.map((sc: any, idx: number) => {
            const picked = wyrChoices[sc.id];
            const optionA = sc.thisChoice || sc.optionA || "";
            const optionB = sc.thatChoice || sc.optionB || "";

            return (
              <div key={sc.id} className="p-3.5 bg-card border-2 border-border rounded-2xl">
                <p className="text-[11px] font-bold text-muted-foreground uppercase mb-2">
                  Dilemma #{idx + 1}
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleWyrChoice(sc.id, "A")}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      picked === "A"
                        ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                        : "border-border bg-secondary/50 text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <strong>This:</strong> {optionA}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWyrChoice(sc.id, "B")}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      picked === "B"
                        ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                        : "border-border bg-secondary/50 text-foreground hover:bg-muted/40"
                    }`}
                  >
                    <strong>That:</strong> {optionB}
                  </button>
                </div>
              </div>
            );
          })}

          {isWyrDone && (
            <button
              type="button"
              onClick={() => {
                playSuccess(settings.soundEnabled);
                triggerConfetti();
                onComplete(100, 30);
              }}
              className="press mt-2 w-full rounded-2xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground shadow-pop active:translate-y-1"
            >
              Analyze My Mindset (+100 XP)
            </button>
          )}
        </div>
      )}

      {/* --- SUBTYPE 4: Photographer Gig Project --- */}
      {activity.subtype === "photographer_gig" && (
        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-1">
          <div className="p-3 bg-primary-soft/30 border border-primary/20 rounded-2xl">
            <p className="text-xs font-semibold text-foreground">
              Neighborhood Photography Startup: <strong>KSh 0 initial gear cost</strong> (using existing smartphone!)
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Select your service package and calculate profit margin per photoshoot.
            </p>
          </div>

          <div className="space-y-2 flex-1">
            {packagesList.map((pkg: any) => {
              const isSelected = selectedPackage === pkg.id;
              const packageName = pkg.name || pkg.package || "";
              const price = pkg.price || 0;
              const profit = pkg.profit || pkg.estProfit || 0;

              return (
                <div
                  key={pkg.id}
                  onClick={() => {
                    playPop(settings.soundEnabled);
                    setSelectedPackage(pkg.id);
                  }}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-primary bg-card shadow-sm"
                      : "border-border bg-card/60 hover:bg-card"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="font-display text-xs font-bold text-foreground">{packageName}</p>
                    <p className="font-display text-sm font-bold text-primary">KSh {price.toLocaleString()}</p>
                  </div>
                  {pkg.includes && (
                    <p className="mt-1 text-[11px] text-muted-foreground leading-snug">{pkg.includes}</p>
                  )}
                  <div className="mt-2 flex justify-between items-center text-xs font-semibold text-emerald-600">
                    <span>Net Profit</span>
                    <span>+KSh {profit.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {activity.config?.growthSteps && (
            <div className="p-3 bg-secondary/50 rounded-2xl border border-border space-y-1.5">
              <p className="text-[11px] font-bold text-primary-deep uppercase">Marketing & Reinvestment Strategy:</p>
              {activity.config.growthSteps.map((st: string, idx: number) => (
                <p key={idx} className="text-[11px] text-muted-foreground leading-snug">
                  • {st}
                </p>
              ))}
            </div>
          )}

          {selectedPackage && (
            <button
              type="button"
              onClick={() => {
                playSuccess(settings.soundEnabled);
                triggerConfetti();
                onComplete(120, 35);
              }}
              className="press mt-2 w-full rounded-2xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground shadow-pop active:translate-y-1"
            >
              Confirm Pricing Strategy (+120 XP)
            </button>
          )}
        </div>
      )}

      {/* --- SUBTYPE 5: Smart Money Pledge --- */}
      {activity.subtype === "smart_money_pledge" && (
        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-1">
          <div className="p-3.5 bg-sun/10 border-2 border-sun/30 rounded-3xl text-center">
            <Award className="size-8 text-sun mx-auto mb-1" />
            <h3 className="font-display text-sm font-bold text-foreground">
              Letterbox Financial Literacy Certificate
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Confirm your commitments to seal your official pledge:
            </p>
          </div>

          <div className="space-y-2 flex-1">
            {pledges.map((pledge: string, idx: number) => {
              const isChecked = signedPledges.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => togglePledge(idx)}
                  className={`w-full flex items-start gap-2.5 p-3 rounded-2xl border-2 text-left text-xs transition-all ${
                    isChecked
                      ? "border-emerald-500 bg-emerald-500/10 text-foreground font-semibold"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  <span
                    className={`size-5 mt-0.5 rounded-md grid place-items-center shrink-0 border ${
                      isChecked
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-muted-foreground/40 bg-muted"
                    }`}
                  >
                    {isChecked && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <span className="leading-snug">{pledge}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-secondary/50 rounded-2xl border border-border">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Signer Name
            </label>
            <input
              type="text"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              className="w-full bg-card border-2 border-border rounded-xl px-3 py-2 text-xs font-bold text-foreground outline-none focus:border-primary"
            />
          </div>

          <button
            type="button"
            disabled={!isPledgeReady}
            onClick={() => {
              playSuccess(settings.soundEnabled);
              triggerConfetti();
              onComplete(150, 50);
            }}
            className="press mt-2 w-full rounded-2xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground shadow-pop disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-1"
          >
            Sign & Seal Certificate (+150 XP)
          </button>
        </div>
      )}

      {/* --- SUBTYPE 6: Home Treasure Hunt & Step-by-Step Practical Activities --- */}
      {activity.subtype === "home_treasure_hunt" && (
        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto pr-1">
          <div className="space-y-2.5 flex-1">
            {stepsList.map((st: any, idx: number) => {
              const isChecked = completedSteps.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    isChecked
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-primary-deep">
                      Step {st.step || idx + 1}: {st.title}
                    </span>
                    <span
                      className={`size-5 rounded-md grid place-items-center border ${
                        isChecked
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-muted-foreground/40 bg-muted"
                      }`}
                    >
                      {isChecked && <Check className="size-3.5" strokeWidth={3} />}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-snug">{st.description}</p>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!isStepsDone}
            onClick={() => {
              playSuccess(settings.soundEnabled);
              triggerConfetti();
              onComplete(120, 35);
            }}
            className="press mt-2 w-full rounded-2xl bg-primary py-3.5 font-display text-sm font-bold text-primary-foreground shadow-pop disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-1"
          >
            Complete Practical Activity (+120 XP)
          </button>
        </div>
      )}
    </div>
  );
};
