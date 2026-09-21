import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  getAdditionalUserInfo,
  type Auth,
  type User,
  type UserCredential,
  type ConfirmationResult,
} from "firebase/auth";

// Firebase web app configuration
export const firebaseConfig = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"] || "AIzaSyBLGhD8MNujzDFFq0WQrwHcMKDtawtEmIU",
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] || "letterbox-1b06d.firebaseapp.com",
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"] || "letterbox-1b06d",
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] || "letterbox-1b06d.firebasestorage.app",
  messagingSenderId: import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] || "407459576350",
  appId: import.meta.env["VITE_FIREBASE_APP_ID"] || "1:407459576350:web:49e016e3bdac09c2e18c0f",
  measurementId: import.meta.env["VITE_FIREBASE_MEASUREMENT_ID"] || "G-0ZJ8EDM5HM",
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("Placeholder"));
};

// Initialize Firebase App
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Analytics safely on client side
if (typeof window !== "undefined") {
  isAnalyticsSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  }).catch(() => {});
}

export const auth: Auth = getAuth(app);

// Configure Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("profile");
googleProvider.addScope("email");
googleProvider.setCustomParameters({ prompt: "select_account" });

// Configure Apple Provider
const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

/**
 * Format human name from email
 */
export function formatNameFromEmail(email: string): string {
  if (!email || !email.includes("@")) return "Player";
  const raw = email.split("@")[0] || "Player";
  const parts = raw.split(/[._-]/).filter(Boolean);
  if (parts.length === 0) return "Player";
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(" ");
}

/**
 * Format phone number into standard international E.164
 */
export function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-()]/g, "");
  if (!cleaned.startsWith("+")) {
    if (cleaned.startsWith("0")) {
      cleaned = "+254" + cleaned.slice(1);
    } else {
      cleaned = "+" + cleaned;
    }
  }
  return cleaned;
}

/**
 * Map Firebase Auth errors to clear, friendly user messages
 */
export function getFirebaseErrorMessage(error: any): string {
  const code = error?.code || "";
  const msg = error?.message || "";

  switch (code) {
    case "auth/user-not-found":
    case "auth/invalid-credential":
      return "No account found with these credentials. Please check your details or sign up first.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in instead.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-phone-number":
      return "Invalid phone number format. Please include country code (e.g. +254 712 345678).";
    case "auth/missing-phone-number":
      return "Please enter a valid phone number.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded for today. Please try again later or use Google sign-in.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a few moments and try again.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    case "auth/invalid-verification-code":
      return "Invalid verification code. Please check the SMS code and try again.";
    case "auth/code-expired":
      return "SMS code has expired. Please request a new code.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Please try again.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in popup was closed before completing.";
    case "auth/popup-blocked":
      return "The sign-in window was blocked. Allow popups for this site, or try again.";
    case "auth/unauthorized-domain": {
      const host = typeof window !== "undefined" ? window.location.hostname : "this domain";
      return `Google sign-in is not allowed on ${host} yet. In Firebase Console → Authentication → Settings → Authorized domains, add “${host}”.`;
    }
    case "auth/operation-not-supported-in-this-environment":
      return "Google sign-in is not supported in this browser. Try Chrome or Safari.";
    case "auth/account-exists-with-different-credential":
      return "This email is already used with another sign-in method. Log in with that method instead.";
    default:
      return msg.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim() || "Authentication failed.";
  }
}

const GOOGLE_INTENT_KEY = "letterbox-google-auth-mode";

type GoogleAuthMode = "login" | "signup";

export type GoogleAuthResult = {
  user: User;
  email: string;
  displayName: string;
  token?: string | undefined;
  isNewUser?: boolean | undefined;
};

let googleRedirectPromise: Promise<UserCredential | null> | null = null;
let googleRedirectConsumed = false;

function rememberGoogleIntent(mode: GoogleAuthMode) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(GOOGLE_INTENT_KEY, mode);
}

export function readGoogleIntent(): GoogleAuthMode {
  if (typeof window === "undefined") return "login";
  return sessionStorage.getItem(GOOGLE_INTENT_KEY) === "signup" ? "signup" : "login";
}

function clearGoogleIntent() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(GOOGLE_INTENT_KEY);
}

function shouldFallbackToRedirect(error: any) {
  const code = error?.code || "";
  return (
    code === "auth/popup-blocked" ||
    code === "auth/popup-closed-by-user" ||
    code === "auth/cancelled-popup-request" ||
    code === "auth/operation-not-supported-in-this-environment" ||
    code === "auth/internal-error"
  );
}

