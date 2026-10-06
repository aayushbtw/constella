import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { space } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const fruits = ["Apples", "Oranges", "Pears"];

const styles = stylex.create({
  column: {
    alignItems: "flex-start",
    flexDirection: "column",
    gap: space.sm,
  },
  children: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    paddingInlineStart: space.lg,
  },
});

function CheckboxDemo() {
  return (
    <DemoRow>
      <Label>
        <Checkbox defaultChecked />
        Accept terms and conditions
      </Label>
    </DemoRow>
  );
}

function CheckboxControlledDemo() {
  const [checked, setChecked] = useState(true);

  return (
    <DemoRow>
      <Label>
        <Checkbox checked={checked} onCheckedChange={setChecked} />
        {checked ? "Notifications on" : "Notifications off"}
      </Label>
    </DemoRow>
  );
}

function CheckboxIndeterminateDemo() {
  const [selected, setSelected] = useState(["Apples"]);
  const all = selected.length === fruits.length;

  return (
    <DemoRow sx={styles.column}>
      <Label>
        <Checkbox
          checked={all}
          indeterminate={selected.length > 0 && !all}
          onCheckedChange={(checked) => {
            setSelected(checked ? fruits : []);
          }}
        />
        All fruits
      </Label>
      <div {...stylex.props(styles.children)}>
        {fruits.map((fruit) => (
          <Label key={fruit}>
            <Checkbox
              checked={selected.includes(fruit)}
              onCheckedChange={(checked) => {
                setSelected((current) =>
                  checked
                    ? [...current, fruit]
                    : current.filter((item) => item !== fruit)
                );
              }}
            />
            {fruit}
          </Label>
        ))}
      </div>
    </DemoRow>
  );
}

function CheckboxInvalidDemo() {
  return (
    <DemoRow>
      <Label>
        <Checkbox aria-invalid />
        Accept terms and conditions
      </Label>
    </DemoRow>
  );
}

function CheckboxDisabledDemo() {
  return (
    <DemoRow sx={styles.column}>
      <Label>
        <Checkbox disabled />
        Unavailable
      </Label>
      <Label>
        <Checkbox defaultChecked disabled />
        Always on
      </Label>
    </DemoRow>
  );
}

export {
  CheckboxControlledDemo,
  CheckboxDemo,
  CheckboxDisabledDemo,
  CheckboxIndeterminateDemo,
  CheckboxInvalidDemo,
};
