import { useState, useEffect, useCallback } from "react";
import type { AvatarKey } from "@/assets/icons";
import {
  playCoin,
  playPop,
  playSuccess,
  setMusicVolume as applyMusicVolume,
  setSoundVolume as applySoundVolume,
  setSelectedTrackPreference,
  stopBackgroundMusic,
} from "./audio";
import { triggerConfetti } from "./confetti";
import api from "./api";
import { isFirebaseConfigured, subscribeToFirebaseAuthState } from "./firebase";
import { signOutEverywhere } from "./authService";

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
  musicVolume?: number; // 0 to 100, default 70
  soundVolume?: number; // 0 to 100, default 80
  bgmTrack?: string; // "auto" or specific track id
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
    musicVolume: 70,
    soundVolume: 80,
    bgmTrack: "auto",
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
  },
  registeredAccounts: [],
};

function cloneState(state: LetterboxState): LetterboxState {
  return JSON.parse(JSON.stringify(state)) as LetterboxState;
}

function mergeRegisteredAccounts(
  local: RegisteredAccount[],
  remote: RegisteredAccount[] | undefined
): RegisteredAccount[] {
  if (!remote || remote.length === 0) return local;
  const byKey = new Map<string, RegisteredAccount>();
  for (const acc of [...remote, ...local]) {
    const key = acc.id || acc.emailOrPhone.toLowerCase();
    if (key && !byKey.has(key)) byKey.set(key, acc);
  }
  return Array.from(byKey.values());
}

function normalizeState(partial: Partial<LetterboxState>): LetterboxState {
  const state: LetterboxState = {
    ...DEFAULT_STATE,
    ...partial,
    user: { ...DEFAULT_STATE.user, ...(partial.user || {}) },
    settings: {
      ...DEFAULT_STATE.settings,
      ...(partial.settings || {}),
      musicEnabled: partial.settings?.musicEnabled ?? true,
      musicVolume: partial.settings?.musicVolume ?? 70,
      soundVolume: partial.settings?.soundVolume ?? 80,
      bgmTrack: partial.settings?.bgmTrack ?? "auto",
    },
    goal: { ...DEFAULT_STATE.goal, ...(partial.goal || {}) },
    registeredAccounts: mergeRegisteredAccounts(
      (partial.registeredAccounts || []),
      undefined
    ),
    auth: { ...DEFAULT_STATE.auth, ...(partial.auth || {}) },
  };
  return state;
}

/**
 * Merge a dashboard payload returned by the backend into global state.
 * Server data is authoritative, but locally-created registered accounts
 * (e.g. a just-signed-up sibling) are preserved when the server doesn't
 * know about them yet.
 */
function adoptDashboard(data: Partial<LetterboxState>): void {
  const auth = { ...globalState.auth, ...(data.auth || {}) };
  const remoteAccounts = data.registeredAccounts;
  globalState = normalizeState({
    ...data,
    registeredAccounts: mergeRegisteredAccounts(globalState.registeredAccounts, remoteAccounts),
    auth,
  });
  applyMusicVolume(globalState.settings.musicVolume ?? 70);
  applySoundVolume(globalState.settings.soundVolume ?? 80);
  setSelectedTrackPreference(globalState.settings.bgmTrack || "auto");
  emitChange();
}

/**
 * Fire a backend sync in the background. On success the authoritative
 * dashboard replaces the local state; failures are non-fatal (offline demo).
 */
function syncWithBackend(promise: Promise<{ success: boolean; data?: any }>): void {
  promise
    .then((res) => {
      if (res && res.data) adoptDashboard(res.data);
    })
    .catch(() => {
      // Backend offline/unavailable — keep the optimistic local state.
    });
}

let globalState: LetterboxState = cloneState(DEFAULT_STATE);
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach((listener) => listener());
}

