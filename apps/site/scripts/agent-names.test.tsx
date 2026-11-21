import { render } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import type { ReactNode } from "react";
import { expect, test } from "vite-plus/test";

import { Button } from "@/components/primitives/button";
import { Field, FieldLabel } from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/primitives/popover";

import { addressOf, ambiguousIn, fold } from "./agent-names.ts";
import type { Named } from "./agent-names.ts";

const agent = createAgent({ allow: () => false });

const namedOnPage = (): Named[] =>
  agent
    .snapshot()
    .flatMap(({ actions, component, label, offPage, row }) =>
      component === "more" || offPage === true || (label?.trim() ?? "") === ""
        ? []
        : [{ actions, component, label: label?.trim() ?? "", row }]
    );

async function bridgeFindsMany(entry: Named) {
  const results = await Promise.all(
    entry.actions.map(
      async (action) =>
        await agent.act({ steps: [{ action, ref: addressOf(entry) }] })
    )
  );
  return results.some((result) =>
    /names \d+ components/u.test(result.error?.message ?? "")
  );
}

async function ambiguityOf(ui: ReactNode) {
  render(ui);
  const named = namedOnPage();
  const flagged = new Set(
    ambiguousIn(named).map((clash) =>
      fold(/^"(?<address>.+?)"(?:×| in ")/u.exec(clash)?.groups?.address ?? "")
    )
  );
  return await Promise.all(
    named.map(async (entry) => ({
      address: addressOf(entry),
      bridge: await bridgeFindsMany(entry),
      copy: flagged.has(fold(addressOf(entry))),
    }))
  );
}

function expectAmbiguous(
  seen: Awaited<ReturnType<typeof ambiguityOf>>,
  expected: Record<string, boolean>
) {
  expect(
    seen.map(({ address, bridge }) => ({ address, ambiguous: bridge }))
  ).toEqual(seen.map(({ address, copy }) => ({ address, ambiguous: copy })));
  expect(
    Object.fromEntries(seen.map(({ address, copy }) => [address, copy]))
  ).toEqual(expected);
}

const field = (label: string) => (
  <Field key={label}>
    <FieldLabel>{label}</FieldLabel>
    <Input />
  </Field>
);

test("accents and ß fold away, so Résumé and resume are one name", async () => {
  expectAmbiguous(
    await ambiguityOf(
      <>
        <Button>Résumé</Button>
        <Button>resume</Button>
        <Button>Straße</Button>
        <Button>Über</Button>
      </>
    ),
    { resume: true, Résumé: true, Straße: false, Über: false }
  );
});

test("Name is a word inside Display name", async () => {
  expectAmbiguous(
    await ambiguityOf(
      <>
        {field("Name")}
        {field("Display name")}
      </>
    ),
    { "Display name": false, Name: true }
  );
});

test("Name is not a word inside Username", async () => {
  expectAmbiguous(
    await ambiguityOf(
      <>
        {field("Name")}
        {field("Username")}
      </>
    ),
    { Name: false, Username: false }
  );
});

test("a row's text makes the address, so Remove in two rows isn't ambiguous", async () => {
  expectAmbiguous(
    await ambiguityOf(
      <ul>
        <li>
          Ada <Button>Remove</Button>
        </li>
        <li>
          Grace <Button>Remove</Button>
        </li>
      </ul>
    ),
    { "Remove Ada": false, "Remove Grace": false }
  );
});

test("a trigger and its popup share a name without being ambiguous", async () => {
  expectAmbiguous(
    await ambiguityOf(
      <Popover defaultOpen>
        <PopoverTrigger>Dimensions</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Dimensions</PopoverTitle>
        </PopoverContent>
      </Popover>
    ),
    { Dimensions: false }
  );
});

test("two buttons with one label are ambiguous", async () => {
  expectAmbiguous(
    await ambiguityOf(
      <>
        <Button>Save</Button>
        <Button>Save</Button>
      </>
    ),
    { Save: true }
  );
});

test("a punctuation-only label is only its own name", async () => {
  expectAmbiguous(
    await ambiguityOf(
      <>
        <Button>…</Button>
        <Button>Save</Button>
      </>
    ),
    { "…": false, Save: false }
  );
});

test.fails("ø and ł fold like the bridge's collator", async () => {
  expectAmbiguous(
    await ambiguityOf(
      <>
        <Button>Søren</Button>
        <Button>Soren</Button>
        <Button>Łódź</Button>
        <Button>Lodz</Button>
      </>
    ),
    { Lodz: true, Łódź: true, Soren: true, Søren: true }
  );
});
