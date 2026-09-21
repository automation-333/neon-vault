import { Application } from "pixi.js";

import "./styles.css";
import { GameView } from "./ui/GameView";

async function bootstrap(): Promise<void> {
  const root = document.querySelector<HTMLDivElement>("#app");
  if (!root) {
    throw new Error("Missing #app root element");
  }

  const app = new Application();

  await app.init({
    background: "#030712",
    antialias: true,
    resizeTo: window,
    resolution: Math.min(window.devicePixelRatio, 2),
    autoDensity: true,
  });

  root.appendChild(app.canvas);
  new GameView(app);
}

void bootstrap();
