// Web Audio API Sound Synthesizer & Multi-Track Game Background Music Engine

let audioCtx: AudioContext | null = null;
let currentMusicVolume = 70; // 0 to 100
let currentSoundVolume = 80; // 0 to 100
let isBgmActive = false;
let bgmInterval: any = null;
let bgmMasterGain: GainNode | null = null;
let bgmFilterNode: BiquadFilterNode | null = null;
let bgmDelayNode: DelayNode | null = null;
let bgmFeedbackGain: GainNode | null = null;
let activePadOscillators: OscillatorNode[] = [];

export interface BgmTrackInfo {
  id: string;
  title: string;
  mood: string;
  tempoMs: number;
  filterFreq: number;
  barsPerLoop: number;
  chords: { root: number; notes: number[]; bassType?: OscillatorType }[];
  melodyPatterns: number[][];
}

// 4 Unique, Melodic, Child-Friendly Soundtrack Themes
export const BGM_TRACKS: BgmTrackInfo[] = [
  {
    id: "coin-quest",
    title: "Coin Quest Bounce",
    mood: "Sunny & Upbeat",
    tempoMs: 350,
    filterFreq: 2600,
    barsPerLoop: 8,
    chords: [
      { root: 130.81, notes: [261.63, 329.63, 392.0], bassType: "triangle" }, // C3 + C4, E4, G4
      { root: 110.0,  notes: [220.0, 261.63, 329.63], bassType: "triangle" }, // A2 + A3, C4, E4
      { root: 87.31,  notes: [174.61, 220.0, 261.63], bassType: "triangle" }, // F2 + F3, A3, C4
      { root: 98.0,   notes: [196.0, 246.94, 293.66], bassType: "triangle" }, // G2 + G3, B3, D4
    ],
    melodyPatterns: [
      [523.25, 587.33, 659.25, 783.99], // C5, D5, E5, G5
      [659.25, 587.33, 523.25, 440.0],  // E5, D5, C5, A4
      [523.25, 659.25, 783.99, 1046.5], // C5, E5, G5, C6
      [783.99, 659.25, 587.33, 523.25], // G5, E5, D5, C5
    ],
  },
  {
    id: "starlight-adventure",
    title: "Starlight Adventure",
    mood: "Dreamy & Wonder",
    tempoMs: 400,
    filterFreq: 2200,
    barsPerLoop: 8,
    chords: [
      { root: 146.83, notes: [293.66, 349.23, 440.0], bassType: "sine" },     // D3 + D4, F4, A4 (Dm)
      { root: 116.54, notes: [233.08, 293.66, 349.23], bassType: "sine" },     // Bb2 + Bb3, D4, F4 (Bb)
      { root: 87.31,  notes: [174.61, 220.0, 261.63], bassType: "sine" },     // F2 + F3, A3, C4 (F)
      { root: 130.81, notes: [261.63, 329.63, 392.0], bassType: "sine" },     // C3 + C4, E4, G4 (C)
    ],
    melodyPatterns: [
      [587.33, 698.46, 880.0, 1046.5],  // D5, F5, A5, C6
      [880.0, 698.46, 587.33, 523.25],  // A5, F5, D5, C5
      [698.46, 880.0, 1046.5, 1174.66], // F5, A5, C6, D6
      [1046.5, 880.0, 698.46, 587.33], // C6, A5, F5, D5
    ],
  },
  {
    id: "tropical-groove",
    title: "Tropical Island Groove",
    mood: "Playful & Calypso",
    tempoMs: 310,
    filterFreq: 2800,
    barsPerLoop: 8,
    chords: [
      { root: 98.0,   notes: [196.0, 246.94, 293.66], bassType: "triangle" }, // G2 + G3, B3, D4 (G)
      { root: 82.41,  notes: [164.81, 196.0, 246.94], bassType: "triangle" }, // E2 + E3, G3, B3 (Em)
      { root: 130.81, notes: [261.63, 329.63, 392.0], bassType: "triangle" }, // C3 + C4, E4, G4 (C)
      { root: 146.83, notes: [293.66, 369.99, 440.0], bassType: "triangle" }, // D3 + D4, F#4, A4 (D)
    ],
    melodyPatterns: [
      [392.0, 493.88, 587.33, 783.99],  // G4, B4, D5, G5
      [783.99, 659.25, 587.33, 493.88], // G5, E5, D5, B4
      [587.33, 783.99, 880.0, 987.77],  // D5, G5, A5, B5
      [987.77, 783.99, 587.33, 392.0],  // B5, G5, D5, G4
    ],
  },
  {
    id: "arcade-hero",
    title: "Arcade Hero Fanfare",
    mood: "Chiptune & Energetic",
    tempoMs: 290,
    filterFreq: 3200,
    barsPerLoop: 8,
    chords: [
      { root: 146.83, notes: [293.66, 369.99, 440.0], bassType: "sawtooth" }, // D3 + D4, F#4, A4 (D)
      { root: 123.47, notes: [246.94, 293.66, 369.99], bassType: "sawtooth" }, // B2 + B3, D4, F#4 (Bm)
      { root: 98.0,   notes: [196.0, 246.94, 293.66], bassType: "sawtooth" }, // G2 + G3, B3, D4 (G)
      { root: 110.0,  notes: [220.0, 277.18, 329.63], bassType: "sawtooth" }, // A2 + A3, C#4, E4 (A)
    ],
    melodyPatterns: [
      [587.33, 739.99, 880.0, 1174.66], // D5, F#5, A5, D6
      [880.0, 739.99, 587.33, 440.0],   // A5, F#5, D5, A4
      [739.99, 880.0, 1108.73, 1174.66],// F#5, A5, C#6, D6
      [1174.66, 880.0, 739.99, 587.33], // D6, A5, F#5, D5
    ],
  },
];

