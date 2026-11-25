import * as stylex from "@stylexjs/stylex";
import { Fragment, useState } from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxCreate,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemText,
  ComboboxList,
  ComboboxSeparator,
  comboboxSizes,
} from "@/components/primitives/combobox";
import type { ComboboxSize } from "@/components/primitives/combobox";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/primitives/field";
import { space } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  field: { maxWidth: "100%", width: 256 },
  stack: {
    alignItems: "center",
    flexDirection: "column",
    gap: space.sm,
  },
});

const fruits = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];

const produce = [
  { items: ["Apple", "Banana", "Blueberry"], label: "Fruits" },
  { items: ["Broccoli", "Carrot", "Spinach"], label: "Vegetables" },
];

const tags = ["design", "engineering", "marketing", "research", "support"];

const sizeLabels = {
  default: "Default",
  lg: "Large",
  sm: "Small",
} satisfies Record<ComboboxSize, string>;

function FruitList() {
  return (
    <>
      <ComboboxEmpty>No fruits found.</ComboboxEmpty>
      <ComboboxList>
        {fruits.map((fruit) => (
          <ComboboxItem key={fruit} value={fruit}>
            <ComboboxItemText />
          </ComboboxItem>
        ))}
      </ComboboxList>
    </>
  );
}

function FruitChips({ label, size }: { label: string; size?: ComboboxSize }) {
  const [value, setValue] = useState(["Apple", "Banana"]);
  return (
    <Combobox multiple onValueChange={setValue} value={value}>
      <ComboboxChips aria-label={label} size={size} sx={styles.field}>
        {value.map((fruit) => (
          <ComboboxChip key={fruit} value={fruit} />
        ))}
        <ComboboxChipsInput aria-label={label} />
      </ComboboxChips>
      <ComboboxContent size={size}>
        <FruitList />
      </ComboboxContent>
    </Combobox>
  );
}

function ComboboxDemo() {
  return (
    <DemoRow>
      <Combobox>
        <ComboboxInput
          aria-label="Fruit"
          placeholder="Select a fruit"
          sx={styles.field}
          triggerLabel="Show fruits"
        />
        <ComboboxContent>
          <FruitList />
        </ComboboxContent>
      </Combobox>
    </DemoRow>
  );
}

function ComboboxMultipleDemo() {
  return (
    <DemoRow>
      <FruitChips label="Fruits" />
    </DemoRow>
  );
}

function ComboboxCreatableDemo() {
  const [known, setKnown] = useState(tags);
  const [value, setValue] = useState(["design"]);
  const [query, setQuery] = useState("");

  function add(text: string) {
    const typed = text.trim();
    if (typed === "") {
      return;
    }
    const tag =
      known.find((name) => name.toLowerCase() === typed.toLowerCase()) ?? typed;
    setKnown((current) =>
      current.includes(tag) ? current : [...current, tag]
    );
    setValue((current) =>
      current.includes(tag) ? current : [...current, tag]
    );
    setQuery("");
  }

  return (
    <DemoRow>
      <Combobox
        autoHighlight
        multiple
        onQueryChange={setQuery}
        onValueChange={setValue}
        query={query}
        value={value}
      >
        <ComboboxChips aria-label="Tags" sx={styles.field}>
          {value.map((tag) => (
            <ComboboxChip key={tag} value={tag} />
          ))}
          <ComboboxChipsInput
            aria-label="Tags"
            onKeyDown={(event) => {
              if (event.key !== "," || event.nativeEvent.isComposing) {
                return;
              }
              event.preventDefault();
              add(query);
            }}
            placeholder={value.length > 0 ? "" : "Add a tag"}
          />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxList>
            {known.map((tag) => (
              <ComboboxItem key={tag} value={tag}>
                <ComboboxItemText />
              </ComboboxItem>
            ))}
            <ComboboxCreate onCreate={add}>
              {(state) => `Create “${state.query}”`}
            </ComboboxCreate>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </DemoRow>
  );
}

function ComboboxClearDemo() {
  return (
    <DemoRow>
      <Combobox defaultValue="Banana">
        <ComboboxInput
          aria-label="Fruit"
          clearLabel="Clear fruit"
          showClear
          sx={styles.field}
          triggerLabel="Show fruits"
        />
        <ComboboxContent>
          <FruitList />
        </ComboboxContent>
      </Combobox>
    </DemoRow>
  );
}

function ComboboxGroupsDemo() {
  return (
    <DemoRow>
      <Combobox>
        <ComboboxInput
          aria-label="Produce"
          placeholder="Select produce"
          sx={styles.field}
          triggerLabel="Show produce"
        />
        <ComboboxContent>
          <ComboboxEmpty>No produce found.</ComboboxEmpty>
          <ComboboxList>
            {produce.map((group, index) => (
              <Fragment key={group.label}>
                {index > 0 && <ComboboxSeparator />}
                <ComboboxGroup>
                  <ComboboxGroupLabel>{group.label}</ComboboxGroupLabel>
                  {group.items.map((item) => (
                    <ComboboxItem key={item} value={item}>
                      <ComboboxItemText />
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              </Fragment>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </DemoRow>
  );
}

function ComboboxSizeDemo() {
  return (
    <DemoRow sx={styles.stack}>
      {comboboxSizes.map((size) => (
        <FruitChips key={size} label={sizeLabels[size]} size={size} />
      ))}
    </DemoRow>
  );
}

function ComboboxDisabledDemo() {
  return (
    <DemoRow>
      <Combobox defaultValue="Banana" disabled>
        <ComboboxInput
          aria-label="Fruit"
          sx={styles.field}
          triggerLabel="Show fruits"
        />
        <ComboboxContent>
          <FruitList />
        </ComboboxContent>
      </Combobox>
    </DemoRow>
  );
}

function ComboboxInvalidDemo() {
  return (
    <DemoRow sx={styles.field}>
      <Field invalid>
        <FieldLabel>Fruit</FieldLabel>
        <Combobox>
          <ComboboxInput
            placeholder="Select a fruit"
            triggerLabel="Show fruits"
          />
          <ComboboxContent>
            <FruitList />
          </ComboboxContent>
        </Combobox>
        <FieldDescription>Please select a fruit.</FieldDescription>
      </Field>
    </DemoRow>
  );
}

export {
  ComboboxClearDemo,
  ComboboxCreatableDemo,
  ComboboxDemo,
  ComboboxDisabledDemo,
  ComboboxGroupsDemo,
  ComboboxInvalidDemo,
  ComboboxMultipleDemo,
  ComboboxSizeDemo,
};
