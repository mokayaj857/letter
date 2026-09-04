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
  age?: string;
  email?: string;
  provider?: string;
}

export interface UserSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
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

export interface RegisteredAccount {
  id: string;
  emailOrPhone: string;
  name: string;
  avatar: AvatarKey;
  age?: string;
  provider: string;
  pictureCode?: string[];
  createdAt: string;
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
    token?: string;
  };
  registeredAccounts: RegisteredAccount[];
}

const STORAGE_KEY = "letterbox_player_state_v2";

const DEFAULT_STATE: LetterboxState = {
  user: {
    name: "Player",
    avatar: "lion",
    level: 1,
    title: "Beginner Saver",
    coins: 100,
    streak: 1,
    xp: 250,
    equippedItem: null,
  },
  settings: {
    soundEnabled: true,
    musicEnabled: true,
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
    { id: "flame", name: "5 Day Streak", artKey: "badgeFlame", got: false, desc: "Completed quests 5 days in a row.", xpValue: 150 },
    { id: "sprout", name: "Smart Saver", artKey: "badgeSprout", got: false, desc: "Completed the budget simulation.", xpValue: 100 },
    { id: "target", name: "Goal Getter", artKey: "badgeTarget", got: false, desc: "Reach 100% of your personal savings goal.", xpValue: 200 },
    { id: "rocket", name: "Super Saver", artKey: "badgeRocket", got: false, desc: "Complete 10 quest levels without errors.", xpValue: 250 },
  ],
  gameProgress: {
    "money-basics": 1,
    "budget-boss": 0,
    "save-invest": 0,
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
    isLoggedIn: false,
    email: undefined,
    provider: undefined,
  },
  registeredAccounts: [],
};

function loadInitialState(): LetterboxState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Reset legacy hardcoded pseudo-name if present
      if (parsed.user?.name === "Amani" && (!parsed.auth?.email || parsed.auth?.email === "amani@family.com")) {
        return DEFAULT_STATE;
      }
      return {
        ...DEFAULT_STATE,
        ...parsed,
        user: { ...DEFAULT_STATE.user, ...(parsed.user || {}) },
        settings: {
          ...DEFAULT_STATE.settings,
          ...(parsed.settings || {}),
          musicEnabled: parsed.settings?.musicEnabled ?? true,
        },
        goal: { ...DEFAULT_STATE.goal, ...(parsed.goal || {}) },
        registeredAccounts: parsed.registeredAccounts || [],
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

  const toggleMusic = useCallback(() => {
    const nextVal = !globalState.settings.musicEnabled;
    globalState = {
      ...globalState,
      settings: { ...globalState.settings, musicEnabled: nextVal },
    };
    emitChange();
    if (nextVal) playPop(globalState.settings.soundEnabled);
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

  const isAccountRegistered = useCallback((emailOrPhone: string): boolean => {
    if (!emailOrPhone) return false;
    const norm = emailOrPhone.trim().toLowerCase();
    return (globalState.registeredAccounts || []).some(
      (acc) => acc.emailOrPhone.trim().toLowerCase() === norm
    );
  }, []);

  const getRegisteredAccount = useCallback((identifier: string): RegisteredAccount | undefined => {
    if (!identifier) return undefined;
    const norm = identifier.trim().toLowerCase();
    return (globalState.registeredAccounts || []).find(
      (acc) => acc.emailOrPhone.trim().toLowerCase() === norm
    );
  }, []);

  const findAccountByPictureCode = useCallback((code: string[]): RegisteredAccount | undefined => {
    if (!code || code.length < 3) return undefined;
    const target = code.join("-");
    return (globalState.registeredAccounts || []).find(
      (acc) => acc.pictureCode && acc.pictureCode.join("-") === target
    );
  }, []);

  const loginWithProvider = useCallback((
    provider: string,
    email?: string,
    name?: string,
    avatar?: AvatarKey,
    token?: string
  ) => {
    let resolvedName = name?.trim();
    if (!resolvedName && email) {
      const raw = email.split("@")[0] || "";
      const parts = raw.split(/[._-]/).filter(Boolean);
      resolvedName = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
    }
    if (!resolvedName) {
      resolvedName = "Player";
    }

    globalState = {
      ...globalState,
      auth: {
        isLoggedIn: true,
        email: email || "",
        provider,
        token,
      },
      user: {
        ...globalState.user,
        name: resolvedName,
        email: email || "",
        provider,
        ...(avatar ? { avatar } : {}),
      },
    };
    emitChange();
    playSuccess(globalState.settings.soundEnabled);
  }, []);

  const signupUser = useCallback((
    name: string,
    age: string,
    avatar: AvatarKey,
    emailOrPhone: string,
    provider = "signup",
    token?: string,
    pictureCode?: string[]
  ) => {
    let resolvedName = name?.trim();
    if (!resolvedName && emailOrPhone) {
      const raw = emailOrPhone.includes("@") ? emailOrPhone.split("@")[0] : emailOrPhone;
      const parts = raw.split(/[._-]/).filter(Boolean);
      resolvedName = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
    }
    if (!resolvedName) {
      resolvedName = "Player";
    }

    const currentAccounts = globalState.registeredAccounts || [];
    const norm = emailOrPhone.trim().toLowerCase();
    const existingIndex = currentAccounts.findIndex(
      (a) => a.emailOrPhone.trim().toLowerCase() === norm
    );

    let updatedAccounts: RegisteredAccount[];
    if (existingIndex >= 0) {
      updatedAccounts = currentAccounts.map((a, idx) =>
        idx === existingIndex
          ? { ...a, name: resolvedName, age, avatar, pictureCode: pictureCode || a.pictureCode }
          : a
      );
    } else {
      updatedAccounts = [
        ...currentAccounts,
        {
          id: `acc_${Date.now()}`,
          emailOrPhone: emailOrPhone.trim(),
          name: resolvedName,
          avatar,
          age: age || "11",
          provider,
          pictureCode,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    globalState = {
      ...globalState,
      registeredAccounts: updatedAccounts,
      auth: {
        isLoggedIn: true,
        email: emailOrPhone,
        provider,
        token,
      },
      user: {
        ...globalState.user,
        name: resolvedName,
        age: age || "11",
        avatar,
        email: emailOrPhone,
        provider,
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
        token: undefined,
      },
      user: {
        ...globalState.user,
        name: "Player",
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
    registeredAccounts: state.registeredAccounts,
    // Actions
    updateProfile,
    addCoins,
    addXp,
    setAvatar,
    toggleSound,
    toggleMusic,
    toggleReminders,
    updateSettings,
    depositToGoal,
    buyShopItem,
    completeLevel,
    loginWithProvider,
    signupUser,
    logout,
    resetAllProgress,
    isAccountRegistered,
    getRegisteredAccount,
    findAccountByPictureCode,
  };
}
