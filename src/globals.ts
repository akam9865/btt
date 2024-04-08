import { gameStore } from "./stores/game";
import { lobbyStore } from "./stores/lobby";

if (typeof window !== "undefined") {
  Object.assign(window, { app: { gameStore, lobbyStore } });
}
