const OFFLINE_SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export function registerLetterboxPwa() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  if (!import.meta.env.PROD) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Ignore registration failures (private mode, insecure origin).
    });
  });
}

export function isOfflineSessionFresh(savedAt: number | undefined) {
  if (!savedAt) return false;
  return Date.now() - savedAt < OFFLINE_SESSION_MS;
}