let currentTrackIndex = 0;
let userSelectedTrackId: string = "auto";
let chordStep = 0;
let beatInBar = 0;
let totalBarsPlayed = 0;
const trackListeners = new Set<(track: BgmTrackInfo) => void>();

export function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function unlockAudio() {
  if (typeof window === "undefined") return;
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
}

// Global auto-unlock listeners on first user interaction
if (typeof window !== "undefined") {
  const handleFirstInteraction = () => {
    unlockAudio();
    if (isBgmActive) {
      if (bgmMasterGain && audioCtx) {
        const targetGain = (currentMusicVolume / 100) * 0.35;
        bgmMasterGain.gain.setValueAtTime(targetGain, audioCtx.currentTime);
      }
    }
  };
  window.addEventListener("pointerdown", handleFirstInteraction, { passive: true });
  window.addEventListener("click", handleFirstInteraction, { passive: true });
  window.addEventListener("touchstart", handleFirstInteraction, { passive: true });
  window.addEventListener("keydown", handleFirstInteraction, { passive: true });
}

export function setMusicVolume(volume: number) {
  currentMusicVolume = Math.max(0, Math.min(100, volume));
  if (bgmMasterGain && audioCtx) {
    try {
      const targetGain = (currentMusicVolume / 100) * 0.35;
      const now = audioCtx.currentTime;
      bgmMasterGain.gain.cancelScheduledValues(now);
      bgmMasterGain.gain.setValueAtTime(bgmMasterGain.gain.value, now);
      bgmMasterGain.gain.linearRampToValueAtTime(targetGain, now + 0.1);
    } catch (e) {
      console.debug(e);
    }
  }
}

export function setSoundVolume(volume: number) {
  currentSoundVolume = Math.max(0, Math.min(100, volume));
}

export function getMusicVolume(): number {
  return currentMusicVolume;
}

export function getSoundVolume(): number {
  return currentSoundVolume;
}

export function getCurrentBgmTrack(): BgmTrackInfo {
  return BGM_TRACKS[currentTrackIndex % BGM_TRACKS.length];
}

export function setSelectedTrackPreference(trackId: string) {
  userSelectedTrackId = trackId;
  if (trackId !== "auto") {
    const idx = BGM_TRACKS.findIndex((t) => t.id === trackId);
    if (idx !== -1) {
      currentTrackIndex = idx;
      chordStep = 0;
      beatInBar = 0;
      totalBarsPlayed = 0;
      notifyTrackListeners();
      restartBgmInterval();
    }
  }
}

export function getSelectedTrackPreference(): string {
  return userSelectedTrackId;
}

export function onTrackChange(listener: (track: BgmTrackInfo) => void): () => void {
  trackListeners.add(listener);
  listener(getCurrentBgmTrack());
  return () => trackListeners.delete(listener);
}

function notifyTrackListeners() {
  const current = getCurrentBgmTrack();
  trackListeners.forEach((fn) => {
    try { fn(current); } catch {}
  });
}

function getSfxGainMultiplier(): number {
  return Math.max(0, Math.min(1, currentSoundVolume / 100));
}

