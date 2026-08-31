export type Level = {
  title: string;
  kind: "lesson" | "quiz" | "sim" | "boss";
  state: "done" | "current" | "locked";
  xp: number;
};

export type Game = {
  id: string;
  title: string;
  blurb: string;
  emoji: string;
  tint: string;
  locked?: boolean;
  unlockXp?: number;
  done: number;
  levels: Level[];
};

const path = (titles: [string, Level["kind"]][], done: number): Level[] =>
  titles.map(([title, kind], i) => ({
    title,
    kind,
    xp: kind === "boss" ? 150 : kind === "sim" ? 80 : 50,
    state: i < done ? "done" : i === done ? "current" : "locked",
  }));

export const games: Game[] = [
  {
    id: "money-basics",
    title: "Money Basics",
    blurb: "Where money comes from, value and fair trade.",
    emoji: "🪙",
    tint: "bg-sun",
    done: 5,
    levels: path(
      [
        ["What money really is", "lesson"],
        ["Value & price check", "quiz"],
        ["Earning vs receiving", "lesson"],
        ["Market day trade", "sim"],
        ["Fair price quiz", "quiz"],
        ["Currency around us", "lesson"],
        ["Basics boss battle", "boss"],
      ],
      5,
    ),
  },
  {
    id: "budget-boss",
    title: "Budget Boss",
    blurb: "Plan a monthly budget and survive surprise costs.",
    emoji: "📊",
    tint: "bg-primary-soft",
    done: 2,
    levels: path(
      [
        ["Needs vs wants, level 10", "lesson"],
        ["The 50/30/20 rule", "lesson"],
        ["Build your first budget", "sim"],
        ["Surprise expense!", "sim"],
        ["Track a week of spending", "quiz"],
        ["Budget boss battle", "boss"],
      ],
      2,
    ),
  },
  {
    id: "save-invest",
    title: "Save & Grow",
    blurb: "Goals, interest and the magic of compounding.",
    emoji: "🌱",
    tint: "bg-sky",
    done: 1,
    levels: path(
      [
        ["Set a savings goal", "lesson"],
        ["Simple vs compound interest", "lesson"],
        ["Grow KES 1,000 for a year", "sim"],
        ["Risk & reward quiz", "quiz"],
        ["Growth boss battle", "boss"],
      ],
      1,
    ),
  },
  {
    id: "smart-spender",
    title: "Smart Spender",
    blurb: "Spot ads, compare deals and dodge impulse buys.",
    emoji: "🛒",
    tint: "bg-berry",
    done: 0,
    levels: path(
      [
        ["Advert detective", "lesson"],
        ["Compare the deals", "sim"],
        ["The 24-hour rule", "lesson"],
        ["Shopping run", "sim"],
        ["Spender boss battle", "boss"],
      ],
      0,
    ),
  },
  {
    id: "digital-money",
    title: "Digital Money",
    blurb: "Mobile money, safety and scam-spotting.",
    emoji: "📱",
    tint: "bg-sky",
    locked: true,
    unlockXp: 4200,
    done: 0,
    levels: path(
      [
        ["How mobile money moves", "lesson"],
        ["PINs & privacy", "lesson"],
        ["Scam or safe?", "quiz"],
        ["Digital boss battle", "boss"],
      ],
      0,
    ),
  },
  {
    id: "young-hustler",
    title: "Young Hustler",
    blurb: "Start a mini business, price it and make profit.",
    emoji: "🚀",
    tint: "bg-sun",
    locked: true,
    unlockXp: 5000,
    done: 0,
    levels: path(
      [
        ["Find a problem to solve", "lesson"],
        ["Cost, price, profit", "lesson"],
        ["Run your stall", "sim"],
        ["Reinvest or cash out?", "quiz"],
        ["Hustler boss battle", "boss"],
      ],
      0,
    ),
  },
];

export const getGame = (id: string) => games.find((g) => g.id === id);
