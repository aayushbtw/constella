import * as stylex from "@stylexjs/stylex";
import { useId } from "react";

import { Checkbox } from "@/components/primitives/checkbox";
import { Label } from "@/components/primitives/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/primitives/radio-group";
import { space } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stack: {
    alignItems: "flex-start",
    flexDirection: "column",
    gap: space.sm,
  },
});

const speeds = [
  { label: "Standard", value: "standard" },
  { label: "Express", value: "express" },
  { label: "Overnight", value: "overnight" },
];

function LabelDemo() {
  const id = useId();
  return (
    <DemoRow>
      <Checkbox id={id} />
      <Label htmlFor={id}>Accept terms and conditions</Label>
    </DemoRow>
  );
}

function LabelWrapDemo() {
  return (
    <DemoRow>
      <Label>
        <Checkbox />
        Accept terms and conditions
      </Label>
    </DemoRow>
  );
}

function LabelRadioGroupDemo() {
  const id = useId();
  return (
    <DemoRow sx={styles.stack}>
      <Label htmlFor={id}>Shipping speed</Label>
      <RadioGroup defaultValue="standard" id={id}>
        {speeds.map((speed) => (
          <Label key={speed.value}>
            <RadioGroupItem value={speed.value} />
            {speed.label}
          </Label>
        ))}
      </RadioGroup>
    </DemoRow>
  );
}

export { LabelDemo, LabelRadioGroupDemo, LabelWrapDemo };
