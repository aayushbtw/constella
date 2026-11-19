import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vite-plus/test";

import { CommandInput, CommandList } from "@/components/primitives/command";

import {
  ModelPicker,
  ModelPickerCommand,
  ModelPickerContent,
  ModelPickerItem,
  ModelPickerTrigger,
} from "./model-picker";

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
