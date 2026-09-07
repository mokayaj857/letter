import { ActivityPuzzle } from "../types";

export const wouldYouRatherActivity: ActivityPuzzle = {
  type: "activity",
  id: "ss-would-you-rather",
  title: "Would You Rather: Delay of Gratification",
  topic: "Save & Grow",
  subtype: "would_you_rather",
  instruction:
    "Make tough financial choices between instant gratification and patient long-term wealth building, and discover your money mindset profile!",
  config: {
    scenarios: [
      {
        id: "w1",
        optionA: "Receive KSh 1,000 cash today to spend immediately on snacks & arcades",
        optionB: "Receive KSh 5,000 in 6 months deposited directly into a high-yield locked savings account",
        growthMindset: "B",
        insight: "Choosing Option B demonstrates delayed gratification and a compound growth mindset!",
      },
      {
        id: "w2",
        optionA: "Buy the latest trending designer sneakers on credit (paying extra interest for 12 months)",
        optionB: "Wear durable, stylish standard shoes and invest the price difference in index shares",
        growthMindset: "B",
        insight: "Assets put money in your pocket; liabilities take money out of your pocket.",
      },
      {
        id: "w3",
        optionA: "Spend KSh 300 every day on takeaway soda and packaged chips",
        optionB: "Pack a home-made fruit snack and save KSh 9,000 monthly to start a photography side hustle",
        growthMindset: "B",
        insight: "Small daily habits compound into massive startup capital over 1 year!",
      },
    ],
  },
};

export const smartMoneyPledgeActivity: ActivityPuzzle = {
  type: "activity",
  id: "ss-smart-money-pledge",
  title: "The Smart Money Pledge: Official Certificate",
  topic: "Young Hustler",
  subtype: "smart_money_pledge",
  instruction:
    "Take the pledge to practice wise spending, disciplined saving, honest enterprise, and debt avoidance. Sign your custom Letterbox certificate!",
  config: {
    pledges: [
      "I will track every shilling I earn and spend each month.",
      "I will save at least 20% of all pocket money or gift income before spending.",
      "I will follow the 24-hour waiting rule before making non-essential purchases.",
      "I will protect my PINs and never click suspicious financial links.",
      "I will invest in building my skills, knowledge, and creative talents.",
    ],
  },
};
