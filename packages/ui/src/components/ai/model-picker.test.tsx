import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { expect, test, vi } from "vite-plus/test";

import {
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandList,
} from "@/components/primitives/command";

import {
  ModelPicker,
  ModelPickerCommand,
  ModelPickerContent,
  ModelPickerItem,
  ModelPickerTrigger,
} from "./model-picker";

const agent = createAgent();

const models = ["Claude Opus", "GPT-5"];

// The skip must be in the DOM when onOpenChange fires; see useSkipMotion in motion.ts.
async function openPicker() {
  const onPick = vi.fn<(model: string) => void>();
  const skipOnClose: boolean[] = [];
  render(
    <ModelPicker
      onOpenChange={(open) => {
        if (!open) {
          skipOnClose.push(
            Object.hasOwn(screen.getByRole("dialog").dataset, "skipMotion")
          );
        }
      }}
    >
      <ModelPickerTrigger>Pick a model</ModelPickerTrigger>
      <ModelPickerContent>
        <ModelPickerCommand>
          <CommandInput aria-label="Search models" />
          <CommandList>
            {models.map((model) => (
              <ModelPickerItem
                key={model}
                onSelect={() => {
                  onPick(model);
                }}
                value={model}
              >
                {model}
              </ModelPickerItem>
            ))}
          </CommandList>
        </ModelPickerCommand>
      </ModelPickerContent>
    </ModelPicker>
  );
  fireEvent.click(screen.getByRole("button", { name: "Pick a model" }));
  await screen.findByRole("option", { name: "GPT-5" });
  return { onPick, skipOnClose };
}

async function expectPickedAndClosed({
  onPick,
  skipOnClose,
}: Awaited<ReturnType<typeof openPicker>>) {
  await waitFor(() => {
    expect(screen.queryByRole("option")).toBeNull();
  });
  expect(onPick.mock.calls).toEqual([["GPT-5"]]);
  expect(skipOnClose).toEqual([true]);
}

test("clicking a model runs its onSelect and closes the picker with no exit motion", async () => {
  const picker = await openPicker();

  fireEvent.click(screen.getByRole("option", { name: "GPT-5" }));

  await expectPickedAndClosed(picker);
});

test("Enter on the highlighted model runs its onSelect and closes the picker with no exit motion", async () => {
  const picker = await openPicker();
  const input = screen.getByRole("combobox", { name: "Search models" });
  fireEvent.change(input, { target: { value: "gpt" } });
  await waitFor(() => {
    expect(
      Object.hasOwn(
        screen.getByRole("option", { name: "GPT-5" }).dataset,
        "highlighted"
      )
    ).toBe(true);
  });

  fireEvent.keyDown(input, { key: "Enter" });

  await expectPickedAndClosed(picker);
});

const catalog = [
  { label: "Claude Opus", value: "claude-opus" },
  { label: "GPT-5", value: "gpt-5" },
  { label: "Gemini Pro", value: "gemini-pro" },
];

function Picker({ onPick }: { onPick?: (model: string) => void }) {
  const [value, setValue] = useState("gpt-5");
  const [highlighted, setHighlighted] = useState<string | null>("claude-opus");
  const picked = catalog.find((model) => model.value === value);
  return (
    <ModelPicker>
      <ModelPickerTrigger>{picked?.label}</ModelPickerTrigger>
      <ModelPickerContent>
        <ModelPickerCommand onValueChange={setHighlighted} value={highlighted}>
          <CommandInput aria-label="Search models" />
          <CommandEmpty>No models found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <CommandGroupLabel>Models</CommandGroupLabel>
              {catalog.map((model) => (
                <ModelPickerItem
                  key={model.value}
                  onSelect={() => {
                    setValue(model.value);
                    onPick?.(model.value);
                  }}
                  selected={model.value === value}
                  value={model.value}
                >
                  {model.label}
                </ModelPickerItem>
              ))}
            </CommandGroup>
          </CommandList>
        </ModelPickerCommand>
      </ModelPickerContent>
    </ModelPicker>
  );
}

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

function expectNamed(labels: string[]) {
  for (const entry of entries()) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const found = entries().map((entry) => entry.label);
  for (const label of labels) {
    expect(found, `${label} is missing from the snapshot`).toContain(label);
  }
}

test("an agent opens the picker, finds its search by name and picks a model", async () => {
  const onPick = vi.fn<(model: string) => void>();
  render(<Picker onPick={onPick} />);
  expectNamed(["GPT-5"]);

  const opened = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "GPT-5" }],
  });
  expect(opened.ok, opened.error?.message).toBe(true);
  expectNamed(["GPT-5", "Search models"]);

  const result = await agent.act({
    steps: [{ action: "run", args: ["Claude Opus"], ref: "Search models" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(onPick.mock.calls).toEqual([["claude-opus"]]);
  await waitFor(() => {
    expect(screen.queryByRole("option")).toBeNull();
  });
  expect(
    screen
      .getByRole("button", { name: "Claude Opus" })
      .getAttribute("aria-expanded")
  ).toBe("false");
});