export function playPop(soundEnabled = true) {
  if (!soundEnabled || currentSoundVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    unlockAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const mult = getSfxGainMultiplier();
    osc.type = "sine";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
    gain.gain.setValueAtTime(0.25 * mult, now);
    gain.gain.exponentialRampToValueAtTime(0.01 * mult, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch (e) {
    console.debug(e);
  }
}

export function playCoin(soundEnabled = true) {
  if (!soundEnabled || currentSoundVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    unlockAudio();
    const now = ctx.currentTime;
    const mult = getSfxGainMultiplier();
    [987.77, 1318.51].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      const start = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.3 * mult, start);
      gain.gain.exponentialRampToValueAtTime(0.001 * mult, start + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.25);
    });
  } catch (e) {
    console.debug(e);
  }
}

export function playSuccess(soundEnabled = true) {
  if (!soundEnabled || currentSoundVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    unlockAudio();
    const now = ctx.currentTime;
    const mult = getSfxGainMultiplier();
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const start = now + idx * 0.09;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.28 * mult, start);
      gain.gain.exponentialRampToValueAtTime(0.001 * mult, start + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.32);
    });
  } catch (e) {
    console.debug(e);
  }
}

export function playVictory(soundEnabled = true) {
  if (!soundEnabled || currentSoundVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    unlockAudio();
    const now = ctx.currentTime;
    const mult = getSfxGainMultiplier();
    const melody = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.12 },
      { f: 1046.5, d: 0.28 },
      { f: 880.0, d: 0.14 },
      { f: 1046.5, d: 0.45 },
    ];
    let offset = 0;
    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      const start = now + offset;
      osc.frequency.setValueAtTime(note.f, start);
      gain.gain.setValueAtTime(0.32 * mult, start);
      gain.gain.exponentialRampToValueAtTime(0.001 * mult, start + note.d);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + note.d);
      offset += note.d * 0.85;
    });
  } catch (e) {
    console.debug(e);
  }
}

export function playError(soundEnabled = true) {
  if (!soundEnabled || currentSoundVolume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    unlockAudio();
    const now = ctx.currentTime;
    const mult = getSfxGainMultiplier();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.18);
    gain.gain.setValueAtTime(0.2 * mult, now);
    gain.gain.exponentialRampToValueAtTime(0.01 * mult, now + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  } catch (e) {
    console.debug(e);
  }
}

// ==============================================================
// Multi-Track Melodic Jukebox Synthesizer Loop
// ==============================================================

function setupBgmBus(ctx: AudioContext, filterFreq = 2600) {
  if (!bgmMasterGain) {
    bgmMasterGain = ctx.createGain();
    const initialGain = (currentMusicVolume / 100) * 0.35;
    bgmMasterGain.gain.setValueAtTime(initialGain, ctx.currentTime);
  }

  if (!bgmFilterNode) {
    bgmFilterNode = ctx.createBiquadFilter();
    bgmFilterNode.type = "lowpass";
    bgmFilterNode.frequency.setValueAtTime(filterFreq, ctx.currentTime);
    bgmFilterNode.Q.setValueAtTime(1.0, ctx.currentTime);
  } else {
    bgmFilterNode.frequency.setValueAtTime(filterFreq, ctx.currentTime);
  }

  if (!bgmDelayNode) {
    bgmDelayNode = ctx.createDelay();
    bgmDelayNode.delayTime.setValueAtTime(0.32, ctx.currentTime);
    bgmFeedbackGain = ctx.createGain();
    bgmFeedbackGain.gain.setValueAtTime(0.22, ctx.currentTime);

    bgmFilterNode.connect(bgmMasterGain);
    bgmFilterNode.connect(bgmDelayNode);
    bgmDelayNode.connect(bgmFeedbackGain);
    bgmFeedbackGain.connect(bgmDelayNode);
    bgmDelayNode.connect(bgmMasterGain);
    bgmMasterGain.connect(ctx.destination);
  }
}

function playBgmBass(ctx: AudioContext, freq: number, duration = 0.3, type: OscillatorType = "triangle") {
  if (!bgmFilterNode) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    const isSoft = type === "sine";
    const peakGain = isSoft ? 0.28 : type === "sawtooth" ? 0.16 : 0.22;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(peakGain, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(bgmFilterNode);

    osc.start(now);
    osc.stop(now + duration);
  } catch (e) {
    console.debug(e);
  }
}

function playBgmChordPad(ctx: AudioContext, freqs: number[], duration = 1.4) {
  if (!bgmFilterNode) return;
  const now = ctx.currentTime;

  activePadOscillators.forEach((osc) => {
    try { osc.stop(now + 0.1); } catch {}
  });
  activePadOscillators = [];

  freqs.forEach((freq) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.1);
      gain.gain.setValueAtTime(0.09, now + duration - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(bgmFilterNode!);

      osc.start(now);
      osc.stop(now + duration);
      activePadOscillators.push(osc);
    } catch (e) {
      console.debug(e);
    }
  });
}

