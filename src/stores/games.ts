import { PvPGame } from "@/features/game/entities/PvPGame";
import { AbstractGame } from "@/features/game/entities/AbstractGame";
import { makeAutoObservable } from "mobx";
import { LocalGame } from "@/features/game/entities/LocalGame";
import { ComputerGame } from "@/features/game/entities/ComputerGame";

class GamesStore {
  games: AbstractGame[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get localGame() {
    return this.games.find((game) => game.gameId === "local");
  }

  getGame(gameId: string): AbstractGame | undefined {
    return this.games.find((game) => game.gameId === gameId);
  }

  createPvPGame(gameId: string) {
    if (this.getGame(gameId)) return;

    const game = new PvPGame(gameId);
    this.games.push(game);
    game.loadGame();
    game.subscribe();
    return game;
  }

  createLocalGame() {
    const game = new LocalGame("local");
    this.games.push(game);
    return game;
  }

  createComputerGame() {
    const game = new ComputerGame("computer");
    this.games.push(game);
    return game;
  }
}

export const gamesStore = new GamesStore();
