import { motion, AnimatePresence } from 'framer-motion';
import type { BargainMessageKey } from '../types/game';
import { formatCurrency } from '../utils/gameLogic';
import { useSound } from '../hooks/useSound';
import { useTranslation } from '../i18n/useTranslation';
import { getBargainMessageKey } from '../i18n/translations';
import { BargainButton } from './BargainButton';
import { CurrencyAmount } from './CurrencyAmount';
import styles from './BankerOfferModal.module.css';

interface BankerOfferModalProps {
  offer: number;
  round: number;
  hasBargained: boolean;
  isBargaining: boolean;
  bargainMessageKey: BargainMessageKey | null;
  onDeal: () => void;
  onNoDeal: () => void;
  onBargain: () => void;
}

export function BankerOfferModal({
  offer,
  round,
  hasBargained,
  isBargaining,
  bargainMessageKey,
  onDeal,
  onNoDeal,
  onBargain,
}: BankerOfferModalProps) {
  const { play } = useSound();
  const { t, locale } = useTranslation();

  const handleDeal = () => {
    play('deal');
    onDeal();
  };

  const handleNoDeal = () => {
    play('click');
    onNoDeal();
  };

  const handleBargain = () => {
    play('click');
    onBargain();
  };

  const bargainMessage = bargainMessageKey
    ? t(getBargainMessageKey(bargainMessageKey))
    : null;

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-heading"
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onAnimationStart={() => play('offer')}
      >
        <div className={styles.bankerAvatar} aria-hidden="true">
          🏦
        </div>
        <p className={styles.bankerLabel}>{t('bankerOffer')}</p>
        <p className={styles.round}>{t('afterRound', { n: round })}</p>

        <AnimatePresence mode="wait">
          {isBargaining ? (
            <motion.div
              key="bargaining"
              className={styles.bargainingState}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={styles.phoneIcon} aria-hidden="true">
                📞
              </div>
              <p className={styles.bargainingText}>{t('callingBanker')}</p>
              <div className={styles.dots} aria-hidden="true">
                <span /><span /><span />
              </div>
            </motion.div>
          ) : (
            <motion.div key="offer-display">
              <motion.h2
                id="offer-heading"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <CurrencyAmount className={styles.offer}>
                  {formatCurrency(offer, locale)}
                </CurrencyAmount>
              </motion.h2>

              <AnimatePresence>
                {bargainMessage && (
                  <motion.p
                    className={styles.bargainMessage}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {bargainMessage}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {!isBargaining && (
          <>
            <p className={styles.prompt}>{t('dealOrNoDeal')}</p>

            <div className={styles.actions}>
              <motion.button
                type="button"
                className={styles.dealBtn}
                onClick={handleDeal}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {t('deal')}
              </motion.button>
              <motion.button
                type="button"
                className={styles.noDealBtn}
                onClick={handleNoDeal}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {t('noDeal')}
              </motion.button>
            </div>

            <BargainButton disabled={hasBargained} onConfirm={handleBargain} />
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