// Restore a previously signed-in Firebase session on app load, pulling the
// authoritative player state from the backend instead of localStorage.
if (typeof window !== "undefined" && isFirebaseConfigured()) {
  try {
    subscribeToFirebaseAuthState((fbUser) => {
      if (fbUser) {
        syncWithBackend(api.dashboard());
      } else if (globalState.auth.isLoggedIn) {
        globalState = cloneState({ ...DEFAULT_STATE, registeredAccounts: globalState.registeredAccounts });
        emitChange();
      }
    });
  } catch (e) {
    console.warn("Failed to subscribe to Firebase auth state:", e);
  }
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

    if (globalState.auth.isLoggedIn) {
      const body: Record<string, unknown> = {};
      if (updates.name !== undefined) body["name"] = updates.name;
      if (updates.title !== undefined) body["title"] = updates.title;
      if (updates.avatar !== undefined) body["avatar"] = updates.avatar;
      if (updates.age !== undefined) body["age"] = updates.age;
      if (updates.email !== undefined) body["email"] = updates.email;
      if (Object.keys(body).length > 0) {
        syncWithBackend(api.updateProfile(body));
      }
    }
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

    if (globalState.auth.isLoggedIn) {
      syncWithBackend(api.updateProfile({ avatar }));
    }
  }, []);

  const toggleSound = useCallback(() => {
    const nextVal = !globalState.settings.soundEnabled;
    globalState = {
      ...globalState,
      settings: { ...globalState.settings, soundEnabled: nextVal },
    };
    emitChange();
    if (!nextVal) {
      stopBackgroundMusic();
    }
    if (nextVal) playPop(true);

    if (globalState.auth.isLoggedIn) {
      syncWithBackend(api.updateSettings({ soundEnabled: nextVal }));
    }
  }, []);

  const toggleMusic = useCallback(() => {
    const nextVal = !globalState.settings.musicEnabled;
    globalState = {
      ...globalState,
      settings: { ...globalState.settings, musicEnabled: nextVal },
    };
    emitChange();
    if (!nextVal) {
      stopBackgroundMusic();
    } else {
      applyMusicVolume(globalState.settings.musicVolume ?? 70);
    }
    if (nextVal) playPop(globalState.settings.soundEnabled);

    if (globalState.auth.isLoggedIn) {
      syncWithBackend(api.updateSettings({ musicEnabled: nextVal }));
    }
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(volume)));
    globalState = {
      ...globalState,
      settings: { ...globalState.settings, musicVolume: clamped },
    };
    emitChange();
    applyMusicVolume(clamped);

    if (globalState.auth.isLoggedIn) {
      syncWithBackend(api.updateSettings({ musicVolume: clamped }));
    }
  }, []);

  const setSoundVolume = useCallback((volume: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(volume)));
    globalState = {
      ...globalState,
      settings: { ...globalState.settings, soundVolume: clamped },
    };
    emitChange();
    applySoundVolume(clamped);

    if (globalState.auth.isLoggedIn) {
      syncWithBackend(api.updateSettings({ soundVolume: clamped }));
    }
  }, []);

  const setBgmTrack = useCallback((trackId: string) => {
    globalState = {
      ...globalState,
      settings: { ...globalState.settings, bgmTrack: trackId },
    };
    emitChange();
    setSelectedTrackPreference(trackId);
    playPop(globalState.settings.soundEnabled);

    if (globalState.auth.isLoggedIn) {
      syncWithBackend(api.updateSettings({ bgmTrack: trackId }));
    }
  }, []);

  const toggleReminders = useCallback(() => {
    const nextVal = !globalState.settings.remindersEnabled;
    globalState = {
      ...globalState,
      settings: {
        ...globalState.settings,
        remindersEnabled: nextVal,
      },
    };
    emitChange();
    playPop(globalState.settings.soundEnabled);

    if (globalState.auth.isLoggedIn) {
      syncWithBackend(api.updateSettings({ remindersEnabled: nextVal }));
    }
  }, []);

  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    globalState = {
      ...globalState,
      settings: { ...globalState.settings, ...updates },
    };
    emitChange();
    playPop(globalState.settings.soundEnabled);

    if (globalState.auth.isLoggedIn) {
      syncWithBackend(api.updateSettings(updates));
    }
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

    if (globalState.auth.isLoggedIn) {
      syncWithBackend(api.updateGoal({ deposit: amount }));
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

    if (globalState.auth.isLoggedIn) {
      syncWithBackend(api.buyItem(itemId, cost));
    }
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

    if (globalState.auth.isLoggedIn) {
      syncWithBackend(api.completeLevel({ gameId, levelIndex, xpReward, coinReward }));
    }
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
    token?: string,
    firebaseUid?: string
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

    const authUpdate: LetterboxState["auth"] = {
      isLoggedIn: true,
      email: email || "",
      provider,
    };
    if (token) authUpdate.token = token;

    globalState = {
      ...globalState,
      auth: authUpdate,
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

    if (firebaseUid || (email && email.includes("@"))) {
      syncWithBackend(
        api.socialLogin({
          provider: provider || "email",
          email: email || "",
          username: resolvedName,
          ...(avatar ? { avatar } : {}),
          ...(firebaseUid ? { firebaseUid } : {}),
        })
      );
    }
  }, []);

  const signupUser = useCallback((
    name: string,
    age: string,
    avatar: AvatarKey,
    emailOrPhone: string,
    provider = "signup",
    token?: string,
    pictureCode?: string[],
    firebaseUid?: string
  ) => {
    let resolvedName = name?.trim();
    if (!resolvedName && emailOrPhone) {
      const raw = (emailOrPhone.includes("@") ? emailOrPhone.split("@")[0] : emailOrPhone) || "";
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
          ? {
              ...a,
              name: resolvedName,
              age,
              avatar,
              ...(pictureCode ? { pictureCode } : {}),
            }
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
          ...(pictureCode ? { pictureCode } : {}),
          createdAt: new Date().toISOString(),
        },
      ];
    }

    const authUpdate: LetterboxState["auth"] = {
      isLoggedIn: true,
      email: emailOrPhone,
      provider,
    };
    if (token) authUpdate.token = token;

    globalState = {
      ...globalState,
      registeredAccounts: updatedAccounts,
      auth: authUpdate,
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

    if (firebaseUid || emailOrPhone.includes("@")) {
      syncWithBackend(
        api.socialLogin({
          provider: provider || "email",
          email: emailOrPhone,
          username: resolvedName,
          ...(avatar ? { avatar } : {}),
          ...(age ? { age } : {}),
          ...(firebaseUid ? { firebaseUid } : {}),
        })
      );
      if (firebaseUid) {
        syncWithBackend(
          api.createAccount({
            emailOrPhone: emailOrPhone.trim(),
            name: resolvedName,
            avatar,
            age,
            provider,
            pictureCode,
          })
        );
      }
    }
  }, []);

  const logout = useCallback(() => {
    globalState = {
      ...globalState,
      auth: { isLoggedIn: false },
      user: {
        ...globalState.user,
        name: "Player",
      },
    };
    emitChange();
    playPop(globalState.settings.soundEnabled);
    signOutEverywhere();
  }, []);

  const resetAllProgress = useCallback(() => {
    globalState = cloneState({ ...DEFAULT_STATE, registeredAccounts: globalState.registeredAccounts });
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
    setMusicVolume,
    setSoundVolume,
    setBgmTrack,
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