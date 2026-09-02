import { useState, useEffect, useCallback } from "react";
import type { AvatarKey } from "@/assets/icons";
import { playCoin, playPop, playSuccess } from "./audio";
import { triggerConfetti } from "./confetti";

export interface UserProfile {
  name: string;
  avatar: AvatarKey;
  level: number;
  title: string;
  coins: number;
  streak: number;
  xp: number;
  equippedItem: string | null;
}

export interface UserSettings {
  soundEnabled: boolean;
  remindersEnabled: boolean;
  streakFreeze: boolean;
  parentPin: string;
  dailyLimitMinutes: number;
  isPrivate: boolean;
}

export interface SavingsGoal {
  title: string;
  current: number;
  target: number;
}

export interface UserBadge {
  id: string;
  name: string;
  artKey: string;
  got: boolean;
  dateUnlocked?: string;
  desc: string;
  xpValue: number;
}

export interface LetterboxState {
  user: UserProfile;
  settings: UserSettings;
  goal: SavingsGoal;
  ownedItems: string[];
  badges: UserBadge[];
  gameProgress: Record<string, number>;
  dailyChallenge: {
    completed: boolean;
    title: string;
    xp: number;
    coins: number;
  };
  auth: {
    isLoggedIn: boolean;
    email?: string;
    provider?: string;
  };
}

const STORAGE_KEY = "letterbox_player_state_v2";

const DEFAULT_STATE: LetterboxState = {
  user: {
    name: "Amani",
    avatar: "lion",
    level: 12,
    title: "Budget Boss",
    coins: 1240,
    streak: 12,
    xp: 3860,
    equippedItem: null,
  },
  settings: {
    soundEnabled: true,
    remindersEnabled: true,
    streakFreeze: true,
    parentPin: "1234",
    dailyLimitMinutes: 30,
    isPrivate: false,
  },
  goal: {
    title: "New football boots",
    current: 240,
    target: 400,
  },
  ownedItems: ["shop-dino"],
  badges: [
    { id: "medal", name: "First Coin", artKey: "badgeMedal", got: true, dateUnlocked: "Aug 12", desc: "Collected your very first gold coin in a quest.", xpValue: 50 },
    { id: "piggy", name: "Piggy Pro", artKey: "badgePiggy", got: true, dateUnlocked: "Aug 16", desc: "Deposited 100+ coins into your savings goal.", xpValue: 100 },
    { id: "flame", name: "5 Day Streak", artKey: "badgeFlame", got: true, dateUnlocked: "Aug 20", desc: "Completed quests 5 days in a row.", xpValue: 150 },
    { id: "sprout", name: "Smart Saver", artKey: "badgeSprout", got: true, dateUnlocked: "Aug 25", desc: "Completed the budget simulation.", xpValue: 100 },
    { id: "target", name: "Goal Getter", artKey: "badgeTarget", got: false, desc: "Reach 100% of your personal savings goal.", xpValue: 200 },
    { id: "rocket", name: "Super Saver", artKey: "badgeRocket", got: false, desc: "Complete 10 quest levels without errors.", xpValue: 250 },
  ],
  gameProgress: {
    "money-basics": 5,
    "budget-boss": 2,
    "save-invest": 1,
    "smart-spender": 0,
    "digital-money": 0,
    "young-hustler": 0,
  },
  dailyChallenge: {
    completed: false,
    title: "Build a KES 5,000 monthly budget",
    xp: 150,
    coins: 40,
  },
  auth: {
    isLoggedIn: true,
    email: "amani@family.com",
    provider: "email",
  },
};

function loadInitialState(): LetterboxState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        user: { ...DEFAULT_STATE.user, ...(parsed.user || {}) },
        settings: { ...DEFAULT_STATE.settings, ...(parsed.settings || {}) },
        goal: { ...DEFAULT_STATE.goal, ...(parsed.goal || {}) },
      };
    }
  } catch (e) {
    console.error("Failed to load player state:", e);
  }
  return DEFAULT_STATE;
}

let globalState: LetterboxState = loadInitialState();
const listeners = new Set<() => void>();

function emitChange() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    } catch (e) {
      console.error("Failed to persist player state:", e);
    }
  }
  listeners.forEach((listener) => listener());
}

