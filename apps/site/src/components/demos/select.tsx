import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  selectSizes,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SelectSize } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { space } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  trigger: { maxWidth: 192, width: "100%" },
  wide: { maxWidth: 256, width: "100%" },
  narrow: { maxWidth: 320, width: "100%" },
  stack: {
    alignItems: "center",
    flexDirection: "column",
    gap: space.sm,
  },
});

interface Option {
  disabled?: boolean;
  label: string;
  value: string | null;
}

const fruits: Option[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
];

const fruitItems: Option[] = [
  { label: "Select a fruit", value: null },
  ...fruits,
];

const vegetables: Option[] = [
  { label: "Carrot", value: "carrot" },
  { label: "Broccoli", value: "broccoli" },
  { label: "Spinach", value: "spinach" },
];

const timezones = [
  {
    items: [
      { label: "Eastern Standard Time", value: "est" },
      { label: "Central Standard Time", value: "cst" },
      { label: "Mountain Standard Time", value: "mst" },
      { label: "Pacific Standard Time", value: "pst" },
      { label: "Alaska Standard Time", value: "akst" },
      { label: "Hawaii Standard Time", value: "hst" },
    ],
    label: "North America",
  },
  {
    items: [
      { label: "Greenwich Mean Time", value: "gmt" },
      { label: "Central European Time", value: "cet" },
      { label: "Eastern European Time", value: "eet" },
      { label: "Western European Summer Time", value: "west" },
      { label: "Central Africa Time", value: "cat" },
      { label: "East Africa Time", value: "eat" },
    ],
    label: "Europe & Africa",
  },
  {
    items: [
      { label: "Moscow Time", value: "msk" },
      { label: "India Standard Time", value: "ist" },
      { label: "China Standard Time", value: "cst_china" },
      { label: "Japan Standard Time", value: "jst" },
      { label: "Korea Standard Time", value: "kst" },
      { label: "Indonesia Central Standard Time", value: "ist_indonesia" },
    ],
    label: "Asia",
  },
  {
    items: [
      { label: "Australian Western Standard Time", value: "awst" },
      { label: "Australian Central Standard Time", value: "acst" },
      { label: "Australian Eastern Standard Time", value: "aest" },
      { label: "New Zealand Standard Time", value: "nzst" },
      { label: "Fiji Time", value: "fjt" },
    ],
    label: "Australia & Pacific",
  },
  {
    items: [
      { label: "Argentina Time", value: "art" },
      { label: "Bolivia Time", value: "bot" },
      { label: "Brasilia Time", value: "brt" },
      { label: "Chile Standard Time", value: "clt" },
    ],
    label: "South America",
  },
];

const timezoneItems: Option[] = [
  { label: "Select a timezone", value: null },
  ...timezones.flatMap((group) => group.items),
];

const sizeLabels = {
  default: "Default",
  sm: "Small",
} satisfies Record<SelectSize, string>;

function Items({ items }: { items: Option[] }) {
  return items.map((item) => (
    <SelectItem disabled={item.disabled} key={item.label} value={item.value}>
      {item.label}
    </SelectItem>
  ));
}

function SelectDemo() {
  return (
    <DemoRow>
      <Select items={fruitItems}>
        <SelectTrigger aria-label="Fruit" sx={styles.trigger}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <Items items={fruits} />
          </SelectGroup>
        </SelectContent>
      </Select>
    </DemoRow>
  );
}

function SelectAlignItemDemo() {
  const [alignItemWithTrigger, setAlignItemWithTrigger] = useState(true);
  return (
    <DemoRow sx={styles.narrow}>
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel>Align Item</FieldLabel>
            <FieldDescription>
              Toggle to align the item with the trigger.
            </FieldDescription>
          </FieldContent>
          <Switch
            checked={alignItemWithTrigger}
            onCheckedChange={setAlignItemWithTrigger}
          />
        </Field>
        <Select defaultValue="banana" items={fruitItems}>
          <SelectTrigger aria-label="Fruit" sx={styles.narrow}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={alignItemWithTrigger}>
            <SelectGroup>
              <Items items={fruits} />
            </SelectGroup>
          </SelectContent>
        </Select>
      </FieldGroup>
    </DemoRow>
  );
}

function SelectGroupsDemo() {
  return (
    <DemoRow>
      <Select
        items={[
          { label: "Select a fruit", value: null },
          ...fruits.slice(0, 3),
          ...vegetables,
        ]}
      >
        <SelectTrigger aria-label="Produce" sx={styles.trigger}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <Items items={fruits.slice(0, 3)} />
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Vegetables</SelectLabel>
            <Items items={vegetables} />
          </SelectGroup>
        </SelectContent>
      </Select>
    </DemoRow>
  );
}

function SelectScrollableDemo() {
  return (
    <DemoRow>
      <Select items={timezoneItems}>
        <SelectTrigger aria-label="Timezone" sx={styles.wide}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {timezones.map((group) => (
            <SelectGroup key={group.label}>
              <SelectLabel>{group.label}</SelectLabel>
              <Items items={group.items} />
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </DemoRow>
  );
}

function SelectDisabledDemo() {
  const items = fruitItems.map((item) =>
    item.value === "grapes" ? { ...item, disabled: true } : item
  );
  return (
    <DemoRow>
      <Select disabled items={items}>
        <SelectTrigger aria-label="Fruit" sx={styles.trigger}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <Items items={items.slice(1)} />
          </SelectGroup>
        </SelectContent>
      </Select>
    </DemoRow>
  );
}

function SelectInvalidDemo() {
  return (
    <DemoRow sx={styles.trigger}>
      <Field invalid>
        <FieldLabel>Fruit</FieldLabel>
        <Select items={fruitItems}>
          <SelectTrigger sx={styles.trigger}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <Items items={fruits} />
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription>Please select a fruit.</FieldDescription>
      </Field>
    </DemoRow>
  );
}

function SelectSizesDemo() {
  return (
    <DemoRow sx={styles.stack}>
      {selectSizes.map((size) => (
        <Select defaultValue="apple" items={fruitItems} key={size}>
          <SelectTrigger aria-label={sizeLabels[size]} size={size}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <Items items={fruits} />
            </SelectGroup>
          </SelectContent>
        </Select>
      ))}
    </DemoRow>
  );
}

export {
  SelectAlignItemDemo,
  SelectDemo,
  SelectDisabledDemo,
  SelectGroupsDemo,
  SelectInvalidDemo,
  SelectScrollableDemo,
  SelectSizesDemo,
};
