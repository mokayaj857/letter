// Web Audio API Sound Synthesizer & Melodic Game Background Music Engine

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
      // Re-trigger music volume and scheduled notes if suspended
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
// Melodic Cheerful Game Background Music (BGM) Engine
// ==============================================================

// Chords: C major, A minor, F major, G major
const BGM_CHORDS = [
  { root: 130.81, notes: [261.63, 329.63, 392.0] },  // C3 + C4, E4, G4
  { root: 110.0,  notes: [220.0, 261.63, 329.63] },  // A2 + A3, C4, E4
  { root: 87.31,  notes: [174.61, 220.0, 261.63] },  // F2 + F3, A3, C4
  { root: 98.0,   notes: [196.0, 246.94, 293.66] },  // G2 + G3, B3, D4
];

const BGM_MELODIES = [
  // Sweet pentatonic chime melodies
  [523.25, 587.33, 659.25, 783.99], // C5, D5, E5, G5
  [659.25, 587.33, 523.25, 440.0],  // E5, D5, C5, A4
  [523.25, 659.25, 783.99, 1046.5], // C5, E5, G5, C6
  [783.99, 659.25, 587.33, 523.25], // G5, E5, D5, C5
];

let chordStep = 0;
let beatInBar = 0;

function setupBgmBus(ctx: AudioContext) {
  if (bgmMasterGain && bgmFilterNode) return;

  // Master Gain for Music
  bgmMasterGain = ctx.createGain();
  const initialGain = (currentMusicVolume / 100) * 0.35;
  bgmMasterGain.gain.setValueAtTime(initialGain, ctx.currentTime);

  // Warm filter to shape tone
  bgmFilterNode = ctx.createBiquadFilter();
  bgmFilterNode.type = "lowpass";
  bgmFilterNode.frequency.setValueAtTime(2400, ctx.currentTime);
  bgmFilterNode.Q.setValueAtTime(1.0, ctx.currentTime);

  // Spacious gentle delay
  bgmDelayNode = ctx.createDelay();
  bgmDelayNode.delayTime.setValueAtTime(0.32, ctx.currentTime);
  bgmFeedbackGain = ctx.createGain();
  bgmFeedbackGain.gain.setValueAtTime(0.25, ctx.currentTime);

  // Routing
  bgmFilterNode.connect(bgmMasterGain);
  bgmFilterNode.connect(bgmDelayNode);
  bgmDelayNode.connect(bgmFeedbackGain);
  bgmFeedbackGain.connect(bgmDelayNode);
  bgmDelayNode.connect(bgmMasterGain);

  bgmMasterGain.connect(ctx.destination);
}

function playBgmBass(ctx: AudioContext, freq: number, duration = 0.3) {
  if (!bgmFilterNode) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.02);
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

  // Clean previous pads
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
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1);
      gain.gain.setValueAtTime(0.10, now + duration - 0.2);
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

    // Warm marimba/kalimba chime
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

  const currentChord = BGM_CHORDS[chordStep % BGM_CHORDS.length];
  const melodySet = BGM_MELODIES[chordStep % BGM_MELODIES.length];

  // Beat 0: New chord pad + Root bass
  if (beatInBar === 0) {
    playBgmChordPad(ctx, currentChord.notes, 1.5);
    playBgmBass(ctx, currentChord.root, 0.4);
  }

  // Beat 2: Fifth/Octave bass bounce
  if (beatInBar === 2) {
    playBgmBass(ctx, currentChord.root * 1.5, 0.3);
  }

  // Melodic chimes on rhythmic beats
  if (beatInBar === 0 || beatInBar === 1 || beatInBar === 2 || beatInBar === 3) {
    const note = melodySet[beatInBar % melodySet.length];
    playBgmChime(ctx, note);
  }

  beatInBar = (beatInBar + 1) % 4;
  if (beatInBar === 0) {
    chordStep = (chordStep + 1) % BGM_CHORDS.length;
  }
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
  setupBgmBus(ctx);

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

  // Trigger immediate beat and start interval (every 380ms per beat = ~158 BPM)
  bgmStep();
  if (bgmInterval) clearInterval(bgmInterval);
  bgmInterval = setInterval(bgmStep, 380);
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
