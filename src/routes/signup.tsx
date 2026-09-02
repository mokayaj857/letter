import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Phone, ArrowLeft, Sparkles, Check } from "lucide-react";
import { Screen } from "@/components/PhoneFrame";
import { Field, GoogleIcon, AppleIcon } from "./login";
import { avatarList, type AvatarKey } from "@/assets/icons";
import { useUserStore } from "../lib/userStore";
import { toast } from "sonner";
import { playPop, playSuccess } from "../lib/audio";
import { triggerConfetti } from "../lib/confetti";

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
  const [kidName, setKidName] = useState("Amani");
  const [parentEmail, setParentEmail] = useState("parent@family.com");
  const [secretCode, setSecretCode] = useState("••••••");
  const [loading, setLoading] = useState(false);

  const handleAvatarSelect = (key: AvatarKey) => {
    setSelectedAvatar(key);
    playPop(settings.soundEnabled);
  };

  const handleAgeSelect = (age: string) => {
    setSelectedAge(age);
    playPop(settings.soundEnabled);
  };

  const handleSocialSignup = (provider: string) => {
    playPop(settings.soundEnabled);
    toast.loading(`Creating account with ${provider}...`, { id: "social-signup" });

    setTimeout(() => {
      toast.dismiss("social-signup");
      signupUser(kidName || "Amani", selectedAge, selectedAvatar, `kid@${provider.toLowerCase()}.com`);
      toast.success(`Welcome to Letterbox, ${kidName || "Amani"}!`);
      triggerConfetti();
      navigate({ to: "/" });
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kidName.trim()) {
      toast.error("Please enter a first name");
      return;
    }
    setLoading(true);
    playPop(settings.soundEnabled);

    setTimeout(() => {
      setLoading(false);
      signupUser(kidName.trim(), selectedAge, selectedAvatar, parentEmail);
      toast.success(`Welcome to Letterbox, ${kidName}!`);
      triggerConfetti();
      navigate({ to: "/" });
    }, 450);
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
          placeholder="Amani"
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
