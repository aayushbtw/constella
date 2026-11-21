import * as stylex from "@stylexjs/stylex";
import type { ListData } from "@ui-sdk/react/select";
import { useState } from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/primitives/field";
import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemText,
  SelectList,
  SelectSeparator,
  selectSizes,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import type { SelectSize } from "@/components/primitives/select";
import { Switch } from "@/components/primitives/switch";
import { space } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  trigger: { maxWidth: "100%", width: 192 },
  wide: { maxWidth: "100%", width: 256 },
  narrow: { maxWidth: "100%", width: 320 },
  stack: {
    alignItems: "center",
    flexDirection: "column",
    gap: space.sm,
  },
});

interface Option {
  disabled?: boolean;
  label: string;
  value: string;
}

const fruits: Option[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
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

const timezoneItems = timezones.flatMap((group) => group.items);

const timezoneGroups = timezones.map((group) => ({
  ...group,
  type: "group" as const,
}));

const sizeLabels = {
  default: "Default",
  lg: "Large",
  sm: "Small",
} satisfies Record<SelectSize, string>;

function Items({ items }: { items: Option[] }) {
  return items.map((item) => (
    <SelectItem disabled={item.disabled} key={item.value} value={item.value}>
      {item.label}
    </SelectItem>
  ));
}

function SelectDemo() {
  return (
    <DemoRow>
      <Select items={fruits} placeholder="Select a fruit">
        <SelectTrigger aria-label="Fruit" sx={styles.trigger}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectGroupLabel>Fruits</SelectGroupLabel>
            <Items items={fruits} />
          </SelectGroup>
        </SelectContent>
      </Select>
    </DemoRow>
  );
}

function SelectAlignItemDemo() {
  const [alignItemWithTrigger, setAlignItemWithTrigger] = useState(false);
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
        <Select
          defaultValue="banana"
          items={fruits}
          placeholder="Select a fruit"
        >
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
        items={[...fruits.slice(0, 3), ...vegetables]}
        placeholder="Select a fruit"
      >
        <SelectTrigger aria-label="Produce" sx={styles.trigger}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectGroupLabel>Fruits</SelectGroupLabel>
            <Items items={fruits.slice(0, 3)} />
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectGroupLabel>Vegetables</SelectGroupLabel>
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
      <Select items={timezoneItems} placeholder="Select a timezone">
        <SelectTrigger aria-label="Timezone" sx={styles.wide}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {timezones.map((group) => (
            <SelectGroup key={group.label}>
              <SelectGroupLabel>{group.label}</SelectGroupLabel>
              <Items items={group.items} />
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </DemoRow>
  );
}

function SearchOptions({ entries }: { entries: ListData<unknown> }) {
  return entries.map((entry) => {
    const item =
      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- a plain string is an item in ui-sdk's ListData
      typeof entry === "string" ? { label: entry, value: entry } : entry;
    if ("type" in item) {
      return item.type === "group" ? (
        <SelectGroup key={item.label}>
          <SelectGroupLabel>{item.label}</SelectGroupLabel>
          <SearchOptions entries={item.items} />
        </SelectGroup>
      ) : null;
    }
    return (
      <SelectItem key={item.label} label={item.label} value={item.value}>
        <SelectItemText />
      </SelectItem>
    );
  });
}

function SelectSearchDemo() {
  return (
    <DemoRow>
      <Select items={timezoneGroups} placeholder="Select a timezone">
        <SelectTrigger aria-label="Timezone" sx={styles.wide}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectInput
            aria-label="Search timezones"
            placeholder="Search timezones"
          />
          <SelectEmpty>No timezones found.</SelectEmpty>
          <SelectList>
            {({ items }) => <SearchOptions entries={items} />}
          </SelectList>
        </SelectContent>
      </Select>
    </DemoRow>
  );
}

function SelectDisabledDemo() {
  const items = fruits.map((item) =>
    item.value === "grapes" ? { ...item, disabled: true } : item
  );
  return (
    <DemoRow>
      <Select disabled items={items} placeholder="Select a fruit">
        <SelectTrigger aria-label="Fruit" sx={styles.trigger}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <Items items={items} />
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
        <Select items={fruits} placeholder="Select a fruit">
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
        <Select
          defaultValue="apple"
          items={fruits}
          key={size}
          placeholder="Select a fruit"
        >
          <SelectTrigger aria-label={sizeLabels[size]} size={size}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent size={size}>
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
  SelectSearchDemo,
  SelectSizesDemo,
};
