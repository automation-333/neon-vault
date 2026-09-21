import { describe, expect, it } from "vitest";

import { createSeededRng } from "../src/game/rng";
import { GameSession } from "../src/game/session";

describe("GameSession", () => {
  it("charges virtual credits for a paid spin", () => {
    const session = new GameSession(100, 10, createSeededRng(1));

    const before = session.state.credits;
    const outcome = session.spin();

    expect(session.state.credits).toBe(
      before - 10 + outcome.totalWin,
    );
  });

  it("prevents a spin when credits are insufficient", () => {
    const session = new GameSession(5, 10, createSeededRng(1));

    expect(session.canSpin()).toBe(false);
    expect(() => session.spin()).toThrow("Not enough credits");
  });
});
