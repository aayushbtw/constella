import { ClientOnly, useRouterState } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import type { ReactNode } from "react";

import { Toaster } from "@/components/primitives/toast";
import { Header } from "~/components/header";
import { agentFlag } from "~/lib/agent-flag";

const loadLoop = agentFlag?.loadLoop;
const AgentLoop =
  loadLoop &&
  lazy(async () => {
    const { AgentLoop: loop } = await loadLoop();
    return { default: loop };
  });

function SiteChrome({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <Header
        activity={AgentLoop && { onOpenChange: setActivity, open: activity }}
      />
      {children}
      <Toaster />
      {AgentLoop && (
        <ClientOnly>
          <Suspense>
            <AgentLoop onOpenChange={setActivity} open={activity} path={path} />
          </Suspense>
        </ClientOnly>
      )}
    </>
  );
}

export { SiteChrome };
