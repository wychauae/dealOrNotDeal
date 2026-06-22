import type { Case } from '../types/game';
import { CASE_VALUES, ROUND_OPENINGS, TOTAL_CASES } from './constants';
import { shuffle } from './shuffle';

export function createInitialCases(): Case[] {
  const shuffledValues = shuffle(CASE_VALUES);
  return shuffledValues.map((value, index) => ({
    id: index + 1,
    value,
    isOpen: false,
    isPlayerCase: false,
  }));
}

export function getCasesToOpenForRound(roundIndex: number): number {
  return ROUND_OPENINGS[Math.min(roundIndex, ROUND_OPENINGS.length - 1)];
}

export function getRemainingClosedCases(cases: Case[]): Case[] {
  return cases.filter((c) => !c.isOpen);
}

export function getRemainingValues(cases: Case[]): number[] {
  return getRemainingClosedCases(cases).map((c) => c.value);
}

export function getPlayerCase(cases: Case[]): Case | undefined {
  return cases.find((c) => c.isPlayerCase);
}

export function isRoundComplete(
  casesOpenedThisRound: number,
  casesToOpenThisRound: number,
): boolean {
  return casesOpenedThisRound >= casesToOpenThisRound;
}

export function shouldShowFinalChoice(cases: Case[]): boolean {
  const closedNonPlayer = cases.filter((c) => !c.isOpen && !c.isPlayerCase);
  return closedNonPlayer.length === 1;
}

export { formatCurrency, formatBriefcaseCurrency } from './formatCurrency';

export function getRoundLabel(round: number): string {
  return `Round ${round + 1}`;
}

export { TOTAL_CASES };
