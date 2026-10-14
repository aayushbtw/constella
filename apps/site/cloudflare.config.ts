import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    assets: {
      // Pages pass through the worker so it can answer `Accept: text/markdown`.
      // Hashed build files never need it.
      runWorkerFirst: ["/*", "!/assets/*"],
    },
    compatibilityDate: "2026-09-16",
    compatibilityFlags: ["nodejs_compat"],
    domains: ["constella.aayush.cv"],
    entrypoint: "./src/server.ts",
    env: { ASSETS: bindings.assets() },
    name: "constella",
    observability: {
      logs: { enabled: true, headSamplingRate: 0.05, invocationLogs: true },
      traces: { enabled: false },
    },
    previewUrls: false,
    workersDev: false,
  },
});
