import path from "node:path";

import stylex from "@stylexjs/unplugin/vite";
import { defineProject } from "vite-plus";

export default defineProject({
  plugins: [
    stylex({
      aliases: {
        "@/*": [path.join(import.meta.dirname, "../../packages/ui/src/*")],
        "~/*": [path.join(import.meta.dirname, "src/*")],
      },
    }),
  ],
  resolve: { tsconfigPaths: true },
  test: {
    css: false,
    environment: "jsdom",
    name: "site",
    setupFiles: ["../../packages/ui/test/setup.ts"],
  },
});
