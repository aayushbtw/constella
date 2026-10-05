import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";
import stylex from "@stylexjs/unplugin/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  plugins: lazyPlugins(() => [
    tanstackStart({
      prerender: {
        crawlLinks: true,
        enabled: true,
      },
      sitemap: {
        enabled: true,
        host: "https://ui.aayush.cv",
      },
    }),
    // Before the React plugin, or Fast Refresh breaks.
    stylex({
      aliases: { "@/*": [path.join(import.meta.dirname, "src/*")] },
      // The router transforms client and server code differently, so the line
      // numbers in `data-style-src` disagree and fail hydration.
      enableDebugDataProp: false,
      useCSSLayers: true,
    }),
    viteReact(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
  ]),
  resolve: { tsconfigPaths: true },
  server: { port: 3001 },
});