export function useUserStore() {
  const [state, setState] = useState<LetterboxState>(globalState);

  useEffect(() => {
    const handleUpdate = () => setState({ ...globalState });
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    globalState = {
      ...globalState,
      user: { ...globalState.user, ...updates },
    };
    emitChange();
    playPop(globalState.settings.soundEnabled);
  }, []);

  const addCoins = useCallback((amount: number) => {
    globalState = {
      ...globalState,
      user: {
        ...globalState.user,
        coins: Math.max(0, globalState.user.coins + amount),
      },
    };
    emitChange();
    playCoin(globalState.settings.soundEnabled);
  }, []);

  const addXp = useCallback((amount: number) => {
    const newXp = globalState.user.xp + amount;
    const newLevel = Math.floor(newXp / 350) + 1;
    const leveledUp = newLevel > globalState.user.level;

    globalState = {
      ...globalState,
      user: {
        ...globalState.user,
        xp: newXp,
        level: Math.max(globalState.user.level, newLevel),
      },
    };
    emitChange();

    if (leveledUp) {
      playSuccess(globalState.settings.soundEnabled);
      triggerConfetti();
    }
  }, []);

  const setAvatar = useCallback((avatar: AvatarKey) => {
    globalState = {
      ...globalState,
      user: { ...globalState.user, avatar },
    };
    emitChange();
    playPop(globalState.settings.soundEnabled);
  }, []);

  const toggleSound = useCallback(() => {
    const nextVal = !globalState.settings.soundEnabled;
    globalState = {
      ...globalState,
      settings: { ...globalState.settings, soundEnabled: nextVal },
    };
    emitChange();
    if (nextVal) playPop(true);
  }, []);

  const toggleReminders = useCallback(() => {
    globalState = {
      ...globalState,
      settings: {
        ...globalState.settings,
        remindersEnabled: !globalState.settings.remindersEnabled,
      },
    };
    emitChange();
    playPop(globalState.settings.soundEnabled);
  }, []);

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    globalState = {
      ...globalState,
      settings: { ...globalState.settings, ...updates },
    };
    emitChange();
    playPop(globalState.settings.soundEnabled);
  }, []);

  const depositToGoal = useCallback((amount: number) => {
    if (globalState.user.coins < amount) return false;
    const newGoalCurrent = globalState.goal.current + amount;
    const completed = newGoalCurrent >= globalState.goal.target;

    const updatedBadges = globalState.badges.map((b) =>
      b.id === "target" && completed ? { ...b, got: true, dateUnlocked: "Today" } : b
    );

    globalState = {
      ...globalState,
      user: {
        ...globalState.user,
        coins: globalState.user.coins - amount,
      },
      goal: {
        ...globalState.goal,
        current: newGoalCurrent,
      },
      badges: updatedBadges,
    };
    emitChange();
    playCoin(globalState.settings.soundEnabled);
    if (completed) {
      playSuccess(globalState.settings.soundEnabled);
      triggerConfetti();
    }
    return true;
  }, []);

  const buyShopItem = useCallback((itemId: string, cost: number) => {
    if (globalState.user.coins < cost || globalState.ownedItems.includes(itemId)) {
      return false;
    }
    globalState = {
      ...globalState,
      user: {
        ...globalState.user,
        coins: globalState.user.coins - cost,
        equippedItem: itemId,
      },
      ownedItems: [...globalState.ownedItems, itemId],
    };
    emitChange();
    playSuccess(globalState.settings.soundEnabled);
    triggerConfetti();
    return true;
  }, []);

  const completeLevel = useCallback((gameId: string, levelIndex: number, xpReward: number, coinReward: number) => {
    const currentDone = globalState.gameProgress[gameId] || 0;
    const newDone = Math.max(currentDone, levelIndex + 1);

    globalState = {
      ...globalState,
      user: {
        ...globalState.user,
        xp: globalState.user.xp + xpReward,
        coins: globalState.user.coins + coinReward,
        streak: globalState.user.streak + 1,
      },
      gameProgress: {
        ...globalState.gameProgress,
        [gameId]: newDone,
      },
    };
    emitChange();
    playSuccess(globalState.settings.soundEnabled);
    triggerConfetti();
  }, []);

  const loginWithProvider = useCallback((provider: string, email = "amani@family.com", name = "Amani") => {
    globalState = {
      ...globalState,
      auth: {
        isLoggedIn: true,
        email,
        provider,
      },
      user: {
        ...globalState.user,
        name: name || globalState.user.name,
      },
    };
    emitChange();
    playSuccess(globalState.settings.soundEnabled);
  }, []);

  const signupUser = useCallback((name: string, age: string, avatar: AvatarKey, email: string) => {
    globalState = {
      ...globalState,
      auth: {
        isLoggedIn: true,
        email,
        provider: "signup",
      },
      user: {
        ...globalState.user,
        name,
        avatar,
        coins: globalState.user.coins + 50,
      },
    };
    emitChange();
    playSuccess(globalState.settings.soundEnabled);
    triggerConfetti();
  }, []);

  const logout = useCallback(() => {
    globalState = {
      ...globalState,
      auth: {
        isLoggedIn: false,
        email: undefined,
        provider: undefined,
      },
    };
    emitChange();
    playPop(globalState.settings.soundEnabled);
  }, []);

  const resetAllProgress = useCallback(() => {
    globalState = { ...DEFAULT_STATE };
    emitChange();
  }, []);

  return {
    state,
    user: state.user,
    settings: state.settings,
    goal: state.goal,
    ownedItems: state.ownedItems,
    badges: state.badges,
    gameProgress: state.gameProgress,
    dailyChallenge: state.dailyChallenge,
    auth: state.auth,
    // Actions
    updateProfile,
    addCoins,
    addXp,
    setAvatar,
    toggleSound,
    toggleReminders,
    updateSettings,
    depositToGoal,
    buyShopItem,
    completeLevel,
    loginWithProvider,
    signupUser,
    logout,
    resetAllProgress,
  };
}
