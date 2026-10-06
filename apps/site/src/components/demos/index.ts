import type { ComponentType } from "react";

import {
  ButtonDemo,
  ButtonIconDemo,
  ButtonIconOnlyDemo,
  ButtonLinkDemo,
  ButtonPillDemo,
  ButtonSizesDemo,
  ButtonStatesDemo,
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
  DialogScrollableDemo,
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
  InputInputGroupDemo,
  InputInvalidDemo,
  InputRequiredDemo,
} from "~/components/demos/input";
import {
  InputGroupBlockEndDemo,
  InputGroupBlockStartDemo,
  InputGroupButtonDemo,
  InputGroupCustomDemo,
  InputGroupDemo,
  InputGroupIconDemo,
  InputGroupInlineEndDemo,
  InputGroupInlineStartDemo,
  InputGroupKbdDemo,
  InputGroupSpinnerDemo,
  InputGroupTextareaDemo,
  InputGroupTextDemo,
} from "~/components/demos/input-group";
import {
  KbdButtonDemo,
  KbdDemo,
  KbdGroupDemo,
  KbdTooltipDemo,
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
  TextareaButtonDemo,
  TextareaDemo,
  TextareaDisabledDemo,
  TextareaFieldDemo,
  TextareaInvalidDemo,
} from "~/components/demos/textarea";
import {
  ToastActionDemo,
  ToastDemo,
  ToastDismissDemo,
  ToastPromiseDemo,
  ToastTypesDemo,
} from "~/components/demos/toast";
import {
  TooltipDemo,
  TooltipDisabledDemo,
  TooltipKbdDemo,
  TooltipSideDemo,
} from "~/components/demos/tooltip";
import { TypographyDemo } from "~/components/demos/typography";

const demos = {
  button: ButtonDemo,
  "button-icon": ButtonIconDemo,
  "button-icon-only": ButtonIconOnlyDemo,
  "button-link": ButtonLinkDemo,
  "button-pill": ButtonPillDemo,
  "button-sizes": ButtonSizesDemo,
  "button-states": ButtonStatesDemo,
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
  "dialog-scrollable": DialogScrollableDemo,
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
  "input-group": InputGroupDemo,
  "input-group-block-end": InputGroupBlockEndDemo,
  "input-group-block-start": InputGroupBlockStartDemo,
  "input-group-button": InputGroupButtonDemo,
  "input-group-custom": InputGroupCustomDemo,
  "input-group-icon": InputGroupIconDemo,
  "input-group-inline-end": InputGroupInlineEndDemo,
  "input-group-inline-start": InputGroupInlineStartDemo,
  "input-group-kbd": InputGroupKbdDemo,
  "input-group-spinner": InputGroupSpinnerDemo,
  "input-group-text": InputGroupTextDemo,
  "input-group-textarea": InputGroupTextareaDemo,
  "input-inline": InputInlineDemo,
  "input-input-group": InputInputGroupDemo,
  "input-invalid": InputInvalidDemo,
  "input-required": InputRequiredDemo,
  kbd: KbdDemo,
  "kbd-button": KbdButtonDemo,
  "kbd-group": KbdGroupDemo,
  "kbd-tooltip": KbdTooltipDemo,
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
  tooltip: TooltipDemo,
  "tooltip-disabled": TooltipDisabledDemo,
  "tooltip-kbd": TooltipKbdDemo,
  "tooltip-side": TooltipSideDemo,
  typography: TypographyDemo,
} satisfies Record<string, ComponentType>;

function isDemo(name: string): name is keyof typeof demos {
  return Object.hasOwn(demos, name);
}

export { demos, isDemo };
