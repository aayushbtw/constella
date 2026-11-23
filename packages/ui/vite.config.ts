import path from "node:path";

import stylex from "@stylexjs/unplugin/vite";
import { configDefaults, defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [
    stylex({
      aliases: { "@/*": [path.join(import.meta.dirname, "src/*")] },
    }),
  ],
  resolve: { tsconfigPaths: true },
  test: {
    css: false,
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "src/**/*.css.test.tsx"],
    setupFiles: ["./test/setup.ts"],
  },
});
