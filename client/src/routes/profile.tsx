import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  ShieldCheck,
  Users,
  Volume2,
  VolumeX,
  Music,
  Edit3,
  Check,
  X,
  Flame,
  Zap,
  RotateCcw,
  Clock,
  Mail,
  Sliders,
  Award,
  Radio,
  Play,
  Pause,
  SkipForward,
  Headphones,
  Sparkles,
  Lock,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Screen } from "@/components/PhoneFrame";
import { avatars, avatarList, type AvatarKey } from "@/assets/icons";
import { useUserStore } from "../lib/userStore";
import { Coin } from "@/components/Coin";
import { toast } from "sonner";
import {
  playPop,
  playSuccess,
  playError,
  playCoin,
  startBackgroundMusic,
  stopBackgroundMusic,
} from "../lib/audio";

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

interface ReminderSlot {
  id: string;
  label: string;
  time: string;
  time24: string;
}

const DEFAULT_REMINDER_SLOTS: ReminderSlot[] = [
  { id: "after_school", label: "After School", time: "4:00 PM", time24: "16:00" },
  { id: "dinner_time", label: "Dinner Time", time: "6:30 PM", time24: "18:30" },
  { id: "before_bed", label: "Before Bed", time: "8:00 PM", time24: "20:00" },
];

function to12HourFormat(time24: string): string {
  if (!time24) return "4:00 PM";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const mFormatted = m < 10 ? `0${m}` : `${m}`;
  return `${h}:${mFormatted} ${period}`;
}

