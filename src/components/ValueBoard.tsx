import { motion, AnimatePresence } from 'framer-motion';
import { CASE_VALUES } from '../utils/constants';
import { formatCurrency } from '../utils/gameLogic';
import type { Case } from '../types/game';
import { useTranslation } from '../i18n/useTranslation';
import styles from './ValueBoard.module.css';

interface ValueBoardProps {
  cases: Case[];
}

export function ValueBoard({ cases }: ValueBoardProps) {
  const { t, locale } = useTranslation();
  const openedValues = new Set(
    cases.filter((c) => c.isOpen).map((c) => c.value),
  );

  return (
    <aside className={styles.board} aria-label={t('valuesRemaining')}>
      <h3 className={styles.title}>{t('valuesRemaining')}</h3>
      <ul className={styles.list}>
        {CASE_VALUES.map((value) => {
          const isEliminated = openedValues.has(value);
          const isHigh = value >= 100000;
          const formatted = formatCurrency(value, locale);

          return (
            <motion.li
              key={value}
              className={[
                styles.item,
                isEliminated && styles.eliminated,
                isHigh && styles.highValue,
              ]
                .filter(Boolean)
                .join(' ')}
              layout
              animate={{
                opacity: isEliminated ? 0.25 : 1,
                scale: isEliminated ? 0.92 : 1,
              }}
              transition={{ duration: 0.4 }}
              aria-label={
                isEliminated
                  ? t('valueEliminated', { amount: formatted })
                  : t('valueRemaining', { amount: formatted })
              }
            >
              <AnimatePresence>
                {isEliminated && (
                  <motion.span
                    className={styles.strike}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                  />
                )}
              </AnimatePresence>
              {formatted}
            </motion.li>
          );
        })}
      </ul>
    </aside>
  );
}
