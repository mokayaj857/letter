import { useEffect, useState, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Zap,
  Check,
  Globe,
  Briefcase,
  Lightbulb,
  Wallet,
  PiggyBank,
  TrendingUp,
  Coins,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import mascot from "@/assets/mascot.png";
import { gameArt, icons } from "@/assets/icons";
import { useUserStore } from "@/lib/userStore";
import { playPop, playSuccess } from "@/lib/audio";
import { triggerConfetti } from "@/lib/confetti";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SLIDE_DURATION_MS = 6200;

interface PillarSlide {
  id: string;
  kicker: string;
  badge: string;
  badgeIcon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  art: string;
  artAlt: string;
  linkTo?: string;
  isComingSoon?: boolean;
  theme: {
    bg: string;
    kickerColor: string;
    badgeBg: string;
    buttonBg: string;
    buttonText: string;
    glowColor: string;
    pedestalBg: string;
  };
}

export function QuestSpotlight({
  xp,
  soundEnabled,
}: {
  xp?: number;
  soundEnabled?: boolean;
}) {
  const { user, settings, dailyChallenge, completeDailyChallenge } = useUserStore();
  const isSoundOn = soundEnabled ?? settings.soundEnabled;
  const navigate = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const isDailyCompleted = !!dailyChallenge?.completed;

  // Curated slides: Daily Challenge + All 7 Pillars of Money (Preserving original theme colors)
  const slides: PillarSlide[] = [
    {
      id: "daily-budget",
      kicker: "Daily challenge",
      badge: isDailyCompleted ? "Completed" : "+150 XP",
      badgeIcon: isDailyCompleted ? Check : Zap,
      title: "Build a KES 5,000 monthly budget",
      description: "Beat it today for +150 XP and keep your streak alive.",
      buttonText: isDailyCompleted ? "Completed today" : "Start challenge",
      art: mascot,
      artAlt: "Boxy the Letterbox mascot",
      theme: {
        bg: "bg-leaf text-primary-foreground",
        kickerColor: "text-primary-foreground/80",
        badgeBg: "bg-primary-foreground/18 text-primary-foreground border border-primary-foreground/20",
        buttonBg: "bg-card text-primary-deep shadow-pop",
        buttonText: "text-primary-deep",
        glowColor: "bg-primary-foreground/20",
        pedestalBg: "bg-card/20 border border-white/20",
      },
    },
    {
      id: "money-basics",
      kicker: "Pillar 1 · Basics",
      badge: "Foundations",
      badgeIcon: Coins,
      title: "Coins, Notes & M-Pesa",
      description: "Learn how Kenyan currency works, security features, and digital cash.",
      buttonText: "Explore Basics",
      art: gameArt["money-basics"],
      artAlt: "Money Basics",
      linkTo: "/journey/money-basics",
      theme: {
        bg: "bg-sunny text-sun-foreground",
        kickerColor: "text-sun-foreground/80",
        badgeBg: "bg-sun-foreground/12 text-sun-foreground border border-sun-foreground/15",
        buttonBg: "bg-card text-sun-foreground shadow-pop-sun",
        buttonText: "text-sun-foreground",
        glowColor: "bg-sun/40",
        pedestalBg: "bg-card/20 border border-sun-foreground/15",
      },
    },
    {
      id: "global-money",
      kicker: "Pillar 2 · Global",
      badge: "World Trade",
      badgeIcon: Globe,
      title: "Currencies of the World",
      description: "Travel through Africa, Europe, Asia and America across trade history.",
      buttonText: "Trade Globally",
      art: gameArt["digital-money"],
      artAlt: "Global Money",
      linkTo: "/journey/global-money",
      theme: {
        bg: "bg-sky text-sky-foreground",
        kickerColor: "text-sky-foreground/80",
        badgeBg: "bg-sky-foreground/12 text-sky-foreground border border-sky-foreground/15",
        buttonBg: "bg-card text-sky-foreground shadow-pop",
        buttonText: "text-sky-foreground",
        glowColor: "bg-card/40",
        pedestalBg: "bg-card/20 border border-sky-foreground/15",
      },
    },
    {
      id: "earning",
      kicker: "Pillar 3 · Earning",
      badge: "Pay Day",
      badgeIcon: Briefcase,
      title: "Wages, Hustles & Careers",
      description: "Discover how skills create value and explore high-demand careers.",
      buttonText: "Start Earning",
      art: gameArt["smart-spender"],
      artAlt: "Earning",
      linkTo: "/journey/earning",
      theme: {
        bg: "bg-leaf text-primary-foreground",
        kickerColor: "text-primary-foreground/80",
        badgeBg: "bg-primary-foreground/18 text-primary-foreground border border-primary-foreground/20",
        buttonBg: "bg-card text-primary-deep shadow-pop",
        buttonText: "text-primary-deep",
        glowColor: "bg-primary-foreground/20",
        pedestalBg: "bg-card/20 border border-white/20",
      },
    },
    {
      id: "entrepreneurship",
      kicker: "Pillar 4 · Founder",
      badge: "Founder Mode",
      badgeIcon: Lightbulb,
      title: "Pitch, Profit & Mini-Business",
      description: "Build a venture like a Jua Kali founder and calculate profit margins.",
      buttonText: "Founder Quest",
      art: gameArt["young-hustler"],
      artAlt: "Entrepreneurship",
      isComingSoon: true,
      theme: {
        bg: "bg-sunny text-sun-foreground",
        kickerColor: "text-sun-foreground/80",
        badgeBg: "bg-sun-foreground/12 text-sun-foreground border border-sun-foreground/15",
        buttonBg: "bg-card text-sun-foreground shadow-pop-sun",
        buttonText: "text-sun-foreground",
        glowColor: "bg-sun/40",
        pedestalBg: "bg-card/20 border border-sun-foreground/15",
      },
    },
    {
      id: "budgeting",
      kicker: "Pillar 5 · Budgeting",
      badge: "Spend Smart",
      badgeIcon: Wallet,
      title: "The 50 · 30 · 20 Budget Rule",
      description: "Balance Needs, Wants, and Savings so pocket money never runs out.",
      buttonText: "Master Budget",
      art: gameArt["budget-boss"],
      artAlt: "Budgeting",
      linkTo: "/journey/budgeting",
      theme: {
        bg: "bg-leaf text-primary-foreground",
        kickerColor: "text-primary-foreground/80",
        badgeBg: "bg-primary-foreground/18 text-primary-foreground border border-primary-foreground/20",
        buttonBg: "bg-card text-primary-deep shadow-pop",
        buttonText: "text-primary-deep",
        glowColor: "bg-primary-foreground/20",
        pedestalBg: "bg-card/20 border border-white/20",
      },
    },
    {
      id: "saving",
      kicker: "Pillar 6 · Saving",
      badge: "Future You",
      badgeIcon: PiggyBank,
      title: "Piggy Vaults & Teen Accounts",
      description: "Unlock compounding power and build deposits for your personal goals.",
      buttonText: "Grow Savings",
      art: gameArt["save-invest"],
      artAlt: "Saving",
      linkTo: "/journey/saving",
      theme: {
        bg: "bg-sky text-sky-foreground",
        kickerColor: "text-sky-foreground/80",
        badgeBg: "bg-sky-foreground/12 text-sky-foreground border border-sky-foreground/15",
        buttonBg: "bg-card text-sky-foreground shadow-pop",
        buttonText: "text-sky-foreground",
        glowColor: "bg-card/40",
        pedestalBg: "bg-card/20 border border-sky-foreground/15",
      },
    },
    {
      id: "investing",
      kicker: "Pillar 7 · Investing",
      badge: "Grow Wealth",
      badgeIcon: TrendingUp,
      title: "Shares, NSE & Compound Growth",
      description: "Put your money to work in the capital markets while you sleep.",
      buttonText: "Start Investing",
      art: icons.badgeRocket,
      artAlt: "Investing",
      linkTo: "/journey/investing",
      theme: {
        bg: "bg-berry text-berry-foreground",
        kickerColor: "text-berry-foreground/85",
        badgeBg: "bg-berry-foreground/18 text-berry-foreground border border-berry-foreground/20",
        buttonBg: "bg-card text-primary-deep shadow-pop",
        buttonText: "text-primary-deep",
        glowColor: "bg-berry-foreground/15",
        pedestalBg: "bg-card/20 border border-white/20",
      },
    },
  ];

  // Auto-dissolve timer (Appear & Disappear without track sliding)
  useEffect(() => {
    if (isPaused) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    startTimeRef.current = Date.now() - (progress / 100) * SLIDE_DURATION_MS;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min(100, (elapsed / SLIDE_DURATION_MS) * 100);
      setProgress(pct);

      if (pct >= 100) {
        setActiveIndex((prev) => (prev + 1) % slides.length);
        setProgress(0);
        startTimeRef.current = Date.now();
      } else {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeIndex, isPaused, slides.length]);

  const handleDotClick = (index: number) => {
    playPop(isSoundOn);
    setActiveIndex(index);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPop(isSoundOn);
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPop(isSoundOn);
    setActiveIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  const handleActionClick = (slide: PillarSlide) => {
    playPop(isSoundOn);

    if (slide.id === "daily-budget") {
      if (!isDailyCompleted) {
        completeDailyChallenge(150, 40);
        playSuccess(isSoundOn);
        triggerConfetti();
        toast.success("Daily Challenge Complete! +150 XP & +40 Coins awarded!");
      }
      navigate({ to: "/journey/budgeting" });
      return;
    }

    if (slide.isComingSoon) {
      toast.info("Entrepreneurship quest is coming soon!");
      return;
    }

    if (slide.linkTo) {
      navigate({ to: slide.linkTo as any });
    }
  };

  return (
    <section
      aria-label="Pillars of Money spotlight"
      className="mt-5 animate-slide-up select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="relative min-h-[174px] w-full">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const BadgeIcon = slide.badgeIcon;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={cn(
                "relative overflow-hidden rounded-3xl border-2 border-border p-4 sm:p-5 shadow-card transition-all duration-500 ease-out",
                slide.theme.bg,
                isActive
                  ? "relative z-10 opacity-100 scale-100 pointer-events-auto translate-y-0"
                  : "absolute inset-0 z-0 opacity-0 scale-[0.98] pointer-events-none translate-y-1",
              )}
            >
              {/* Soft Ambient Light Glows */}
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -right-10 -top-10 size-44 rounded-full blur-3xl",
                  slide.theme.glowColor,
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "pointer-events-none absolute -bottom-10 -left-10 size-36 rounded-full blur-3xl",
                  slide.theme.glowColor,
                )}
              />

              {/* Top Row: Kicker & Clean Badge */}
              <div className="relative flex items-center justify-between gap-2">
                <p
                  className={cn(
                    "flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.16em]",
                    slide.theme.kickerColor,
                  )}
                >
                  {slide.kicker}
                </p>

                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-black",
                      slide.theme.badgeBg,
                    )}
                  >
                    <BadgeIcon className="size-3" />
                    {slide.badge}
                  </span>

                  {/* Quick navigation arrows on desktop/tablet */}
                  <div className="hidden sm:flex items-center gap-0.5 ml-1">
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous slide"
                      className="press grid size-6 place-items-center rounded-lg bg-card/20 hover:bg-card/40 transition-colors"
                    >
                      <ChevronLeft className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next slide"
                      className="press grid size-6 place-items-center rounded-lg bg-card/20 hover:bg-card/40 transition-colors"
                    >
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Main Content & Dedicated Art Showcase Row */}
              <div className="relative mt-2.5 flex items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1 pr-1">
                  <h3 className="font-display text-lg sm:text-xl font-bold leading-tight tracking-tight">
                    {slide.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs sm:text-[13px] font-semibold leading-snug opacity-90">
                    {slide.description}
                  </p>

                  {/* Primary Action Button */}
                  <div className="mt-3.5">
                    <button
                      type="button"
                      onClick={() => handleActionClick(slide)}
                      className={cn(
                        "press inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 font-display text-xs font-bold transition-transform hover:-translate-y-0.5 active:scale-95",
                        slide.theme.buttonBg,
                        slide.theme.buttonText,
                      )}
                    >
                      {slide.id === "daily-budget" && isDailyCompleted ? (
                        <>
                          <Check className="size-3.5" strokeWidth={3} />
                          <span>{slide.buttonText}</span>
                        </>
                      ) : (
                        <>
                          <span>{slide.buttonText}</span>
                          <ArrowRight className="size-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Dedicated Artwork Pedestal Stage (Cleanly placed, 100% visible, no logo overlays) */}
                <div className="relative shrink-0 flex items-center justify-center">
                  <div
                    className={cn(
                      "relative grid size-20 sm:size-24 place-items-center rounded-3xl p-2 ring-1 ring-white/25 shadow-inner backdrop-blur-xs",
                      slide.theme.pedestalBg,
                    )}
                  >
                    <img
                      src={slide.art}
                      alt={slide.artAlt}
                      loading="eager"
                      width={384}
                      height={384}
                      className="size-16 sm:size-20 animate-float-soft object-contain drop-shadow-md select-none pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Subtle Auto-Dissolve Timer Progress Bar */}
              <div className="relative mt-3 h-1 overflow-hidden rounded-full bg-card/25">
                <div
                  className="h-full rounded-full bg-card transition-none"
                  style={{ width: `${isActive ? progress : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Indicator Dots (All Pillars + Daily Challenge) */}
      <div className="mt-2.5 flex items-center justify-center gap-1.5">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            aria-label={`Go to ${slide.kicker}`}
            onClick={() => handleDotClick(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === activeIndex
                ? "w-6 bg-primary"
                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60",
            )}
          />
        ))}
      </div>
    </section>
  );
}
