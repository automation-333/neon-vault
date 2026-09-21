export type SymbolId =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "DIAMOND"
  | "CROWN"
  | "VAULT"
  | "SEVEN"
  | "WILD"
  | "SCATTER";

export interface Payline {
  readonly id: number;
  readonly rows: readonly [number, number, number, number, number];
}

export interface LineWin {
  readonly paylineId: number;
  readonly symbol: SymbolId;
  readonly count: number;
  readonly multiplier: number;
  readonly amount: number;
  readonly positions: readonly { reel: number; row: number }[];
}

export interface SpinEvaluation {
  readonly lineWins: readonly LineWin[];
  readonly scatterCount: number;
  readonly scatterWin: number;
  readonly freeSpinsAwarded: number;
  readonly totalWin: number;
}

export interface SpinOutcome extends SpinEvaluation {
  readonly grid: readonly (readonly SymbolId[])[];
}
