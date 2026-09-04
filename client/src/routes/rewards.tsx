import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { HelpCircle, Lock, Check, Plus, X } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";
import { Coin } from "@/components/Coin";
import { icons } from "@/assets/icons";
import { useUserStore } from "../lib/userStore";
import { toast } from "sonner";
import { playPop, playCoin, playSuccess } from "../lib/audio";

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

const shopItems = [
  { id: "shop-dino", art: icons.shopDino, name: "Dino hat", cost: 120, tint: "bg-primary-soft" },
  { id: "shop-rainbow", art: icons.shopRainbow, name: "Rainbow frame", cost: 180, tint: "bg-sky" },
  { id: "shop-crown", art: icons.shopCrown, name: "Gold crown", cost: 300, tint: "bg-sun" },
  { id: "shop-balloon", art: icons.shopBalloon, name: "Balloon pet", cost: 250, tint: "bg-berry" },
];

function Rewards() {
  const { user, goal, ownedItems, badges, buyShopItem, depositToGoal, settings, auth } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth?.isLoggedIn) {
      navigate({ to: "/signup", replace: true });
    }
  }, [auth?.isLoggedIn, navigate]);

  if (!auth?.isLoggedIn) {
    return null;
  }
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(50);

  const goalPct = Math.min(100, Math.round((goal.current / goal.target) * 100));
  const remaining = Math.max(0, goal.target - goal.current);

  const handleBuy = (itemId: string, name: string, cost: number) => {
    if (user.coins < cost) {
      toast.error(`Need ${cost - user.coins} more coins to purchase ${name}`);
      return;
    }
    const success = buyShopItem(itemId, cost);
    if (success) {
      toast.success(`Purchased ${name}! You can now wear it in Profile.`);
    }
  };

  const handleDeposit = () => {
    if (user.coins < depositAmount) {
      toast.error("Not enough coins to deposit that amount");
      return;
    }
    const success = depositToGoal(depositAmount);
    if (success) {
      setShowDepositModal(false);
      toast.success(`Deposited ${depositAmount} coins into your savings goal`);
    }
  };

  return (
    <>
      <Screen>
        <h1 className="animate-slide-up text-3xl font-bold text-primary-deep">Rewards</h1>

        <div
          className="mt-4 flex animate-slide-up items-center justify-between rounded-3xl border-2 border-border bg-sunny p-4 shadow-card"
          style={{ animationDelay: "70ms" }}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-14 place-items-center rounded-full bg-card">
              <Coin className="size-10 animate-float-soft" />
            </span>
            <div>
              <p className="font-display text-2xl font-bold text-sun-foreground">
                {user.coins.toLocaleString()}
              </p>
              <p className="text-xs font-bold text-sun-foreground/80">coins in your box</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playPop(settings.soundEnabled);
              setShowDepositModal(true);
            }}
            className="press flex items-center gap-1.5 rounded-2xl bg-card px-3.5 py-2 font-display text-xs font-bold text-primary-deep shadow hover:-translate-y-0.5 active:scale-95 transition-transform"
          >
            <Plus className="size-3.5" />
            <span>Deposit</span>
          </button>
        </div>

        {/* Savings Goal Progress */}
        <section
          className="mt-6 animate-slide-up rounded-3xl border-2 border-border bg-card p-4 shadow-card"
          style={{ animationDelay: "140ms" }}
        >
          <div className="flex items-center justify-between">
            <p className="font-display font-bold">Goal: {goal.title}</p>
            <p className="text-xs font-bold text-muted-foreground">
              {goal.current} / {goal.target}
            </p>
          </div>
          <div className="mt-3 h-5 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-leaf transition-[width] duration-700 ease-out"
              style={{ width: `${goalPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-semibold text-muted-foreground">
            {remaining > 0
              ? `Only ${remaining} coins to go — you can do it!`
              : "Goal reached! Congratulations on your disciplined savings!"}
          </p>
        </section>

        {/* Badges Grid */}
        <h2 className="mt-7 font-display text-xl font-bold text-primary-deep">My badges</h2>
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {badges.map((b, i) => {
            const artSrc = icons[b.artKey as keyof typeof icons] || icons.badgeMedal;

            return (
              <div
                key={b.name}
                className={`lift flex animate-pop-in flex-col items-center gap-1 rounded-3xl border-2 border-border p-3 shadow-card hover:-translate-y-1 hover:shadow-float ${
                  b.got ? "bg-card" : "bg-muted opacity-70"
                }`}
                style={{ animationDelay: `${180 + i * 55}ms` }}
              >
                {b.got ? (
                  <img
                    src={artSrc}
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
            );
          })}
        </div>

        {/* Coin Shop */}
        <h2 className="mt-7 font-display text-xl font-bold text-primary-deep">Coin shop</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {shopItems.map((item, i) => {
            const isOwned = ownedItems.includes(item.id);
            const affordable = item.cost <= user.coins;

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
                  type="button"
                  disabled={isOwned || !affordable}
                  onClick={() => handleBuy(item.id, item.name, item.cost)}
                  className={`press mt-2 flex w-full items-center justify-center gap-1 rounded-2xl px-3 py-2 font-display text-sm font-bold transition-all ${
                    isOwned
                      ? "border border-primary bg-primary-soft text-primary-deep"
                      : affordable
                        ? "bg-primary text-primary-foreground shadow-pop hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isOwned ? (
                    <>
                      <Check className="size-4" strokeWidth={3} />
                      <span>Owned</span>
                    </>
                  ) : (
                    <>
                      {!affordable && <Lock className="size-3.5" />}
                      <span>{item.cost}</span>
                      <Coin className="size-4 ml-0.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </Screen>

      {/* MODAL: Deposit Coins to Goal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in overscroll-contain my-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-primary-deep">
                Deposit to Savings
              </h2>
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border-2 border-border bg-muted/30 p-4 text-center">
                <p className="text-xs font-bold text-muted-foreground">Target Goal</p>
                <p className="font-display text-base font-bold text-primary-deep mt-0.5">
                  {goal.title}
                </p>
                <p className="text-xs font-semibold text-muted-foreground mt-1">
                  Current: {goal.current} / {goal.target} coins
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary-deep ml-1">
                  Choose Deposit Amount
                </label>
                <div className="mt-1.5 grid grid-cols-4 gap-2">
                  {[25, 50, 100, 200].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt)}
                      className={`rounded-2xl border-2 py-2 font-display text-xs font-bold transition-all ${
                        depositAmount === amt
                          ? "border-primary bg-primary-soft text-primary-deep"
                          : "border-border bg-card text-foreground"
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleDeposit}
                className="press w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
              >
                Deposit {depositAmount} Coins
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}
