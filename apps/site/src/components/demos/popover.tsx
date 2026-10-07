import * as stylex from "@stylexjs/stylex";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { space } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  wide: { width: 320 },
  narrow: { width: 160 },
  form: { width: 256 },
  rows: { display: "grid", gap: space.xs },
  row: {
    alignItems: "center",
    display: "grid",
    gap: space.md,
    gridTemplateColumns: "1fr 2fr",
  },
  gap: { gap: space.lg },
  half: { flexShrink: 0, width: "50%" },
});

const dimensions = [
  { label: "Width", value: "100%" },
  { label: "Max. width", value: "300px" },
  { label: "Height", value: "25px" },
  { label: "Max. height", value: "none" },
];

const alignments = [
  { align: "start", label: "Start" },
  { align: "center", label: "Center" },
  { align: "end", label: "End" },
] as const;

function PopoverDemo() {
  return (
    <DemoRow>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Open popover
        </PopoverTrigger>
        <PopoverContent sx={styles.wide}>
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
          <div {...stylex.props(styles.rows)}>
            {dimensions.map((row) => (
              <Label key={row.label} sx={styles.row}>
                {row.label}
                <Input defaultValue={row.value} size="sm" />
              </Label>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </DemoRow>
  );
}

function PopoverAlignDemo() {
  return (
    <DemoRow sx={styles.gap}>
      {alignments.map((item) => (
        <Popover key={item.align}>
          <PopoverTrigger render={<Button size="sm" variant="outline" />}>
            {item.label}
          </PopoverTrigger>
          <PopoverContent align={item.align} sx={styles.narrow}>
            Aligned to {item.align}
          </PopoverContent>
        </Popover>
      ))}
    </DemoRow>
  );
}

function PopoverFormDemo() {
  return (
    <DemoRow>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Open Popover
        </PopoverTrigger>
        <PopoverContent align="start" sx={styles.form}>
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>
              Set the dimensions for the layer.
            </PopoverDescription>
          </PopoverHeader>
          <FieldGroup>
            <Field orientation="horizontal">
              <FieldLabel sx={styles.half}>Width</FieldLabel>
              <Input defaultValue="100%" />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel sx={styles.half}>Height</FieldLabel>
              <Input defaultValue="25px" />
            </Field>
          </FieldGroup>
        </PopoverContent>
      </Popover>
    </DemoRow>
  );
}

export { PopoverAlignDemo, PopoverDemo, PopoverFormDemo };
