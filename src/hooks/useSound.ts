import { useCallback, useRef } from 'react';
import { useSettingsStore } from '../store/settingsStore';

type SoundType = 'click' | 'reveal' | 'offer' | 'deal' | 'win' | 'lose';

const FREQUENCIES: Record<SoundType, number[]> = {
  click: [440],
  reveal: [330, 220],
  offer: [392, 523, 659],
  deal: [523, 659, 784],
  win: [523, 659, 784, 1047],
  lose: [392, 330, 262],
};

export function useSound() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const ctxRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback(
    (frequency: number, startTime: number, duration: number, volume = 0.15) => {
      const ctx = getContext();
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    },
    [getContext],
  );

  const play = useCallback(
    (type: SoundType) => {
      if (!soundEnabled) return;

      const ctx = getContext();
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }

      const freqs = FREQUENCIES[type];
      const now = ctx.currentTime;

      freqs.forEach((freq, i) => {
        playTone(freq, now + i * 0.12, 0.25, 0.12);
      });
    },
    [soundEnabled, getContext, playTone],
  );

  return { play };
}
