import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { agentFlag } from "~/lib/agent-flag";

function stagedPage(loadStaged: NonNullable<typeof agentFlag>["loadStaged"]) {
  const Staged = lazy(async () => {
    const { AgentStaged } = await loadStaged();
    return { default: AgentStaged };
  });

  return function AgentStagedPage() {
    return (
      <ClientOnly>
        <Suspense>
          <Staged />
        </Suspense>
      </ClientOnly>
    );
  };
}

export const Route = createFileRoute("/_dev/agent-staged")({
  component: agentFlag ? stagedPage(agentFlag.loadStaged) : () => null,
});
