import { AbstractGame } from "./AbstractGame";

class BlankGame extends AbstractGame {
  move(): void {}
  loadGame(): void {}

  get playerO() {
    return undefined;
  }
  get playerX() {
    return undefined;
  }
}

export const blankGame = new BlankGame("deadbeef");
