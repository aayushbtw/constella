import path from "node:path";

import { cloudflare } from "@cloudflare/vite-plugin";
import stylex from "@stylexjs/unplugin/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { tomekit } from "tomekit/vite";
import { defineConfig, lazyPlugins } from "vite-plus";

export default defineConfig({
  plugins: [
    // Before the React plugin, or Fast Refresh breaks.
    stylex({
      aliases: {
        "@/*": [path.join(import.meta.dirname, "../../packages/ui/src/*")],
        "~/*": [path.join(import.meta.dirname, "src/*")],
      },
      // Its default pick differs between the client and server builds, so the
      // chunk the prerendered HTML links would 404.
      cssInjectionTarget: (file) => path.basename(file).startsWith("styles-"),
      // The router transforms client and server code differently, so the line
      // numbers in `data-style-src` disagree and fail hydration.
      enableDebugDataProp: false,
      // Declared ahead of StyleX's own, so any component style wins over them.
      useCSSLayers: { before: ["reset", "base"] },
    }),
    lazyPlugins(() => [
      tomekit(),
      tanstackStart({
        // Dev-only: they 404 in builds.
        pages: ["/break", "/clip", "/poster", "/trace-run"].map((devPath) => ({
          path: devPath,
          prerender: { enabled: false },
          sitemap: { exclude: true },
        })),
        prerender: {
          crawlLinks: true,
          enabled: true,
          // The worker serves Markdown per request; crawling it would follow
          // sample links in code blocks, like `/settings`.
          filter: (page) => !page.path.endsWith("/index.md"),
        },
        sitemap: {
          enabled: true,
          host: "https://constella.aayush.cv",
        },
      }),
      viteReact(),
      cloudflare({ viteEnvironment: { name: "ssr" } }),
    ]),
  ],
  resolve: { tsconfigPaths: true },
  server: { port: 8080 },
});
