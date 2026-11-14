import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, test } from "vite-plus/test";

import {
  CommandCollection,
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

const models = ["Claude Opus", "GPT-5"];

// The skip must be in the DOM when onOpenChange fires; see useSkipMotion in motion.ts.
test("picking a model closes the picker with no exit motion", async () => {
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
        <ModelPickerCommand items={models}>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            <CommandCollection>
              {(model: string) => (
                <ModelPickerItem key={model} value={model}>
                  {model}
                </ModelPickerItem>
              )}
            </CommandCollection>
          </CommandList>
        </ModelPickerCommand>
      </ModelPickerContent>
    </ModelPicker>
  );
  fireEvent.click(screen.getByRole("button", { name: "Pick a model" }));
  fireEvent.click(await screen.findByRole("option", { name: "GPT-5" }));

  await waitFor(() => {
    expect(screen.queryByRole("option")).toBeNull();
  });
  expect(skipOnClose).toEqual([true]);
});
