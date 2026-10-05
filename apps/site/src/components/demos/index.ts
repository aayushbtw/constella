import type { ComponentType } from "react";

import {
  ButtonDemo,
  ButtonDisabledDemo,
  ButtonIconDemo,
  ButtonSizesDemo,
} from "~/components/demos/button";
import {
  ToastActionDemo,
  ToastDemo,
  ToastDismissDemo,
  ToastPromiseDemo,
  ToastTypesDemo,
} from "~/components/demos/toast";

const demos = {
  button: ButtonDemo,
  "button-disabled": ButtonDisabledDemo,
  "button-icon": ButtonIconDemo,
  "button-sizes": ButtonSizesDemo,
  toast: ToastDemo,
  "toast-action": ToastActionDemo,
  "toast-dismiss": ToastDismissDemo,
  "toast-promise": ToastPromiseDemo,
  "toast-types": ToastTypesDemo,
} satisfies Record<string, ComponentType>;

function isDemo(name: string): name is keyof typeof demos {
  return Object.hasOwn(demos, name);
}

export { demos, isDemo };