function playBgmChime(ctx: AudioContext, freq: number) {
  if (!bgmFilterNode) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(bgmFilterNode);

    osc.start(now);
    osc.stop(now + 0.65);
  } catch (e) {
    console.debug(e);
  }
}

function bgmStep() {
  const ctx = getAudioContext();
  if (!ctx || !isBgmActive) return;

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
    return;
  }

  const track = getCurrentBgmTrack();
  setupBgmBus(ctx, track.filterFreq);

  const currentChord = track.chords[chordStep % track.chords.length];
  const melodySet = track.melodyPatterns[chordStep % track.melodyPatterns.length];

  // Beat 0: Root bass + full chord pad
  if (beatInBar === 0) {
    playBgmChordPad(ctx, currentChord.notes, (track.tempoMs * 4) / 1000);
    playBgmBass(ctx, currentChord.root, 0.4, currentChord.bassType || "triangle");
  }

  // Beat 2: Fifth / Octave bounce
  if (beatInBar === 2) {
    playBgmBass(ctx, currentChord.root * 1.5, 0.3, currentChord.bassType || "triangle");
  }

  // Melodic chime on beats
  if (beatInBar >= 0 && beatInBar <= 3) {
    const note = melodySet[beatInBar % melodySet.length];
    playBgmChime(ctx, note);
  }

  beatInBar = (beatInBar + 1) % 4;
  if (beatInBar === 0) {
    chordStep = (chordStep + 1) % track.chords.length;
    totalBarsPlayed++;

    // Track progression logic: After completing track's bar cycle (e.g. 8 bars = ~32 beats)
    if (userSelectedTrackId === "auto" && totalBarsPlayed >= track.barsPerLoop) {
      totalBarsPlayed = 0;
      currentTrackIndex = (currentTrackIndex + 1) % BGM_TRACKS.length;
      chordStep = 0;
      notifyTrackListeners();
      restartBgmInterval();
    }
  }
}

function restartBgmInterval() {
  if (!isBgmActive) return;
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  const track = getCurrentBgmTrack();
  bgmInterval = setInterval(bgmStep, track.tempoMs);
}

export function startBackgroundMusic(musicEnabled = true, soundEnabled = true, volume = 70) {
  if (!musicEnabled || !soundEnabled) return;
  if (volume !== undefined) {
    currentMusicVolume = Math.max(0, Math.min(100, volume));
  }
  if (currentMusicVolume <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  unlockAudio();
  const track = getCurrentBgmTrack();
  setupBgmBus(ctx, track.filterFreq);

  const targetGain = (currentMusicVolume / 100) * 0.35;

  if (bgmMasterGain) {
    const now = ctx.currentTime;
    bgmMasterGain.gain.cancelScheduledValues(now);
    bgmMasterGain.gain.setValueAtTime(bgmMasterGain.gain.value, now);
    bgmMasterGain.gain.linearRampToValueAtTime(targetGain, now + 0.3);
  }

  if (isBgmActive) return;

  isBgmActive = true;
  chordStep = 0;
  beatInBar = 0;
  totalBarsPlayed = 0;

  notifyTrackListeners();
  bgmStep();
  restartBgmInterval();
}

export function stopBackgroundMusic() {
  if (!isBgmActive && !bgmInterval) return;
  isBgmActive = false;

  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }

  const ctx = getAudioContext();
  if (ctx && bgmMasterGain) {
    try {
      const now = ctx.currentTime;
      bgmMasterGain.gain.cancelScheduledValues(now);
      bgmMasterGain.gain.setValueAtTime(bgmMasterGain.gain.value, now);
      bgmMasterGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
    } catch {}
  }

  setTimeout(() => {
    activePadOscillators.forEach((osc) => {
      try { osc.stop(); } catch {}
    });
    activePadOscillators = [];
  }, 600);
}

export function isBackgroundMusicPlaying() {
  return isBgmActive;
}

export function nextBgmTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % BGM_TRACKS.length;
  chordStep = 0;
  beatInBar = 0;
  totalBarsPlayed = 0;
  notifyTrackListeners();
  restartBgmInterval();
}

export function prevBgmTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + BGM_TRACKS.length) % BGM_TRACKS.length;
  chordStep = 0;
  beatInBar = 0;
  totalBarsPlayed = 0;
  notifyTrackListeners();
  restartBgmInterval();
}
