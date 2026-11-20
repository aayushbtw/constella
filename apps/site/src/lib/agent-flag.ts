// The imports sit under the condition itself: the build drops their chunks only when it folds right here.
export const agentFlag =
  import.meta.env.DEV || import.meta.env.VITE_AGENT_BRIDGE === "1"
    ? {
        loadBridge: async () => await import("~/lib/agent"),
        loadLoop: async () => await import("~/components/agent-loop"),
      }
    : undefined;
