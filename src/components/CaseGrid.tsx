import { motion } from 'framer-motion';
import type { Case } from '../types/game';
import { useTranslation } from '../i18n/useTranslation';
import { CaseTile } from './CaseTile';
import styles from './CaseGrid.module.css';

interface CaseGridProps {
  cases: Case[];
  onCaseClick: (id: number) => void;
  disabled?: boolean;
  selectable?: boolean;
  playerCaseId?: number | null;
}

export function CaseGrid({
  cases,
  onCaseClick,
  disabled = false,
  selectable = true,
  playerCaseId = null,
}: CaseGridProps) {
  const { t } = useTranslation();

  return (
    <div
      className={styles.grid}
      role="grid"
      aria-label={t('briefcases')}
    >
      {cases.map((caseData, index) => (
        <motion.div
          key={caseData.id}
          className={styles.gridItem}
          role="gridcell"
          layout
        >
          <CaseTile
            caseData={caseData}
            onClick={onCaseClick}
            disabled={disabled || (playerCaseId !== null && caseData.isPlayerCase)}
            selectable={selectable}
            highlighted={
              caseData.isPlayerCase && !caseData.isOpen
            }
            index={index}
          />
        </motion.div>
      ))}
    </div>
  );
}