async function finishGoogleCredential(
  result: UserCredential,
  _mode: GoogleAuthMode,
): Promise<GoogleAuthResult> {
  const info = getAdditionalUserInfo(result);
  const user = result.user;
  const token = await user.getIdToken().catch(() => undefined);
  const email = user.email || "user@gmail.com";
  const displayName = user.displayName || formatNameFromEmail(email);
  return {
    user,
    email,
    displayName,
    token,
    isNewUser: info?.isNewUser ?? undefined,
  };
}

/** Must run once on app load so Cloudflare/PWA redirect sign-in can finish. */
export function getPendingGoogleRedirect(): Promise<UserCredential | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!googleRedirectPromise) {
    googleRedirectPromise = getRedirectResult(auth).catch(() => null);
  }
  return googleRedirectPromise;
}

export async function consumePendingGoogleSignIn(): Promise<
  (GoogleAuthResult & { mode: GoogleAuthMode }) | null
> {
  const result = await getPendingGoogleRedirect();
  if (!result || googleRedirectConsumed) return null;
  googleRedirectConsumed = true;
  const mode = readGoogleIntent();
  clearGoogleIntent();
  return { ...(await finishGoogleCredential(result, mode)), mode };
}

/**
 * Firebase Google Sign In / Sign Up.
 * Popup first, then full-page redirect — popups often fail on Cloudflare and phones.
 */
export async function firebaseSignInWithGoogle(mode: GoogleAuthMode = "login"): Promise<GoogleAuthResult> {
  rememberGoogleIntent(mode);

  try {
    const result = await signInWithPopup(auth, googleProvider);
    clearGoogleIntent();
    return finishGoogleCredential(result, mode);
  } catch (error: any) {
    if (shouldFallbackToRedirect(error)) {
      await signInWithRedirect(auth, googleProvider);
      await new Promise<never>(() => {});
    }
    throw error;
  }
}

/**
 * Firebase Apple Sign In / Sign Up
 */
export async function firebaseSignInWithApple(mode: "login" | "signup" = "login"): Promise<{
  user: User;
  email: string;
  displayName: string;
  token?: string | undefined;
  isNewUser?: boolean | undefined;
}> {
  const result = await signInWithPopup(auth, appleProvider);
  const info = getAdditionalUserInfo(result);

  if (mode === "login" && info?.isNewUser) {
    try {
      await result.user.delete();
    } catch {
      await signOut(auth);
    }
    throw new Error("No account found for this Apple account. Please sign up first.");
  }

  const user = result.user;
  const token = await user.getIdToken().catch(() => undefined);
  const email = user.email || `${(user.displayName || "user").toLowerCase()}@privaterelay.appleid.com`;
  const displayName = user.displayName || formatNameFromEmail(email);
  return {
    user,
    email,
    displayName,
    token,
    isNewUser: info?.isNewUser ?? undefined,
  };
}

/**
 * Firebase Email & Password Sign In
 */
export async function firebaseSignInWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

/**
 * Firebase Email & Password Sign Up
 */
export async function firebaseSignUpWithEmail(email: string, password: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return result.user;
}

/**
 * Verify OTP on Login and reject if it is a new/unregistered user
 */
export async function confirmPhoneLoginOtp(
  confirmation: ConfirmationResult,
  code: string
): Promise<User> {
  const result = await confirmation.confirm(code);
  const info = getAdditionalUserInfo(result);
  if (info?.isNewUser) {
    try {
      await result.user.delete();
    } catch {
      await signOut(auth);
    }
    throw new Error("No account found with this phone number. Please sign up first.");
  }
  return result.user;
}

/**
 * Firebase Password Reset
 */
export async function firebaseResetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Initialize invisible reCAPTCHA for Phone Sign-In
 */
let recaptchaVerifier: RecaptchaVerifier | null = null;

export function getOrCreateRecaptchaVerifier(containerId = "recaptcha-container"): RecaptchaVerifier {
  if (typeof window === "undefined") {
    throw new Error("Phone verification is only available in browser");
  }

  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }

  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch {}
    recaptchaVerifier = null;
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved
    },
    "expired-callback": () => {
      console.warn("reCAPTCHA expired");
    },
  });

  return recaptchaVerifier;
}

/**
 * Firebase Phone Auth - Send SMS Code
 */
export async function firebaseSendPhoneOtp(
  phoneNumber: string
): Promise<ConfirmationResult> {
  const normalized = normalizePhoneNumber(phoneNumber);
  const verifier = getOrCreateRecaptchaVerifier("recaptcha-container");
  return await signInWithPhoneNumber(auth, normalized, verifier);
}

/**
 * Firebase Sign Out
 */
export async function firebaseLogout(): Promise<void> {
  await signOut(auth);
}

/**
 * Subscribe to Firebase Auth State Changes
 */
export function subscribeToFirebaseAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
