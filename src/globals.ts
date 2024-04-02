import { gameStore } from "./stores/game";

if (typeof window !== "undefined") {
  Object.assign(window, { app: { gameStore } });
}
