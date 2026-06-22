import { AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useSound } from '../hooks/useSound';
import { CaseGrid } from './CaseGrid';
import { ValueBoard } from './ValueBoard';
import { GameStatus } from './GameStatus';
import { RevealOverlay } from './RevealOverlay';
import { BankerOfferModal } from './BankerOfferModal';
import { OfferHistory } from './OfferHistory';
import { FinalChoiceModal } from './FinalChoiceModal';
import styles from './GameBoard.module.css';

export function GameBoard() {
  const {
    phase,
    cases,
    playerCaseId,
    currentRound,
    casesOpenedThisRound,
    casesToOpenThisRound,
    currentOffer,
    lastRevealedCaseId,
    lastRevealedValue,
    offerHistory,
    hasBargained,
    isBargaining,
    bargainMessageKey,
    selectPlayerCase,
    openCase,
    finishReveal,
    acceptDeal,
    rejectDeal,
    bargain,
    swapCase,
    keepCase,
  } = useGameStore();

  const { play } = useSound();

  const handleCaseClick = (caseId: number) => {
    if (phase === 'selecting-case') {
      play('click');
      selectPlayerCase(caseId);
    } else if (phase === 'playing') {
      play('click');
      openCase(caseId);
    }
  };

  const isGridDisabled =
    phase === 'revealing' ||
    phase === 'offer' ||
    phase === 'final-choice';

  return (
    <div className={styles.board}>
      <GameStatus
        phase={phase}
        round={currentRound}
        casesOpenedThisRound={casesOpenedThisRound}
        casesToOpenThisRound={casesToOpenThisRound}
        playerCaseId={playerCaseId}
      />

      <div className={styles.layout}>
        <main className={styles.main} aria-label="Game area">
          <CaseGrid
            cases={cases}
            onCaseClick={handleCaseClick}
            disabled={isGridDisabled}
            selectable={phase === 'selecting-case' || phase === 'playing'}
            playerCaseId={playerCaseId}
          />
        </main>

        <aside className={styles.sidebar}>
          <OfferHistory history={offerHistory} />
          <ValueBoard cases={cases} />
        </aside>
      </div>

      <AnimatePresence>
        {phase === 'revealing' &&
          lastRevealedCaseId !== null &&
          lastRevealedValue !== null && (
            <RevealOverlay
              caseId={lastRevealedCaseId}
              value={lastRevealedValue}
              onComplete={finishReveal}
            />
          )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'offer' && currentOffer !== null && (
          <BankerOfferModal
            offer={currentOffer}
            round={currentRound}
            hasBargained={hasBargained}
            isBargaining={isBargaining}
            bargainMessageKey={bargainMessageKey}
            onDeal={acceptDeal}
            onNoDeal={rejectDeal}
            onBargain={bargain}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'final-choice' && playerCaseId !== null && (
          <FinalChoiceModal
            cases={cases}
            playerCaseId={playerCaseId}
            onSwap={swapCase}
            onKeep={keepCase}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
