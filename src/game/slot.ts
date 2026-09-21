import {
  FREE_SPINS_AWARD,
  PAYLINES,
  PAYTABLE,
  REEL_COUNT,
  REEL_STRIPS,
  ROW_COUNT,
  SCATTER_PAYTABLE,
} from "./config";
import type { Rng } from "./rng";
import type { LineWin, SpinEvaluation, SpinOutcome, SymbolId } from "./types";

function clampStop(value: number, stripLength: number): number {
  return Math.min(stripLength - 1, Math.max(0, Math.floor(value * stripLength)));
}

export function generateGrid(rng: Rng): SymbolId[][] {
  const grid: SymbolId[][] = Array.from({ length: REEL_COUNT }, () => []);

  for (let reel = 0; reel < REEL_COUNT; reel += 1) {
    const strip = REEL_STRIPS[reel];
    if (!strip) {
      throw new Error(`Missing reel strip at index ${reel}`);
    }

    const stop = clampStop(rng(), strip.length);
    const column: SymbolId[] = [];

    for (let row = 0; row < ROW_COUNT; row += 1) {
      const symbol = strip[(stop + row) % strip.length];
      if (!symbol) {
        throw new Error("Invalid reel symbol");
      }
      column.push(symbol);
    }

    grid[reel] = column;
  }

  return grid;
}

function resolveLineSymbol(symbols: readonly SymbolId[]): SymbolId | null {
  const firstRegular = symbols.find(
    (symbol) => symbol !== "WILD" && symbol !== "SCATTER",
  );

  if (firstRegular) {
    return firstRegular;
  }

  return symbols.every((symbol) => symbol === "WILD") ? "WILD" : null;
}

function evaluatePayline(
  grid: readonly (readonly SymbolId[])[],
  paylineId: number,
  rows: readonly [number, number, number, number, number],
  betPerLine: number,
): LineWin | null {
  const symbols = rows.map((row, reel) => grid[reel]?.[row]);

  if (symbols.some((symbol) => symbol === undefined)) {
    throw new Error("Grid dimensions do not match configured paylines");
  }

  const concreteSymbols = symbols as SymbolId[];
  const target = resolveLineSymbol(concreteSymbols);
  if (!target) {
    return null;
  }

  let count = 0;
  for (const symbol of concreteSymbols) {
    if (symbol === target || symbol === "WILD") {
      count += 1;
      continue;
    }
    break;
  }

  if (count < 3) {
    return null;
  }

  const multiplier = PAYTABLE[target]?.[count] ?? 0;
  if (multiplier <= 0) {
    return null;
  }

  return {
    paylineId,
    symbol: target,
    count,
    multiplier,
    amount: multiplier * betPerLine,
    positions: Array.from({ length: count }, (_, reel) => ({
      reel,
      row: rows[reel] ?? 0,
    })),
  };
}

export function evaluateGrid(
  grid: readonly (readonly SymbolId[])[],
  totalBet: number,
): SpinEvaluation {
  if (totalBet <= 0) {
    throw new Error("Bet must be greater than zero");
  }

  const betPerLine = totalBet / PAYLINES.length;

  const lineWins = PAYLINES.map((payline) =>
    evaluatePayline(grid, payline.id, payline.rows, betPerLine),
  ).filter((win): win is LineWin => win !== null);

  const scatterCount = grid
    .flat()
    .filter((symbol) => symbol === "SCATTER").length;

  const normalizedScatterCount = Math.min(5, scatterCount);
  const scatterMultiplier =
    SCATTER_PAYTABLE[normalizedScatterCount] ?? 0;
  const scatterWin = scatterMultiplier * totalBet;

  const freeSpinsAwarded =
    FREE_SPINS_AWARD[normalizedScatterCount] ?? 0;

  const lineWinTotal = lineWins.reduce((sum, win) => sum + win.amount, 0);

  return {
    lineWins,
    scatterCount,
    scatterWin,
    freeSpinsAwarded,
    totalWin: lineWinTotal + scatterWin,
  };
}

export function spin(rng: Rng, totalBet: number): SpinOutcome {
  const grid = generateGrid(rng);
  const evaluation = evaluateGrid(grid, totalBet);

  return {
    grid,
    ...evaluation,
  };
}
