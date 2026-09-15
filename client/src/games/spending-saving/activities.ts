import { ActivityPuzzle } from "../types";

export const wouldYouRatherActivity: ActivityPuzzle = {
  type: "activity",
  id: "sw-would-you-rather",
  title: "Would You Rather: Delayed Gratification",
  topic: "Spending Wisely",
  subtype: "would_you_rather",
  instruction: "Choose between Instant Gratification (This) and Delayed Gratification (That) across 12 money scenarios.",
  config: {
    scenarios: [
      {
        id: "wyr1",
        thisChoice: "Buy a smokie-pasua every day after school",
        thatChoice: "Save that money for 2 weeks to buy a new pair of headphones",
      },
      {
        id: "wyr2",
        thisChoice: "Spend your birthday money immediately",
        thatChoice: "Keep it in a locked wooden box until the December holidays",
      },
      {
        id: "wyr3",
        thisChoice: "Buy the viral sneakers that everyone is wearing on TikTok",
        thatChoice: "Buy a sturdy pair of leather boots that will last 3 years",
      },
      {
        id: "wyr4",
        thisChoice: "Pay for Netflix App to watch one trending show",
        thatChoice: "Use that money to buy data bundles to learn coding on YouTube",
      },
      {
        id: "wyr5",
        thisChoice: "Buy a small bag of popcorn at the movies for 100 bob",
        thatChoice: "Buy a bag of raw kernels to pop at home for 100 bob",
      },
      {
        id: "wyr6",
        thisChoice: "Receive your pocket money via M-PESA Go",
        thatChoice: "Receive your pocket money in physical notes",
      },
      {
        id: "wyr7",
        thisChoice: "Keep your savings in an M-Shwari lock savings account",
        thatChoice: "Keep your savings in a hidden tin under your bed",
      },
      {
        id: "wyr8",
        thisChoice: "Use your phone to buy airtime whenever you run out",
        thatChoice: "Wait until you get home to use the WiFi and save money",
      },
      {
        id: "wyr9",
        thisChoice: "Start a small business selling customized stickers to classmates",
        thatChoice: "Get a 'salary' from your parents for doing extra chores like washing the car",
      },
      {
        id: "wyr10",
        thisChoice: "Sell one big item like a painting for 1,000 bob",
        thatChoice: "Sell 50 small items like sweets for 20 bob each",
      },
      {
        id: "wyr11",
        thisChoice: "Have 1,000 bob today to spend however you want",
        thatChoice: "Wait one month and receive 1,500 bob",
      },
      {
        id: "wyr12",
        thisChoice: "Win a shopping spree at Naivas or Quickmart",
        thatChoice: "Win a unit of shares in Britam or KCB",
      },
    ],
  },
};

export const smartMoneyPledgeActivity: ActivityPuzzle = {
  type: "activity",
  id: "sw-smart-money-pledge",
  title: "The Smart Money Pledge",
  topic: "Spending Wisely",
  subtype: "smart_money_pledge",
  instruction: "Read each commitment and sign your official Smart Money Pledge.",
  config: {
    pledges: [
      "I promise to always be a curious learner about money and commerce.",
      "I will look for real problems to solve in my school and community.",
      "I will always save a portion of my pocket money before spending.",
      "I will remember that my ideas and skills have the power to build a better Kenya.",
    ],
  },
};
