import { trpcClient } from "@/utils/trpc";
import { makeAutoObservable, runInAction } from "mobx";
import { UsersStore, usersStore } from "./users";
import { User } from "@/utils/schema/UserSchema";

class LobbyStore {
  games: GameOverview[] = [];
  joinableGames: GameOverview[] = [];
  isLoading: boolean = false;
  usersStore: UsersStore;

  constructor(usersStore: UsersStore) {
    this.usersStore = usersStore;
    makeAutoObservable(this);
  }

  async loadGames(userId: string) {
    // my games
    // joinable games
    this.isLoading = true;

    const [games, joinableGames] = await Promise.all([
      trpcClient.getGames.query({ userId }),
      trpcClient.getJoinableGames.query({ userId }),
    ]);

    runInAction(() => {
      games.forEach(({ id, playerXId, playerOId }) => {
        const hasGame = this.games.find((game) => game.gameId === id);

        if (!hasGame) {
          const game = new GameOverview(this, { id, playerXId, playerOId });
          this.games.push(game);
        }
      });

      joinableGames.forEach(({ id, playerXId, playerOId }) => {
        const hasGame = this.joinableGames.find((game) => game.gameId === id);

        if (!hasGame) {
          const game = new GameOverview(this, { id, playerXId, playerOId });
          this.joinableGames.push(game);
        }
      });
    });
  }

  async joinGame(gameId: string, userId: string) {
    await trpcClient.joinGame.mutate({ gameId, playerId: userId });

    runInAction(() => {
      this.joinableGames = this.joinableGames.filter(
        (game) => game.gameId !== gameId
      );
    });
  }
}
type RawGame = {
  id: string;
  playerXId: string | null;
  playerOId: string | null;
};

export class GameOverview {
  store: LobbyStore;
  gameId: string;
  playerXId: string | null;
  playerOId: string | null;

  constructor(store: LobbyStore, game: RawGame) {
    this.gameId = game.id;
    this.playerXId = game.playerXId;
    this.playerOId = game.playerOId;
    this.store = store;
    this.hydrateUsers();
    makeAutoObservable(this);
  }

  get playerX(): User | undefined {
    if (!this.playerXId) return;
    return this.store.usersStore.get(this.playerXId);
  }

  get playerO(): User | undefined {
    if (!this.playerOId) return;
    return this.store.usersStore.get(this.playerOId);
  }

  getOpponent(userId?: string): User | undefined {
    if (!userId) return;

    if (this.playerXId === userId) {
      return this.playerO;
    } else if (this.playerOId === userId) {
      return this.playerX;
    }

    return this.playerX || this.playerO;
  }

  hydrateUsers() {
    Promise.all(
      [this.playerXId, this.playerOId].map((userId) =>
        userId ? this.store.usersStore.resolveUser(userId) : null
      )
    );
  }

  subscribe() {
    // subscribe to games table
  }
}

export const lobbyStore = new LobbyStore(usersStore);
