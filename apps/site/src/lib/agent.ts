import { createAgent, registerTools } from "@ui-sdk/react/agent";

// The bridge has no destroy, so an HMR re-run reuses the one already on the page.
if (!("agent" in globalThis)) {
  const agent = createAgent();
  Object.assign(globalThis, { agent });
  registerTools(agent, { allow: (step) => step.confirm === undefined });
}
