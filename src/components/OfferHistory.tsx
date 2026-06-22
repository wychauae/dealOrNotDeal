import { motion } from 'framer-motion';
import type { BankerOfferRecord } from '../types/game';
import { formatCurrency } from '../utils/gameLogic';
import { useTranslation } from '../i18n/useTranslation';
import { CurrencyAmount } from './CurrencyAmount';
import styles from './OfferHistory.module.css';

interface OfferHistoryProps {
  history: BankerOfferRecord[];
}

export function OfferHistory({ history }: OfferHistoryProps) {
  const { t, locale } = useTranslation();

  if (history.length === 0) {
    return (
      <aside className={styles.board} aria-label={t('offerHistory')}>
        <h3 className={styles.title}>{t('offerHistory')}</h3>
        <p className={styles.empty}>{t('noOffersYet')}</p>
      </aside>
    );
  }

  return (
    <aside className={styles.board} aria-label={t('offerHistory')}>
      <h3 className={styles.title}>{t('offerHistory')}</h3>
      <ol className={styles.list}>
        {[...history].reverse().map((record) => (
          <motion.li
            key={`round-${record.round}`}
            className={styles.item}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            layout
          >
            <span className={styles.round}>
              {t('round', { n: record.round })}
            </span>
            <div className={styles.amounts}>
              {record.previousOffer !== undefined && (
                <CurrencyAmount className={styles.previous}>
                  {formatCurrency(record.previousOffer, locale)}
                </CurrencyAmount>
              )}
              <CurrencyAmount
                className={[
                  styles.offer,
                  record.wasBargained && record.previousOffer !== undefined
                    ? styles.improved
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {formatCurrency(record.offer, locale)}
              </CurrencyAmount>
            </div>
            {record.wasBargained && (
              <span className={styles.bargainTag}>{t('bargained')}</span>
            )}
          </motion.li>
        ))}
      </ol>
    </aside>
  );
}
