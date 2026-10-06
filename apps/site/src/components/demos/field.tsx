import * as stylex from "@stylexjs/stylex";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldSetDescription,
  FieldTitle,
} from "@/components/ui/field";
import { DemoRow } from "~/components/demos/frame";

const items = [
  { checked: true, label: "Hard disks" },
  { checked: true, label: "External disks" },
  { checked: false, label: "CDs, DVDs, and iPods" },
  { checked: false, label: "Connected servers" },
];

const styles = stylex.create({
  narrow: { maxWidth: 320, width: "100%" },
});

function FieldDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field orientation="horizontal">
        <Checkbox defaultChecked />
        <FieldContent>
          <FieldLabel>Accept terms and conditions</FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms.
          </FieldDescription>
        </FieldContent>
      </Field>
    </DemoRow>
  );
}

function FieldSetDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <FieldSet>
        <FieldLegend variant="label">
          Show these items on the desktop
        </FieldLegend>
        <FieldSetDescription>
          Select the items you want to show on the desktop.
        </FieldSetDescription>
        <FieldGroup>
          {items.map((item) => (
            <Field key={item.label} orientation="horizontal">
              <Checkbox defaultChecked={item.checked} />
              <FieldLabel>{item.label}</FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
    </DemoRow>
  );
}

function FieldCardDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>
          <Checkbox defaultChecked />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>
              You can enable or disable notifications at any time.
            </FieldDescription>
          </FieldContent>
        </FieldLabel>
      </Field>
    </DemoRow>
  );
}

function FieldDisabledDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field disabled orientation="horizontal">
        <Checkbox />
        <FieldLabel>Enable notifications</FieldLabel>
      </Field>
    </DemoRow>
  );
}

function FieldErrorDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field invalid orientation="horizontal">
        <Checkbox />
        <FieldContent>
          <FieldLabel>Accept terms and conditions</FieldLabel>
          <FieldError match>You must accept the terms to continue.</FieldError>
        </FieldContent>
      </Field>
    </DemoRow>
  );
}

export {
  FieldCardDemo,
  FieldDemo,
  FieldDisabledDemo,
  FieldErrorDemo,
  FieldSetDemo,
};
