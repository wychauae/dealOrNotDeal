import { create } from 'zustand';
import type {
  BankerOfferRecord,
  BargainMessageKey,
  Case,
  GameOutcome,
  GamePhase,
} from '../types/game';
import { calculateBankerOffer, calculateBargainOffer } from '../utils/bankerOffer';
import {
  createInitialCases,
  getCasesToOpenForRound,
  getRemainingValues,
  isRoundComplete,
  shouldShowFinalChoice,
} from '../utils/gameLogic';

interface GameStore {
  phase: GamePhase;
  cases: Case[];
  playerCaseId: number | null;
  currentRound: number;
  casesOpenedThisRound: number;
  casesToOpenThisRound: number;
  currentOffer: number | null;
  finalWinnings: number | null;
  outcome: GameOutcome | null;
  lastRevealedCaseId: number | null;
  lastRevealedValue: number | null;
  offerHistory: BankerOfferRecord[];
  hasBargained: boolean;
  isBargaining: boolean;
  bargainMessageKey: BargainMessageKey | null;

  startGame: () => void;
  selectPlayerCase: (caseId: number) => void;
  openCase: (caseId: number) => void;
  finishReveal: () => void;
  acceptDeal: () => void;
  rejectDeal: () => void;
  bargain: () => void;
  swapCase: () => void;
  keepCase: () => void;
  resetGame: () => void;
}

const initialState = {
  phase: 'welcome' as GamePhase,
  cases: [] as Case[],
  playerCaseId: null as number | null,
  currentRound: 0,
  casesOpenedThisRound: 0,
  casesToOpenThisRound: 0,
  currentOffer: null as number | null,
  finalWinnings: null as number | null,
  outcome: null as GameOutcome | null,
  lastRevealedCaseId: null as number | null,
  lastRevealedValue: null as number | null,
  offerHistory: [] as BankerOfferRecord[],
  hasBargained: false,
  isBargaining: false,
  bargainMessageKey: null as BargainMessageKey | null,
};

function advanceAfterRound(cases: Case[], currentRound: number) {
  if (shouldShowFinalChoice(cases)) {
    return {
      phase: 'final-choice' as const,
      currentRound: currentRound + 1,
      offerRecord: null,
    };
  }

  const remainingValues = getRemainingValues(cases);
  const offer = calculateBankerOffer(remainingValues, currentRound);

  return {
    phase: 'offer' as const,
    currentOffer: offer,
    currentRound: currentRound + 1,
    offerRecord: {
      round: currentRound + 1,
      offer,
      wasBargained: false,
    } satisfies BankerOfferRecord,
  };
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  startGame: () => {
    const cases = createInitialCases();
    set({
      ...initialState,
      phase: 'selecting-case',
      cases,
    });
  },

  selectPlayerCase: (caseId: number) => {
    const { cases } = get();
    const updatedCases = cases.map((c) =>
      c.id === caseId ? { ...c, isPlayerCase: true } : c,
    );
    set({
      cases: updatedCases,
      playerCaseId: caseId,
      phase: 'playing',
      currentRound: 0,
      casesOpenedThisRound: 0,
      casesToOpenThisRound: getCasesToOpenForRound(0),
    });
  },

  openCase: (caseId: number) => {
    const state = get();
    const targetCase = state.cases.find((c) => c.id === caseId);

    if (
      !targetCase ||
      targetCase.isOpen ||
      targetCase.isPlayerCase ||
      state.phase !== 'playing'
    ) {
      return;
    }

    const updatedCases = state.cases.map((c) =>
      c.id === caseId ? { ...c, isOpen: true } : c,
    );
    const casesOpenedThisRound = state.casesOpenedThisRound + 1;

    set({
      cases: updatedCases,
      casesOpenedThisRound,
      phase: 'revealing',
      lastRevealedCaseId: caseId,
      lastRevealedValue: targetCase.value,
    });
  },

  finishReveal: () => {
    const state = get();
    const { cases, casesOpenedThisRound, casesToOpenThisRound, currentRound } =
      state;

    if (!isRoundComplete(casesOpenedThisRound, casesToOpenThisRound)) {
      set({
        phase: 'playing',
        lastRevealedCaseId: null,
        lastRevealedValue: null,
      });
      return;
    }

    const next = advanceAfterRound(cases, currentRound);

    if (next.phase === 'final-choice') {
      set({
        phase: next.phase,
        currentRound: next.currentRound,
        casesOpenedThisRound: 0,
        casesToOpenThisRound: 0,
        lastRevealedCaseId: null,
        lastRevealedValue: null,
        bargainMessageKey: null,
      });
      return;
    }

    set({
      phase: next.phase,
      currentOffer: next.currentOffer,
      currentRound: next.currentRound,
      casesOpenedThisRound: 0,
      casesToOpenThisRound: getCasesToOpenForRound(next.currentRound),
      lastRevealedCaseId: null,
      lastRevealedValue: null,
      bargainMessageKey: null,
      offerHistory: next.offerRecord
        ? [...state.offerHistory, next.offerRecord]
        : state.offerHistory,
    });
  },

  acceptDeal: () => {
    const { currentOffer } = get();
    set({
      phase: 'game-over',
      finalWinnings: currentOffer,
      outcome: 'deal',
    });
  },

  rejectDeal: () => {
    const { cases, currentRound } = get();

    if (shouldShowFinalChoice(cases)) {
      set({ phase: 'final-choice', bargainMessageKey: null });
      return;
    }

    set({
      phase: 'playing',
      currentOffer: null,
      casesOpenedThisRound: 0,
      casesToOpenThisRound: getCasesToOpenForRound(currentRound),
      bargainMessageKey: null,
    });
  },

  bargain: () => {
    const state = get();
    const { currentOffer, hasBargained, isBargaining, offerHistory } = state;

    if (
      hasBargained ||
      isBargaining ||
      currentOffer === null ||
      state.phase !== 'offer'
    ) {
      return;
    }

      set({ isBargaining: true, bargainMessageKey: null });

    setTimeout(() => {
      const remainingValues = getRemainingValues(get().cases);
      const outcome = calculateBargainOffer(currentOffer, remainingValues);

      const updatedHistory = [...offerHistory];
      const lastIndex = updatedHistory.length - 1;
      if (lastIndex >= 0) {
        updatedHistory[lastIndex] = {
          ...updatedHistory[lastIndex],
          offer: outcome.newOffer,
          previousOffer:
            outcome.newOffer !== currentOffer ? currentOffer : undefined,
          wasBargained: true,
        };
      }

      set({
        currentOffer: outcome.newOffer,
        hasBargained: true,
        isBargaining: false,
        bargainMessageKey: outcome.messageKey,
        offerHistory: updatedHistory,
      });
    }, 1800);
  },

  swapCase: () => {
    const { cases, playerCaseId } = get();
    const lastClosed = cases.find((c) => !c.isOpen && !c.isPlayerCase);
    if (!lastClosed || playerCaseId === null) return;

    set({
      phase: 'game-over',
      finalWinnings: lastClosed.value,
      outcome: 'swap',
    });
  },

  keepCase: () => {
    const { cases, playerCaseId } = get();
    const playerCase = cases.find((c) => c.id === playerCaseId);
    if (!playerCase) return;

    set({
      phase: 'game-over',
      finalWinnings: playerCase.value,
      outcome: 'keep',
    });
  },

  resetGame: () => {
    set({ ...initialState });
  },
}));
