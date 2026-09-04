// Web Audio API sound synthesizer

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
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
    audioCtx.resume();
  }
  return audioCtx;
}

export function playPop(soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.07);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  } catch (e) {
    console.debug(e);
  }
}

export function playCoin(soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [987.77, 1318.51].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      const start = now + idx * 0.07;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.22);
    });
  } catch (e) {
    console.debug(e);
  }
}

export function playSuccess(soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const start = now + idx * 0.08;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.3);
    });
  } catch (e) {
    console.debug(e);
  }
}

export function playVictory(soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.12 },
      { f: 1046.5, d: 0.28 },
      { f: 880.0, d: 0.14 },
      { f: 1046.5, d: 0.4 },
    ];
    let offset = 0;
    melody.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      const start = now + offset;
      osc.frequency.setValueAtTime(note.f, start);
      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + note.d);
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
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(140, now + 0.18);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  } catch (e) {
    console.debug(e);
  }
}

// ==========================================
// Ambient Distant Game Background Music (BGM)
// ==========================================

let bgmInterval: any = null;
let bgmFilterNode: BiquadFilterNode | null = null;
let bgmMasterGain: GainNode | null = null;
let bgmDelayNode: DelayNode | null = null;
let bgmFeedbackGain: GainNode | null = null;
let isBgmActive = false;
let activePadOscillators: OscillatorNode[] = [];

// Peaceful pentatonic scales and harmonic chord progressions for calm gaming
const BGM_CHORDS = [
  // C Major: C3, G3, E4
  [130.81, 196.0, 329.63],
  // A Minor: A2, E3, C4
  [110.0, 164.81, 261.63],
  // F Major: F2, C3, A3
  [87.31, 130.81, 220.0],
  // G Major: G2, D3, B3
  [98.0, 146.83, 246.94],
];

const BGM_MELODY_NOTES = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  392.0,  // G4
  440.0,  // A4
  523.25, // C5
  587.33, // D5
  659.25, // E5
  783.99, // G5
];

let currentChordIndex = 0;
let stepCounter = 0;

function setupBgmBus(ctx: AudioContext) {
  if (bgmMasterGain && bgmFilterNode) return;

  // Master Gain for Music (keeps it low and distant)
  bgmMasterGain = ctx.createGain();
  bgmMasterGain.gain.setValueAtTime(0, ctx.currentTime);

  // Lowpass filter to create that distant / soft ambient warmth
  bgmFilterNode = ctx.createBiquadFilter();
  bgmFilterNode.type = "lowpass";
  bgmFilterNode.frequency.setValueAtTime(820, ctx.currentTime);
  bgmFilterNode.Q.setValueAtTime(1.1, ctx.currentTime);

  // Gentle spacious echo/delay
  bgmDelayNode = ctx.createDelay();
  bgmDelayNode.delayTime.setValueAtTime(0.36, ctx.currentTime);
  bgmFeedbackGain = ctx.createGain();
  bgmFeedbackGain.gain.setValueAtTime(0.22, ctx.currentTime);

  // Routing: Sources -> Filter -> Master Gain -> Destination
  // + Delay Loop: Filter -> Delay -> Feedback -> Delay & Filter -> Master Gain
  bgmFilterNode.connect(bgmMasterGain);
  bgmFilterNode.connect(bgmDelayNode);
  bgmDelayNode.connect(bgmFeedbackGain);
  bgmFeedbackGain.connect(bgmDelayNode);
  bgmDelayNode.connect(bgmMasterGain);

  bgmMasterGain.connect(ctx.destination);
}

function playBgmPadChord(ctx: AudioContext, freqs: number[], durationSec = 3.2) {
  if (!bgmFilterNode) return;
  const now = ctx.currentTime;

  // Stop previous pads gently
  activePadOscillators.forEach((osc) => {
    try {
      osc.stop(now + 0.3);
    } catch {}
  });
  activePadOscillators = [];

  freqs.forEach((freq, idx) => {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);

      // Gentle swelling envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.025, now + 0.8);
      gain.gain.setValueAtTime(0.025, now + durationSec - 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc.connect(gain);
      gain.connect(bgmFilterNode!);

      osc.start(now);
      osc.stop(now + durationSec);
      activePadOscillators.push(osc);
    } catch (e) {
      console.debug(e);
    }
  });
}

function playBgmChimeNote(ctx: AudioContext, freq: number) {
  if (!bgmFilterNode) return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    // Warm kalimba / music box chime envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0005, now + 1.2);

    osc.connect(gain);
    gain.connect(bgmFilterNode);

    osc.start(now);
    osc.stop(now + 1.2);
  } catch (e) {
    console.debug(e);
  }
}

function bgmTick() {
  const ctx = getAudioContext();
  if (!ctx || !isBgmActive) return;

  // Change pad chord every 8 steps (~3.2 seconds)
  if (stepCounter % 8 === 0) {
    const chord = BGM_CHORDS[currentChordIndex % BGM_CHORDS.length];
    playBgmPadChord(ctx, chord, 3.4);
    currentChordIndex++;
  }

  // Play melodic chimes on rhythmic beats with some variation
  const stepInBar = stepCounter % 8;
  const playMelody = [0, 2, 3, 5, 6].includes(stepInBar) || Math.random() < 0.35;
  if (playMelody) {
    const note = BGM_MELODY_NOTES[Math.floor(Math.random() * BGM_MELODY_NOTES.length)];
    playBgmChimeNote(ctx, note);
  }

  stepCounter++;
}

export function startBackgroundMusic(musicEnabled = true, soundEnabled = true) {
  if (!musicEnabled || !soundEnabled) return;
  if (isBgmActive) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    const resumeHandler = () => {
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      window.removeEventListener("pointerdown", resumeHandler);
      window.removeEventListener("keydown", resumeHandler);
    };
    window.addEventListener("pointerdown", resumeHandler, { once: true });
    window.addEventListener("keydown", resumeHandler, { once: true });
    ctx.resume().catch(() => {});
  }

  setupBgmBus(ctx);
  isBgmActive = true;
  stepCounter = 0;
  currentChordIndex = 0;

  // Smooth fade-in
  if (bgmMasterGain) {
    const now = ctx.currentTime;
    bgmMasterGain.gain.cancelScheduledValues(now);
    bgmMasterGain.gain.setValueAtTime(bgmMasterGain.gain.value || 0.001, now);
    bgmMasterGain.gain.exponentialRampToValueAtTime(0.045, now + 1.5);
  }

  // Immediately trigger first tick and start loop
  bgmTick();
  if (bgmInterval) clearInterval(bgmInterval);
  bgmInterval = setInterval(bgmTick, 400);
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
      bgmMasterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
    } catch {}
  }

  // Clean up active oscillators after fade
  setTimeout(() => {
    activePadOscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch {}
    });
    activePadOscillators = [];
  }, 850);
}

export function isBackgroundMusicPlaying() {
  return isBgmActive;
}