function Profile() {
  const navigate = useNavigate();
  const {
    user,
    settings,
    setAvatar,
    updateProfile,
    toggleSound,
    toggleMusic,
    setMusicVolume,
    setSoundVolume,
    setBgmTrack,
    toggleReminders,
    updateSettings,
    resetAllProgress,
    logout,
    auth,
  } = useUserStore();

  useEffect(() => {
    if (!auth?.isLoggedIn) {
      navigate({ to: "/signup", replace: true });
    }
  }, [auth?.isLoggedIn, navigate]);

  if (!auth?.isLoggedIn) {
    return null;
  }

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const [titleInput, setTitleInput] = useState(user.title);

  const [activeStatModal, setActiveStatModal] = useState<"coins" | "streak" | "xp" | null>(null);

  // Settings modals
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [reminderSlots, setReminderSlots] = useState<ReminderSlot[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("letterbox_custom_reminder_slots");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return DEFAULT_REMINDER_SLOTS;
  });

  const [selectedSlotId, setSelectedSlotId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("letterbox_selected_reminder_slot_id");
        if (saved) return saved;
      } catch {}
    }
    return "after_school";
  });

  const activeReminder =
    reminderSlots.find((s) => s.id === selectedSlotId) || reminderSlots[0];

  const [showParentModal, setShowParentModal] = useState(false);
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [mathAnswer, setMathAnswer] = useState("");
  const [dailyLimit, setDailyLimit] = useState(settings.dailyLimitMinutes || 30);
  const [allowanceAmount, setAllowanceAmount] = useState("500");
  const [emailReports, setEmailReports] = useState(true);

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [publicLeaderboard, setPublicLeaderboard] = useState(true);
  const [friendCheers, setFriendCheers] = useState(true);

  const [showLogoutModal, setShowLogoutModal] = useState(false);



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
      toast.error("Incorrect answer. Please ask a grown-up.");
    }
  };

  return (
    <>
      <Screen>
        {/* Profile Hero Card */}
        <div className="relative rounded-4xl border-2 border-border bg-leaf p-6 text-center shadow-card overflow-hidden">
          <button
            type="button"
            onClick={() => {
              setNameInput(user.name);
              setTitleInput(user.title);
              setShowEditModal(true);
              playPop(settings.soundEnabled);
            }}
            className="press absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-card/90 px-3.5 py-1.5 font-display text-xs font-bold text-primary-deep shadow hover:bg-card active:scale-95 transition-all"
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
          <div className="mt-5 grid grid-cols-3 gap-2.5">
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

        {/* Avatar Picker */}
        <h2 className="mt-8 font-display text-xl font-bold text-primary-deep">
          Pick your avatar
        </h2>
        <div className="mt-3 grid grid-cols-4 gap-2.5">
          {avatarList.map(([key, src], i) => {
            const isSelected = user.avatar === key;
            return (
              <button
                key={key}
                type="button"
                aria-label={`Select ${key} avatar`}
                onClick={() => {
                  setAvatar(key);
                  playPop(settings.soundEnabled);
                }}
                className={`press relative flex aspect-square animate-pop-in items-center justify-center rounded-3xl border-2 p-2 shadow-card hover:-translate-y-1 active:scale-95 transition-all ${isSelected
                    ? "border-primary bg-primary-soft ring-2 ring-primary/40"
                    : "border-border bg-card"
                  }`}
                style={{ animationDelay: `${i * 45}ms` }}
              >
                <img
                  src={src}
                  alt={`${key} avatar`}
                  loading="lazy"
                  width={128}
                  height={128}
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

        {/* Themed Interactive Settings Section */}
        <h2 className="mt-8 font-display text-xl font-bold text-primary-deep">
          Settings
        </h2>

        <div className="mt-3 space-y-3">
          {/* Music Toggle Card */}
          <div className="flex w-full items-center justify-between rounded-3xl border-2 border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3.5">
              <span
                className={`grid size-11 place-items-center rounded-2xl border transition-colors ${
                  settings.musicEnabled
                    ? "bg-sun text-sun-foreground border-sun"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                <Music className="size-5" strokeWidth={2.4} />
              </span>
              <div className="text-left">
                <p className="font-display font-bold text-foreground">Music</p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {settings.musicEnabled ? "Background music is on" : "Music is off"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextVal = !settings.musicEnabled;
                toggleMusic();
                playPop(settings.soundEnabled);
                if (nextVal) {
                  startBackgroundMusic(true, true, settings.musicVolume ?? 70);
                } else {
                  stopBackgroundMusic();
                }
              }}
              className={`press relative h-7 w-12 rounded-full p-0.5 border-2 border-border transition-colors ${
                settings.musicEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`size-5 rounded-full bg-card shadow-md transition-transform duration-200 ${
                  settings.musicEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Sound Effects Toggle Card */}
          <div className="flex w-full items-center justify-between rounded-3xl border-2 border-border bg-card p-4 shadow-card">
            <div className="flex items-center gap-3.5">
              <span
                className={`grid size-11 place-items-center rounded-2xl border transition-colors ${
                  settings.soundEnabled
                    ? "bg-amber-400 text-amber-950 border-amber-400"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {settings.soundEnabled ? (
                  <Volume2 className="size-5" strokeWidth={2.4} />
                ) : (
                  <VolumeX className="size-5" strokeWidth={2.4} />
                )}
              </span>
              <div className="text-left">
                <p className="font-display font-bold text-foreground">Sound</p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {settings.soundEnabled ? "Sound effects are on" : "Sound effects are off"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                toggleSound();
                playPop(!settings.soundEnabled);
              }}
              className={`press relative h-7 w-12 rounded-full p-0.5 border-2 border-border transition-colors ${
                settings.soundEnabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <div
                className={`size-5 rounded-full bg-card shadow-md transition-transform duration-200 ${
                  settings.soundEnabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Reminders Card */}
          <button
            type="button"
            onClick={() => {
              playPop(settings.soundEnabled);
              setShowRemindersModal(true);
            }}
            className="press flex w-full items-center justify-between rounded-3xl border-2 border-border bg-card p-4 shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <div className="flex items-center gap-3.5">
              <span className="grid size-11 place-items-center rounded-2xl bg-berry text-berry-foreground">
                <Bell className="size-5" strokeWidth={2.4} />
              </span>
              <div className="text-left">
                <p className="font-display font-bold text-foreground">Reminders</p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {settings.remindersEnabled ? `Daily alert at ${activeReminder.time}` : "Turned off"}
                </p>
              </div>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </button>

          {/* Grown-up Zone Card */}
          <button
            type="button"
            onClick={() => {
              playPop(settings.soundEnabled);
              setShowParentModal(true);
            }}
            className="press flex w-full items-center justify-between rounded-3xl border-2 border-border bg-card p-4 shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <div className="flex items-center gap-3.5">
              <span className="grid size-11 place-items-center rounded-2xl bg-sky text-sky-foreground">
                <Users className="size-5" strokeWidth={2.4} />
              </span>
              <div className="text-left">
                <p className="font-display font-bold text-foreground">Grown-up zone</p>
                <p className="text-xs font-semibold text-muted-foreground">
                  Screen time, allowance & reports
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky/20 px-2.5 py-0.5 font-display text-[11px] font-bold text-sky-foreground">
                Parent
              </span>
              <ChevronRight className="size-5 text-muted-foreground" />
            </div>
          </button>

          {/* Safety & Privacy Card */}
          <button
            type="button"
            onClick={() => {
              playPop(settings.soundEnabled);
              setShowPrivacyModal(true);
            }}
            className="press flex w-full items-center justify-between rounded-3xl border-2 border-border bg-card p-4 shadow-card hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <div className="flex items-center gap-3.5">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary-soft text-primary-deep">
                <ShieldCheck className="size-5" strokeWidth={2.4} />
              </span>
              <div className="text-left">
                <p className="font-display font-bold text-foreground">Safety & privacy</p>
                <p className="text-xs font-semibold text-muted-foreground">
                  Kid-safe mode active
                </p>
              </div>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Log Out Button */}
        <button
          type="button"
          onClick={() => {
            playPop(settings.soundEnabled);
            setShowLogoutModal(true);
          }}
          className="press mt-8 block w-full rounded-3xl border-2 border-border bg-card py-4 text-center font-display font-bold text-muted-foreground shadow-card hover:text-foreground active:scale-[0.98]"
        >
          Log out
        </button>
      </Screen>

      {/* MODAL: Edit Profile */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in overscroll-contain my-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-primary-deep">
                Edit Profile
              </h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <label className="block">
                <span className="ml-2 font-display text-xs font-bold text-primary-deep">
                  Display Name
                </span>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="mt-1 w-full rounded-3xl border-2 border-border bg-card px-5 py-3.5 font-semibold outline-none focus:border-primary"
                />
              </label>

              <div>
                <span className="ml-2 font-display text-xs font-bold text-primary-deep">
                  Hero Title
                </span>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {TITLES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTitleInput(t)}
                      className={`rounded-2xl border-2 p-3 text-center font-display text-xs font-bold transition-all ${titleInput === t
                          ? "border-primary bg-primary-soft text-primary-deep shadow-sm"
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
                className="press w-full rounded-3xl bg-primary py-4 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Stat Breakdown */}
      {activeStatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in overscroll-contain my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {activeStatModal === "coins" && (
                  <span className="grid size-8 place-items-center rounded-xl bg-sun text-sun-foreground">
                    <Coin className="size-4" />
                  </span>
                )}
                {activeStatModal === "streak" && (
                  <span className="grid size-8 place-items-center rounded-xl bg-berry text-berry-foreground">
                    <Flame className="size-4" />
                  </span>
                )}
                {activeStatModal === "xp" && (
                  <span className="grid size-8 place-items-center rounded-xl bg-sky text-sky-foreground">
                    <Zap className="size-4" />
                  </span>
                )}
                <h2 className="font-display text-lg font-bold text-primary-deep capitalize">
                  {activeStatModal === "coins" && "Coins Vault"}
                  {activeStatModal === "streak" && "Streak Shield"}
                  {activeStatModal === "xp" && "Level Progress"}
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
              <div className="mt-5 space-y-3">
                <div className="rounded-3xl border-2 border-border bg-sunny p-4 text-center">
                  <p className="text-xs font-bold text-sun-foreground">Total Available Balance</p>
                  <p className="mt-1 font-display text-3xl font-bold text-sun-foreground">
                    {user.coins.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between rounded-2xl bg-secondary p-3">
                    <span>Quest completions</span>
                    <span className="font-bold text-primary-deep">+1,050 coins</span>
                  </div>
                  <div className="flex justify-between rounded-2xl bg-secondary p-3">
                    <span>Daily challenges</span>
                    <span className="font-bold text-primary-deep">+350 coins</span>
                  </div>
                  <div className="flex justify-between rounded-2xl bg-secondary p-3">
                    <span>Shop items</span>
                    <span className="font-bold text-destructive">-160 coins</span>
                  </div>
                </div>
              </div>
            )}

            {activeStatModal === "streak" && (
              <div className="mt-5 space-y-3 text-center">
                <div className="rounded-3xl border-2 border-border bg-card p-5">
                  <Flame className="mx-auto size-12 text-berry" />
                  <p className="mt-2 font-display text-3xl font-bold text-primary-deep">
                    {user.streak} Days
                  </p>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    Complete quests daily to maintain your streak flame.
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-secondary p-3 text-xs font-bold">
                  <span>Streak protection</span>
                  <span className="text-primary-deep">Active</span>
                </div>
              </div>
            )}

            {activeStatModal === "xp" && (
              <div className="mt-5 space-y-3">
                <div className="rounded-3xl border-2 border-border bg-card p-5 text-center">
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
                    {user.xp} / {(user.level) * 350} XP to Level {user.level + 1}
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setActiveStatModal(null)}
              className="press mt-5 w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
            >
              Close
            </button>
          </div>
        </div>
      )}



      {/* MODAL: Reminders */}
      {showRemindersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in overscroll-contain my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-berry text-berry-foreground">
                  <Bell className="size-4" />
                </span>
                <h2 className="font-display text-lg font-bold text-primary-deep">
                  Practice Reminders
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowRemindersModal(false)}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-3xl border-2 border-border bg-card p-3.5">
                <div>
                  <p className="font-display text-sm font-bold">Daily practice alerts</p>
                  <p className="text-xs text-muted-foreground">Notification before streak reset</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    toggleReminders();
                    toast.success("Reminder status updated");
                  }}
                  className={`press h-7 w-12 rounded-full p-0.5 border-2 border-border transition-colors ${settings.remindersEnabled ? "bg-primary" : "bg-muted"
                    }`}
                >
                  <div
                    className={`size-5 rounded-full bg-card shadow transition-transform ${settings.remindersEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>

              {settings.remindersEnabled && (
                <div>
                  <p className="ml-2 font-display text-xs font-bold text-primary-deep">
                    Preferred Reminder Time
                  </p>
                  <div className="mt-2 space-y-2">
                    {reminderSlots.map((item) => {
                      const isSelected = selectedSlotId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSelectedSlotId(item.id);
                            playPop(settings.soundEnabled);
                          }}
                          className={`press flex w-full items-center justify-between rounded-2xl border-2 p-3 text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-primary-soft text-primary-deep"
                              : "border-border bg-card text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`size-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/40 bg-card"
                              }`}
                            >
                              {isSelected && <span className="size-1.5 rounded-full bg-white" />}
                            </span>
                            <span>{item.label}</span>
                          </div>

                          <div
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="time"
                              value={item.time24}
                              onChange={(e) => {
                                const newTime24 = e.target.value;
                                if (newTime24) {
                                  const formatted = to12HourFormat(newTime24);
                                  const updated = reminderSlots.map((r) =>
                                    r.id === item.id
                                      ? { ...r, time24: newTime24, time: formatted }
                                      : r
                                  );
                                  setReminderSlots(updated);
                                  localStorage.setItem(
                                    "letterbox_custom_reminder_slots",
                                    JSON.stringify(updated)
                                  );
                                }
                              }}
                              className="rounded-xl border border-border bg-card px-2.5 py-1 text-xs font-bold text-foreground outline-none focus:border-primary cursor-pointer shadow-xs"
                              title="Click to customize time"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  localStorage.setItem(
                    "letterbox_custom_reminder_slots",
                    JSON.stringify(reminderSlots)
                  );
                  localStorage.setItem(
                    "letterbox_selected_reminder_slot_id",
                    selectedSlotId
                  );
                  playPop(settings.soundEnabled);
                  toast.success(`Reminder set for ${activeReminder.label} at ${activeReminder.time}`);
                  setShowRemindersModal(false);
                }}
                className="press w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Grown-up zone (Parent Gate) */}
      {showParentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in overscroll-contain my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-sky text-sky-foreground">
                  <Users className="size-4" />
                </span>
                <h2 className="font-display text-lg font-bold text-primary-deep">
                  Grown-up Zone
                </h2>
              </div>
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
              <form onSubmit={handleParentGate} className="mt-5 space-y-4">
                <div className="rounded-3xl border-2 border-border bg-muted/40 p-5 text-center">
                  <p className="text-xs font-bold text-primary-deep uppercase tracking-wider">
                    Parent Verification
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Please solve the math puzzle to open controls:
                  </p>
                  <p className="mt-3 font-display text-2xl font-bold text-foreground">
                    7 × 8 = ?
                  </p>
                </div>

                <input
                  type="number"
                  placeholder="Answer"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  className="w-full rounded-3xl border-2 border-border bg-card px-5 py-3.5 text-center font-display text-lg font-bold outline-none focus:border-primary"
                />

                <button
                  type="submit"
                  className="press w-full rounded-3xl bg-primary py-4 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
                >
                  Verify Grown-Up
                </button>
              </form>
            ) : (
              <div className="mt-5 space-y-4">
                {/* Daily Screen Time */}
                <div>
                  <label className="flex items-center gap-1.5 font-display text-xs font-bold text-primary-deep ml-1">
                    <Clock className="size-3.5" />
                    <span>Daily Screen Time Limit</span>
                  </label>
                  <div className="mt-2 flex gap-2">
                    {[15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => {
                          setDailyLimit(mins);
                          playPop(settings.soundEnabled);
                        }}
                        className={`flex-1 rounded-2xl border-2 py-2.5 font-display text-xs font-bold transition-all ${dailyLimit === mins
                            ? "border-primary bg-primary-soft text-primary-deep"
                            : "border-border bg-card text-foreground"
                          }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pocket Money Allowance */}
                <div>
                  <label className="flex items-center gap-1.5 font-display text-xs font-bold text-primary-deep ml-1">
                    <Award className="size-3.5" />
                    <span>Weekly Allowance Tracker</span>
                  </label>
                  <div className="mt-2 flex gap-2">
                    {["200", "500", "1000"].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setAllowanceAmount(amt);
                          playPop(settings.soundEnabled);
                        }}
                        className={`flex-1 rounded-2xl border-2 py-2.5 font-display text-xs font-bold transition-all ${allowanceAmount === amt
                            ? "border-primary bg-primary-soft text-primary-deep"
                            : "border-border bg-card text-foreground"
                          }`}
                      >
                        KES {amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Weekly Email Report */}
                <div className="flex items-center justify-between rounded-3xl border-2 border-border bg-card p-3.5">
                  <div className="flex items-center gap-2.5">
                    <Mail className="size-4 text-primary-deep" />
                    <div>
                      <p className="font-display text-xs font-bold">Weekly Progress Email</p>
                      <p className="text-[11px] text-muted-foreground">Sent to parent@family.com</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailReports(!emailReports)}
                    className={`h-6 w-11 rounded-full p-0.5 border-2 border-border transition-colors ${emailReports ? "bg-primary" : "bg-muted"
                      }`}
                  >
                    <div
                      className={`size-4 rounded-full bg-card shadow transition-transform ${emailReports ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>

                {/* Reset Progress */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Reset all game progress and start over?")) {
                      resetAllProgress();
                      setShowParentModal(false);
                      setParentUnlocked(false);
                      toast.info("Progress has been reset");
                    }
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-destructive/30 py-2.5 font-display text-xs font-bold text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset Kid&apos;s Progress</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateSettings({ dailyLimitMinutes: dailyLimit });
                    setShowParentModal(false);
                    setParentUnlocked(false);
                    toast.success("Parent settings saved");
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
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in overscroll-contain my-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-xl bg-primary-soft text-primary-deep">
                  <ShieldCheck className="size-4" />
                </span>
                <h2 className="font-display text-lg font-bold text-primary-deep">
                  Safety & Privacy
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="grid size-8 place-items-center rounded-full bg-muted text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-3xl border-2 border-border bg-card p-3.5">
                <div>
                  <p className="font-display text-xs font-bold">Public Star Board</p>
                  <p className="text-[11px] text-muted-foreground">Show hero name in rankings</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPublicLeaderboard(!publicLeaderboard)}
                  className={`h-6 w-11 rounded-full p-0.5 border-2 border-border transition-colors ${publicLeaderboard ? "bg-primary" : "bg-muted"
                    }`}
                >
                  <div
                    className={`size-4 rounded-full bg-card shadow transition-transform ${publicLeaderboard ? "translate-x-5" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-3xl border-2 border-border bg-card p-3.5">
                <div>
                  <p className="font-display text-xs font-bold">Friend High-Fives</p>
                  <p className="text-[11px] text-muted-foreground">Allow cheerful cheers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFriendCheers(!friendCheers)}
                  className={`h-6 w-11 rounded-full p-0.5 border-2 border-border transition-colors ${friendCheers ? "bg-primary" : "bg-muted"
                    }`}
                >
                  <div
                    className={`size-4 rounded-full bg-card shadow transition-transform ${friendCheers ? "translate-x-5" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>

              <div className="rounded-3xl border-2 border-primary-soft bg-primary-soft/40 p-4">
                <p className="font-display text-xs font-bold text-primary-deep">
                  Kid-Safe Guarantee
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  Letterbox is 100% ad-free and protected. No personal financial data is stored.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPrivacyModal(false)}
              className="press mt-5 w-full rounded-3xl bg-primary py-3.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm sm:max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-4xl border-2 border-border bg-card p-5 sm:p-6 shadow-float animate-pop-in overscroll-contain my-auto text-center">
            <h2 className="font-display text-xl font-bold text-primary-deep">
              Log out of Letterbox?
            </h2>
            <p className="mt-1.5 text-xs font-semibold text-muted-foreground">
              Your saved coins, streak, and level progress are safely stored.
            </p>
            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-3xl border-2 border-border py-3 font-display text-sm font-bold text-foreground hover:bg-muted/40 transition-colors"
              >
                Keep Playing
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                  navigate({ to: "/signup" });
                }}
                className="flex-1 rounded-3xl bg-destructive py-3 font-display text-sm font-bold text-destructive-foreground shadow hover:opacity-90 transition-opacity"
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
