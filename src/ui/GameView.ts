import {
  Application,
  Container,
  Graphics,
  Text,
  TextStyle,
} from "pixi.js";

import {
  PAYLINES,
  REEL_COUNT,
  ROW_COUNT,
  SYMBOL_LABELS,
} from "../game/config";
import { GameSession } from "../game/session";
import type { SpinOutcome, SymbolId } from "../game/types";

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 720;
const REEL_WIDTH = 154;
const CELL_HEIGHT = 110;
const REEL_GAP = 8;

const palette = {
  bg: 0x030712,
  panel: 0x081321,
  panel2: 0x0d1b2e,
  cyan: 0x31f7ff,
  magenta: 0xff3fd8,
  text: 0xeafaff,
  muted: 0x7da0ba,
  gold: 0xffcc45,
  green: 0x64ff9b,
  red: 0xff5f78,
};

const symbolColors: Record<SymbolId, number> = {
  A: 0x79d8ff,
  K: 0x9cb8ff,
  Q: 0xc5a3ff,
  J: 0xff9be4,
  DIAMOND: 0x31f7ff,
  CROWN: 0xffcc45,
  VAULT: 0x9affd7,
  SEVEN: 0xff5f78,
  WILD: 0xff3fd8,
  SCATTER: 0x64ff9b,
};

export class GameView {
  private readonly stage = new Container();
  private readonly reelsContainer = new Container();
  private readonly symbolTexts: Text[][] = [];
  private readonly creditText: Text;
  private readonly betText: Text;
  private readonly winText: Text;
  private readonly freeSpinText: Text;
  private readonly statusText: Text;
  private readonly spinButton: Container;
  private readonly session = new GameSession();
  private spinning = false;

  constructor(private readonly app: Application) {
    this.app.stage.addChild(this.stage);

    const titleStyle = new TextStyle({
      fill: palette.text,
      fontFamily: "Arial",
      fontSize: 44,
      fontWeight: "800",
      letterSpacing: 6,
    });

    const labelStyle = new TextStyle({
      fill: palette.muted,
      fontFamily: "Arial",
      fontSize: 13,
      fontWeight: "700",
      letterSpacing: 2,
    });

    const valueStyle = new TextStyle({
      fill: palette.text,
      fontFamily: "Arial",
      fontSize: 24,
      fontWeight: "700",
    });

    this.drawBackdrop();

    const title = new Text({
      text: "NEON VAULT",
      style: titleStyle,
    });
    title.anchor.set(0.5, 0);
    title.position.set(DESIGN_WIDTH / 2, 32);
    this.stage.addChild(title);

    const subtitle = new Text({
      text: "HTML5 GAME-TECH DEMO • VIRTUAL CREDITS ONLY",
      style: {
        fill: palette.muted,
        fontFamily: "Arial",
        fontSize: 12,
        letterSpacing: 3,
      },
    });
    subtitle.anchor.set(0.5, 0);
    subtitle.position.set(DESIGN_WIDTH / 2, 88);
    this.stage.addChild(subtitle);

    this.createReels();

    this.creditText = this.createHudBlock(80, "CREDITS", labelStyle, valueStyle);
    this.betText = this.createHudBlock(280, "BET", labelStyle, valueStyle);
    this.winText = this.createHudBlock(480, "LAST WIN", labelStyle, valueStyle);
    this.freeSpinText = this.createHudBlock(680, "FREE SPINS", labelStyle, valueStyle);

    this.statusText = new Text({
      text: "Ready",
      style: {
        fill: palette.muted,
        fontFamily: "Arial",
        fontSize: 14,
      },
    });
    this.statusText.anchor.set(0, 0.5);
    this.statusText.position.set(80, 650);
    this.stage.addChild(this.statusText);

    this.spinButton = this.createSpinButton();
    this.stage.addChild(this.spinButton);

    this.renderState();
    this.renderGrid(this.session.spin().grid, false);

    // Refund the initial visual-only spin by starting a fresh session state.
    this.session = new GameSession();
    this.renderState();

    this.app.renderer.on("resize", () => this.resize());
    this.resize();
  }

