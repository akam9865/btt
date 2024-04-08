import { gamesStore } from "./stores/games";
import { lobbyStore } from "./stores/lobby";

if (typeof window !== "undefined") {
  Object.assign(window, { app: { gamesStore, lobbyStore } });
}
