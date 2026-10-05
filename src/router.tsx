import { createRouter } from "@tanstack/react-router";
// Loads the module so the augmentation below has a target until a server fn imports it.
import type {} from "@tanstack/react-start";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  return createRouter({
    defaultPreload: "intent",
    notFoundMode: "root",
    routeTree,
    scrollRestoration: true,
  });
}

declare module "@tanstack/react-start" {
  interface Register {
    router: ReturnType<typeof getRouter>;
    ssr: true;
  }
}
