import { AbstractGame, RealGame } from "@/features/game/entities/game";
import { makeAutoObservable } from "mobx";

class GamesStore {
  games: RealGame[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getGame(gameId: string): AbstractGame | undefined {
    return this.games.find((game) => game.gameId === gameId);
  }

  loadGame(gameId: string) {
    const game = new RealGame(gameId);
    this.games.push(game);
    game.loadGame();
    game.subscribe();
    return game;
  }
}

export const gamesStore = new GamesStore();
