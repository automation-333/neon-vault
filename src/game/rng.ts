export type Rng = () => number;

export const randomRng: Rng = () => Math.random();

/**
 * Small deterministic PRNG for tests and simulations.
 * Not suitable for cryptography or regulated gambling.
 */
export function createSeededRng(seed: number): Rng {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
