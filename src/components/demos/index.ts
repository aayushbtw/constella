import type { ComponentType } from "react";

import { ToastDemo } from "@/components/demos/toast";

const demos = {
  toast: ToastDemo,
} satisfies Record<string, ComponentType>;

function isDemo(name: string): name is keyof typeof demos {
  return Object.hasOwn(demos, name);
}

export { demos, isDemo };
