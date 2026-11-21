import { createAgent, registerTools } from "@ui-sdk/react/agent";
import type { AgentAction } from "@ui-sdk/react/agent";
import { createAlertDialogController } from "@ui-sdk/react/alert-dialog";

function createBridge() {
  const confirmController = createAlertDialogController<AgentAction>();
  let mounted = false;
  const mountConfirm = () => {
    mounted = true;
    return () => {
      mounted = false;
    };
  };
  const ask = async (step: AgentAction, signal: AbortSignal) => {
    if (!mounted) {
      return false;
    }
    const { returnValue } = await confirmController.open({
      payload: step,
      signal,
    });
    return returnValue === "confirm";
  };
  const agent = createAgent({
    allow: async (step, { signal }) =>
      step.confirm === undefined || (await ask(step, signal)),
  });
  // The bridge's allow already asked the person, and `!step.confirm` would refuse after they said yes.
  registerTools(agent, { allow: () => true });
  return { agent, confirmController, mountConfirm };
}

declare global {
  var agentBridge: ReturnType<typeof createBridge> | undefined;
}

// The bridge has no destroy, so an HMR re-run reuses the one already on the page.
globalThis.agentBridge ??= createBridge();

export const { agent, confirmController, mountConfirm } =
  globalThis.agentBridge;