  private drawBackdrop(): void {
    const bg = new Graphics()
      .rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT)
      .fill(palette.bg);

    const glow = new Graphics()
      .circle(DESIGN_WIDTH / 2, 250, 340)
      .fill({ color: palette.cyan, alpha: 0.035 });

    const frame = new Graphics()
      .roundRect(55, 115, 1170, 500, 28)
      .fill({ color: palette.panel, alpha: 0.97 })
      .stroke({ color: palette.cyan, alpha: 0.28, width: 1 });

    this.stage.addChild(bg, glow, frame);
  }

  private createReels(): void {
    const totalWidth =
      REEL_COUNT * REEL_WIDTH + (REEL_COUNT - 1) * REEL_GAP;
    const startX = (DESIGN_WIDTH - totalWidth) / 2;
    const startY = 160;

    this.reelsContainer.position.set(startX, startY);
    this.stage.addChild(this.reelsContainer);

    for (let reel = 0; reel < REEL_COUNT; reel += 1) {
      const column = new Container();
      column.position.x = reel * (REEL_WIDTH + REEL_GAP);
      this.reelsContainer.addChild(column);

      const frame = new Graphics()
        .roundRect(0, 0, REEL_WIDTH, CELL_HEIGHT * ROW_COUNT, 14)
        .fill(palette.panel2)
        .stroke({ color: palette.cyan, alpha: 0.2, width: 1 });
      column.addChild(frame);

      const textColumn: Text[] = [];

      for (let row = 0; row < ROW_COUNT; row += 1) {
        if (row > 0) {
          column.addChild(
            new Graphics()
              .rect(12, row * CELL_HEIGHT, REEL_WIDTH - 24, 1)
              .fill({ color: palette.cyan, alpha: 0.12 }),
          );
        }

        const symbol = new Text({
          text: "?",
          style: {
            fill: palette.text,
            fontFamily: "Arial",
            fontSize: 48,
            fontWeight: "800",
          },
        });
        symbol.anchor.set(0.5);
        symbol.position.set(
          REEL_WIDTH / 2,
          row * CELL_HEIGHT + CELL_HEIGHT / 2,
        );

        column.addChild(symbol);
        textColumn.push(symbol);
      }

      this.symbolTexts.push(textColumn);
    }
  }

  private createHudBlock(
    x: number,
    label: string,
    labelStyle: TextStyle,
    valueStyle: TextStyle,
  ): Text {
    const labelText = new Text({ text: label, style: labelStyle });
    labelText.position.set(x, 535);
    this.stage.addChild(labelText);

    const valueText = new Text({ text: "0", style: valueStyle });
    valueText.position.set(x, 558);
    this.stage.addChild(valueText);

    return valueText;
  }

  private createSpinButton(): Container {
    const button = new Container();
    button.position.set(1000, 552);
    button.eventMode = "static";
    button.cursor = "pointer";

    const surface = new Graphics()
      .roundRect(0, 0, 165, 58, 16)
      .fill({ color: palette.cyan, alpha: 0.16 })
      .stroke({ color: palette.cyan, alpha: 0.9, width: 2 });
    button.addChild(surface);

    const label = new Text({
      text: "SPIN",
      style: {
        fill: palette.text,
        fontFamily: "Arial",
        fontSize: 20,
        fontWeight: "800",
        letterSpacing: 2,
      },
    });
    label.anchor.set(0.5);
    label.position.set(82.5, 29);
    button.addChild(label);

    button.on("pointerover", () => {
      button.scale.set(1.03);
    });

    button.on("pointerout", () => {
      button.scale.set(1);
    });

    button.on("pointertap", () => {
      void this.handleSpin();
    });

    return button;
  }

  private async handleSpin(): Promise<void> {
    if (this.spinning) {
      return;
    }

    if (!this.session.canSpin()) {
      this.statusText.text = "Not enough virtual credits";
      this.statusText.style.fill = palette.red;
      return;
    }

    this.spinning = true;
    this.spinButton.alpha = 0.55;
    this.statusText.text = "Spinning...";
    this.statusText.style.fill = palette.muted;

    const outcome = this.session.spin();
    await this.animateSpin(outcome);
    this.renderState();
    this.renderOutcomeStatus(outcome);

    this.spinning = false;
    this.spinButton.alpha = 1;
  }

  private async animateSpin(outcome: SpinOutcome): Promise<void> {
    const symbols = Object.keys(SYMBOL_LABELS) as SymbolId[];
    const frames = 10;

    for (let frame = 0; frame < frames; frame += 1) {
      for (const column of this.symbolTexts) {
        for (const text of column) {
          const randomSymbol =
            symbols[Math.floor(Math.random() * symbols.length)] ?? "A";
          text.text = SYMBOL_LABELS[randomSymbol];
          text.style.fill = symbolColors[randomSymbol];
        }
      }
      await new Promise((resolve) => window.setTimeout(resolve, 35 + frame * 3));
    }

    this.renderGrid(outcome.grid, true);
  }

  private renderGrid(
    grid: readonly (readonly SymbolId[])[],
    highlightWins: boolean,
  ): void {
    const winningCells = new Set<string>();

    if (highlightWins) {
      for (const win of this.session.state.lastOutcome?.lineWins ?? []) {
        for (const position of win.positions) {
          winningCells.add(`${position.reel}:${position.row}`);
        }
      }
    }

    for (let reel = 0; reel < REEL_COUNT; reel += 1) {
      for (let row = 0; row < ROW_COUNT; row += 1) {
        const symbol = grid[reel]?.[row] ?? "A";
        const text = this.symbolTexts[reel]?.[row];

        if (!text) {
          continue;
        }

        text.text = SYMBOL_LABELS[symbol];
        text.style.fill = winningCells.has(`${reel}:${row}`)
          ? palette.gold
          : symbolColors[symbol];
        text.scale.set(
          winningCells.has(`${reel}:${row}`) ? 1.12 : 1,
        );
      }
    }
  }

  private renderState(): void {
    const state = this.session.state;
    this.creditText.text = state.credits.toFixed(2);
    this.betText.text = state.bet.toFixed(2);
    this.winText.text = state.lastWin.toFixed(2);
    this.freeSpinText.text = String(state.freeSpins);
  }

  private renderOutcomeStatus(outcome: SpinOutcome): void {
    if (outcome.totalWin > 0) {
      const linePart =
        outcome.lineWins.length > 0
          ? `${outcome.lineWins.length} line win${outcome.lineWins.length === 1 ? "" : "s"}`
          : "scatter win";
      const freePart =
        outcome.freeSpinsAwarded > 0
          ? ` • +${outcome.freeSpinsAwarded} free spins`
          : "";

      this.statusText.text =
        `Win ${outcome.totalWin.toFixed(2)} • ${linePart}${freePart}`;
      this.statusText.style.fill = palette.green;
      return;
    }

    if (outcome.freeSpinsAwarded > 0) {
      this.statusText.text = `+${outcome.freeSpinsAwarded} free spins`;
      this.statusText.style.fill = palette.green;
      return;
    }

    this.statusText.text = `${PAYLINES.length} paylines • virtual credits only`;
    this.statusText.style.fill = palette.muted;
  }

  private resize(): void {
    const width = this.app.renderer.width;
    const height = this.app.renderer.height;
    const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);

    this.stage.scale.set(scale);
    this.stage.position.set(
      (width - DESIGN_WIDTH * scale) / 2,
      (height - DESIGN_HEIGHT * scale) / 2,
    );
  }
}
