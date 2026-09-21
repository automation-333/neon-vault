import type { Payline, SymbolId } from "./types";

export const REEL_COUNT = 5;
export const ROW_COUNT = 3;

export const SYMBOL_LABELS: Record<SymbolId, string> = {
  A: "A",
  K: "K",
  Q: "Q",
  J: "J",
  DIAMOND: "♦",
  CROWN: "♛",
  VAULT: "◉",
  SEVEN: "7",
  WILD: "W",
  SCATTER: "S",
};

export const SYMBOL_NAMES: Record<SymbolId, string> = {
  A: "Ace",
  K: "King",
  Q: "Queen",
  J: "Jack",
  DIAMOND: "Diamond",
  CROWN: "Crown",
  VAULT: "Vault",
  SEVEN: "Seven",
  WILD: "Wild",
  SCATTER: "Scatter",
};

export const PAYTABLE: Partial<Record<SymbolId, Record<number, number>>> = {
  A: { 3: 1, 4: 2, 5: 5 },
  K: { 3: 1, 4: 2, 5: 5 },
  Q: { 3: 1, 4: 2, 5: 4 },
  J: { 3: 1, 4: 2, 5: 4 },
  DIAMOND: { 3: 2, 4: 5, 5: 12 },
  CROWN: { 3: 3, 4: 8, 5: 18 },
  VAULT: { 3: 4, 4: 10, 5: 25 },
  SEVEN: { 3: 5, 4: 15, 5: 40 },
  WILD: { 3: 8, 4: 25, 5: 75 },
};

export const SCATTER_PAYTABLE: Record<number, number> = {
  3: 2,
  4: 10,
  5: 50,
};

export const FREE_SPINS_AWARD: Record<number, number> = {
  3: 6,
  4: 10,
  5: 15,
};

export const PAYLINES: readonly Payline[] = [
  { id: 1, rows: [0, 0, 0, 0, 0] },
  { id: 2, rows: [1, 1, 1, 1, 1] },
  { id: 3, rows: [2, 2, 2, 2, 2] },
  { id: 4, rows: [0, 1, 2, 1, 0] },
  { id: 5, rows: [2, 1, 0, 1, 2] },
  { id: 6, rows: [0, 0, 1, 2, 2] },
  { id: 7, rows: [2, 2, 1, 0, 0] },
  { id: 8, rows: [1, 0, 1, 2, 1] },
  { id: 9, rows: [1, 2, 1, 0, 1] },
  { id: 10, rows: [0, 1, 1, 1, 2] },
] as const;

/**
 * Weighted reel strips. This is a deterministic demo configuration,
 * not a certified gambling math model.
 */
export const REEL_STRIPS: readonly (readonly SymbolId[])[] = [
  ["A", "K", "Q", "J", "DIAMOND", "A", "CROWN", "Q", "VAULT", "K", "SEVEN", "J", "WILD", "A", "SCATTER", "Q", "DIAMOND", "K", "CROWN", "J"],
  ["K", "Q", "J", "A", "DIAMOND", "K", "CROWN", "J", "VAULT", "A", "SEVEN", "Q", "WILD", "K", "SCATTER", "J", "DIAMOND", "A", "CROWN", "Q"],
  ["Q", "J", "A", "K", "DIAMOND", "Q", "CROWN", "A", "VAULT", "J", "SEVEN", "K", "WILD", "Q", "SCATTER", "A", "DIAMOND", "J", "CROWN", "K"],
  ["J", "A", "K", "Q", "DIAMOND", "J", "CROWN", "K", "VAULT", "Q", "SEVEN", "A", "WILD", "J", "SCATTER", "K", "DIAMOND", "Q", "CROWN", "A"],
  ["A", "Q", "K", "J", "DIAMOND", "K", "CROWN", "Q", "VAULT", "J", "SEVEN", "A", "WILD", "Q", "SCATTER", "K", "DIAMOND", "J", "CROWN", "A"],
] as const;
