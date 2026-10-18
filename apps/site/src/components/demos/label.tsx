import { useId } from "react";

import { Checkbox } from "@/components/primitives/checkbox";
import { Label } from "@/components/primitives/label";
import { DemoRow } from "~/components/demos/frame";

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

export { LabelDemo, LabelWrapDemo };
