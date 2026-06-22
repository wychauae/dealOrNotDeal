import { useCallback, useRef, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../i18n/useTranslation';
import styles from './BankerOfferModal.module.css';

const HOLD_MS = 2000;
const MOVE_CANCEL_PX = 12;

interface BargainButtonProps {
  disabled: boolean;
  onConfirm: () => void;
}

export function BargainButton({ disabled, onConfirm }: BargainButtonProps) {
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
      if (disabled) return;

      completedRef.current = false;
      startTimeRef.current = Date.now();
      startPosRef.current = { x: clientX, y: clientY };
      setHolding(true);
      rafRef.current = requestAnimationFrame(tick);
    },
    [disabled, tick],
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

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    startHold(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    cancelIfMoved(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    if (!completedRef.current) {
      clearHold();
    }
  };

  const handlePointerCancel = () => {
    if (!completedRef.current) {
      clearHold();
    }
  };

  const label = disabled ? t('bargainUsed') : t('bargain');

  return (
    <div className={styles.bargainWrap}>
      <motion.button
        type="button"
        className={[
          styles.bargainBtn,
          holding && styles.bargainBtnHolding,
          !disabled && styles.bargainBtnTouch,
        ]
          .filter(Boolean)
          .join(' ')}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerCancel}
        onPointerCancel={handlePointerCancel}
        onClick={(e) => e.preventDefault()}
        disabled={disabled}
        aria-label={disabled ? t('bargainUsedAria') : t('bargainAria')}
      >
        {holding && (
          <span
            className={styles.holdProgress}
            style={{ transform: `scaleX(${progress})` }}
            aria-hidden="true"
          />
        )}
        {holding && (
          <span
            className={styles.holdRing}
            style={{ '--hold-progress': progress } as CSSProperties}
            aria-hidden="true"
          />
        )}
        <span className={styles.bargainLabel}>{label}</span>
      </motion.button>
      {!disabled && (
        <p className={styles.bargainHint}>{t('bargainHoldHint')}</p>
      )}
    </div>
  );
}
