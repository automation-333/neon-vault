# NEON VAULT

**NEON VAULT** is a portfolio-quality HTML5 slot demo built with **TypeScript, PixiJS and Vite**.

It is intentionally a **virtual-credit game-tech demo**, not a real-money gambling product. The project focuses on clean game logic, deterministic testing, rendering, session state and reproducible simulation.

## What it demonstrates

- TypeScript game architecture
- PixiJS rendering and interaction
- 5x3 reel layout
- configurable reel strips
- 10 paylines
- Wild substitution
- Scatter wins
- Free-spin awards
- virtual-credit session state
- deterministic RNG injection for tests
- unit-tested payout logic
- 100,000-spin simulation tooling
- responsive canvas layout
- Vite build pipeline
- GitHub Actions CI

## Stack

- TypeScript
- PixiJS
- Vite
- Vitest
- Node.js
- GitHub Actions

## Game model

```text
Input
  |
Session state
  |
Spin engine
  |
Reel strips + RNG
  |
5x3 symbol grid
  |
Payline evaluation
  |
Scatter evaluation
  |
Payout + free-spin state
  |
PixiJS presentation
```

The core game math is kept separate from the rendering layer so it can be tested without a browser.

## Symbols

The demo uses original generic symbols only:

- A / K / Q / J
- Diamond
- Crown
- Vault
- Seven
- Wild
- Scatter

No third-party game art or branded assets are used.

## Running locally

Requires Node.js 22+.

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Tests

```bash
npm test
```

Tests cover:

- seeded deterministic spins
- 5x3 grid generation
- left-to-right payline evaluation
- Wild substitution
- Scatter rewards
- free-spin awards
- virtual-credit session behavior

## Production build

```bash
npm run build
```

## Math simulation

A deterministic simulation script is included for inspecting the current demo configuration:

```bash
npm run simulate
```

Default: **100,000 spins**.

You can also provide a custom count:

```bash
npm run simulate -- 250000
```

The script reports observed RTP, hit rate, scatter triggers and awarded free spins.

> These numbers are for development diagnostics only. The math model is not audited or certified for real-money gambling.

## Project structure

```text
src/
  game/
    config.ts      paytable, paylines and reel strips
    rng.ts         random + deterministic seeded RNG
    slot.ts        grid generation and payout evaluation
    session.ts     virtual-credit and free-spin state
    types.ts       shared game types
  ui/
    GameView.ts    PixiJS rendering and interaction
  main.ts
scripts/
  simulate.ts
tests/
  slot.test.ts
  session.test.ts
```

## Design decisions

### Logic is independent from rendering

The slot engine accepts an injected RNG and returns plain data. PixiJS only consumes the result.

That makes gameplay logic deterministic in tests and avoids coupling payout behavior to animation code.

### Configurable reel strips

Symbols are generated from explicit reel strips rather than hardcoded demo outcomes.

### Idempotent tests, not fake screenshots

The repository includes code, tests, CI and a repeatable simulation rather than relying only on a polished visual.

## Roadmap

- bet controls
- paytable/help overlay
- win-line animation
- richer reel-stop animation
- sound layer
- turbo/autoplay demo modes
- developer inspector for current outcome
- mobile layout pass
- expanded statistical tests

## Disclaimer

This repository is a **software engineering portfolio project using virtual credits only**. It does not accept deposits, does not process payments and is not presented as certified gambling software.

---

Developer: [automation-333](https://github.com/automation-333)
