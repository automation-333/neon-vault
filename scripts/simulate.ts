import { createSeededRng } from "../src/game/rng";
import { spin } from "../src/game/slot";

const spins = Number(process.argv[2] ?? 100_000);
const bet = 10;
const rng = createSeededRng(20260921);

if (!Number.isInteger(spins) || spins <= 0) {
  throw new Error("Spin count must be a positive integer");
}

let totalBet = 0;
let totalWin = 0;
let winningSpins = 0;
let scatterTriggers = 0;
let awardedFreeSpins = 0;

for (let index = 0; index < spins; index += 1) {
  const outcome = spin(rng, bet);

  totalBet += bet;
  totalWin += outcome.totalWin;

  if (outcome.totalWin > 0) {
    winningSpins += 1;
  }

  if (outcome.scatterCount >= 3) {
    scatterTriggers += 1;
    awardedFreeSpins += outcome.freeSpinsAwarded;
  }
}

const rtp = (totalWin / totalBet) * 100;
const hitRate = (winningSpins / spins) * 100;

console.log("NEON VAULT deterministic simulation");
console.log("----------------------------------");
console.log(`Spins:              ${spins.toLocaleString()}`);
console.log(`Bet per spin:       ${bet.toFixed(2)}`);
console.log(`Total bet:          ${totalBet.toFixed(2)}`);
console.log(`Total win:          ${totalWin.toFixed(2)}`);
console.log(`Observed RTP:       ${rtp.toFixed(2)}%`);
console.log(`Hit rate:           ${hitRate.toFixed(2)}%`);
console.log(`Scatter triggers:   ${scatterTriggers}`);
console.log(`Free spins awarded: ${awardedFreeSpins}`);
console.log("");
console.log("Portfolio simulation only. Not certified gambling math.");
