import { randomRng, type Rng } from "./rng";
import { spin } from "./slot";
import type { SpinOutcome } from "./types";

export interface SessionState {
  readonly credits: number;
  readonly bet: number;
  readonly freeSpins: number;
  readonly lastWin: number;
  readonly lastOutcome: SpinOutcome | null;
}

export class GameSession {
  private creditsValue: number;
  private betValue: number;
  private freeSpinsValue = 0;
  private lastWinValue = 0;
  private lastOutcomeValue: SpinOutcome | null = null;

  constructor(
    credits = 1000,
    bet = 10,
    private readonly rng: Rng = randomRng,
  ) {
    if (credits < 0) {
      throw new Error("Credits cannot be negative");
    }
    if (bet <= 0) {
      throw new Error("Bet must be greater than zero");
    }

    this.creditsValue = credits;
    this.betValue = bet;
  }

  get state(): SessionState {
    return {
      credits: this.creditsValue,
      bet: this.betValue,
      freeSpins: this.freeSpinsValue,
      lastWin: this.lastWinValue,
      lastOutcome: this.lastOutcomeValue,
    };
  }

  setBet(nextBet: number): void {
    if (nextBet <= 0) {
      throw new Error("Bet must be greater than zero");
    }
    this.betValue = nextBet;
  }

  canSpin(): boolean {
    return this.freeSpinsValue > 0 || this.creditsValue >= this.betValue;
  }

  spin(): SpinOutcome {
    if (!this.canSpin()) {
      throw new Error("Not enough credits");
    }

    const usingFreeSpin = this.freeSpinsValue > 0;

    if (usingFreeSpin) {
      this.freeSpinsValue -= 1;
    } else {
      this.creditsValue -= this.betValue;
    }

    const outcome = spin(this.rng, this.betValue);

    this.creditsValue += outcome.totalWin;
    this.freeSpinsValue += outcome.freeSpinsAwarded;
    this.lastWinValue = outcome.totalWin;
    this.lastOutcomeValue = outcome;

    return outcome;
  }
}
