import { motion } from 'framer-motion';
import type { Case } from '../types/game';
import { formatBriefcaseCurrency, formatCurrency } from '../utils/gameLogic';
import { useTranslation } from '../i18n/useTranslation';
import { CurrencyAmount } from './CurrencyAmount';
import styles from './CaseTile.module.css';

interface CaseTileProps {
  caseData: Case;
  onClick: (id: number) => void;
  disabled?: boolean;
  selectable?: boolean;
  highlighted?: boolean;
  index?: number;
}

export function CaseTile({
  caseData,
  onClick,
  disabled = false,
  selectable = true,
  highlighted = false,
  index = 0,
}: CaseTileProps) {
  const { id, value, isOpen, isPlayerCase } = caseData;
  const { t, locale } = useTranslation();

  const displayAmount = formatBriefcaseCurrency(value, locale);
  const fullAmount = formatCurrency(value, locale);

  const handleClick = () => {
    if (!disabled && selectable && !isOpen) {
      onClick(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled && selectable && !isOpen) {
      e.preventDefault();
      onClick(id);
    }
  };

  const isHighValue = value >= 10000;
  const isLowValue = value <= 100;
  const isCompact = displayAmount.length > 6;

  return (
    <motion.div
      className={[
        styles.tile,
        isOpen && styles.open,
        isPlayerCase && styles.playerCase,
        highlighted && styles.highlighted,
        disabled && styles.disabled,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled || isOpen ? -1 : 0}
      aria-label={
        isOpen
          ? t('caseOpened', { id, amount: fullAmount })
          : isPlayerCase
            ? t('caseYours', { id })
            : t('caseClosed', { id })
      }
      aria-disabled={disabled || isOpen}
      initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{
        delay: index * 0.03,
        duration: 0.4,
        type: 'spring',
        stiffness: 200,
      }}
      whileHover={
        !disabled && !isOpen && selectable
          ? { scale: 1.05, y: -6 }
          : undefined
      }
      whileTap={!disabled && !isOpen && selectable ? { scale: 0.96 } : undefined}
      layout
    >
      <div className={styles.briefcase}>
        <div className={styles.handle} aria-hidden="true">
          <div className={styles.handleBar} />
        </div>

        <motion.div
          className={styles.lid}
          animate={{ rotateX: isOpen ? -110 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 120, damping: 14 }}
          aria-hidden="true"
        >
          <div className={styles.lidFace}>
            {!isOpen && <span className={styles.lidNumber}>{id}</span>}
            <div className={styles.latch} />
          </div>
        </motion.div>

        <div className={styles.body}>
          <div className={styles.bodyInner}>
            {isOpen ? (
              <motion.div
                className={[
                  styles.moneyReveal,
                  isHighValue && styles.highValue,
                  isLowValue && styles.lowValue,
                  isCompact && styles.compact,
                ]
                  .filter(Boolean)
                  .join(' ')}
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
              >
                <span className={styles.moneyIcon} aria-hidden="true">
                  💵
                </span>
                <CurrencyAmount
                  className={styles.moneyAmount}
                  title={fullAmount}
                >
                  {displayAmount}
                </CurrencyAmount>
              </motion.div>
            ) : (
              <>
                <span className={styles.bodyNumber}>{id}</span>
                <div className={styles.cornerRivets} aria-hidden="true">
                  <span /><span /><span /><span />
                </div>
              </>
            )}
          </div>
        </div>

        {isPlayerCase && !isOpen && (
          <span className={styles.playerBadge} aria-hidden="true">
            {t('yours')}
          </span>
        )}
      </div>
    </motion.div>
  );
}
