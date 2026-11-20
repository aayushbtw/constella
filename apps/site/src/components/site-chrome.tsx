import { ClientOnly, useRouterState } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
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
    const path = useRouterState({ select: (s) => s.location.pathname });

    return (
      <>
        <Header
          actions={
            <ClientOnly>
              <Suspense>
                <ActivityButton />
              </Suspense>
            </ClientOnly>
          }
        />
        {children}
        <Toaster />
        <ClientOnly>
          <Suspense>
            <AgentLoop path={path} />
          </Suspense>
        </ClientOnly>
      </>
    );
  };
}

const SiteChrome = agentFlag ? agentChrome(agentFlag.loadLoop) : PlainChrome;

export { SiteChrome };
