import { PvPGame } from "@/features/game/entities/PvPGame";
import { AbstractGame } from "@/features/game/entities/AbstractGame";
import { makeAutoObservable } from "mobx";

class GamesStore {
  games: PvPGame[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getGame(gameId: string): AbstractGame | undefined {
    return this.games.find((game) => game.gameId === gameId);
  }

  loadGame(gameId: string) {
    const game = new PvPGame(gameId);
    this.games.push(game);
    game.loadGame();
    game.subscribe();
    return game;
  }
}

export const gamesStore = new GamesStore();
