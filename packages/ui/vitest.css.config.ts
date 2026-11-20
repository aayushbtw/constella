import path from "node:path";

import stylex from "@stylexjs/unplugin/vite";
import { defineProject } from "vite-plus";

export default defineProject({
  plugins: [
    stylex({
      aliases: { "@/*": [path.join(import.meta.dirname, "src/*")] },
      runtimeInjection: true,
    }),
  ],
  resolve: { tsconfigPaths: true },
  test: {
    css: false,
    environment: "jsdom",
    include: ["src/**/*.css.test.tsx"],
    name: "ui-css",
    setupFiles: ["./test/setup.ts"],
  },
});
