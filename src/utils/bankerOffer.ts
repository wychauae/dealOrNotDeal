import type { BargainMessageKey, BargainResult } from '../types/game';
import { BANKER_OFFER_MULTIPLIERS } from './constants';

function roundOffer(raw: number): number {
  if (raw >= 1000) return Math.round(raw / 100) * 100;
  if (raw >= 100) return Math.round(raw / 10) * 10;
  if (raw >= 10) return Math.round(raw);
  return Math.round(raw * 100) / 100;
}

export function calculateBankerOffer(
  remainingValues: number[],
  roundIndex: number,
): number {
  if (remainingValues.length === 0) return 0;

  const expectedValue =
    remainingValues.reduce((sum, v) => sum + v, 0) / remainingValues.length;

  const multiplier =
    BANKER_OFFER_MULTIPLIERS[
      Math.min(roundIndex, BANKER_OFFER_MULTIPLIERS.length - 1)
    ];

  const variance = 0.94 + Math.random() * 0.12;
  const raw = expectedValue * multiplier * variance;

  return roundOffer(raw);
}

export interface BargainOutcome {
  newOffer: number;
  result: BargainResult;
  messageKey: BargainMessageKey;
}

/** One-time bargain — banker may raise the offer or refuse */
export function calculateBargainOffer(
  currentOffer: number,
  remainingValues: number[],
): BargainOutcome {
  const expectedValue =
    remainingValues.length > 0
      ? remainingValues.reduce((sum, v) => sum + v, 0) / remainingValues.length
      : currentOffer;

  const roll = Math.random();

  if (roll < 0.25) {
    return {
      newOffer: currentOffer,
      result: 'refused',
      messageKey: 'refused-firm',
    };
  }

  const increasePct =
    roll < 0.85 ? 0.08 + Math.random() * 0.1 : 0.03 + Math.random() * 0.04;

  let newOffer = roundOffer(currentOffer * (1 + increasePct));

  const ceiling = roundOffer(expectedValue * 0.98);
  if (newOffer > ceiling) {
    newOffer = ceiling;
  }
  if (newOffer <= currentOffer) {
    return {
      newOffer: currentOffer,
      result: 'refused',
      messageKey: 'refused-budge',
    };
  }

  const result: BargainResult =
    increasePct >= 0.08 ? 'improved' : 'small-improvement';

  return {
    newOffer,
    result,
    messageKey:
      result === 'improved' ? 'improved' : 'small-improvement',
  };
}
