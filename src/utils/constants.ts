/** Standard 26-case US Deal or No Deal values */
export const CASE_VALUES: readonly number[] = [
  0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500, 750,
  1000, 5000, 10000, 25000, 50000, 75000, 100000, 200000,
  300000, 400000, 500000, 750000, 1000000,
] as const;

export const TOTAL_CASES = CASE_VALUES.length;

/** Cases to open per round (matches TV show pacing) */
export const ROUND_OPENINGS: readonly number[] = [6, 5, 4, 3, 3, 2, 1, 1, 1, 1, 1, 1, 1];

export const BANKER_OFFER_MULTIPLIERS: readonly number[] = [
  0.22, 0.32, 0.42, 0.52, 0.62, 0.72, 0.82, 0.88, 0.92, 0.95, 0.97, 0.98, 0.99,
];
