export type WeekKind = "task" | "math" | "review" | "reflect";

export interface WeekQuiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface WeekChallenge {
  week: number;
  title: string;
  prompt: string;
  tip?: string;
  kind: WeekKind;
  xp: number;
  coins: number;
  quiz?: WeekQuiz;
}

export interface ChallengeChapter {
  id: string;
  year: 1 | 2;
  rangeLabel: string;
  start: number;
  end: number;
  title: string;
  blurb: string;
  tint: string;
  iconTint: string;
}

export const WEEKLY_GAME_ID = "weekly-challenge";
export const WEEKLY_DEPOSIT_KES = 100;
export const YEAR_ONE_TOTAL_KES = 5200;

export const CHALLENGE_INTRO = {
  title: "The 52-Week Savings Challenge",
  summary: "Deposit a fixed KSh 100 every single week for 52 weeks.",
  total: "Total saved: KSh 5,200.",
  tip: "Save this in a glass jar, a piggy bank, or a locked savings account with a parent watching.",
};

export const chapters: ChallengeChapter[] = [
  {
    id: "q1",
    year: 1,
    rangeLabel: "Weeks 1–13",
    start: 1,
    end: 13,
    title: "Budgeting & Tracking",
    blurb: "Audit cash, split needs from wants, and pay yourself first.",
    tint: "bg-leaf text-primary-foreground",
    iconTint: "bg-primary-soft text-primary-deep",
  },
  {
    id: "q2",
    year: 1,
    rangeLabel: "Weeks 14–26",
    start: 14,
    end: 26,
    title: "Smart Shopping",
    blurb: "Negotiate, compare, and spot ads that try to empty your pocket.",
    tint: "bg-sunny text-sun-foreground",
    iconTint: "bg-sun/40 text-sun-foreground",
  },
  {
    id: "q3",
    year: 1,
    rangeLabel: "Weeks 27–39",
    start: 27,
    end: 39,
    title: "Earning & Hustles",
    blurb: "Find a skill, pitch a mini-business, and track your first coins.",
    tint: "bg-sky text-sky-foreground",
    iconTint: "bg-sky/50 text-sky-foreground",
  },
  {
    id: "q4",
    year: 1,
    rangeLabel: "Weeks 40–52",
    start: 40,
    end: 52,
    title: "Banks & Chamas",
    blurb: "Teen accounts, interest, PINs, and Kenya’s money toolbox.",
    tint: "bg-berry text-berry-foreground",
    iconTint: "bg-berry/25 text-berry-foreground",
  },
  {
    id: "q5",
    year: 2,
    rangeLabel: "Weeks 53–65",
    start: 53,
    end: 65,
    title: "Wealth Systems",
    blurb: "50/30/20, cash flow, and habits that quietly grow a stash.",
    tint: "bg-leaf text-primary-foreground",
    iconTint: "bg-primary-soft text-primary-deep",
  },
  {
    id: "q6",
    year: 2,
    rangeLabel: "Weeks 66–78",
    start: 66,
    end: 78,
    title: "Debt & Pitfalls",
    blurb: "Good debt, bad debt, mobile loans, scams, and saying no.",
    tint: "bg-berry text-berry-foreground",
    iconTint: "bg-berry/25 text-berry-foreground",
  },
  {
    id: "q7",
    year: 2,
    rangeLabel: "Weeks 79–91",
    start: 79,
    end: 91,
    title: "Investing Basics",
    blurb: "MMFs, compound interest, NSE, Saccos, and risk vs return.",
    tint: "bg-sunny text-sun-foreground",
    iconTint: "bg-sun/40 text-sun-foreground",
  },
  {
    id: "q8",
    year: 2,
    rangeLabel: "Weeks 92–104",
    start: 92,
    end: 104,
    title: "Independence",
    blurb: "School costs, tax, insurance, rent math, and a 5-year plan.",
    tint: "bg-sky text-sky-foreground",
    iconTint: "bg-sky/50 text-sky-foreground",
  },
];

