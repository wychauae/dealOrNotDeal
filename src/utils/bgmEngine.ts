import { getAudioContext } from './audioContext';

const BPM = 132;
const LOOP_BEATS = 16;
const BEAT_SEC = 60 / BPM;
const LOOKAHEAD = 0.18;
const SCHEDULER_MS = 25;
const MASTER_VOLUME = 0.07;

/** C major game-show style loop — frequencies in Hz */
const MELODY: ReadonlyArray<{ beat: number; freq: number; dur: number }> = [
  { beat: 0, freq: 784, dur: 0.45 },
  { beat: 1, freq: 988, dur: 0.45 },
  { beat: 2, freq: 1175, dur: 0.9 },
  { beat: 4, freq: 1047, dur: 0.45 },
  { beat: 5, freq: 988, dur: 0.45 },
  { beat: 6, freq: 784, dur: 0.9 },
  { beat: 8, freq: 880, dur: 0.45 },
  { beat: 9, freq: 988, dur: 0.45 },
  { beat: 10, freq: 1175, dur: 0.45 },
  { beat: 11, freq: 1319, dur: 0.45 },
  { beat: 12, freq: 1175, dur: 0.45 },
  { beat: 13, freq: 988, dur: 0.45 },
  { beat: 14, freq: 784, dur: 0.9 },
];

const BASS: ReadonlyArray<{ beat: number; freq: number; dur: number }> = [
  { beat: 0, freq: 131, dur: 1.8 },
  { beat: 4, freq: 98, dur: 1.8 },
  { beat: 8, freq: 110, dur: 1.8 },
  { beat: 12, freq: 87, dur: 1.8 },
];

const SPARKLE: ReadonlyArray<{ beat: number; freq: number }> = [
  { beat: 3, freq: 1568 },
  { beat: 7, freq: 1760 },
  { beat: 11, freq: 1568 },
  { beat: 15, freq: 1976 },
];

export class BgmEngine {
  private masterGain: GainNode | null = null;
  private schedulerId: ReturnType<typeof setInterval> | null = null;
  private nextBeatTime = 0;
  private currentBeat = 0;
  private loopStart = 0;
  private running = false;
  private scheduledKeys = new Set<string>();

  start(): void {
    if (this.running) return;

    const ctx = getAudioContext();
    this.running = true;
    this.scheduledKeys.clear();

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0, ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(
      MASTER_VOLUME,
      ctx.currentTime + 0.6,
    );
    this.masterGain.connect(ctx.destination);

    this.loopStart = ctx.currentTime + 0.05;
    this.nextBeatTime = this.loopStart;
    this.currentBeat = 0;

    this.schedulerId = setInterval(() => this.tick(), SCHEDULER_MS);
  }

  stop(): void {
    this.running = false;

    if (this.schedulerId !== null) {
      clearInterval(this.schedulerId);
      this.schedulerId = null;
    }

    if (this.masterGain) {
      const ctx = getAudioContext();
      const gain = this.masterGain;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      const node = gain;
      setTimeout(() => node.disconnect(), 450);
      this.masterGain = null;
    }

    this.scheduledKeys.clear();
  }

  private tick(): void {
    if (!this.running || !this.masterGain) return;

    const ctx = getAudioContext();
    const horizon = ctx.currentTime + LOOKAHEAD;

    while (this.nextBeatTime < horizon) {
      this.scheduleBeat(this.currentBeat, this.nextBeatTime);
      this.nextBeatTime += BEAT_SEC;
      this.currentBeat = (this.currentBeat + 1) % LOOP_BEATS;

      if (this.currentBeat === 0) {
        this.loopStart = this.nextBeatTime;
        this.scheduledKeys.clear();
      }
    }
  }

  private scheduleBeat(beat: number, time: number): void {
    if (!this.masterGain) return;

    for (const n of MELODY) {
      if (n.beat === beat) {
        this.playNote(n.freq, time, n.dur * BEAT_SEC, 'triangle', 0.55);
      }
    }

    for (const n of BASS) {
      if (n.beat === beat) {
        this.playNote(n.freq, time, n.dur * BEAT_SEC, 'sine', 0.7);
      }
    }

    for (const n of SPARKLE) {
      if (n.beat === beat) {
        this.playNote(n.freq, time, 0.08, 'sine', 0.25);
      }
    }

    if (beat % 2 === 0) {
      this.playNote(523, time, 0.06, 'square', 0.08);
    }
  }

  private playNote(
    freq: number,
    time: number,
    duration: number,
    type: OscillatorType,
    velocity: number,
  ): void {
    if (!this.masterGain) return;

    const key = `${Math.round(time * 1000)}-${freq}-${type}`;
    if (this.scheduledKeys.has(key)) return;
    this.scheduledKeys.add(key);

    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    const peak = velocity;
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.exponentialRampToValueAtTime(peak, time + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration + 0.05);
  }
}

let engineInstance: BgmEngine | null = null;

export function getBgmEngine(): BgmEngine {
  if (!engineInstance) {
    engineInstance = new BgmEngine();
  }
  return engineInstance;
}
