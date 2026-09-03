import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Phone, Check, X, Shield, Grid3X3 } from "lucide-react";
import { Screen } from "@/components/PhoneFrame";
import mascot from "@/assets/mascot.png";
import { avatars, avatarList } from "@/assets/icons";
import { useUserStore } from "../lib/userStore";
import { toast } from "sonner";
import { playPop, playSuccess, playError } from "../lib/audio";
import {
  authenticateWithGoogle,
  authenticateWithApple,
  authenticateWithEmail,
  sendPhoneVerificationCode,
} from "../lib/authService";
import { getFirebaseErrorMessage, formatNameFromEmail, confirmPhoneLoginOtp } from "../lib/firebase";
import type { ConfirmationResult } from "firebase/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Letterbox" },
      {
        name: "description",
        content:
          "Log back into Letterbox and keep your money adventure and coin streak going.",
      },
      { property: "og:title", content: "Log in — Letterbox" },
      {
        property: "og:description",
        content: "Welcome back to Letterbox, the kids money adventure app.",
      },
    ],
  }),
  component: Login,
});

export function GoogleIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export function AppleIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.18.65-2.87 1.45-.61.7-.85 1.77-.74 2.87 1.08.08 2.22-.55 2.62-1.22z" />
    </svg>
  );
}

function Login() {
  const navigate = useNavigate();
  const { loginWithProvider, settings, findAccountByPictureCode } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Picture code modal state
  const [showPictureModal, setShowPictureModal] = useState(false);
  const [pictureSequence, setPictureSequence] = useState<string[]>([]);

  // Phone sign in modal state
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [phoneConfirmation, setPhoneConfirmation] = useState<ConfirmationResult | null>(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [parentMathInput, setParentMathInput] = useState("");
  const [showParentReveal, setShowParentReveal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!password.trim()) {
      toast.error("Please enter your secret password");
      return;
    }
    setLoading(true);
    playPop(settings.soundEnabled);

    try {
      const result = await authenticateWithEmail("login", email.trim(), password);
      setLoading(false);
      if (result.success) {
        loginWithProvider("email", result.email, result.name, result.avatar, result.token);
        toast.success(`Welcome back, ${result.name}!`);
        navigate({ to: "/" });
      }
    } catch (err: any) {
      setLoading(false);
      playError(settings.soundEnabled);
      toast.error(err?.message || "No account found with these credentials. Please sign up first.");
    }
  };

  const handleSocialAuth = async (provider: "google" | "apple" | "phone") => {
    if (provider === "phone") {
      playPop(settings.soundEnabled);
      setShowPhoneModal(true);
      return;
    }

    playPop(settings.soundEnabled);
    const providerLabel = provider === "google" ? "Google" : "Apple";
    toast.loading(`Signing in with ${providerLabel}...`, { id: "social-auth" });

    try {
      const result =
        provider === "google"
          ? await authenticateWithGoogle("login")
          : await authenticateWithApple("login");

      toast.dismiss("social-auth");
      if (result.success) {
        loginWithProvider(result.provider, result.email, result.name, result.avatar, result.token);
        toast.success(`Welcome back, ${result.name}!`);
        navigate({ to: "/" });
      } else {
        toast.error(`${providerLabel} sign-in could not be completed.`);
      }
    } catch (err: any) {
      toast.dismiss("social-auth");
      playError(settings.soundEnabled);
      toast.error(err?.message || `No account found for this ${providerLabel} account. Please sign up first.`);
    }
  };

  const handlePictureTap = (key: string) => {
    playPop(settings.soundEnabled);
    if (pictureSequence.length < 3) {
      const nextSeq = [...pictureSequence, key];
      setPictureSequence(nextSeq);

      if (nextSeq.length === 3) {
        const matched = findAccountByPictureCode(nextSeq);
        if (matched) {
          setTimeout(() => {
            setShowPictureModal(false);
            loginWithProvider("picture", matched.emailOrPhone, matched.name, matched.avatar);
            toast.success(`Picture code verified! Welcome back, ${matched.name}.`);
            navigate({ to: "/" });
          }, 400);
        } else {
          setTimeout(() => {
            playError(settings.soundEnabled);
            toast.error("No account found with this picture code. Please sign up first.");
            setPictureSequence([]);
          }, 300);
        }
      }
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpStep) {
      if (!phone.trim()) {
        toast.error("Please enter a mobile phone number (e.g. +254 712 345678)");
        return;
      }
      playPop(settings.soundEnabled);
      toast.loading("Sending SMS verification code...", { id: "phone-otp" });
      try {
        const confirmation = await sendPhoneVerificationCode(phone.trim());
        toast.dismiss("phone-otp");
        setPhoneConfirmation(confirmation);
        setOtpStep(true);
        setOtpCode("");
        toast.success("SMS verification code sent to your phone!");
      } catch (err: any) {
        toast.dismiss("phone-otp");
        playError(settings.soundEnabled);
        toast.error(err?.message || "Could not send SMS code. Please check your phone number.");
      }
    } else {
      if (!otpCode || otpCode.trim().length < 6) {
        playError(settings.soundEnabled);
        toast.error("Please enter the 6-digit SMS verification code");
        return;
      }
      toast.loading("Verifying SMS code...", { id: "phone-verify" });
      try {
        if (!phoneConfirmation) {
          throw new Error("Session expired. Please request a new SMS code.");
        }
        const user = await confirmPhoneLoginOtp(phoneConfirmation, otpCode.trim());
        toast.dismiss("phone-verify");
        playSuccess(settings.soundEnabled);
        setShowPhoneModal(false);
        const finalName = user.displayName || formatNameFromEmail(user.email || phone.trim()) || "Player";
        loginWithProvider("phone", phone.trim(), finalName);
        toast.success(`Welcome back, ${finalName}!`);
        navigate({ to: "/" });
      } catch (err: any) {
        toast.dismiss("phone-verify");
        playError(settings.soundEnabled);
        toast.error(getFirebaseErrorMessage(err) || "No account found with this phone number. Please sign up first.");
      }
    }
  };

  const handleParentGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parentMathInput.trim() === "54") {
      setShowParentReveal(true);
      playSuccess(settings.soundEnabled);
    } else {
      playError(settings.soundEnabled);
      toast.error("Incorrect answer. Please ask a grown-up to help.");
    }
  };

  return (
    <Screen withNav={false}>
      {/* Brand Mascot & Heading */}
      <div className="flex flex-col items-center text-center">
        <img
          src={mascot}
          alt="Boxy the Letterbox mascot"
          width={768}
          height={768}
          className="size-40 animate-bob object-contain"
        />
        <h1 className="mt-2 text-4xl font-bold text-primary-deep">Letterbox</h1>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          Welcome back, little saver!
        </p>
      </div>

      {/* Main Credentials Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <Field
          label="Your name or email"
          placeholder="yourname@family.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Secret code"
          placeholder="••••••"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="press w-full rounded-3xl bg-primary py-4 font-display text-lg font-bold text-primary-foreground shadow-pop active:translate-y-1.5 active:shadow-none disabled:opacity-75"
        >
          {loading ? "Signing in..." : "Let's play"}
        </button>
      </form>

      {/* Forgot Secret Code Trigger */}
      <button
        type="button"
        onClick={() => {
          playPop(settings.soundEnabled);
          setShowForgotModal(true);
        }}
        className="mt-3 w-full text-center text-sm font-bold text-muted-foreground hover:text-primary-deep transition-colors"
      >
        Forgot your secret code?
      </button>

      {/* Picture Code Log in Button */}
      <button
        type="button"
        onClick={() => {
          playPop(settings.soundEnabled);
          setPictureSequence([]);
          setShowPictureModal(true);
        }}
        className="press mt-4 flex w-full items-center justify-center gap-2.5 rounded-3xl border-2 border-border bg-card py-3.5 font-display font-bold text-foreground shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
      >
        <Grid3X3 className="size-5 text-primary" />
        <span>Log in with a picture code</span>
      </button>

      {/* Bottom Section: Quick Sign In with Google, Apple, Phone */}
      <div className="my-6 flex items-center gap-3">
        <span className="h-0.5 flex-1 rounded bg-border" />
        <span className="text-xs font-bold text-muted-foreground">or</span>
        <span className="h-0.5 flex-1 rounded bg-border" />
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => handleSocialAuth("google")}
          className="press flex w-full items-center justify-center gap-3 rounded-3xl border-2 border-border bg-card py-3.5 font-display text-sm font-bold text-foreground shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <GoogleIcon className="size-5" />
          <span>Continue with Google</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleSocialAuth("apple")}
            className="press flex items-center justify-center gap-2.5 rounded-3xl border-2 border-border bg-card py-3 font-display text-sm font-bold text-foreground shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <AppleIcon className="size-5" />
            <span>Apple</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialAuth("phone")}
            className="press flex items-center justify-center gap-2 rounded-3xl border-2 border-border bg-card py-3 font-display text-sm font-bold text-foreground shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Phone className="size-4 text-primary-deep" />
            <span>Phone</span>
          </button>
        </div>
      </div>

      {/* Link to Sign Up */}
      <p className="mt-8 text-center text-sm font-semibold text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="font-bold text-primary-deep underline">
          Make an account
        </Link>
      </p>

      {/* MODAL: Picture Code Authenticator */}
      {showPictureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in overscroll-contain my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-xl bg-primary-soft text-primary-deep">
                  <Grid3X3 className="size-4" />
                </div>
                <h2 className="font-display text-lg font-bold text-primary-deep">
                  Picture Code
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPictureModal(false)}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="mt-2 text-xs font-semibold text-muted-foreground">
              Tap your 3 secret character cards in the correct order:
            </p>

            {/* Selected 3-slot preview */}
            <div className="my-4 flex justify-center gap-3">
              {[0, 1, 2].map((idx) => {
                const key = pictureSequence[idx];
                const avatarSrc = key ? avatars[key as keyof typeof avatars] : null;

                return (
                  <div
                    key={idx}
                    className={`grid size-14 place-items-center rounded-2xl border-2 p-1 transition-all ${avatarSrc
                        ? "border-primary bg-primary-soft shadow-card scale-105"
                        : "border-dashed border-border bg-muted/30 text-xs font-bold text-muted-foreground"
                      }`}
                  >
                    {avatarSrc ? (
                      <img
                        src={avatarSrc}
                        alt="Selected character"
                        className="size-full object-contain"
                      />
                    ) : (
                      idx + 1
                    )}
                  </div>
                );
              })}
            </div>

            {/* Grid of character cards */}
            <div className="grid grid-cols-4 gap-2">
              {avatarList.map(([key, src]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePictureTap(key)}
                  className="press grid aspect-square place-items-center rounded-2xl border-2 border-border bg-card p-1.5 shadow-card hover:border-primary active:scale-95"
                >
                  <img
                    src={src}
                    alt={key}
                    className="size-full object-contain"
                  />
                </button>
              ))}
            </div>

            {pictureSequence.length > 0 && (
              <button
                type="button"
                onClick={() => setPictureSequence([])}
                className="mt-3 w-full text-center text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Reset code
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Phone Number Verification */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in overscroll-contain my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-xl bg-primary-soft text-primary-deep">
                  <Phone className="size-4" />
                </div>
                <h2 className="font-display text-lg font-bold text-primary-deep">
                  {otpStep ? "Verification Code" : "Phone Sign In"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPhoneModal(false);
                  setOtpStep(false);
                }}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handlePhoneSubmit} className="mt-4 space-y-4">
              {!otpStep ? (
                <>
                  <label className="block">
                    <span className="ml-2 font-display text-xs font-bold text-primary-deep">
                      Mobile Number
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+254 712 345 678"
                      className="mt-1 w-full rounded-3xl border-2 border-border bg-card px-5 py-3.5 text-base font-semibold outline-none focus:border-primary"
                    />
                  </label>
                  <button
                    type="submit"
                    className="press w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
                  >
                    Send code
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">
                    Code sent to <span className="font-bold text-foreground">{phone}</span>
                  </p>
                  <label className="block">
                    <span className="ml-2 font-display text-xs font-bold text-primary-deep">
                      4-Digit Code
                    </span>
                    <input
                      type="text"
                      maxLength={4}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="••••"
                      className="mt-1 w-full rounded-3xl border-2 border-border bg-card px-5 py-3 text-center font-display text-2xl font-bold tracking-widest outline-none focus:border-primary"
                    />
                  </label>
                  <button
                    type="submit"
                    className="press w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
                  >
                    Confirm & Enter
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Forgot Secret Code */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in overscroll-contain my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-xl bg-primary-soft text-primary-deep">
                  <Shield className="size-4" />
                </div>
                <h2 className="font-display text-lg font-bold text-primary-deep">
                  Secret Code Helper
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setShowParentReveal(false);
                  setParentMathInput("");
                }}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {!showParentReveal ? (
              <form onSubmit={handleParentGate} className="mt-4 space-y-3.5">
                <div className="rounded-2xl border-2 border-border bg-muted/40 p-4 text-center">
                  <p className="text-xs font-bold text-primary-deep">Grown-Up Verification</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Please solve to view the secret code:
                  </p>
                  <p className="mt-2 font-display text-xl font-bold text-foreground">
                    9 × 6 = ?
                  </p>
                </div>
                <input
                  type="number"
                  placeholder="Answer"
                  value={parentMathInput}
                  onChange={(e) => setParentMathInput(e.target.value)}
                  className="w-full rounded-3xl border-2 border-border bg-card px-5 py-3 text-center font-display text-lg font-bold outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="press w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
                >
                  Verify
                </button>
              </form>
            ) : (
              <div className="mt-4 space-y-3.5">
                <div className="rounded-2xl border-2 border-primary bg-primary-soft p-4 text-center">
                  <p className="text-xs font-bold text-primary-deep">Your Secret Code</p>
                  <p className="mt-1 font-display text-2xl font-bold tracking-widest text-primary-deep">
                    1 2 3 4
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPassword("1234");
                    setShowForgotModal(false);
                    setShowParentReveal(false);
                    toast.success("Code auto-filled into form");
                  }}
                  className="press w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
                >
                  Use This Code
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Screen>
  );
}

export function Field({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="ml-2 font-display text-sm font-bold text-primary-deep">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 w-full rounded-3xl border-2 border-border bg-card px-5 py-3.5 text-base font-semibold outline-none placeholder:text-muted-foreground focus:border-primary transition-colors"
      />
    </label>
  );
}
