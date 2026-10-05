import { defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    compatibilityDate: "2026-04-16",
    compatibilityFlags: ["nodejs_compat"],
    domains: ["ui.aayush.cv"],
    entrypoint: "@tanstack/react-start/server-entry",
    name: "ui",
    observability: {
      logs: { enabled: true, headSamplingRate: 0.05, invocationLogs: true },
      traces: { enabled: false },
    },
    previewUrls: false,
    workersDev: false,
  },
});
