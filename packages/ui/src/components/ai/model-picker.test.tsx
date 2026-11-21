import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import type { PopoverProps } from "@ui-sdk/react/popover";
import { useState } from "react";
import type { ComponentProps } from "react";
import { expect, test, vi } from "vite-plus/test";

import {
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItemText,
  CommandList,
} from "@/components/primitives/command";
import type { CommandProps } from "@/components/primitives/command";

import {
  ModelPicker,
  ModelPickerCommand,
  ModelPickerContent,
  ModelPickerDetails,
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
                <CommandItemText />
              </ModelPickerItem>
            ))}
          </CommandList>
        </ModelPickerCommand>
      </ModelPickerContent>
    </ModelPicker>
  );
  fireEvent.click(screen.getByRole("button", { name: "Model: Pick a model" }));
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

function Picker({
  label,
  onPick,
}: {
  label?: string;
  onPick?: (model: string) => void;
}) {
  const [value, setValue] = useState("gpt-5");
  const [highlighted, setHighlighted] = useState<string | null>("claude-opus");
  const picked = catalog.find((model) => model.value === value);
  return (
    <ModelPicker>
      <ModelPickerTrigger label={label}>{picked?.label}</ModelPickerTrigger>
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
                  label={model.label}
                  onSelect={() => {
                    setValue(model.value);
                    onPick?.(model.value);
                  }}
                  selected={model.value === value}
                  value={model.value}
                >
                  <CommandItemText />
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
  expectNamed(["Model: GPT-5"]);
  expect(screen.getByRole("button", { name: "Model: GPT-5" })).toBeDefined();

  const opened = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "GPT-5" }],
  });
  expect(opened.ok, opened.error?.message).toBe(true);
  expectNamed(["Model: GPT-5", "Search models"]);

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
      .getByRole("button", { name: "Model: Claude Opus" })
      .getAttribute("aria-expanded")
  ).toBe("false");
});

test("two pickers named by their labels each open by name, and only their own", async () => {
  render(
    <>
      <Picker />
      <Picker label="Fallback" />
    </>
  );
  const model = screen.getByRole("button", { name: "Model: GPT-5" });
  const fallback = screen.getByRole("button", { name: "Fallback: GPT-5" });

  const opened = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "Model" }],
  });
  expect(opened.ok, opened.error?.message).toBe(true);
  expect(model.getAttribute("aria-expanded")).toBe("true");
  expect(fallback.getAttribute("aria-expanded")).toBe("false");

  const swapped = await agent.act({
    steps: [
      { action: "setOpen", args: [false], ref: "Model" },
      { action: "setOpen", args: [true], ref: "Fallback" },
    ],
  });
  expect(swapped.ok, swapped.error?.message).toBe(true);
  expect(model.getAttribute("aria-expanded")).toBe("false");
  expect(fallback.getAttribute("aria-expanded")).toBe("true");
});

function UncontrolledPicker({
  keepMounted,
  onOpenChange,
  onSelect,
  onValueChange,
}: {
  keepMounted?: boolean;
  onOpenChange?: PopoverProps["onOpenChange"];
  onSelect?: ComponentProps<typeof ModelPickerItem>["onSelect"];
  onValueChange?: CommandProps["onValueChange"];
}) {
  return (
    <ModelPicker onOpenChange={onOpenChange}>
      <ModelPickerTrigger>Pick a model</ModelPickerTrigger>
      <ModelPickerContent keepMounted={keepMounted}>
        <ModelPickerCommand onValueChange={onValueChange}>
          <CommandInput aria-label="Search models" />
          <CommandList>
            {catalog.map((model) => (
              <ModelPickerItem
                key={model.value}
                onSelect={onSelect}
                value={model.value}
              >
                {model.label}
              </ModelPickerItem>
            ))}
          </CommandList>
        </ModelPickerCommand>
        <ModelPickerDetails>Model details</ModelPickerDetails>
      </ModelPickerContent>
    </ModelPicker>
  );
}

async function openUncontrolled() {
  fireEvent.click(screen.getByRole("button", { name: "Model: Pick a model" }));
  await screen.findByRole("option", { name: "GPT-5" });
}

const highlighted = () =>
  screen
    .getAllByRole("option")
    .filter((option) => Object.hasOwn(option.dataset, "highlighted"))
    .map((option) => option.textContent);

const gpt5 = () => screen.getByRole("option", { hidden: true, name: "GPT-5" });

test("an agent's highlight reaches onValueChange as the agent's, and its cancel keeps the highlight", async () => {
  const seen: [string | null, string][] = [];
  render(
    <UncontrolledPicker
      onValueChange={(value, details) => {
        seen.push([value, details.source]);
        if (details.source === "agent") {
          details.cancel();
        }
      }}
    />
  );
  await openUncontrolled();
  expect(highlighted()).toEqual(["Claude Opus"]);

  const result = await agent.act({
    steps: [{ action: "setValue", args: ["gpt-5"], ref: "Search models" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(seen).toContainEqual(["gpt-5", "agent"]);
  expect(highlighted()).toEqual(["Claude Opus"]);
});

test("an arrow-key highlight shows the details card", async () => {
  render(<UncontrolledPicker />);
  await openUncontrolled();

  fireEvent.keyDown(screen.getByRole("combobox", { name: "Search models" }), {
    key: "ArrowDown",
  });

  expect(highlighted()).toEqual(["GPT-5"]);
  const details = screen.getByText("Model details");
  expect(
    screen
      .getByRole("option", { name: "GPT-5" })
      .getAttribute("aria-describedby")
  ).toBe(details.id);
});

test("a consumer that cancels an arrow-key highlight keeps the details card hidden", async () => {
  const reasons: string[] = [];
  render(
    <UncontrolledPicker
      onValueChange={(_value, details) => {
        if (details.reason === "list-navigation") {
          reasons.push(details.reason);
          details.cancel();
        }
      }}
    />
  );
  await openUncontrolled();

  fireEvent.keyDown(screen.getByRole("combobox", { name: "Search models" }), {
    key: "ArrowDown",
  });

  expect(reasons).toEqual(["list-navigation"]);
  expect(highlighted()).toEqual(["Claude Opus"]);
  expect(screen.queryByText("Model details")).toBeNull();
  for (const option of screen.getAllByRole("option")) {
    expect(option.getAttribute("aria-describedby")).toBeNull();
  }
});

test("an agent's pick closes the picker as the agent's", async () => {
  const closes: string[] = [];
  render(
    <UncontrolledPicker
      onOpenChange={(open, details) => {
        if (!open) {
          closes.push(details.source);
        }
      }}
    />
  );
  await openUncontrolled();

  const result = await agent.act({
    steps: [{ action: "run", args: ["GPT-5"], ref: "Search models" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  await waitFor(() => {
    expect(screen.queryByRole("option")).toBeNull();
  });
  expect(closes).toEqual(["agent"]);
});

test("a Promise from onSelect keeps the model pending until it settles, and a reopened picker isn't", async () => {
  const { promise, resolve } = Promise.withResolvers<null>();
  render(
    <UncontrolledPicker keepMounted onSelect={async () => await promise} />
  );
  await openUncontrolled();

  fireEvent.click(gpt5());
  await waitFor(() => {
    expect(screen.queryByRole("option")).toBeNull();
  });
  expect(Object.hasOwn(gpt5().dataset, "pending")).toBe(true);

  await act(async () => {
    resolve(null);
    await promise;
  });
  expect(Object.hasOwn(gpt5().dataset, "pending")).toBe(false);

  await openUncontrolled();
  expect(Object.hasOwn(gpt5().dataset, "pending")).toBe(false);
});
