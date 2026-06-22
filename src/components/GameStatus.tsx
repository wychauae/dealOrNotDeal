import { motion } from 'framer-motion';
import { useTranslation } from '../i18n/useTranslation';
import styles from './GameStatus.module.css';

interface GameStatusProps {
  phase: string;
  round: number;
  casesOpenedThisRound: number;
  casesToOpenThisRound: number;
  playerCaseId: number | null;
}

export function GameStatus({
  phase,
  round,
  casesOpenedThisRound,
  casesToOpenThisRound,
  playerCaseId,
}: GameStatusProps) {
  const { t } = useTranslation();

  const getMessage = () => {
    switch (phase) {
      case 'selecting-case':
        return t('statusSelectCase');
      case 'playing':
        return t('statusOpenMore', {
          count: casesToOpenThisRound - casesOpenedThisRound,
        });
      case 'revealing':
        return t('statusRevealing');
      case 'offer':
        return t('statusOffer');
      case 'final-choice':
        return t('statusFinalChoice');
      default:
        return '';
    }
  };

  if (phase === 'welcome' || phase === 'game-over') return null;

  return (
    <motion.div
      className={styles.status}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      role="status"
      aria-live="polite"
    >
      <div className={styles.badges}>
        {phase !== 'selecting-case' && (
          <span className={styles.badge}>{t('round', { n: round + 1 })}</span>
        )}
        {playerCaseId && (
          <span className={styles.badgeAccent}>
            {t('yourCase', { id: playerCaseId })}
          </span>
        )}
        {phase === 'playing' && (
          <span className={styles.badge}>
            {t('opened', {
              opened: casesOpenedThisRound,
              total: casesToOpenThisRound,
            })}
          </span>
        )}
      </div>
      <p className={styles.message}>{getMessage()}</p>
    </motion.div>
  );
}
