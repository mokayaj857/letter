import { WordSearchPuzzle, QuizPuzzle } from "../types";

export const savvyShopperWordSearch: WordSearchPuzzle = {
  type: "wordsearch",
  id: "ss-savvy-ws1",
  title: "Savvy Shopper: Online Marketplaces",
  topic: "Smart Spender",
  theme: "E-Commerce, Deals, and Digital Shopping Safety",
  instruction: "Search for e-commerce, delivery, and online marketplace terms.",
  size: 14,
  words: [
    "CART",
    "CHECKOUT",
    "COUPON",
    "CASH ON DELIVERY",
    "DISCOUNT",
    "FREE SHIPPING",
    "MARKETPLACE",
    "ORDER",
    "PROMO CODE",
    "RATINGS",
    "RETURN POLICY",
    "REVIEWS",
    "SELLER",
    "TRACKING",
  ],
  grid: [
    ["M", "A", "R", "K", "E", "T", "P", "L", "A", "C", "E", "C", "A", "R"],
    ["C", "H", "E", "C", "K", "O", "U", "T", "C", "O", "U", "P", "O", "T"],
    ["D", "I", "S", "C", "O", "U", "N", "T", "O", "R", "D", "E", "R", "N"],
    ["F", "R", "E", "E", "S", "H", "I", "P", "P", "I", "N", "G", "S", "E"],
    ["P", "R", "O", "M", "O", "C", "O", "D", "E", "R", "A", "T", "E", "L"],
    ["R", "E", "T", "U", "R", "N", "P", "O", "L", "I", "C", "Y", "L", "L"],
    ["R", "E", "V", "I", "E", "W", "S", "T", "R", "A", "C", "K", "L", "E"],
    ["C", "A", "S", "H", "O", "N", "D", "E", "L", "I", "V", "E", "E", "R"],
    ["T", "R", "A", "C", "K", "I", "N", "G", "S", "A", "F", "E", "R", "S"],
    ["S", "E", "C", "U", "R", "E", "P", "A", "Y", "M", "E", "N", "T", "S"],
    ["D", "O", "O", "R", "S", "T", "E", "P", "D", "E", "L", "I", "V", "E"],
    ["C", "U", "S", "T", "O", "M", "E", "R", "S", "U", "P", "P", "O", "R"],
    ["V", "E", "R", "I", "F", "I", "E", "D", "B", "U", "Y", "E", "R", "S"],
    ["W", "I", "S", "H", "L", "I", "S", "T", "B", "A", "S", "K", "E", "T"],
  ],
};

export const savvyShopperQuiz: QuizPuzzle = {
  type: "quiz",
  id: "ss-savvy-quiz",
  title: "Savvy Online Shopper Quiz",
  topic: "Smart Spender",
  instruction: "Learn how to spot authentic sellers and avoid e-commerce scams.",
  questions: [
    {
      id: 1,
      question: "What is the safest practice when buying from an unfamiliar social media seller?",
      options: [
        "Opt for Pay-on-Delivery (after inspecting the product) or use escrow payment services",
        "Send the full money immediately via direct mobile transfer with zero verification",
        "Give them your bank login password",
        "Delete your phone number",
      ],
      correctIndex: 0,
      explanation:
        "Payment on delivery or escrow protects buyers from non-delivery and fraudulent phantom sellers.",
    },
    {
      id: 2,
      question: "What should you examine before buying an electronic gadget online?",
      options: [
        "Verified buyer reviews, seller rating, return warranty policy, and detailed item specifications",
        "Only the flashy rendered marketing picture",
        "How many emojis the seller typed",
        "Nothing at all",
      ],
      correctIndex: 0,
      explanation:
        "Checking verified reviews and explicit return terms protects against counterfeit or defective goods.",
    },
  ],
};
