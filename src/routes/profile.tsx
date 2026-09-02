import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  ShieldCheck,
  Users,
  Volume2,
  VolumeX,
  Edit3,
  Check,
  X,
  Flame,
  Zap,
  RotateCcw,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";
import { avatars, avatarList, type AvatarKey } from "@/assets/icons";
import { useUserStore } from "../lib/userStore";
import { Coin } from "@/components/Coin";
import { toast } from "sonner";
import { playPop, playSuccess, playError } from "../lib/audio";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Letterbox" },
      {
        name: "description",
        content: "Your Letterbox profile: avatar, coins, XP, streak and badges.",
      },
      { property: "og:title", content: "My Profile — Letterbox" },
      {
        property: "og:description",
        content: "Kid profile with avatar picker, progress stats and parent zone.",
      },
    ],
  }),
  component: Profile,
});

const TITLES = [
  "Budget Boss",
  "Coin Wizard",
  "Super Saver",
  "Quest Champion",
  "Piggy Bank Pro",
  "Smart Investor",
];

function Profile() {
  const navigate = useNavigate();
  const {
    user,
    settings,
    setAvatar,
    updateProfile,
    toggleSound,
    toggleReminders,
    updateSettings,
    resetAllProgress,
    logout,
  } = useUserStore();

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [titleInput, setTitleInput] = useState(user.title);

  const [activeStatModal, setActiveStatModal] = useState<"coins" | "streak" | "xp" | null>(null);
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [showParentModal, setShowParentModal] = useState(false);
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [mathAnswer, setMathAnswer] = useState("");
  const [dailyLimit, setDailyLimit] = useState(settings.dailyLimitMinutes || 30);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleAvatarSelect = (key: AvatarKey) => {
    setAvatar(key);
    toast.success(`Active character updated to ${key}`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    updateProfile({ name: nameInput.trim(), title: titleInput });
    setShowEditModal(false);
    toast.success("Profile saved");
  };

  const handleParentGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (mathAnswer.trim() === "56") {
      setParentUnlocked(true);
      playSuccess(settings.soundEnabled);
    } else {
      playError(settings.soundEnabled);
      toast.error("Incorrect. 7 × 8 = 56");
    }
  };

  return (
    <>
      <Screen>
        {/* Profile Hero Card */}
        <div className="relative rounded-3xl border-2 border-border bg-leaf p-5 text-center shadow-card">
          <button
            type="button"
            onClick={() => {
              setNameInput(user.name);
              setTitleInput(user.title);
              setShowEditModal(true);
              playPop(settings.soundEnabled);
            }}
            className="press absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-card/85 px-3 py-1 font-display text-xs font-bold text-primary-deep shadow-sm hover:bg-card active:scale-95 transition-all"
          >
            <Edit3 className="size-3.5" />
            <span>Edit</span>
          </button>

          <div className="mx-auto grid size-24 animate-float-soft place-items-center rounded-full border-4 border-card bg-card p-2 shadow-card">
            <img
              src={avatars[user.avatar]}
              alt={`${user.name} avatar`}
              width={384}
              height={384}
              className="size-full object-contain"
            />
          </div>

          <h1 className="mt-3 text-2xl font-bold text-primary-foreground">{user.name}</h1>
          <p className="text-sm font-semibold text-primary-foreground/85">
            Level {user.level} · {user.title}
          </p>

          {/* Interactive Stat Chips */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => {
                playPop(settings.soundEnabled);
                setActiveStatModal("coins");
              }}
              className="press rounded-2xl bg-card/90 py-2.5 shadow-sm hover:-translate-y-0.5 active:scale-95 transition-transform"
            >
              <p className="font-display text-lg font-bold text-primary-deep">
                {user.coins.toLocaleString()}
              </p>
              <p className="text-[11px] font-bold text-muted-foreground">coins</p>
            </button>

            <button
              type="button"
              onClick={() => {
                playPop(settings.soundEnabled);
                setActiveStatModal("streak");
              }}
              className="press rounded-2xl bg-card/90 py-2.5 shadow-sm hover:-translate-y-0.5 active:scale-95 transition-transform"
            >
              <p className="font-display text-lg font-bold text-primary-deep">
                {user.streak}
              </p>
              <p className="text-[11px] font-bold text-muted-foreground">day streak</p>
            </button>

            <button
              type="button"
              onClick={() => {
                playPop(settings.soundEnabled);
                setActiveStatModal("xp");
              }}
              className="press rounded-2xl bg-card/90 py-2.5 shadow-sm hover:-translate-y-0.5 active:scale-95 transition-transform"
            >
              <p className="font-display text-lg font-bold text-primary-deep">
                {user.xp.toLocaleString()}
              </p>
              <p className="text-[11px] font-bold text-muted-foreground">XP</p>
            </button>
          </div>
        </div>

        {/* Interactive Avatar Picker */}
        <h2 className="mt-7 font-display text-xl font-bold text-primary-deep">
          Pick your avatar
        </h2>
        <div className="mt-3 grid grid-cols-4 gap-3">
          {avatarList.map(([key, src], i) => {
            const isSelected = user.avatar === key;
            return (
              <button
                key={key}
                type="button"
                aria-label={`Select ${key}`}
                onClick={() => handleAvatarSelect(key)}
                className={`press relative grid aspect-square animate-pop-in place-items-center rounded-3xl border-2 p-2 shadow-card hover:-translate-y-1 active:scale-95 transition-all ${
                  isSelected ? "border-primary bg-primary-soft ring-2 ring-primary/40" : "border-border bg-card"
                }`}
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  width={384}
                  height={384}
                  className="size-full object-contain"
                />
                {isSelected && (
                  <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground shadow">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Settings List */}
        <h2 className="mt-7 font-display text-xl font-bold text-primary-deep">
          Settings
        </h2>
        <ul className="mt-3 space-y-3">
          {/* Sound & Music */}
          <li>
            <button
              type="button"
              onClick={() => {
                toggleSound();
                toast.info(settings.soundEnabled ? "Sounds disabled" : "Sounds enabled");
              }}
              className="press flex w-full items-center gap-3 rounded-3xl border-2 border-border bg-card px-4 py-3.5 shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary-deep">
                {settings.soundEnabled ? (
                  <Volume2 className="size-5" strokeWidth={2.4} />
                ) : (
                  <VolumeX className="size-5" strokeWidth={2.4} />
                )}
              </span>
              <span className="flex-1 text-left font-display font-bold">
                Sounds & music
              </span>
              <span
                className={`rounded-full px-3 py-1 font-display text-xs font-bold ${
                  settings.soundEnabled
                    ? "bg-primary-soft text-primary-deep"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {settings.soundEnabled ? "On" : "Off"}
              </span>
            </button>
          </li>

          {/* Reminders */}
          <li>
            <button
              type="button"
              onClick={() => {
                playPop(settings.soundEnabled);
                setShowRemindersModal(true);
              }}
              className="press flex w-full items-center gap-3 rounded-3xl border-2 border-border bg-card px-4 py-3.5 shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary-deep">
                <Bell className="size-5" strokeWidth={2.4} />
              </span>
              <span className="flex-1 text-left font-display font-bold">
                Reminders
              </span>
              <ChevronRight className="size-5 text-muted-foreground" />
            </button>
          </li>

          {/* Grown-up zone */}
          <li>
            <button
              type="button"
              onClick={() => {
                playPop(settings.soundEnabled);
                setShowParentModal(true);
              }}
              className="press flex w-full items-center gap-3 rounded-3xl border-2 border-border bg-card px-4 py-3.5 shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary-deep">
                <Users className="size-5" strokeWidth={2.4} />
              </span>
              <span className="flex-1 text-left font-display font-bold">
                Grown-up zone
              </span>
              <ChevronRight className="size-5 text-muted-foreground" />
            </button>
          </li>

          {/* Safety & privacy */}
          <li>
            <button
              type="button"
              onClick={() => {
                playPop(settings.soundEnabled);
                setShowPrivacyModal(true);
              }}
              className="press flex w-full items-center gap-3 rounded-3xl border-2 border-border bg-card px-4 py-3.5 shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary-deep">
                <ShieldCheck className="size-5" strokeWidth={2.4} />
              </span>
              <span className="flex-1 text-left font-display font-bold">
                Safety & privacy
              </span>
              <ChevronRight className="size-5 text-muted-foreground" />
            </button>
          </li>
        </ul>

        {/* Log out button */}
        <button
          type="button"
          onClick={() => {
            playPop(settings.soundEnabled);
            setShowLogoutModal(true);
          }}
          className="press mt-6 block w-full rounded-3xl border-2 border-border bg-card py-3.5 text-center font-display font-bold text-muted-foreground shadow-card hover:text-foreground active:scale-[0.98]"
        >
          Log out
        </button>
      </Screen>

      {/* MODAL: Edit Profile */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-4xl border-2 border-border bg-card p-6 shadow-float animate-pop-in">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-primary-deep">
                Edit Profile
              </h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <label className="block">
                <span className="ml-2 font-display text-xs font-bold text-primary-deep">
                  Display Name
                </span>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="mt-1 w-full rounded-3xl border-2 border-border bg-card px-5 py-3 font-semibold outline-none focus:border-primary"
                />
              </label>

              <div>
                <span className="ml-2 font-display text-xs font-bold text-primary-deep">
                  Title
                </span>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  {TITLES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTitleInput(t)}
                      className={`rounded-2xl border-2 p-2.5 text-center font-display text-xs font-bold transition-all ${
                        titleInput === t
                          ? "border-primary bg-primary-soft text-primary-deep"
                          : "border-border bg-card text-muted-foreground"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="press w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Stat Breakdown */}
      {activeStatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-4xl border-2 border-border bg-card p-6 shadow-float animate-pop-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeStatModal === "coins" && <Coin className="size-5" />}
                {activeStatModal === "streak" && <Flame className="size-5 text-berry" />}
                {activeStatModal === "xp" && <Zap className="size-5 text-sky" />}
                <h2 className="font-display text-lg font-bold text-primary-deep capitalize">
                  {activeStatModal === "coins" && "Coins Balance"}
                  {activeStatModal === "streak" && "Streak Status"}
                  {activeStatModal === "xp" && "Experience Points"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveStatModal(null)}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {activeStatModal === "coins" && (
              <div className="mt-4 space-y-3">
                <div className="rounded-3xl border-2 border-border bg-sunny p-4 text-center">
                  <p className="text-xs font-bold text-sun-foreground">Total Available</p>
                  <p className="mt-1 font-display text-3xl font-bold text-sun-foreground">
                    {user.coins.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between rounded-2xl bg-secondary p-3">
                    <span>Quest completions</span>
                    <span className="font-bold text-primary-deep">+1,050</span>
                  </div>
                  <div className="flex justify-between rounded-2xl bg-secondary p-3">
                    <span>Daily challenges</span>
                    <span className="font-bold text-primary-deep">+350</span>
                  </div>
                  <div className="flex justify-between rounded-2xl bg-secondary p-3">
                    <span>Shop items</span>
                    <span className="font-bold text-destructive">-160</span>
                  </div>
                </div>
              </div>
            )}

            {activeStatModal === "streak" && (
              <div className="mt-4 space-y-3 text-center">
                <div className="rounded-3xl border-2 border-border bg-card p-4">
                  <Flame className="mx-auto size-12 text-berry" />
                  <p className="mt-2 font-display text-3xl font-bold text-primary-deep">
                    {user.streak} Days
                  </p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    Complete quests daily to maintain your streak.
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-secondary p-3 text-xs font-bold">
                  <span>Streak protection</span>
                  <span className="text-primary-deep">Active</span>
                </div>
              </div>
            )}

            {activeStatModal === "xp" && (
              <div className="mt-4 space-y-3">
                <div className="rounded-3xl border-2 border-border bg-card p-4 text-center">
                  <p className="text-xs font-bold text-muted-foreground">Current Level</p>
                  <p className="font-display text-3xl font-bold text-primary-deep">
                    Level {user.level}
                  </p>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700"
                      style={{ width: `${Math.min(100, ((user.xp % 350) / 350) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs font-bold text-muted-foreground">
                    {user.xp} / {(user.level) * 350} XP
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveStatModal(null)}
              className="press mt-4 w-full rounded-3xl bg-primary py-3 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Reminders */}
      {showRemindersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-4xl border-2 border-border bg-card p-6 shadow-float animate-pop-in">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-primary-deep">
                Reminders
              </h2>
              <button
                type="button"
                onClick={() => setShowRemindersModal(false)}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-secondary p-3">
                <div>
                  <p className="font-display text-sm font-bold">Daily practice</p>
                  <p className="text-xs text-muted-foreground">4:00 PM alert</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleReminders();
                    toast.success("Reminder preference updated");
                  }}
                  className={`rounded-full px-3 py-1 font-display text-xs font-bold ${
                    settings.remindersEnabled
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {settings.remindersEnabled ? "On" : "Off"}
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-secondary p-3">
                <div>
                  <p className="font-display text-sm font-bold">Streak alerts</p>
                  <p className="text-xs text-muted-foreground">Before day ends</p>
                </div>
                <span className="font-display text-xs font-bold text-primary-deep">
                  Enabled
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRemindersModal(false)}
              className="press mt-4 w-full rounded-3xl bg-primary py-3 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Grown-up zone */}
      {showParentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-4xl border-2 border-border bg-card p-6 shadow-float animate-pop-in">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-primary-deep">
                Grown-up Zone
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowParentModal(false);
                  setParentUnlocked(false);
                  setMathAnswer("");
                }}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {!parentUnlocked ? (
              <form onSubmit={handleParentGate} className="mt-4 space-y-4">
                <div className="rounded-2xl border-2 border-border bg-muted/40 p-4 text-center">
                  <p className="text-xs font-bold text-primary-deep">Grown-Up Verification</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Please solve to enter settings:
                  </p>
                  <p className="mt-2 font-display text-xl font-bold text-foreground">
                    7 × 8 = ?
                  </p>
                </div>

                <input
                  type="number"
                  placeholder="Answer"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
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
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-primary-deep">
                    Daily Screen Time Limit
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    {[15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDailyLimit(mins)}
                        className={`flex-1 rounded-2xl border-2 py-2 font-display text-xs font-bold ${
                          dailyLimit === mins
                            ? "border-primary bg-primary-soft text-primary-deep"
                            : "border-border bg-card text-foreground"
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-secondary p-3 text-xs">
                  <div>
                    <p className="font-bold">Weekly Progress Email</p>
                    <p className="text-muted-foreground">parent@family.com</p>
                  </div>
                  <span className="font-bold text-primary-deep">Active</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset player progress?")) {
                      resetAllProgress();
                      setShowParentModal(false);
                      setParentUnlocked(false);
                      toast.info("Progress reset");
                    }
                  }}
                  className="flex w-full items-center justify-center gap-1.5 rounded-2xl border border-destructive/30 py-2 font-display text-xs font-bold text-destructive hover:bg-destructive/10"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset Progress</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateSettings({ dailyLimitMinutes: dailyLimit });
                    setShowParentModal(false);
                    setParentUnlocked(false);
                    toast.success("Settings saved");
                  }}
                  className="press w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
                >
                  Save Settings
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Privacy */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-4xl border-2 border-border bg-card p-6 shadow-float animate-pop-in">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-primary-deep">
                Safety & Privacy
              </h2>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-secondary p-3 text-xs">
                <div>
                  <p className="font-bold">Leaderboard Display</p>
                  <p className="text-muted-foreground">Show hero name on star board</p>
                </div>
                <span className="font-bold text-primary-deep">Visible</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-secondary p-3 text-xs">
                <div>
                  <p className="font-bold">Kid-Safe Mode</p>
                  <p className="text-muted-foreground">Ad-free and protected</p>
                </div>
                <span className="font-bold text-primary-deep">Active</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPrivacyModal(false)}
              className="press mt-4 w-full rounded-3xl bg-primary py-3 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-4xl border-2 border-border bg-card p-6 shadow-float animate-pop-in text-center">
            <h2 className="font-display text-lg font-bold text-primary-deep">
              Log out of Letterbox?
            </h2>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              Your saved coins, streak and progress are safe.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-2xl border-2 border-border py-2.5 font-display text-sm font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                  navigate({ to: "/login" });
                }}
                className="flex-1 rounded-2xl bg-destructive py-2.5 font-display text-sm font-bold text-destructive-foreground shadow"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
}
