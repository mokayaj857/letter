import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { games } from "@/data/games";
import type { AvatarKey } from "@/assets/icons";

export type Session = {
  name: string;
  avatar: AvatarKey;
  coins: number;
  xp: number;
  streak: number;
  saved: number;
  goal: number;
  owned: string[];
  claimedDaily: boolean;
  sounds: boolean;
  reminders: boolean;
  /** gameId -> number of cleared levels */
  progress: Record<string, number>;
};

const initialProgress = () =>
  Object.fromEntries(games.map((g) => [g.id, g.done])) as Record<string, number>;

const initialState = (): Session => ({
  name: "Amani",
  avatar: "lion",
  coins: 1240,
  xp: 3860,
  streak: 12,
  saved: 240,
  goal: 400,
  owned: [],
  claimedDaily: false,
  sounds: true,
  reminders: true,
  progress: initialProgress(),
});

type Ctx = {
  s: Session;
  setName: (n: string) => void;
  setAvatar: (a: AvatarKey) => void;
  toggle: (k: "sounds" | "reminders") => void;
  claimDaily: () => void;
  completeLevel: (gameId: string, index: number, xp: number) => void;
  buy: (item: string, cost: number) => boolean;
  contribute: (amount: number) => boolean;
  reset: () => void;
};

const SessionContext = createContext<Ctx | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [s, set] = useState<Session>(initialState);

  const setName = useCallback(
    (name: string) => set((p) => ({ ...p, name: name || p.name })),
    [],
  );
  const setAvatar = useCallback(
    (avatar: AvatarKey) => set((p) => ({ ...p, avatar })),
    [],
  );
  const toggle = useCallback(
    (k: "sounds" | "reminders") => set((p) => ({ ...p, [k]: !p[k] })),
    [],
  );
  const claimDaily = useCallback(
    () =>
      set((p) =>
        p.claimedDaily
          ? p
          : { ...p, claimedDaily: true, coins: p.coins + 50, xp: p.xp + 150 },
      ),
    [],
  );

  const completeLevel = useCallback(
    (gameId: string, index: number, xp: number) =>
      set((p) => {
        const done = p.progress[gameId] ?? 0;
        if (index !== done) return p;
        return {
          ...p,
          xp: p.xp + xp,
          coins: p.coins + 20,
          progress: { ...p.progress, [gameId]: done + 1 },
        };
      }),
    [],
  );

  const buy = useCallback((item: string, cost: number) => {
    let ok = false;
    set((p) => {
      if (p.owned.includes(item) || p.coins < cost) return p;
      ok = true;
      return { ...p, coins: p.coins - cost, owned: [...p.owned, item] };
    });
    return ok;
  }, []);

  const contribute = useCallback((amount: number) => {
    let ok = false;
    set((p) => {
      const next = p.saved + amount;
      if (next < 0 || next > p.goal || amount > p.coins) return p;
      ok = true;
      return { ...p, saved: next, coins: p.coins - amount };
    });
    return ok;
  }, []);

  const reset = useCallback(() => set(initialState()), []);

  const value = useMemo(
    () => ({
      s,
      setName,
      setAvatar,
      toggle,
      claimDaily,
      completeLevel,
      buy,
      contribute,
      reset,
    }),
    [s, setName, setAvatar, toggle, claimDaily, completeLevel, buy, contribute, reset],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}

/** Is a game unlocked for the current XP? */
export function isUnlocked(
  game: { locked?: boolean; unlockXp?: number },
  xp: number,
) {
  if (!game.locked) return true;
  return xp >= (game.unlockXp ?? Infinity);
}
