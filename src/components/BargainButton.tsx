import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useTouchDevice } from '../hooks/useTouchDevice';
import { useTranslation } from '../i18n/useTranslation';
import styles from './BankerOfferModal.module.css';

const HOLD_MS = 2000;
const MOVE_CANCEL_PX = 12;

interface BargainButtonProps {
  disabled: boolean;
  onConfirm: () => void;
}

export function BargainButton({ disabled, onConfirm }: BargainButtonProps) {
  const isTouchDevice = useTouchDevice();
  const { t } = useTranslation();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const startPosRef = useRef({ x: 0, y: 0 });
  const completedRef = useRef(false);

  const clearHold = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHolding(false);
    setProgress(0);
  }, []);

  const finishHold = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHolding(false);
    setProgress(1);
    onConfirm();
  }, [onConfirm]);

  const tick = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const p = Math.min(elapsed / HOLD_MS, 1);
    setProgress(p);

    if (p >= 1) {
      finishHold();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [finishHold]);

  const startHold = useCallback(
    (clientX: number, clientY: number) => {
      if (disabled || !isTouchDevice) return;

      completedRef.current = false;
      startTimeRef.current = Date.now();
      startPosRef.current = { x: clientX, y: clientY };
      setHolding(true);
      rafRef.current = requestAnimationFrame(tick);
    },
    [disabled, isTouchDevice, clearHold, tick],
  );

  const cancelIfMoved = useCallback(
    (clientX: number, clientY: number) => {
      if (!holding) return;
      const dx = clientX - startPosRef.current.x;
      const dy = clientY - startPosRef.current.y;
      if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) {
        clearHold();
      }
    },
    [holding, clearHold],
  );

  const handleClick = () => {
    if (disabled || isTouchDevice) return;
    onConfirm();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || !isTouchDevice) return;
    const touch = e.touches[0];
    startHold(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouchDevice) return;
    const touch = e.touches[0];
    cancelIfMoved(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    if (!isTouchDevice || completedRef.current) return;
    clearHold();
  };

  const label = disabled ? t('bargainUsed') : t('bargain');

  return (
    <div className={styles.bargainWrap}>
      <motion.button
        type="button"
        className={[
          styles.bargainBtn,
          holding && styles.bargainBtnHolding,
          isTouchDevice && !disabled && styles.bargainBtnTouch,
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        disabled={disabled}
        whileHover={!disabled && !isTouchDevice ? { scale: 1.02 } : undefined}
        whileTap={!disabled && !isTouchDevice ? { scale: 0.98 } : undefined}
        aria-label={disabled ? t('bargainUsedAria') : t('bargainAria')}
      >
        {isTouchDevice && holding && (
          <span
            className={styles.holdProgress}
            style={{ transform: `scaleX(${progress})` }}
            aria-hidden="true"
          />
        )}
        {isTouchDevice && holding && (
          <span
            className={styles.holdRing}
            style={{ '--hold-progress': progress } as CSSProperties}
            aria-hidden="true"
          />
        )}
        <span className={styles.bargainLabel}>{label}</span>
      </motion.button>
      {isTouchDevice && !disabled && (
        <p className={styles.bargainHint}>{t('bargainHoldHint')}</p>
      )}
    </div>
  );
}
