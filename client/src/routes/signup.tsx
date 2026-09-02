import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Phone, ArrowLeft, Sparkles, Check, X } from "lucide-react";
import { Screen } from "@/components/PhoneFrame";
import { Field, GoogleIcon, AppleIcon } from "./login";
import { avatarList, type AvatarKey } from "@/assets/icons";
import { useUserStore } from "../lib/userStore";
import { toast } from "sonner";
import { playPop, playSuccess, playError } from "../lib/audio";
import { triggerConfetti } from "../lib/confetti";
import {
  authenticateWithGoogle,
  authenticateWithApple,
  authenticateWithEmail,
  sendPhoneVerificationCode,
} from "../lib/authService";
import { getFirebaseErrorMessage } from "../lib/firebase";
import type { ConfirmationResult } from "firebase/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Join Letterbox — Kids Money Adventure" },
      {
        name: "description",
        content:
          "Create a Letterbox account, pick your character and start the money adventure for ages 10+.",
      },
      { property: "og:title", content: "Join Letterbox — Kids Money Adventure" },
      {
        property: "og:description",
        content: "Sign up in seconds and start earning XP and coins with Boxy.",
      },
    ],
  }),
  component: Signup,
});

const avatars = avatarList.slice(0, 6);
const ages = ["10", "11", "12", "13+"];

