import { motion } from 'framer-motion';
import type { Case } from '../types/game';
import { useSound } from '../hooks/useSound';
import { useTranslation } from '../i18n/useTranslation';
import styles from './FinalChoiceModal.module.css';

interface FinalChoiceModalProps {
  cases: Case[];
  playerCaseId: number;
  onSwap: () => void;
  onKeep: () => void;
}

export function FinalChoiceModal({
  cases,
  playerCaseId,
  onSwap,
  onKeep,
}: FinalChoiceModalProps) {
  const { play } = useSound();
  const { t } = useTranslation();
  const otherCase = cases.find((c) => !c.isOpen && !c.isPlayerCase);

  const handleSwap = () => {
    play('click');
    onSwap();
  };

  const handleKeep = () => {
    play('click');
    onKeep();
  };

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="final-heading"
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      >
        <h2 id="final-heading" className={styles.heading}>
          {t('finalDecision')}
        </h2>
        <p className={styles.description}>
          {t('finalDescription', {
            playerId: playerCaseId,
            otherId: otherCase?.id ?? '',
          })}
        </p>

        <div className={styles.cases}>
          <div className={styles.caseOption}>
            <span className={styles.caseNum}>#{playerCaseId}</span>
            <span className={styles.caseLabel}>{t('yourCaseLabel')}</span>
          </div>
          <span className={styles.vs} aria-hidden="true">
            VS
          </span>
          <div className={styles.caseOption}>
            <span className={styles.caseNum}>#{otherCase?.id}</span>
            <span className={styles.caseLabel}>{t('otherCaseLabel')}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <motion.button
            type="button"
            className={styles.keepBtn}
            onClick={handleKeep}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {t('keepCase', { id: playerCaseId })}
          </motion.button>
          <motion.button
            type="button"
            className={styles.swapBtn}
            onClick={handleSwap}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {t('swapCase', { id: otherCase?.id ?? '' })}
          </motion.button>
        </div>

        <p className={styles.hint}>{t('finalHint')}</p>
      </motion.div>
    </motion.div>
  );
}
