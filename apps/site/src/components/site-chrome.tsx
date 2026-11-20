import { ClientOnly, useRouterState } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import type { ReactNode } from "react";

import { Toaster } from "@/components/primitives/toast";
import { Header } from "~/components/header";
import { agentFlag } from "~/lib/agent-flag";

function PlainChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Toaster />
    </>
  );
}

// A separate tree, so an unflagged build keeps PlainChrome's useId values and markup.
function agentChrome(loadLoop: NonNullable<typeof agentFlag>["loadLoop"]) {
  const AgentLoop = lazy(async () => {
    const { AgentLoop: loop } = await loadLoop();
    return { default: loop };
  });
  const ActivityButton = lazy(async () => {
    const { AgentActivityButton: button } = await loadLoop();
    return { default: button };
  });

  return function AgentChrome({ children }: { children: ReactNode }) {
    const [activity, setActivity] = useState(false);
    const path = useRouterState({ select: (s) => s.location.pathname });

    return (
      <>
        <Header
          actions={
            <ClientOnly>
              <Suspense>
                <ActivityButton onOpenChange={setActivity} open={activity} />
              </Suspense>
            </ClientOnly>
          }
        />
        {children}
        <Toaster />
        <ClientOnly>
          <Suspense>
            <AgentLoop onOpenChange={setActivity} open={activity} path={path} />
          </Suspense>
        </ClientOnly>
      </>
    );
  };
}

const SiteChrome = agentFlag ? agentChrome(agentFlag.loadLoop) : PlainChrome;

export { SiteChrome };
