import type { ReactElement } from "react";

import { ComboboxInput } from "@/components/primitives/combobox";

const accepts = (element: ReactElement) => element;

accepts(<ComboboxInput triggerLabel="Show fruits" />);
accepts(<ComboboxInput showTrigger={false} />);
accepts(
  <ComboboxInput
    clearLabel="Clear fruit"
    showClear
    triggerLabel="Show fruits"
  />
);

// @ts-expect-error -- the bundled trigger needs a name of its own
accepts(<ComboboxInput />);
// @ts-expect-error -- the bundled clear button needs a name of its own
accepts(<ComboboxInput showClear triggerLabel="Show fruits" />);
