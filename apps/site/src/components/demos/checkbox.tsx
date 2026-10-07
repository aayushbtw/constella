import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fontWeights, space } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const fruits = ["Apples", "Oranges", "Pears"];

const people = [
  {
    email: "sarah.chen@example.com",
    id: "1",
    name: "Sarah Chen",
    role: "Admin",
  },
  {
    email: "marcus.rodriguez@example.com",
    id: "2",
    name: "Marcus Rodriguez",
    role: "User",
  },
  {
    email: "priya.patel@example.com",
    id: "3",
    name: "Priya Patel",
    role: "User",
  },
  {
    email: "david.kim@example.com",
    id: "4",
    name: "David Kim",
    role: "Editor",
  },
];

const styles = stylex.create({
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

function CheckboxTableDemo() {
  const [selected, setSelected] = useState(() => new Set(["1"]));
  const all = selected.size === people.length;

  return (
    <DemoRow sx={styles.wide}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                aria-label="Select all"
                checked={all}
                indeterminate={selected.size > 0 && !all}
                onCheckedChange={(checked) => {
                  setSelected(
                    new Set(checked ? people.map((row) => row.id) : [])
                  );
                }}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {people.map((row) => (
            <TableRow
              data-state={selected.has(row.id) ? "selected" : undefined}
              key={row.id}
            >
              <TableCell>
                <Checkbox
                  aria-label={`Select ${row.name}`}
                  checked={selected.has(row.id)}
                  onCheckedChange={(checked) => {
                    setSelected((current) => {
                      const next = new Set(current);
                      if (checked) {
                        next.add(row.id);
                      } else {
                        next.delete(row.id);
                      }
                      return next;
                    });
                  }}
                />
              </TableCell>
              <TableCell sx={styles.strong}>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DemoRow>
  );
}

export {
  CheckboxControlledDemo,
  CheckboxDemo,
  CheckboxDisabledDemo,
  CheckboxIndeterminateDemo,
  CheckboxInvalidDemo,
  CheckboxTableDemo,
};
