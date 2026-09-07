import { useState, useEffect, useCallback } from "react";
import {
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sparkles,
  Coins,
  Award,
  Zap,
  X,
  Check,
  Repeat,
  Diamond,
  Bell,
  Gift,
  Flame,
} from "lucide-react";
import {
  BGM_TRACKS,
  type BgmTrackInfo,
  getCurrentBgmTrack,
  isBackgroundMusicPlaying,
  startBackgroundMusic,
  stopBackgroundMusic,
  nextBgmTrack,
  prevBgmTrack,
  playPop,
  playCoin,
  playSuccess,
  playLaserPowerUp,
  playGemReward,
  playBell,
  playChestOpen,
  playAvatarUnlock,
  onTrackChange,
  onPlaybackChange,
  onBeatPulse,
} from "@/lib/audio";
import { useUserStore } from "@/lib/userStore";
import { toast } from "sonner";

interface SoundStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEME_ICONS: Record<string, string> = {
  "coin-quest": "🪙",
  "starlight-adventure": "🌟",
  "tropical-groove": "🏝️",
  "arcade-hero": "👾",
  "cyber-neon": "⚡",
  "safari-beat": "🦁",
  "magic-castle": "🏰",
  "lofi-study": "☕",
};

const THEME_GRADIENTS: Record<string, { bg: string; border: string; text: string }> = {
  "coin-quest": {
    bg: "bg-amber-400/15 text-amber-950 dark:text-amber-200",
    border: "border-amber-400/40",
    text: "text-amber-800 dark:text-amber-300",
  },
  "starlight-adventure": {
    bg: "bg-indigo-400/15 text-indigo-950 dark:text-indigo-200",
    border: "border-indigo-400/40",
    text: "text-indigo-800 dark:text-indigo-300",
  },
  "tropical-groove": {
    bg: "bg-emerald-400/15 text-emerald-950 dark:text-emerald-200",
    border: "border-emerald-400/40",
    text: "text-emerald-800 dark:text-emerald-300",
  },
  "arcade-hero": {
    bg: "bg-rose-400/15 text-rose-950 dark:text-rose-200",
    border: "border-rose-400/40",
    text: "text-rose-800 dark:text-rose-300",
  },
  "cyber-neon": {
    bg: "bg-fuchsia-400/15 text-fuchsia-950 dark:text-fuchsia-200",
    border: "border-fuchsia-400/40",
    text: "text-fuchsia-800 dark:text-fuchsia-300",
  },
  "safari-beat": {
    bg: "bg-orange-400/15 text-orange-950 dark:text-orange-200",
    border: "border-orange-400/40",
    text: "text-orange-800 dark:text-orange-300",
  },
  "magic-castle": {
    bg: "bg-cyan-400/15 text-cyan-950 dark:text-cyan-200",
    border: "border-cyan-400/40",
    text: "text-cyan-800 dark:text-cyan-300",
  },
  "lofi-study": {
    bg: "bg-amber-600/15 text-amber-950 dark:text-amber-200",
    border: "border-amber-600/40",
    text: "text-amber-900 dark:text-amber-300",
  },
};

