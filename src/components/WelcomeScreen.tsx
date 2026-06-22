import { motion } from 'framer-motion';
import { useSound } from '../hooks/useSound';
import { useTranslation } from '../i18n/useTranslation';
import styles from './WelcomeScreen.module.css';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { play } = useSound();
  const { t } = useTranslation();

  const handleStart = () => {
    play('click');
    onStart();
  };

  return (
    <motion.section
      className={styles.welcome}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      aria-labelledby="welcome-heading"
    >
      <div className={styles.hero}>
        <motion.div
          className={styles.briefcase}
          animate={{
            rotateY: [0, 10, -10, 0],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          aria-hidden="true"
        >
          💼
        </motion.div>

        <h2 id="welcome-heading" className={styles.heading}>
          {t('welcomeTitle')}
        </h2>
        <p className={styles.description}>
          {t('welcomeDescription')}{' '}
          <strong>{t('welcomeHighlight')}</strong>
        </p>

        <motion.button
          type="button"
          className={styles.startBtn}
          onClick={handleStart}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {t('startGame')}
        </motion.button>

        <ul className={styles.rules} aria-label={t('howToPlay')}>
          <li>
            <span className={styles.step}>1</span>
            {t('rule1')}
          </li>
          <li>
            <span className={styles.step}>2</span>
            {t('rule2')}
          </li>
          <li>
            <span className={styles.step}>3</span>
            {t('rule3')}
          </li>
          <li>
            <span className={styles.step}>4</span>
            {t('rule4')}
          </li>
        </ul>
      </div>
    </motion.section>
  );
}
