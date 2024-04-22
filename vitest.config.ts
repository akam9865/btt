import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: ".",
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "src") }],
  },
});