export function SoundStudioModal({ isOpen, onClose }: SoundStudioModalProps) {
  const {
    settings,
    toggleSound,
    toggleMusic,
    setMusicVolume,
    setSoundVolume,
    setBgmTrack,
  } = useUserStore();

  const [isPlaying, setIsPlaying] = useState(isBackgroundMusicPlaying());
  const [currentTrack, setCurrentTrack] = useState<BgmTrackInfo>(getCurrentBgmTrack());
  const [currentBeat, setCurrentBeat] = useState(0);
  const [activeTestSound, setActiveTestSound] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setIsPlaying(isBackgroundMusicPlaying());
    setCurrentTrack(getCurrentBgmTrack());

    const unsubTrack = onTrackChange((t) => setCurrentTrack(t));
    const unsubPlay = onPlaybackChange((p) => setIsPlaying(p));
    const unsubBeat = onBeatPulse((beat) => setCurrentBeat(beat));

    return () => {
      unsubTrack();
      unsubPlay();
      unsubBeat();
    };
  }, [isOpen]);

  const handleTogglePlayback = useCallback(() => {
    playPop(settings.soundEnabled);
    if (isPlaying) {
      stopBackgroundMusic();
      setIsPlaying(false);
    } else {
      if (!settings.musicEnabled) toggleMusic();
      if (!settings.soundEnabled) toggleSound();
      startBackgroundMusic(true, true, settings.musicVolume ?? 70);
      setIsPlaying(true);
    }
  }, [isPlaying, settings, toggleMusic, toggleSound]);

  const handleSelectTrack = useCallback(
    (trackId: string) => {
      setBgmTrack(trackId);
      if (!isPlaying && settings.musicEnabled && settings.soundEnabled) {
        startBackgroundMusic(true, true, settings.musicVolume ?? 70);
      }
      const track = BGM_TRACKS.find((t) => t.id === trackId);
      if (track) toast.success(`Now Playing: ${track.title}`);
    },
    [isPlaying, setBgmTrack, settings]
  );

  const handleTestSound = (id: string, fn: (enabled?: boolean) => void) => {
    fn(settings.soundEnabled);
    setActiveTestSound(id);
    setTimeout(() => setActiveTestSound(null), 250);
  };

  if (!isOpen) return null;

  const isAutoLoop = !settings.bgmTrack || settings.bgmTrack === "auto";
  const themeColors = THEME_GRADIENTS[currentTrack.id] || THEME_GRADIENTS["coin-quest"]!;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          playPop(settings.soundEnabled);
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-4xl border-3 border-border bg-card p-4 sm:p-6 shadow-float animate-pop-in overscroll-contain my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-border/70">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-tr from-sun via-amber-400 to-yellow-300 text-sun-foreground shadow-sm">
              <Music className="size-5" strokeWidth={2.4} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-bold text-foreground">
                  Sound Studio
                </h2>
                <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[9px] font-display font-bold text-primary-deep">
                  8 Soundtracks
                </span>
              </div>
              <p className="text-[11px] font-semibold text-muted-foreground">
                Calm background tunes & playful sound effects
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Master Mute Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              title={settings.soundEnabled ? "Mute All Sound" : "Unmute Sound"}
              className={`press grid size-8 place-items-center rounded-xl border transition-all ${
                settings.soundEnabled
                  ? "border-primary/40 bg-primary-soft text-primary-deep"
                  : "border-destructive/40 bg-destructive/10 text-destructive"
              }`}
            >
              {settings.soundEnabled ? (
                <Volume2 className="size-4" strokeWidth={2.2} />
              ) : (
                <VolumeX className="size-4" strokeWidth={2.2} />
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => {
                playPop(settings.soundEnabled);
                onClose();
              }}
              className="press grid size-8 place-items-center rounded-xl bg-muted text-muted-foreground hover:bg-muted/80 active:scale-95"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* HERO JUKEBOX CAPSULE */}
        <div className="mt-3.5 relative overflow-hidden rounded-3xl border-2 border-border bg-gradient-to-b from-card to-muted/30 p-4 text-center">
          {/* Animated Music Disc */}
          <div className="relative mx-auto size-20 sm:size-24 mb-2.5 flex items-center justify-center">
            <div
              className={`size-full rounded-full bg-neutral-900 border-4 border-neutral-700 shadow-md flex items-center justify-center transition-transform ${
                isPlaying ? "animate-spin-slow" : ""
              }`}
              style={{
                backgroundImage:
                  "radial-gradient(circle, #2c2c2c 25%, #151515 26%, #222222 45%, #111111 46%, #262626 70%, #0d0d0d 71%)",
              }}
            >
              {/* Disc Center Label */}
              <div
                className={`size-8 sm:size-9 rounded-full flex items-center justify-center text-base sm:text-lg border-2 border-white/40 shadow-inner ${themeColors.bg}`}
              >
                <span>{THEME_ICONS[currentTrack.id] || "🎵"}</span>
              </div>
            </div>

            {/* Spindle Pin */}
            <div className="absolute size-2 rounded-full bg-white border border-neutral-800 shadow" />

            {/* Floating Sparkles when playing */}
            {isPlaying && (
              <>
                <span className="absolute -top-1 right-2 text-xs animate-bounce text-amber-500">
                  🎵
                </span>
                <span className="absolute -bottom-1 left-2 text-xs animate-pulse text-primary">
                  ✨
                </span>
              </>
            )}
          </div>

          {/* Song Name & Mood Pill */}
          <h3 className="font-display text-base font-bold text-foreground truncate">
            {currentTrack.title}
          </h3>
          <div className="mt-1 flex items-center justify-center gap-1.5">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-display font-bold border ${themeColors.bg} ${themeColors.border}`}>
              {currentTrack.mood}
            </span>
            <span className="rounded-full bg-muted border border-border px-2 py-0.5 text-[10px] font-display font-semibold text-muted-foreground">
              {currentTrack.bpm} BPM
            </span>
          </div>

          {/* Equalizer Waveform Bars */}
          <div className="mt-2 flex items-center justify-center gap-1 h-3.5">
            {[1, 2, 3, 4, 5, 6].map((bar) => (
              <span
                key={bar}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isPlaying
                    ? `bg-primary ${
                        bar % 2 === 0 ? "animate-eq-1" : "animate-eq-2"
                      }`
                    : "h-1 bg-muted-foreground/30"
                }`}
                style={{
                  height: isPlaying
                    ? `${Math.max(25, ((bar + currentBeat) % 4) * 25 + 25)}%`
                    : "4px",
                }}
              />
            ))}
          </div>

          {/* Playback Controls (Prev, Play/Pause, Next) */}
          <div className="mt-3.5 pt-2.5 border-t border-border/70 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                playPop(settings.soundEnabled);
                prevBgmTrack();
              }}
              title="Previous song"
              className="press grid size-9 place-items-center rounded-2xl border-2 border-border bg-card text-foreground hover:bg-muted active:scale-95 shadow-sm"
            >
              <SkipBack className="size-4" strokeWidth={2.5} />
            </button>

            <button
              type="button"
              onClick={handleTogglePlayback}
              title={isPlaying ? "Pause music" : "Play music"}
              className={`press flex items-center gap-2 rounded-2xl px-5 py-2 font-display text-xs font-bold text-white shadow-pop active:translate-y-1 transition-all ${
                isPlaying
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="size-4" strokeWidth={3} />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="size-4 fill-white" />
                  <span>Play Music</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                playPop(settings.soundEnabled);
                nextBgmTrack();
              }}
              title="Next song"
              className="press grid size-9 place-items-center rounded-2xl border-2 border-border bg-card text-foreground hover:bg-muted active:scale-95 shadow-sm"
            >
              <SkipForward className="size-4" strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* 8 SOUNDTRACK CARDS GRID */}
        <div className="mt-3.5 space-y-2">
          <div className="flex items-center justify-between px-1">
            <p className="font-display text-xs font-bold text-foreground">
              Soundtrack Playlist
            </p>
            {/* Auto-Loop Toggle */}
            <button
              type="button"
              onClick={() => {
                setBgmTrack(isAutoLoop ? currentTrack.id : "auto");
                playPop(settings.soundEnabled);
                toast.success(
                  !isAutoLoop
                    ? "✨ Auto-loop enabled (plays all 8 songs in sequence)"
                    : `Fixed on ${currentTrack.title}`
                );
              }}
              className={`press flex items-center gap-1 text-[10px] font-display font-bold px-2 py-0.5 rounded-full border transition-all ${
                isAutoLoop
                  ? "bg-primary-soft text-primary-deep border-primary/40"
                  : "bg-muted text-muted-foreground border-border"
              }`}
            >
              <Repeat className="size-3" />
              <span>{isAutoLoop ? "Auto-Looping 8 Themes" : "Loop Single"}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {BGM_TRACKS.map((t) => {
              const isSelected = (!isAutoLoop && settings.bgmTrack === t.id) || (isAutoLoop && currentTrack.id === t.id);
              const colors = THEME_GRADIENTS[t.id] || THEME_GRADIENTS["coin-quest"]!;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTrack(t.id)}
                  className={`press flex items-center gap-2 p-2 rounded-2xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary-soft text-primary-deep shadow-sm ring-1 ring-primary/30"
                      : "border-border bg-card hover:bg-muted/40 text-foreground"
                  }`}
                >
                  <span className={`grid size-7 shrink-0 place-items-center rounded-xl text-xs ${colors.bg}`}>
                    {THEME_ICONS[t.id] || "🎵"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[11px] font-bold truncate">
                      {t.title}
                    </p>
                    <p className="text-[9px] font-semibold text-muted-foreground truncate">
                      {t.mood}
                    </p>
                  </div>
                  {isSelected && (
                    <Check className="size-3 text-primary shrink-0" strokeWidth={3} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* VOLUME SLIDERS */}
        <div className="mt-3.5 space-y-2.5 rounded-3xl border-2 border-border bg-muted/20 p-3">
          {/* Music Volume */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-1">
              <span className="flex items-center gap-1.5 text-foreground font-display">
                <Music className="size-3.5 text-primary" />
                <span>Music Volume</span>
              </span>
              <span className="font-display text-primary-deep text-xs">
                {settings.musicVolume ?? 70}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.musicVolume ?? 70}
              disabled={!settings.musicEnabled}
              onChange={(e) => setMusicVolume(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Sound FX Volume */}
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-1">
              <span className="flex items-center gap-1.5 text-foreground font-display">
                <Volume2 className="size-3.5 text-primary" />
                <span>Sound FX</span>
              </span>
              <span className="font-display text-primary-deep text-xs">
                {settings.soundVolume ?? 80}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={settings.soundVolume ?? 80}
              disabled={!settings.soundEnabled}
              onChange={(e) => setSoundVolume(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-muted rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>

        {/* 8 TAP-TO-TEST GAME SOUNDS */}
        <div className="mt-3.5">
          <p className="font-display text-xs font-bold text-foreground px-1 mb-1.5">
            Tap to Test Game Sounds
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: "coin", name: "Coin", icon: Coins, bg: "bg-amber-400 text-amber-950", play: playCoin },
              { id: "pop", name: "Pop", icon: Sparkles, bg: "bg-sky text-sky-foreground", play: playPop },
              { id: "win", name: "Success", icon: Award, bg: "bg-emerald-400 text-emerald-950", play: playSuccess },
              { id: "power", name: "Power", icon: Zap, bg: "bg-fuchsia-400 text-fuchsia-950", play: playLaserPowerUp },
              { id: "gem", name: "Gem", icon: Diamond, bg: "bg-cyan-400 text-cyan-950", play: playGemReward },
              { id: "bell", name: "Bell", icon: Bell, bg: "bg-rose-400 text-rose-950", play: playBell },
              { id: "chest", name: "Treasure", icon: Gift, bg: "bg-indigo-400 text-indigo-950", play: playChestOpen },
              { id: "unlock", name: "Magic", icon: Flame, bg: "bg-sun text-sun-foreground", play: playAvatarUnlock },
            ].map((sound) => {
              const Icon = sound.icon;
              const isTriggered = activeTestSound === sound.id;
              return (
                <button
                  key={sound.id}
                  type="button"
                  onClick={() => handleTestSound(sound.id, sound.play)}
                  className={`press flex flex-col items-center justify-center p-1.5 rounded-2xl border-2 text-center transition-all ${
                    isTriggered
                      ? "scale-95 border-primary bg-primary-soft shadow-inner"
                      : "border-border bg-card hover:bg-muted/40 shadow-sm"
                  }`}
                >
                  <div className={`grid size-7 place-items-center rounded-xl mb-0.5 shadow-sm ${sound.bg}`}>
                    <Icon className="size-3.5" />
                  </div>
                  <span className="font-display text-[9px] font-bold text-foreground truncate w-full">
                    {sound.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Done Button */}
        <button
          type="button"
          onClick={() => {
            playPop(settings.soundEnabled);
            onClose();
          }}
          className="press mt-4 w-full rounded-3xl bg-primary py-2.5 font-display font-bold text-primary-foreground shadow-pop active:translate-y-1 text-xs sm:text-sm"
        >
          Done
        </button>
      </div>
    </div>
  );
}
