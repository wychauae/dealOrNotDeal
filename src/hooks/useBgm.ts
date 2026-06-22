import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';
import { resumeAudioContext } from '../utils/audioContext';
import { getBgmEngine } from '../utils/bgmEngine';

/** Loops upbeat game-show BGM while `active` and sound is enabled */
export function useBgm(active: boolean): void {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  useEffect(() => {
    const engine = getBgmEngine();

    if (!active || !soundEnabled) {
      engine.stop();
      return;
    }

    void resumeAudioContext().then(() => {
      engine.start();
    });

    return () => {
      engine.stop();
    };
  }, [active, soundEnabled]);
}
