export const agentFlag =
  import.meta.env.DEV || import.meta.env.VITE_AGENT_BRIDGE === "1"
    ? {
        loadBridge: async () => await import("~/lib/agent"),
        loadLoop: async () => await import("~/components/agent-loop"),
        loadStaged: async () => await import("~/components/agent-staged"),
      }
    : undefined;
