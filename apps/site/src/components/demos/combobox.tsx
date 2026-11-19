import * as stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  comboboxSizes,
  ComboboxValue,
  useComboboxAnchor,
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
  { items: ["Apple", "Banana", "Blueberry"], value: "Fruits" },
  { items: ["Broccoli", "Carrot", "Spinach"], value: "Vegetables" },
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
        {(item: string) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxList>
    </>
  );
}

function FruitChips({ label, size }: { label: string; size?: ComboboxSize }) {
  const anchor = useComboboxAnchor();
  return (
    <Combobox defaultValue={["Apple", "Banana"]} items={fruits} multiple>
      <ComboboxChips ref={anchor} size={size} sx={styles.field}>
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map((value) => (
                <ComboboxChip key={value}>{value}</ComboboxChip>
              ))}
              <ComboboxChipsInput aria-label={label} />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor} size={size}>
        <FruitList />
      </ComboboxContent>
    </Combobox>
  );
}

function ComboboxDemo() {
  return (
    <DemoRow>
      <Combobox items={fruits}>
        <ComboboxInput
          aria-label="Fruit"
          placeholder="Select a fruit"
          sx={styles.field}
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
  const anchor = useComboboxAnchor();
  const [value, setValue] = useState(["design"]);
  const [query, setQuery] = useState("");
  const highlighted = useRef<string | undefined>(undefined);

  const typed = query.trim();
  const known = [...new Set([...tags, ...value])];
  const match = known.find((tag) => tag.toLowerCase() === typed.toLowerCase());
  const items = typed !== "" && match === undefined ? [...known, typed] : known;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const adds =
      event.key === "," ||
      (event.key === "Enter" && highlighted.current === undefined);
    if (!adds) {
      return;
    }
    event.preventDefault();
    if (typed === "") {
      return;
    }
    const tag = match ?? typed;
    setValue((current) =>
      current.includes(tag) ? current : [...current, tag]
    );
    setQuery("");
  }

  return (
    <DemoRow>
      <Combobox
        inputValue={query}
        items={items}
        multiple
        onInputValueChange={setQuery}
        onItemHighlighted={(item) => {
          highlighted.current = item;
        }}
        onValueChange={(next) => {
          setValue(next);
          setQuery("");
        }}
        value={value}
      >
        <ComboboxChips ref={anchor} sx={styles.field}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((tag) => (
                  <ComboboxChip key={tag}>{tag}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  aria-label="Tags"
                  onKeyDown={handleKeyDown}
                  placeholder={values.length > 0 ? "" : "Add a tag"}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxList>
            {(tag: string) => (
              <ComboboxItem key={tag} value={tag}>
                {known.includes(tag) ? tag : `Create "${tag}"`}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </DemoRow>
  );
}

function ComboboxClearDemo() {
  return (
    <DemoRow>
      <Combobox defaultValue="Banana" items={fruits}>
        <ComboboxInput aria-label="Fruit" showClear sx={styles.field} />
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
      <Combobox items={produce}>
        <ComboboxInput
          aria-label="Produce"
          placeholder="Select produce"
          sx={styles.field}
        />
        <ComboboxContent>
          <ComboboxEmpty>No produce found.</ComboboxEmpty>
          <ComboboxList>
            {(group: (typeof produce)[number], index: number) => (
              <ComboboxGroup items={group.items} key={group.value}>
                {index > 0 && <ComboboxSeparator />}
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
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
      <Combobox defaultValue="Banana" disabled items={fruits}>
        <ComboboxInput aria-label="Fruit" sx={styles.field} />
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
        <Combobox items={fruits}>
          <ComboboxInput placeholder="Select a fruit" />
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
