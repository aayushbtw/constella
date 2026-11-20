import { createAgent, registerTools } from "@ui-sdk/react/agent";
import type { AgentAction } from "@ui-sdk/react/agent";
import { createConfirm } from "@ui-sdk/react/alert-dialog";
import { createHistory } from "@ui-sdk/react/history";

function createBridge() {
  const confirm = createConfirm<AgentAction>();
  const ask = async (step: AgentAction, signal: AbortSignal) => {
    // The controller has members only while an alert dialog holds it; unheld, `open` does nothing and resolves nothing.
    if (!("open" in confirm.controller)) {
      return false;
    }
    const { returnValue } = await confirm.controller.open({
      payload: step,
      signal,
    });
    return returnValue === "confirm";
  };
  const agent = createAgent({
    allow: async (step, { signal }) =>
      step.confirm === undefined || (await ask(step, signal)),
  });
  registerTools(agent, { allow: () => true });
  return { agent, confirm, history: createHistory(agent) };
}

declare global {
  var agentBridge: ReturnType<typeof createBridge> | undefined;
}

// The bridge has no destroy, so an HMR re-run reuses the one already on the page.
globalThis.agentBridge ??= createBridge();

export const { agent, confirm, history } = globalThis.agentBridge;