function Signup() {
  const navigate = useNavigate();
  const { signupUser, settings } = useUserStore();

  const [selectedAvatar, setSelectedAvatar] = useState<AvatarKey>("lion");
  const [selectedAge, setSelectedAge] = useState("11");
  const [kidName, setKidName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Phone Sign Up Modal State
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneName, setPhoneName] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [phoneConfirmation, setPhoneConfirmation] = useState<ConfirmationResult | null>(null);

  const handleAvatarSelect = (key: AvatarKey) => {
    setSelectedAvatar(key);
    playPop(settings.soundEnabled);
  };

  const handleAgeSelect = (age: string) => {
    setSelectedAge(age);
    playPop(settings.soundEnabled);
  };

  const handleSocialSignup = async (provider: string) => {
    playPop(settings.soundEnabled);
    const provLower = provider.toLowerCase();

    if (provLower === "phone") {
      setPhoneName(kidName);
      setShowPhoneModal(true);
      return;
    }

    toast.loading(`Creating account with ${provider}...`, { id: "social-signup" });

    try {
      const result =
        provLower === "google"
          ? await authenticateWithGoogle("signup", {
              name: kidName.trim() || undefined,
              age: selectedAge,
              avatar: selectedAvatar,
              email: parentEmail.trim() || undefined,
            })
          : await authenticateWithApple("signup", {
              name: kidName.trim() || undefined,
              age: selectedAge,
              avatar: selectedAvatar,
              email: parentEmail.trim() || undefined,
            });

      toast.dismiss("social-signup");
      if (result.success) {
        const finalName = result.name || kidName.trim() || "Player";
        signupUser(
          finalName,
          selectedAge,
          selectedAvatar,
          result.email,
          result.provider,
          result.token
        );
        toast.success(`Welcome to Letterbox, ${finalName}!`);
        triggerConfetti();
        navigate({ to: "/" });
      } else {
        toast.error(`${provider} sign-up could not be completed.`);
      }
    } catch (err: any) {
      toast.dismiss("social-signup");
      toast.error(err?.message || `${provider} sign-up cancelled or failed.`);
    }
  };

  const handlePhoneSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpStep) {
      if (!phone.trim()) {
        toast.error("Please enter a mobile phone number (e.g. +254 712 345678)");
        return;
      }
      playPop(settings.soundEnabled);
      toast.loading("Sending SMS verification code...", { id: "phone-otp-signup" });
      try {
        const confirmation = await sendPhoneVerificationCode(phone.trim());
        toast.dismiss("phone-otp-signup");
        setPhoneConfirmation(confirmation);
        setOtpStep(true);
        setOtpCode("");
        toast.success("SMS verification code sent to your phone!");
      } catch (err: any) {
        toast.dismiss("phone-otp-signup");
        playError(settings.soundEnabled);
        toast.error(err?.message || "Could not send SMS code. Please check your phone number.");
      }
    } else {
      if (!otpCode || otpCode.trim().length < 6) {
        playError(settings.soundEnabled);
        toast.error("Please enter the 6-digit SMS verification code");
        return;
      }
      toast.loading("Verifying SMS code and creating account...", { id: "phone-verify-signup" });
      try {
        if (!phoneConfirmation) {
          throw new Error("Session expired. Please request a new SMS code.");
        }
        const userCredential = await phoneConfirmation.confirm(otpCode.trim());
        toast.dismiss("phone-verify-signup");
        const finalName = phoneName.trim() || kidName.trim() || userCredential.user.displayName || "Player";
        playSuccess(settings.soundEnabled);
        setShowPhoneModal(false);
        signupUser(
          finalName,
          selectedAge,
          selectedAvatar,
          phone.trim(),
          "phone"
        );
        toast.success(`Welcome to Letterbox, ${finalName}!`);
        triggerConfetti();
        navigate({ to: "/" });
      } catch (err: any) {
        toast.dismiss("phone-verify-signup");
        playError(settings.soundEnabled);
        toast.error(getFirebaseErrorMessage(err) || "Invalid verification code. Please check and try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kidName.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!parentEmail.trim()) {
      toast.error("Please enter a parent/grown-up email");
      return;
    }
    if (!secretCode || secretCode.length < 6) {
      toast.error("Secret code must be at least 6 characters");
      return;
    }
    setLoading(true);
    playPop(settings.soundEnabled);

    try {
      const result = await authenticateWithEmail("signup", parentEmail.trim(), secretCode, {
        name: kidName.trim(),
        age: selectedAge,
        avatar: selectedAvatar,
      });
      setLoading(false);
      const finalName = result.name || kidName.trim();
      signupUser(
        finalName,
        selectedAge,
        selectedAvatar,
        result.email,
        "email",
        result.token
      );
      toast.success(`Welcome to Letterbox, ${finalName}!`);
      triggerConfetti();
      navigate({ to: "/" });
    } catch (err: any) {
      setLoading(false);
      playError(settings.soundEnabled);
      toast.error(err?.message || "Could not create account. Please try again.");
    }
  };

  return (
    <Screen withNav={false}>
      {/* Top Header */}
      <Link
        to="/login"
        className="font-display text-sm font-bold text-muted-foreground hover:text-primary-deep transition-colors"
      >
        ← Back
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-primary-deep">
        Let&apos;s make your box!
      </h1>
      <p className="mt-1 text-sm font-semibold text-muted-foreground">
        Set up your player card in under a minute.
      </p>

      {/* Choose Character */}
      <section className="mt-6">
        <p className="ml-2 font-display text-sm font-bold text-primary-deep">
          Choose your character
        </p>
        <div className="mt-2 grid grid-cols-6 gap-2">
          {avatars.map(([key, src], i) => {
            const isSelected = selectedAvatar === key;
            return (
              <button
                key={key}
                type="button"
                aria-label={key}
                onClick={() => handleAvatarSelect(key)}
                className={`press grid aspect-square animate-pop-in place-items-center rounded-2xl border-2 p-1.5 shadow-card hover:-translate-y-0.5 active:scale-95 transition-all ${
                  isSelected ? "border-primary bg-primary-soft ring-2 ring-primary/40" : "border-border bg-card"
                }`}
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  width={384}
                  height={384}
                  className="size-full object-contain"
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Form for Player Card */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <Field
          label="Kid's first name"
          placeholder="Enter your name"
          value={kidName}
          onChange={(e) => setKidName(e.target.value)}
        />

        <div>
          <p className="ml-2 font-display text-sm font-bold text-primary-deep">
            How old are you?
          </p>
          <div className="mt-1 flex gap-2">
            {ages.map((age) => {
              const isSelected = selectedAge === age;
              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => handleAgeSelect(age)}
                  className={`press flex-1 rounded-3xl border-2 py-3 font-display text-lg font-bold shadow-card transition-all active:scale-95 ${
                    isSelected
                      ? "border-primary bg-primary-soft text-primary-deep ring-1 ring-primary/40"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  {age}
                </button>
              );
            })}
          </div>
        </div>

        <Field
          label="Grown-up's email"
          placeholder="parent@family.com"
          type="email"
          value={parentEmail}
          onChange={(e) => setParentEmail(e.target.value)}
        />
        <Field
          label="Secret code"
          placeholder="••••••"
          type="password"
          value={secretCode}
          onChange={(e) => setSecretCode(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="press w-full rounded-3xl bg-primary py-4 font-display text-lg font-bold text-primary-foreground shadow-pop active:translate-y-1.5 active:shadow-none disabled:opacity-75"
        >
          {loading ? "Starting..." : "Start the adventure"}
        </button>
      </form>

      {/* Bottom Section: Quick Sign-Up Options */}
      <div className="my-6 flex items-center gap-3">
        <span className="h-0.5 flex-1 rounded bg-border" />
        <span className="text-xs font-bold text-muted-foreground">or</span>
        <span className="h-0.5 flex-1 rounded bg-border" />
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => handleSocialSignup("Google")}
          className="press flex w-full items-center justify-center gap-3 rounded-3xl border-2 border-border bg-card py-3.5 font-display text-sm font-bold text-foreground shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <GoogleIcon className="size-5" />
          <span>Quick sign up with Google</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleSocialSignup("Apple")}
            className="press flex items-center justify-center gap-2.5 rounded-3xl border-2 border-border bg-card py-3 font-display text-sm font-bold text-foreground shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <AppleIcon className="size-5" />
            <span>Apple</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignup("Phone")}
            className="press flex items-center justify-center gap-2 rounded-3xl border-2 border-border bg-card py-3 font-display text-sm font-bold text-foreground shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Phone className="size-4 text-primary-deep" />
            <span>Phone</span>
          </button>
        </div>
      </div>

      {/* MODAL: Phone Sign-Up Verification */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-4xl border-2 border-border bg-card p-6 shadow-float animate-pop-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid size-8 place-items-center rounded-xl bg-primary-soft text-primary-deep">
                  <Phone className="size-4" />
                </div>
                <h2 className="font-display text-lg font-bold text-primary-deep">
                  {otpStep ? "Verification Code" : "Phone Sign Up"}
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

            <form onSubmit={handlePhoneSignupSubmit} className="mt-4 space-y-4">
              {!otpStep ? (
                <>
                  <label className="block">
                    <span className="ml-2 font-display text-xs font-bold text-primary-deep">
                      Your First Name
                    </span>
                    <input
                      type="text"
                      value={phoneName}
                      onChange={(e) => setPhoneName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="mt-1 w-full rounded-3xl border-2 border-border bg-card px-5 py-3.5 text-base font-semibold outline-none focus:border-primary"
                    />
                  </label>

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
                    Send SMS code
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground">
                    Code sent to <span className="font-bold text-foreground">{phone}</span>
                  </p>
                  <label className="block">
                    <span className="ml-2 font-display text-xs font-bold text-primary-deep">
                      4-Digit Verification Code
                    </span>
                    <input
                      type="text"
                      maxLength={6}
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
                    Confirm & Start Adventure
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Footer link to log in */}
      <p className="mt-8 text-center text-sm font-semibold text-muted-foreground">
        Already have a box?{" "}
        <Link to="/login" className="font-bold text-primary-deep underline">
          Log in
        </Link>
      </p>
    </Screen>
  );
}
