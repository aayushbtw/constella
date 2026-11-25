import { ClientOnly, useRouterState } from "@tanstack/react-router";
import { createDialogController } from "@ui-sdk/react/dialog";
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
    // oxlint-disable-next-line react/hook-use-state -- created once and never set, as ui-sdk's controller docs do
    const [activity] = useState(() => createDialogController());

    return (
      <>
        <Header
          actions={
            <ClientOnly>
              <Suspense>
                <ActivityButton controller={activity} />
              </Suspense>
            </ClientOnly>
          }
        />
        {children}
        <Toaster />
        <ClientOnly>
          <Suspense>
            <AgentLoop controller={activity} path={path} />
          </Suspense>
        </ClientOnly>
      </>
    );
  };
}

const SiteChrome = agentFlag ? agentChrome(agentFlag.loadLoop) : PlainChrome;

export { SiteChrome };
