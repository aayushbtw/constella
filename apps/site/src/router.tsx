import { createRouter } from "@tanstack/react-router";

import { agentFlag } from "~/lib/agent-flag";
import { markNavigations } from "~/lib/entrance";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    defaultPreload: "intent",
    notFoundMode: "root",
    routeTree,
    scrollRestoration: true,
  });

  if (typeof document !== "undefined") {
    markNavigations(router);
    void agentFlag?.loadBridge();
  }

  return router;
}

declare module "@tanstack/react-start" {
  interface Register {
    router: ReturnType<typeof getRouter>;
    ssr: true;
  }
}
