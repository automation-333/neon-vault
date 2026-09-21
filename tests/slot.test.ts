import { describe, expect, it } from "vitest";

import { createSeededRng } from "../src/game/rng";
import { evaluateGrid, generateGrid, spin } from "../src/game/slot";
import type { SymbolId } from "../src/game/types";

describe("slot engine", () => {
  it("is deterministic with a seeded RNG", () => {
    const first = spin(createSeededRng(42), 10);
    const second = spin(createSeededRng(42), 10);

    expect(first).toEqual(second);
  });

  it("generates a 5x3 grid", () => {
    const grid = generateGrid(createSeededRng(7));

    expect(grid).toHaveLength(5);
    for (const column of grid) {
      expect(column).toHaveLength(3);
    }
  });

  it("pays left-to-right line wins and lets wild substitute", () => {
    const grid: SymbolId[][] = [
      ["SEVEN", "J", "J"],
      ["WILD", "Q", "Q"],
      ["SEVEN", "K", "K"],
      ["SEVEN", "Q", "Q"],
      ["A", "J", "J"],
    ];

    const result = evaluateGrid(grid, 10);
    const line1 = result.lineWins.find((win) => win.paylineId === 1);

    expect(line1).toMatchObject({
      symbol: "SEVEN",
      count: 4,
      multiplier: 15,
      amount: 15,
    });
  });

  it("awards scatter win and free spins for three scatters", () => {
    const grid: SymbolId[][] = [
      ["SCATTER", "J", "J"],
      ["A", "SCATTER", "Q"],
      ["K", "Q", "SCATTER"],
      ["A", "J", "Q"],
      ["K", "A", "J"],
    ];

    const result = evaluateGrid(grid, 10);

    expect(result.scatterCount).toBe(3);
    expect(result.scatterWin).toBe(20);
    expect(result.freeSpinsAwarded).toBe(6);
  });

  it("rejects zero bet", () => {
    const grid: SymbolId[][] = Array.from({ length: 5 }, () => [
      "A",
      "K",
      "Q",
    ]);

    expect(() => evaluateGrid(grid, 0)).toThrow(
      "Bet must be greater than zero",
    );
  });
});
