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
import {
  CheckboxControlledDemo,
  CheckboxDemo,
  CheckboxDisabledDemo,
  CheckboxIndeterminateDemo,
  CheckboxInvalidDemo,
} from "~/components/demos/checkbox";
import { ColorRolesDemo, ColorScalesDemo } from "~/components/demos/color";
import {
  DialogControlledDemo,
  DialogDemo,
  DialogNestedDemo,
} from "~/components/demos/dialog";
import {
  FieldCardDemo,
  FieldDemo,
  FieldDisabledDemo,
  FieldErrorDemo,
  FieldSetDemo,
} from "~/components/demos/field";
import {
  InputBasicDemo,
  InputDemo,
  InputDisabledDemo,
  InputFieldDemo,
  InputFieldGroupDemo,
  InputFileDemo,
  InputGridDemo,
  InputInlineDemo,
  InputInvalidDemo,
  InputRequiredDemo,
} from "~/components/demos/input";
import {
  KbdButtonDemo,
  KbdDemo,
  KbdGroupDemo,
} from "~/components/demos/kbd";
import { LabelDemo } from "~/components/demos/label";
import { LayoutRadiiDemo, LayoutSizesDemo } from "~/components/demos/layout";
import { MotionEasingDemo } from "~/components/demos/motion";
import {
  SliderDemo,
  SliderDisabledDemo,
  SliderInputDemo,
  SliderMultipleDemo,
  SliderRangeDemo,
  SliderReferencesDemo,
  SliderStepsDemo,
  SliderTooltipDemo,
  SliderVerticalDemo,
} from "~/components/demos/slider";
import { SpinnerDemo } from "~/components/demos/spinner";
import { TabsDemo } from "~/components/demos/tabs";
import {
  ToastActionDemo,
  ToastDemo,
  ToastDismissDemo,
  ToastPromiseDemo,
  ToastTypesDemo,
} from "~/components/demos/toast";
import {
  TextareaButtonDemo,
  TextareaDemo,
  TextareaDisabledDemo,
  TextareaFieldDemo,
  TextareaInvalidDemo,
} from "~/components/demos/textarea";
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
  checkbox: CheckboxDemo,
  "checkbox-controlled": CheckboxControlledDemo,
  "checkbox-disabled": CheckboxDisabledDemo,
  "checkbox-indeterminate": CheckboxIndeterminateDemo,
  "checkbox-invalid": CheckboxInvalidDemo,
  "color-roles": ColorRolesDemo,
  "color-scales": ColorScalesDemo,
  dialog: DialogDemo,
  "dialog-controlled": DialogControlledDemo,
  "dialog-nested": DialogNestedDemo,
  field: FieldDemo,
  "field-card": FieldCardDemo,
  "field-disabled": FieldDisabledDemo,
  "field-error": FieldErrorDemo,
  "field-set": FieldSetDemo,
  input: InputDemo,
  "input-basic": InputBasicDemo,
  "input-disabled": InputDisabledDemo,
  "input-field": InputFieldDemo,
  "input-field-group": InputFieldGroupDemo,
  "input-file": InputFileDemo,
  "input-grid": InputGridDemo,
  "input-inline": InputInlineDemo,
  "input-invalid": InputInvalidDemo,
  "input-required": InputRequiredDemo,
  kbd: KbdDemo,
  "kbd-button": KbdButtonDemo,
  "kbd-group": KbdGroupDemo,
  label: LabelDemo,
  "layout-radii": LayoutRadiiDemo,
  "layout-sizes": LayoutSizesDemo,
  "motion-easing": MotionEasingDemo,
  slider: SliderDemo,
  "slider-disabled": SliderDisabledDemo,
  "slider-input": SliderInputDemo,
  "slider-multiple": SliderMultipleDemo,
  "slider-range": SliderRangeDemo,
  "slider-references": SliderReferencesDemo,
  "slider-steps": SliderStepsDemo,
  "slider-tooltip": SliderTooltipDemo,
  "slider-vertical": SliderVerticalDemo,
  spinner: SpinnerDemo,
  toast: ToastDemo,
  "toast-action": ToastActionDemo,
  "toast-dismiss": ToastDismissDemo,
  "toast-promise": ToastPromiseDemo,
  "toast-types": ToastTypesDemo,
  tabs: TabsDemo,
  textarea: TextareaDemo,
  "textarea-button": TextareaButtonDemo,
  "textarea-disabled": TextareaDisabledDemo,
  "textarea-field": TextareaFieldDemo,
  "textarea-invalid": TextareaInvalidDemo,
  typography: TypographyDemo,
} satisfies Record<string, ComponentType>;

function isDemo(name: string): name is keyof typeof demos {
  return Object.hasOwn(demos, name);
}

export { demos, isDemo };