export const weeks: WeekChallenge[] = [
  {
    week: 1,
    title: "The Cash Audit",
    prompt: "Track every single shilling spent this week in a small notebook or a phone app.",
    tip: "Don’t skip airtime, snacks, or ‘just 20 bob’. Tiny leaks sink a jar.",
    kind: "task",
    xp: 40,
    coins: 12,
  },
  {
    week: 2,
    title: "Needs vs. Wants",
    prompt: "List your top 10 expenses from last week and classify each as a survival Need or a lifestyle Want.",
    kind: "task",
    xp: 40,
    coins: 12,
  },
  {
    week: 3,
    title: "The Family Budget Shadow",
    prompt: "Sit with a parent and look at one utility bill — Kenya Power token or water — to see how household costs work.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 4,
    title: "Pay Yourself First",
    prompt: "Take 10% of any pocket money or gift this week and move it to savings before you spend anything else.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 5,
    title: "Price Comparison",
    prompt: "At a supermarket, market, or supermarket website, compare prices of three identical items from different brands.",
    kind: "task",
    xp: 40,
    coins: 12,
  },
  {
    week: 6,
    title: "The Unspent Balance",
    prompt: "Finish the week with at least KSh 100 left over from your usual allowance.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 7,
    title: "Impulse Postponement",
    prompt: "If you see a Want you want to buy, wait 48 hours before you spend.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 8,
    title: "Business Set-up",
    prompt: "If you had KES 5,000 as capital, what business would you start this Saturday — and why?",
    kind: "reflect",
    xp: 50,
    coins: 15,
  },
  {
    week: 9,
    title: "Energy Saver Audit",
    prompt: "Turn off unused lights and unplug chargers for a week to help cut the family electricity bill.",
    kind: "task",
    xp: 40,
    coins: 12,
  },
  {
    week: 10,
    title: "Entertainment on a Budget",
    prompt: "Plan a fun afternoon with friends that costs absolutely zero shillings — a hike, a board game, a kickabout.",
    kind: "task",
    xp: 40,
    coins: 12,
  },
  {
    week: 11,
    title: "The Mobile Money Trap",
    prompt: "Ask a parent if you can review a recent M-Pesa or Airtel Money statement and spot how much went to fees alone.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 12,
    title: "Zero-Waste Meal Planning",
    prompt: "Work with a parent to plan a week of meals from food already in the pantry, so you skip extra shopping.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 13,
    title: "Quarterly Review",
    prompt: "Add up your 52-Week Challenge deposits so far and celebrate the first-quarter milestone.",
    tip: "Thirteen weeks × KSh 100 = KSh 1,300 if you never missed a deposit.",
    kind: "review",
    xp: 70,
    coins: 25,
  },
  {
    week: 14,
    title: "The Mama Mboga Negotiation",
    prompt: "Go with a parent to the market or kibanda and watch how to politely negotiate for fresh produce.",
    kind: "task",
    xp: 40,
    coins: 12,
  },
  {
    week: 15,
    title: "Bulk vs. Retail Math",
    prompt: "Calculate whether one 2kg packet of sugar is cheaper than two 1kg packets at your local shop.",
    kind: "math",
    xp: 50,
    coins: 15,
    quiz: {
      question: "2kg sugar is KSh 280. 1kg is KSh 150. Which is cheaper per kilo?",
      options: ["The 1kg packs", "The 2kg pack", "They cost the same"],
      answer: 1,
      explanation: "2kg at 280 is KSh 140 per kilo. Two 1kg packs are KSh 150 per kilo. Bulk wins here.",
    },
  },
  {
    week: 16,
    title: "Subscription Audit",
    prompt: "Check digital subscriptions at home — Netflix, Spotify, YouTube Premium, internet — and find one that can be downgraded or shared.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 17,
    title: "Making a Profit",
    prompt: "If you sell 10 mangoes at 20 KES each, but bought them at 12 KES each, what is your profit?",
    kind: "math",
    xp: 50,
    coins: 15,
    quiz: {
      question: "10 mangoes bought at 12 KES, sold at 20 KES. Profit?",
      options: ["KES 80", "KES 200", "KES 120"],
      answer: 0,
      explanation: "Revenue 200 minus cost 120 equals profit of KES 80.",
    },
  },
  {
    week: 18,
    title: "The Peer Pressure Test",
    prompt: "Notice a moment this week when you wanted to spend just to fit in. Write down how you handled it.",
    kind: "reflect",
    xp: 45,
    coins: 12,
  },
  {
    week: 19,
    title: "DIY Snack Week",
    prompt: "Skip packaged snacks or soda after school. Make popcorn or a smoothie at home instead.",
    kind: "task",
    xp: 40,
    coins: 12,
  },
  {
    week: 20,
    title: "Prize Money",
    prompt: "If you won a prize of 10,000 KES, would you spend it, save it, or invest it — and why?",
    kind: "reflect",
    xp: 50,
    coins: 15,
  },
  {
    week: 21,
    title: "The Warranty Hunt",
    prompt: "Find the receipt and warranty card for an appliance at home. That’s consumer protection on paper.",
    kind: "task",
    xp: 40,
    coins: 12,
  },
  {
    week: 22,
    title: "Advert Deconstruction",
    prompt: "Pick a popular ad on Kenyan TV or social media and talk with a friend about the tricks used to make you buy.",
    kind: "reflect",
    xp: 45,
    coins: 12,
  },
  {
    week: 23,
    title: "The Fruit Tree Challenge",
    prompt: "What is the ‘value’ of a tree — the shade, the fruit, or the timber? Discuss with someone at home.",
    kind: "reflect",
    xp: 40,
    coins: 12,
  },
  {
    week: 24,
    title: "Festive Budgeting",
    prompt: "Plan a strict budget for an upcoming holiday or celebration, including gifts and food.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 25,
    title: "Generic vs. Brand Name",
    prompt: "Try a supermarket brand of flour or salt instead of a premium brand. Notice if quality actually changes.",
    kind: "task",
    xp: 40,
    coins: 12,
  },
  {
    week: 26,
    title: "Mid-Year Health Check",
    prompt: "Review your 52-Week savings. If you are behind, make a two-week catch-up plan.",
    tip: "Halfway target is KSh 2,600 if you deposited every week.",
    kind: "review",
    xp: 70,
    coins: 25,
  },
  {
    week: 27,
    title: "The Skills Inventory",
    prompt: "List three things you are good at — design, baking, tutoring — that someone might pay you for.",
    kind: "reflect",
    xp: 45,
    coins: 12,
  },
  {
    week: 28,
    title: "Declutter for Cash",
    prompt: "Find three unused items — books, clothes, gadgets — you could sell to friends or online.",
    kind: "task",
    xp: 40,
    coins: 12,
  },
  {
    week: 29,
    title: "The Micro-Business Pitch",
    prompt: "Pitch a simple holiday business (baking, tutoring) to your parents. Would they put in seed capital?",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 30,
    title: "The Service Trial",
    prompt: "If you traded a skill like tutoring for sneakers, is that still earning? Talk it through.",
    kind: "reflect",
    xp: 40,
    coins: 12,
  },
  {
    week: 31,
    title: "Pricing Strategy",
    prompt: "Calculate the exact cost of materials and time to launch your Week 29 idea.",
    kind: "math",
    xp: 50,
    coins: 15,
  },
  {
    week: 32,
    title: "Side Hustle Launch",
    prompt: "Run your micro-business or service for one weekend and track your first revenue.",
    kind: "task",
    xp: 60,
    coins: 20,
  },
  {
    week: 33,
    title: "Customer Feedback",
    prompt: "Ask your first customers what they liked and what would justify a higher price.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 34,
    title: "Business Expense Separation",
    prompt: "Set up a separate envelope or wallet strictly for business income and expenses.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 35,
    title: "Reinvestment Math",
    prompt: "Take 50% of this month’s business profit and put it back into supplies or better tools.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 36,
    title: "Time is Money",
    prompt: "Track hours spent on the business versus money earned to find your hourly wage.",
    kind: "math",
    xp: 50,
    coins: 15,
  },
  {
    week: 37,
    title: "Barter Challenge",
    prompt: "Trade a skill or item with a friend with zero money — homework help for a book, for example.",
    kind: "task",
    xp: 40,
    coins: 12,
  },
  {
    week: 38,
    title: "The Shadowing Day",
    prompt: "Spend half a day with a local business owner or relative at work. Watch how operations actually run.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 39,
    title: "Quarter 3 Milestone",
    prompt: "Deposit business earnings or savings into your 52-Week Challenge fund.",
    kind: "review",
    xp: 70,
    coins: 25,
  },
  {
    week: 40,
    title: "Banking 101",
    prompt: "Visit a local bank branch with a parent and learn what it takes to open a teen or student savings account.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 41,
    title: "Interest Rate Comparison",
    prompt: "Compare interest on three Kenyan micro-savings options — M-Shwari, KCB M-Pesa, and a traditional bank.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 42,
    title: "The Chama Simulation",
    prompt: "Form a mini chama with 3–5 people. Everyone contributes a little weekly; one person takes the lump sum.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 43,
    title: "Digital Security Drill",
    prompt: "Learn PIN safety. Help change mobile-money and phone PINs to stronger codes — and never share them.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 44,
    title: "Understanding Inflation",
    prompt: "Ask a parent what bread or milk cost 10 years ago, then talk about why prices rise.",
    kind: "reflect",
    xp: 45,
    coins: 12,
  },
  {
    week: 45,
    title: "Statement Literacy",
    prompt: "Download a bank or mobile-money statement and practise reading credit, debit, and running balance.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 46,
    title: "Emergency Fund Blueprint",
    prompt: "Discuss with parents what a true family emergency is versus a regular monthly bill.",
    kind: "reflect",
    xp: 45,
    coins: 12,
  },
  {
    week: 47,
    title: "Opportunity Cost",
    prompt: "Before a small purchase this week, list two other things you could have done with that same money.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 48,
    title: "The Philanthropy Project",
    prompt: "Give a little savings or time to a local charity, children’s home, or community clean-up.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 49,
    title: "Financial Terms Glossary",
    prompt: "Write simple definitions for Asset, Liability, Principal, Interest, and Liquidity.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 50,
    title: "The Financial Vision Board",
    prompt: "Make a collage or list of three things you want to afford in the next three years — laptop, trip, business fund.",
    kind: "reflect",
    xp: 50,
    coins: 15,
  },
  {
    week: 51,
    title: "The 52-Week Final Push",
    prompt: "Make your final deposit into the 52-Week Savings Challenge.",
    kind: "task",
    xp: 60,
    coins: 20,
  },
  {
    week: 52,
    title: "Year 1 Victory Lap",
    prompt: "Count the total with your parents, decide how to allocate it, and review how you grew.",
    tip: "Full jar: KSh 5,200 if you never missed a week.",
    kind: "review",
    xp: 100,
    coins: 40,
  },
  {
    week: 53,
    title: "The 50/30/20 Framework",
    prompt: "Reorganise this month’s allowance: 50% Needs, 30% Wants, 20% Savings or investments.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 54,
    title: "High-Yield Cash Tracking",
    prompt: "Research which Kenyan places currently pay the best yields on savings accounts and money market funds.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 55,
    title: "Cash Flow Projection",
    prompt: "Estimate income and expenses for the next three months so dry spells don’t surprise you.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 56,
    title: "The Expense Slasher",
    prompt: "Pick one recurring weekly expense and cut its cost in half with a creative swap.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 57,
    title: "Household Inventory",
    prompt: "List major assets your parents own — furniture, electronics, a vehicle — and ask how value falls over time.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 58,
    title: "Net Worth Calculation",
    prompt: "Work out your personal net worth: what you own minus what you owe.",
    kind: "math",
    xp: 55,
    coins: 18,
  },
  {
    week: 59,
    title: "Ghost Expense Tracker",
    prompt: "Track forgotten little spends for a week — snacks, airtime, tiny fees.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 60,
    title: "Automated Saving",
    prompt: "Work with a parent to set an automatic weekly transfer into savings.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 61,
    title: "Utility Optimisation",
    prompt: "Lower home electricity for a week: lights off on time, watch microwave use, then compare.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 62,
    title: "Gift Planning Matrix",
    prompt: "Make a birthday calendar for the year and a tiny monthly pool so gifts never ambush you.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 63,
    title: "Podcast / Book Club",
    prompt: "Listen to a Kenyan personal-finance episode (like The Centonomy Show) or read an article with a friend.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 64,
    title: "Cost-per-Use",
    prompt: "Divide the price of your most expensive clothing item or gadget by how many times you’ve used it.",
    kind: "math",
    xp: 50,
    coins: 15,
  },
  {
    week: 65,
    title: "Mid-Project Capital Review",
    prompt: "Assess how your Year 1 savings are performing now.",
    kind: "review",
    xp: 70,
    coins: 25,
  },
  {
    week: 66,
    title: "Good Debt vs. Bad Debt",
    prompt: "Talk with a parent: borrowing for an asset like land versus borrowing for clothes.",
    kind: "reflect",
    xp: 50,
    coins: 15,
  },
  {
    week: 67,
    title: "The Digital Loan Trap",
    prompt: "Research interest on popular Kenyan mobile loan apps and how fast they can spiral.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 68,
    title: "The Credit Score Concept",
    prompt: "Learn how registries track borrowing and why a clean reputation matters later.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 69,
    title: "The Guarantor Conversation",
    prompt: "Ask an adult what it means to guarantee someone else’s loan — and the risk if they default.",
    kind: "reflect",
    xp: 50,
    coins: 15,
  },
  {
    week: 70,
    title: "Loan Repayment Mathematics",
    prompt: "Use a calculator: total interest on a KSh 50,000 loan at 15% over 1 year versus 3 years.",
    kind: "math",
    xp: 55,
    coins: 18,
    quiz: {
      question: "KSh 50,000 at 15% simple interest. How much interest in 1 year?",
      options: ["KSh 7,500", "KSh 15,000", "KSh 5,000"],
      answer: 0,
      explanation: "50,000 × 0.15 × 1 = KSh 7,500. Stretching to 3 years triples simple interest to KSh 22,500.",
    },
  },
  {
    week: 71,
    title: "The No-Borrow Pact",
    prompt: "Challenge a friend: a whole month with no borrowing a shilling or an item from each other.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 72,
    title: "Identifying Financial Scams",
    prompt: "Research flags of pyramid schemes, fake online jobs, and get-rich-quick posts targeting youth.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 73,
    title: "Hidden Fee Treasure Hunt",
    prompt: "Read the fine print of a digital money service: maintenance fees, withdrawals, excise tax.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 74,
    title: "The Late Fee Reality",
    prompt: "Find out what happens if a utility bill is missed — penalties stack.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 75,
    title: "Peer Lending Boundaries",
    prompt: "Roleplay saying a polite, firm no when someone asks to borrow money you cannot afford to lose.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 76,
    title: "Bankruptcy Case Study",
    prompt: "Read or watch how Nakumatt and Tuskys went broke. Name the core mistakes.",
    kind: "reflect",
    xp: 55,
    coins: 18,
  },
  {
    week: 77,
    title: "Emergency Triage",
    prompt: "Imagine pocket money drops by 50%. Write an emergency budget for the shock.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 78,
    title: "Debt-Free Celebration",
    prompt: "Outline a life plan that leans on cash and investments, not consumer debt.",
    kind: "review",
    xp: 70,
    coins: 25,
  },
  {
    week: 79,
    title: "Money Market Funds 101",
    prompt: "Research how Kenyan MMFs pool money into low-risk securities and look up current top yields.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 80,
    title: "The Magic of Compound Interest",
    prompt: "Calculate how KSh 10,000 grows over 10 years at 10% compound versus simple interest.",
    kind: "math",
    xp: 60,
    coins: 20,
    quiz: {
      question: "KSh 10,000 at 10% simple interest for 10 years becomes…",
      options: ["KSh 20,000", "KSh 11,000", "KSh 25,937"],
      answer: 0,
      explanation: "Simple: 10,000 + (10,000 × 0.10 × 10) = KSh 20,000. Compound lands near KSh 25,937 — that’s the extra magic.",
    },
  },
  {
    week: 81,
    title: "Stock Market Exploration",
    prompt: "Look up the Nairobi Securities Exchange. Ask how a parent could help you get an account, and which shares exist.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 82,
    title: "Virtual Stock Portfolio",
    prompt: "‘Buy’ imaginary shares of three public Kenyan companies and track them for a month.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 83,
    title: "T-Bills and Bonds",
    prompt: "Learn how people lend to the government via T-Bills and Treasury Bonds, and the minimum you can start with.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 84,
    title: "Sacco Literacy",
    prompt: "Ask a parent how Saccos work in Kenya — dividends and borrowing multiples.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 85,
    title: "Risk vs. Return Scale",
    prompt: "Draw a chart from lowest to highest risk: cash, MMFs, Saccos, real estate, stocks.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 86,
    title: "Real Estate Reality Check",
    prompt: "Research the average cost of an acre or plot in your county now versus 10 years ago.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 87,
    title: "Dividend Deep Dive",
    prompt: "Check which top NSE companies paid dividends to shareholders last year.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 88,
    title: "Laptop Budgeting",
    prompt: "If you want a laptop in 6 months, how much must you save from pocket money each week?",
    kind: "math",
    xp: 55,
    coins: 18,
  },
  {
    week: 89,
    title: "The Diversification Shield",
    prompt: "Talk with a friend or sibling about why parking all savings in one thing — like shares — is risky.",
    kind: "reflect",
    xp: 50,
    coins: 15,
  },
  {
    week: 90,
    title: "Platform Verification",
    prompt: "Check whether your investment ideas are regulated by bodies like the CMA or SASRA.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 91,
    title: "Virtual Portfolio Harvest",
    prompt: "Check those imaginary Week 82 shares. Calculate paper profit or loss.",
    kind: "review",
    xp: 70,
    coins: 25,
  },
  {
    week: 92,
    title: "Higher Education Costing",
    prompt: "Map tuition and living costs for a degree or diploma you actually care about.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 93,
    title: "Smart Device Amortisation",
    prompt: "How many hours of work or saving to fully pay a new smartphone — and how fast it loses value.",
    kind: "math",
    xp: 50,
    coins: 15,
  },
  {
    week: 94,
    title: "Understanding VAT",
    prompt: "Look at a supermarket receipt and see how much VAT sits on each item.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 95,
    title: "The Insurance Shield",
    prompt: "Discuss with parents how health cover (SHIF/NHIF) or car insurance protects a family from a sudden bill.",
    kind: "reflect",
    xp: 50,
    coins: 15,
  },
  {
    week: 96,
    title: "Digital Portfolio",
    prompt: "Build a simple CV showing skills, volunteer work, and projects.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 97,
    title: "Roommate / Rent Math",
    prompt: "Research bedsitter or one-bedroom rent near a university town, including utility splits.",
    kind: "task",
    xp: 50,
    coins: 15,
  },
  {
    week: 98,
    title: "The Retirement Reality",
    prompt: "Learn why people start pension saving in their 20s — decades of compounding.",
    kind: "reflect",
    xp: 50,
    coins: 15,
  },
  {
    week: 99,
    title: "The Changing Job Market",
    prompt: "Interview a family member about their first job and what they were paid.",
    kind: "task",
    xp: 45,
    coins: 12,
  },
  {
    week: 100,
    title: "Negotiation Practice",
    prompt: "Practise a mock salary or contract talk with a parent pretending to be your future boss.",
    kind: "task",
    xp: 55,
    coins: 18,
  },
  {
    week: 101,
    title: "The Legacy Plan",
    prompt: "Talk with older family about generational wealth, land history, or family businesses.",
    kind: "reflect",
    xp: 50,
    coins: 15,
  },
  {
    week: 102,
    title: "Lifetime Blueprint",
    prompt: "Write a 5-year plan: income goals, savings targets, and investments you want by age 23.",
    kind: "task",
    xp: 60,
    coins: 20,
  },
  {
    week: 103,
    title: "Live Below Your Means",
    prompt: "Find out what ‘live below your means’ actually means, and why it matters.",
    kind: "reflect",
    xp: 50,
    coins: 15,
  },
  {
    week: 104,
    title: "Graduation & Capital",
    prompt: "Celebrate two years. With a parent, park accumulated savings in a real vehicle — an MMF or Sacco — and start adult money life.",
    kind: "review",
    xp: 120,
    coins: 50,
  },
];

