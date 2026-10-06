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
import { ColorRolesDemo, ColorScalesDemo } from "~/components/demos/color";
import {
  DialogControlledDemo,
  DialogDemo,
  DialogNestedDemo,
} from "~/components/demos/dialog";
import { LayoutRadiiDemo, LayoutSizesDemo } from "~/components/demos/layout";
import { MotionEasingDemo } from "~/components/demos/motion";
import { SliderDemo } from "~/components/demos/slider";
import { SpinnerDemo } from "~/components/demos/spinner";
import { TabsDemo } from "~/components/demos/tabs";
import {
  ToastActionDemo,
  ToastDemo,
  ToastDismissDemo,
  ToastPromiseDemo,
  ToastTypesDemo,
} from "~/components/demos/toast";
import { TypographyDemo } from "~/components/demos/typography";

const demos = {
  button: ButtonDemo,
  "button-icon": ButtonIconDemo,
  "button-icon-only": ButtonIconOnlyDemo,
  "button-link": ButtonLinkDemo,
  "button-loading": ButtonLoadingDemo,
  "button-pill": ButtonPillDemo,
  "button-sizes": ButtonSizesDemo,
  "button-variants": ButtonVariantsDemo,
  "color-roles": ColorRolesDemo,
  "color-scales": ColorScalesDemo,
  dialog: DialogDemo,
  "dialog-controlled": DialogControlledDemo,
  "dialog-nested": DialogNestedDemo,
  "layout-radii": LayoutRadiiDemo,
  "layout-sizes": LayoutSizesDemo,
  "motion-easing": MotionEasingDemo,
  slider: SliderDemo,
  spinner: SpinnerDemo,
  toast: ToastDemo,
  "toast-action": ToastActionDemo,
  "toast-dismiss": ToastDismissDemo,
  "toast-promise": ToastPromiseDemo,
  "toast-types": ToastTypesDemo,
  tabs: TabsDemo,
  typography: TypographyDemo,
} satisfies Record<string, ComponentType>;

function isDemo(name: string): name is keyof typeof demos {
  return Object.hasOwn(demos, name);
}

export { demos, isDemo };
