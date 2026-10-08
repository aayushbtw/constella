import * as stylex from "@stylexjs/stylex";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Switch, switchSizes } from "@/components/ui/switch";
import type { SwitchSize } from "@/components/ui/switch";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  narrow: { maxWidth: 384, width: "100%" },
});

const labels = {
  default: "Default",
  lg: "Large",
  sm: "Small",
} satisfies Record<SwitchSize, string>;

function SwitchDemo() {
  return (
    <DemoRow>
      <Label>
        <Switch />
        Airplane Mode
      </Label>
    </DemoRow>
  );
}

function SwitchDescriptionDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel>Share across devices</FieldLabel>
          <FieldDescription>
            Focus is shared across devices, and turns off when you leave the
            app.
          </FieldDescription>
        </FieldContent>
        <Switch />
      </Field>
    </DemoRow>
  );
}

function SwitchCardDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <FieldGroup>
        <Field>
          <FieldLabel>
            <FieldContent>
              <FieldTitle>Share across devices</FieldTitle>
              <FieldDescription>
                Focus is shared across devices, and turns off when you leave the
                app.
              </FieldDescription>
            </FieldContent>
            <Switch />
          </FieldLabel>
        </Field>
        <Field>
          <FieldLabel>
            <FieldContent>
              <FieldTitle>Enable notifications</FieldTitle>
              <FieldDescription>
                Receive notifications when focus mode is enabled or disabled.
              </FieldDescription>
            </FieldContent>
            <Switch defaultChecked />
          </FieldLabel>
        </Field>
      </FieldGroup>
    </DemoRow>
  );
}

function SwitchDisabledDemo() {
  return (
    <DemoRow>
      <Field disabled orientation="horizontal">
        <Switch />
        <FieldLabel>Disabled</FieldLabel>
      </Field>
    </DemoRow>
  );
}

function SwitchInvalidDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field invalid orientation="horizontal">
        <FieldContent>
          <FieldLabel>Accept terms and conditions</FieldLabel>
          <FieldDescription>
            You must accept the terms and conditions to continue.
          </FieldDescription>
        </FieldContent>
        <Switch />
      </Field>
    </DemoRow>
  );
}

function SwitchSizesDemo() {
  return (
    <DemoRow>
      <FieldGroup>
        {switchSizes.map((size) => (
          <Field key={size} orientation="horizontal">
            <Switch size={size} />
            <FieldLabel>{labels[size]}</FieldLabel>
          </Field>
        ))}
      </FieldGroup>
    </DemoRow>
  );
}

export {
  SwitchCardDemo,
  SwitchDemo,
  SwitchDescriptionDemo,
  SwitchDisabledDemo,
  SwitchInvalidDemo,
  SwitchSizesDemo,
};
