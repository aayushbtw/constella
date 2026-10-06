import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DemoRow } from "~/components/demos/frame";

function LabelDemo() {
  return (
    <DemoRow>
      <Label>
        <Checkbox />
        Accept terms and conditions
      </Label>
    </DemoRow>
  );
}

export { LabelDemo };
