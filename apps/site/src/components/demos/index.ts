import type { ComponentType } from "react";

import {
  ButtonDemo,
  ButtonIconDemo,
  ButtonIconOnlyDemo,
  ButtonLinkDemo,
  ButtonLoadingDemo,
  ButtonPillDemo,
  ButtonSizesDemo,
  ButtonVariantsDemo,
} from "~/components/demos/button";
import { SpinnerDemo } from "~/components/demos/spinner";
import {
  ToastActionDemo,
  ToastDemo,
  ToastDismissDemo,
  ToastPromiseDemo,
  ToastTypesDemo,
} from "~/components/demos/toast";

const demos = {
  button: ButtonDemo,
  "button-icon": ButtonIconDemo,
  "button-icon-only": ButtonIconOnlyDemo,
  "button-link": ButtonLinkDemo,
  "button-loading": ButtonLoadingDemo,
  "button-pill": ButtonPillDemo,
  "button-sizes": ButtonSizesDemo,
  "button-variants": ButtonVariantsDemo,
  spinner: SpinnerDemo,
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
