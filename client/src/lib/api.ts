import type { AvatarKey } from "@/assets/icons";
import { auth as firebaseAuth } from "./firebase";

export const API_BASE: string =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

// Mapping from client camelCase to server snake_case columns is handled server-side.
// The server returns data already shaped as LetterboxState. Here we just pass raw.

async function getToken(): Promise<string | null> {
  const currentUser = firebaseAuth?.currentUser;
  if (!currentUser) return null;
  try {
    return await currentUser.getIdToken();
  } catch {
    return null;
  }
}

/**
 * Perform an authenticated fetch. If firebase-admin isn't configured server-side,
 * the backend falls back to the x-firebase-uid header for dev.
 */
async function request<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const token = await getToken();
  const uid = firebaseAuth?.currentUser?.uid;

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (uid) {
    // Dev fallback header
    headers["X-Firebase-Uid"] = uid;
    const email = firebaseAuth?.currentUser?.email;
    const name = firebaseAuth?.currentUser?.displayName;
    if (email) headers["X-Firebase-Email"] = email;
    if (name) headers["X-Firebase-Name"] = name;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }
  return json as T;
}

const api = {
  // Auth / dashboard
  socialLogin: (payload: {
    provider: string;
    email: string;
    username: string;
    avatar?: string;
    age?: string;
    firebaseUid?: string;
  }) =>
    request<{ success: boolean; data: any }>("/api/auth/social-login", {
      method: "POST",
      body: payload,
    }),

  dashboard: () => request<{ success: boolean; data: any }>("/api/auth/dashboard"),

  // Profile / settings / goal
  updateProfile: (updates: Record<string, unknown>) =>
    request<{ success: boolean; data: any }>("/api/user/profile", {
      method: "PUT",
      body: updates,
    }),
  updateSettings: (updates: Record<string, unknown>) =>
    request<{ success: boolean; data: any }>("/api/user/settings", {
      method: "PUT",
      body: updates,
    }),
  updateGoal: (updates: { title?: string; target?: number; deposit?: number }) =>
    request<{ success: boolean; data: any }>("/api/user/goal", {
      method: "PUT",
      body: updates,
    }),

  // Shop
  buyItem: (itemId: string, cost: number) =>
    request<{ success: boolean; data: any }>("/api/user/items", {
      method: "POST",
      body: { itemId, cost },
    }),
  equipItem: (itemId: string) =>
    request<{ success: boolean; data: any }>(`/api/user/items/${itemId}/equip`, {
      method: "PUT",
    }),

  // Levels & daily
  completeLevel: (payload: {
    gameId: string;
    levelIndex: number;
    xpReward: number;
    coinReward: number;
  }) =>
    request<{ success: boolean; data: any }>("/api/user/levels", {
      method: "POST",
      body: payload,
    }),
  completeDaily: () =>
    request<{ success: boolean; data: any }>("/api/user/daily/complete", {
      method: "POST",
      body: {},
    }),

  // Badges
  unlockBadge: (badgeId: string) =>
    request<{ success: boolean; data: any }>(`/api/user/badges/${badgeId}/unlock`, {
      method: "POST",
      body: {},
    }),

  // Registered accounts
  listAccounts: () =>
    request<{ success: boolean; data: any[] }>("/api/user/accounts"),
  createAccount: (payload: Record<string, unknown>) =>
    request<{ success: boolean; id: number }>("/api/user/accounts", {
      method: "POST",
      body: payload,
    }),
  updateAccount: (id: string, payload: Record<string, unknown>) =>
    request<{ success: boolean }>(`/api/user/accounts/${id}`, {
      method: "PUT",
      body: payload,
    }),
  deleteAccount: (id: string) =>
    request<{ success: boolean }>(`/api/user/accounts/${id}`, {
      method: "DELETE",
    }),
};

export default api;
