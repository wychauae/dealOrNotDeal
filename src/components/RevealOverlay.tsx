import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/gameLogic';
import { useSound } from '../hooks/useSound';
import { useTranslation } from '../i18n/useTranslation';
import { CurrencyAmount } from './CurrencyAmount';
import styles from './RevealOverlay.module.css';

interface RevealOverlayProps {
  caseId: number;
  value: number;
  onComplete: () => void;
}

export function RevealOverlay({ caseId, value, onComplete }: RevealOverlayProps) {
  const { play } = useSound();
  const { t, locale } = useTranslation();
  const isHighValue = value >= 10000;
  const isLowValue = value <= 100;

  const handleAnimationComplete = () => {
    play(isLowValue ? 'win' : 'reveal');
    setTimeout(onComplete, 1200);
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reveal-heading"
    >
      <motion.div
        className={[
          styles.card,
          isHighValue && styles.highValue,
          isLowValue && styles.lowValue,
        ]
          .filter(Boolean)
          .join(' ')}
        initial={{ scale: 0.5, rotateY: 180 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        onAnimationComplete={handleAnimationComplete}
      >
        <p className={styles.label}>{t('revealCase', { id: caseId })}</p>
        <h2 id="reveal-heading" className={styles.valueHeading}>
          <CurrencyAmount className={styles.value}>
            {formatCurrency(value, locale)}
          </CurrencyAmount>
        </h2>
        <p className={styles.message}>
          {isLowValue
            ? t('revealGreat')
            : isHighValue
              ? t('revealOuch')
              : t('revealEliminated')}
        </p>
      </motion.div>
    </motion.div>
  );
}
