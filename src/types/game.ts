export type GamePhase =
  | 'welcome'
  | 'selecting-case'
  | 'playing'
  | 'revealing'
  | 'offer'
  | 'final-choice'
  | 'game-over';

export type GameOutcome = 'deal' | 'no-deal' | 'swap' | 'keep';

export interface Case {
  id: number;
  value: number;
  isOpen: boolean;
  isPlayerCase: boolean;
}

export interface GameState {
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
}

export type Theme = 'light' | 'dark';

export interface BankerOfferRecord {
  round: number;
  offer: number;
  previousOffer?: number;
  wasBargained: boolean;
}

export type BargainResult = 'improved' | 'refused' | 'small-improvement';

export type BargainMessageKey =
  | 'refused-firm'
  | 'refused-budge'
  | 'improved'
  | 'small-improvement';
