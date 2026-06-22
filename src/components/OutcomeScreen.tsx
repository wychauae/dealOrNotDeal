import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/gameLogic';
import type { Case, GameOutcome } from '../types/game';
import { useSound } from '../hooks/useSound';
import { useTranslation } from '../i18n/useTranslation';
import type { TranslationKey } from '../i18n/translations';
import styles from './OutcomeScreen.module.css';

interface OutcomeScreenProps {
  winnings: number;
  outcome: GameOutcome;
  cases: Case[];
  playerCaseId: number | null;
  onRestart: () => void;
}

const OUTCOME_KEYS: Record<GameOutcome, TranslationKey> = {
  deal: 'outcomeDeal',
  'no-deal': 'outcomeNoDeal',
  swap: 'outcomeSwap',
  keep: 'outcomeKeep',
};

export function OutcomeScreen({
  winnings,
  outcome,
  cases,
  playerCaseId,
  onRestart,
}: OutcomeScreenProps) {
  const { play } = useSound();
  const { t, locale } = useTranslation();
  const isBigWin = winnings >= 100000;
  const playerCase = cases.find((c) => c.id === playerCaseId);
  const otherValues = cases
    .filter((c) => c.id !== playerCaseId)
    .map((c) => ({ id: c.id, value: c.value }));

  const handleRestart = () => {
    play('click');
    onRestart();
  };

  return (
    <motion.section
      className={styles.outcome}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      aria-labelledby="outcome-heading"
    >
      <motion.div
        className={styles.confetti}
        initial={{ opacity: 0 }}
        animate={{ opacity: isBigWin ? 1 : 0.3 }}
        aria-hidden="true"
      >
        {isBigWin && '🎉✨🎊✨🎉'}
      </motion.div>

      <h2 id="outcome-heading" className={styles.heading}>
        {t('gameOver')}
      </h2>
      <p className={styles.message}>{t(OUTCOME_KEYS[outcome])}</p>

      <motion.div
        className={[styles.winnings, isBigWin && styles.bigWin].filter(Boolean).join(' ')}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        onAnimationComplete={() => play(isBigWin ? 'win' : 'reveal')}
      >
        <span className={styles.winningsLabel}>{t('youWon')}</span>
        <span className={styles.winningsAmount}>
          {formatCurrency(winnings, locale)}
        </span>
      </motion.div>

      {playerCase && (
        <div className={styles.summary}>
          <h3 className={styles.summaryTitle}>{t('fullReveal')}</h3>
          <p className={styles.playerReveal}>
            {t('yourCaseContained', { id: playerCaseId ?? '' })}{' '}
            <strong>{formatCurrency(playerCase.value, locale)}</strong>
          </p>
          <ul className={styles.allCases} aria-label={t('allCaseValues')}>
            {otherValues.slice(0, 8).map(({ id, value }) => (
              <li key={id}>
                {t('caseValue', {
                  id,
                  amount: formatCurrency(value, locale),
                })}
              </li>
            ))}
            {otherValues.length > 8 && (
              <li className={styles.more}>
                {t('moreCasesRevealed', { count: otherValues.length - 8 })}
              </li>
            )}
          </ul>
        </div>
      )}

      <motion.button
        type="button"
        className={styles.restartBtn}
        onClick={handleRestart}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        {t('playAgain')}
      </motion.button>
    </motion.section>
  );
}
