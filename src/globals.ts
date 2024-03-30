import { gameStore } from "./stores/game";
import { sessionStore } from "./stores/session";

if (typeof window !== "undefined") {
  Object.assign(window, { app: { gameStore, sessionStore } });
}