export function getWeek(week: number) {
  return weeks.find((w) => w.week === week);
}

export function getChapterForWeek(week: number) {
  return chapters.find((c) => week >= c.start && week <= c.end);
}

export function weeksInChapter(chapter: ChallengeChapter) {
  return weeks.filter((w) => w.week >= chapter.start && w.week <= chapter.end);
}

export function yearOneSavedKes(completedCount: number) {
  const yearOneDone = Math.min(52, Math.max(0, completedCount));
  return yearOneDone * WEEKLY_DEPOSIT_KES;
}

export function levelsForChapter(chapter: ChallengeChapter) {
  const list = weeksInChapter(chapter);
  const levels: { level: number; weeks: WeekChallenge[] }[] = [];
  for (let i = 0; i < list.length; i += 3) {
    levels.push({ level: Math.floor(i / 3) + 1, weeks: list.slice(i, i + 3) });
  }
  return levels;
}

export function shortWeekLabel(title: string) {
  const words = title.replace(/^The\s+/i, "").split(" ");
  return words.slice(0, 2).join(" ");
}

export function typedPrompt(week: WeekChallenge) {
  if (week.quiz) {
    return {
      mode: "check" as const,
      question: week.quiz.question,
      expected: week.quiz.options[week.quiz.answer],
      explanation: week.quiz.explanation,
      placeholder: "Type the answer here…",
    };
  }
  return {
    mode: "journal" as const,
    question: week.prompt,
    expected: null,
    explanation: week.tip ?? "Write what you noticed, decided, or did this week.",
    placeholder:
      week.kind === "math"
        ? "Type the number or amount…"
        : "Key in your answer. Be specific.",
  };
}

export function answersMatch(typed: string, expected: string) {
  const fold = (s: string) =>
    s
      .toLowerCase()
      .replace(/kes|ksh|shillings?|bob/g, "")
      .replace(/[^a-z0-9.]/g, "");
  const a = fold(typed);
  const b = fold(expected);
  if (!a) return false;
  if (a === b) return true;
  const nums = (s: string) => (s.match(/\d+\.?\d*/g) || []).join("");
  const na = nums(typed.replace(/,/g, ""));
  const nb = nums(expected.replace(/,/g, ""));
  return na.length > 0 && na === nb;
}
