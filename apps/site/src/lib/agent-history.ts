import { createHistory } from "@ui-sdk/react/history";

import { agent } from "~/lib/agent";

declare global {
  var agentHistory: ReturnType<typeof createHistory> | undefined;
}

// One history per page, like the bridge, so an HMR re-run doesn't record twice.
globalThis.agentHistory ??= createHistory(agent);

export const history = globalThis.agentHistory;
