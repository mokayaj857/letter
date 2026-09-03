import type { AvatarKey } from "@/assets/icons";
import {
  firebaseSignInWithGoogle,
  firebaseSignInWithApple,
  firebaseSignInWithEmail,
  firebaseSignUpWithEmail,
  firebaseSendPhoneOtp,
  firebaseLogout,
  firebaseResetPassword,
  formatNameFromEmail,
  getFirebaseErrorMessage,
  isFirebaseConfigured,
} from "./firebase";
import type { ConfirmationResult } from "firebase/auth";

export interface SocialAuthResult {
  success: boolean;
  provider: "google" | "apple" | "phone" | "email" | "picture";
  email: string;
  name: string;
  avatar?: AvatarKey;
  token?: string;
  firebaseUid?: string;
}

export interface SocialSignupOptions {
  name?: string;
  age?: string;
  avatar?: AvatarKey;
  email?: string;
  password?: string;
}

// Backend API URL helper
const API_BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000";

/**
 * Non-blocking background sync with backend if available
 */
function syncWithBackend(payload: {
  provider: string;
  email: string;
  username: string;
  avatar?: string;
  age?: string;
  firebaseUid?: string;
}): void {
  try {
    fetch(`${API_BASE}/api/auth/social-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {}
}

/**
 * Authenticate with Google via Firebase
 */
export async function authenticateWithGoogle(
  mode: "login" | "signup",
  options?: SocialSignupOptions
): Promise<SocialAuthResult> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Please check your credentials.");
  }

  try {
    const fbResult = await firebaseSignInWithGoogle(mode);
    const finalName =
      fbResult.displayName ||
      options?.name?.trim() ||
      formatNameFromEmail(fbResult.email);
    const finalEmail = fbResult.email;

    syncWithBackend({
      provider: "google",
      email: finalEmail,
      username: finalName,
      avatar: options?.avatar,
      age: options?.age,
      firebaseUid: fbResult.user.uid,
    });

    return {
      success: true,
      provider: "google",
      email: finalEmail,
      name: finalName,
      avatar: options?.avatar || "lion",
      token: fbResult.token,
      firebaseUid: fbResult.user.uid,
    };
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Authenticate with Apple via Firebase
 */
export async function authenticateWithApple(
  mode: "login" | "signup",
  options?: SocialSignupOptions
): Promise<SocialAuthResult> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Please check your credentials.");
  }

  try {
    const fbResult = await firebaseSignInWithApple(mode);
    const finalName =
      fbResult.displayName ||
      options?.name?.trim() ||
      formatNameFromEmail(fbResult.email);
    const finalEmail = fbResult.email;

    syncWithBackend({
      provider: "apple",
      email: finalEmail,
      username: finalName,
      avatar: options?.avatar,
      age: options?.age,
      firebaseUid: fbResult.user.uid,
    });

    return {
      success: true,
      provider: "apple",
      email: finalEmail,
      name: finalName,
      avatar: options?.avatar || "lion",
      token: fbResult.token,
      firebaseUid: fbResult.user.uid,
    };
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Authenticate with Email & Password via Firebase
 */
export async function authenticateWithEmail(
  mode: "login" | "signup",
  email: string,
  password: string,
  options?: SocialSignupOptions
): Promise<SocialAuthResult> {
  if (!email || !email.trim()) {
    throw new Error("Please enter your email address.");
  }
  if (!password || !password.trim()) {
    throw new Error("Please enter your password.");
  }

  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Please check your credentials.");
  }

  try {
    const user =
      mode === "signup"
        ? await firebaseSignUpWithEmail(email.trim(), password)
        : await firebaseSignInWithEmail(email.trim(), password);

    const name =
      options?.name?.trim() ||
      user.displayName ||
      formatNameFromEmail(user.email || email.trim());
    const token = await user.getIdToken().catch(() => undefined);

    syncWithBackend({
      provider: "email",
      email: user.email || email.trim(),
      username: name,
      avatar: options?.avatar,
      age: options?.age,
      firebaseUid: user.uid,
    });

    return {
      success: true,
      provider: "email",
      email: user.email || email.trim(),
      name,
      avatar: options?.avatar || "lion",
      token,
      firebaseUid: user.uid,
    };
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Send Phone Verification OTP via Firebase
 */
export async function sendPhoneVerificationCode(phoneNumber: string): Promise<ConfirmationResult> {
  if (!phoneNumber || !phoneNumber.trim()) {
    throw new Error("Please enter a phone number.");
  }

  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured. Please check your credentials.");
  }

  try {
    return await firebaseSendPhoneOtp(phoneNumber.trim());
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Reset Password via Firebase
 */
export async function requestPasswordReset(email: string): Promise<boolean> {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase is not configured.");
  }

  try {
    await firebaseResetPassword(email.trim());
    return true;
  } catch (error) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

/**
 * Log Out
 */
export async function signOutEverywhere(): Promise<void> {
  try {
    await firebaseLogout();
  } catch (err) {
    console.warn("Sign out error:", err);
  }
}
