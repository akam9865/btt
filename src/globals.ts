import { gameStore } from "./stores/game";
import { lobbyStore } from "./stores/games";

if (typeof window !== "undefined") {
  Object.assign(window, { app: { gameStore, lobbyStore } });
}
