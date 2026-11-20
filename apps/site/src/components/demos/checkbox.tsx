import * as stylex from "@stylexjs/stylex";
import { useId, useState } from "react";

import {
  Checkbox,
  CheckboxGroup,
  checkboxSizes,
} from "@/components/primitives/checkbox";
import {
  FieldDescription,
  FieldLegend,
  FieldSet,
} from "@/components/primitives/field";
import { Label } from "@/components/primitives/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/primitives/table";
import { fontWeights, space } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const fruits = ["Apples", "Oranges", "Pears"];

const desktopItems = [
  { label: "Hard disks", value: "hard-disks" },
  { label: "External disks", value: "external-disks" },
  { label: "CDs, DVDs, and iPods", value: "media" },
  { label: "Connected servers", value: "servers" },
];

const people = [
  {
    email: "alex@acme.com",
    id: "1",
    name: "Alex Smith",
    role: "Admin",
  },
  {
    email: "sam@acme.com",
    id: "2",
    name: "Sam Lee",
    role: "User",
  },
  {
    email: "jordan@acme.com",
    id: "3",
    name: "Jordan Kim",
    role: "User",
  },
  {
    email: "taylor@acme.com",
    id: "4",
    name: "Taylor Brown",
    role: "Editor",
  },
];

const styles = stylex.create({
  fit: { width: "fit-content" },
  narrow: { maxWidth: 320, width: "100%" },
  wide: { maxWidth: 560, width: "100%" },
  strong: { fontWeight: fontWeights.medium },
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

const sizeLabels = {
  default: "Default",
  lg: "Large",
  sm: "Small",
} as const;

function CheckboxSizeDemo() {
  return (
    <DemoRow>
      {checkboxSizes.map((size) => (
        <Label key={size}>
          <Checkbox defaultChecked size={size} />
          {sizeLabels[size]}
        </Label>
      ))}
    </DemoRow>
  );
}

function CheckboxControlledDemo() {
  const [checked, setChecked] = useState(true);

  return (
    <DemoRow>
      <Label>
        <Checkbox
          checked={checked}
          onCheckedChange={(next) => {
            setChecked(next === true);
          }}
        />
        {checked ? "Notifications on" : "Notifications off"}
      </Label>
    </DemoRow>
  );
}

function CheckboxIndeterminateDemo() {
  return (
    <DemoRow>
      <CheckboxGroup
        aria-label="Fruits"
        allValues={fruits}
        defaultValue={["Apples"]}
        sx={styles.fit}
      >
        <Label>
          <Checkbox parent />
          All fruits
        </Label>
        <div {...stylex.props(styles.children)}>
          {fruits.map((fruit) => (
            <Label key={fruit}>
              <Checkbox value={fruit} />
              {fruit}
            </Label>
          ))}
        </div>
      </CheckboxGroup>
    </DemoRow>
  );
}

function CheckboxGroupDemo() {
  const legend = useId();
  const description = useId();
  return (
    <DemoRow sx={styles.narrow}>
      <FieldSet>
        <FieldLegend id={legend} variant="label">
          Show these items on the desktop
        </FieldLegend>
        <FieldDescription id={description}>
          Select the items you want to show on the desktop.
        </FieldDescription>
        <CheckboxGroup
          aria-describedby={description}
          aria-labelledby={legend}
          defaultValue={["hard-disks"]}
        >
          {desktopItems.map((item) => (
            <Label key={item.value}>
              <Checkbox value={item.value} />
              {item.label}
            </Label>
          ))}
        </CheckboxGroup>
      </FieldSet>
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

function CheckboxTableDemo() {
  const [selected, setSelected] = useState(["1"]);

  return (
    <DemoRow sx={styles.wide}>
      <CheckboxGroup
        allValues={people.map((row) => row.id)}
        aria-label="Team members"
        onValueChange={setSelected}
        value={selected}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox aria-label="Select all" parent />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {people.map((row) => (
              <TableRow
                data-state={selected.includes(row.id) ? "selected" : undefined}
                key={row.id}
              >
                <TableCell>
                  <Checkbox aria-label={`Select ${row.name}`} value={row.id} />
                </TableCell>
                <TableCell sx={styles.strong}>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CheckboxGroup>
    </DemoRow>
  );
}

export {
  CheckboxControlledDemo,
  CheckboxDemo,
  CheckboxDisabledDemo,
  CheckboxGroupDemo,
  CheckboxIndeterminateDemo,
  CheckboxInvalidDemo,
  CheckboxSizeDemo,
  CheckboxTableDemo,
};
