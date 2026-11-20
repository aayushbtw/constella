import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { AgentStep } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { Label } from "@/components/primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { Switch } from "@/components/primitives/switch";

interface Tool {
  execute: (
    input: { steps: AgentStep[] },
    context?: { signal?: AbortSignal }
  ) => Promise<{ ok: boolean; error?: { message: string } }>;
  name: string;
}

const tools = new Map<string, Tool>();
Object.assign(document, {
  modelContext: {
    registerTool: async (tool: Tool) => {
      tools.set(tool.name, tool);
      await Promise.resolve();
    },
  },
});

const { agent } = await import("~/lib/agent");
const { AgentActivityButton, AgentLoop } = await import("./agent-loop");

const turnOn = {
  steps: [{ action: "setChecked", args: [true], ref: "Airplane mode" }],
};

function Settings() {
  return (
    <>
      <div data-agent-confirm="Cuts every connection">
        <Label>
          <Switch />
          Airplane mode
        </Label>
      </div>
      <Label>
        <Switch />
        Weekly digest
      </Label>
      <Label>
        <Switch />
        Dark mode
      </Label>
    </>
  );
}

function Page({ path = "/" }: { path?: string }) {
  return (
    <>
      <header>
        <Label>
          <Switch />
          Compact header
        </Label>
      </header>
      <main>
        <Settings />
      </main>
      <AgentActivityButton />
      <AgentLoop path={path} />
    </>
  );
}

const activityButton = () =>
  screen.getByRole("button", { name: "Assistant activity" });

const openPanel = async () => {
  fireEvent.click(activityButton());
  return within(
    await screen.findByRole("dialog", { name: "Assistant activity" })
  );
};

const checked = (name: string) =>
  screen.getByRole("switch", { name }).getAttribute("aria-checked");

const askedDialog = async () =>
  await screen.findByRole("alertdialog", { name: "Allow the assistant?" });

async function expectNoDialog() {
  await waitFor(() => {
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });
}

test("with no confirm dialog on the page, a confirm step is refused", async () => {
  render(<Settings />);

  const result = await agent.act(turnOn);

  expect(result.ok).toBe(false);
  expect(checked("Airplane mode")).toBe("false");
});

test("the person refuses a confirm step with Cancel and lets it run with Allow", async () => {
  render(<Page />);

  const refused = agent.act(turnOn);
  const dialog = await askedDialog();
  expect(within(dialog).getByText(/It asked to/u).textContent).toBe(
    "Cuts every connection. It asked to setChecked Airplane mode with true."
  );
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  await expect(refused).resolves.toMatchObject({ ok: false });
  expect(checked("Airplane mode")).toBe("false");
  await expectNoDialog();

  const allowed = agent.act(turnOn);
  await askedDialog();
  fireEvent.click(screen.getByRole("button", { name: "Allow" }));
  const result = await allowed;
  expect(result.ok, result.error?.message).toBe(true);
  expect(checked("Airplane mode")).toBe("true");
});

test("a browser agent's confirm step asks the person once, and runs on Allow", async () => {
  render(<Page />);
  const act = tools.get("act");

  const running = act?.execute(turnOn);
  await askedDialog();
  fireEvent.click(screen.getByRole("button", { name: "Allow" }));
  const result = await running;

  expect(result?.ok, result?.error?.message).toBe(true);
  expect(checked("Airplane mode")).toBe("true");
  expect(screen.queryByRole("alertdialog")).toBeNull();
});

test("a browser agent's confirm step is refused when the person presses Cancel", async () => {
  render(<Page />);

  const running = tools.get("act")?.execute(turnOn);
  await askedDialog();
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

  await expect(running).resolves.toMatchObject({ ok: false });
  expect(checked("Airplane mode")).toBe("false");
  await expectNoDialog();
});

test("with no confirm dialog on the page, a browser agent's confirm step is refused", async () => {
  render(<Settings />);

  const result = await tools.get("act")?.execute(turnOn);

  expect(result?.ok).toBe(false);
  expect(checked("Airplane mode")).toBe("false");
});

test("the agent can't see the confirm dialog, so it can't press Allow for the person", async () => {
  render(<Page />);

  const asking = agent.act(turnOn);
  await askedDialog();
  const seen = JSON.stringify(agent.snapshot());
  for (const word of [
    "Allow",
    "Cancel",
    "alert-dialog",
    "Assistant activity",
    "Undo assistant",
  ]) {
    expect(seen).not.toContain(word);
  }

  const selfAllow = agent.act({ steps: [{ action: "press", ref: "Allow" }] });
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

  await expect(asking).resolves.toMatchObject({ ok: false });
  await expect(selfAllow).resolves.toMatchObject({ ok: false });
  expect(checked("Airplane mode")).toBe("false");
});

test("two confirm steps asked at once each wait for their own answer", async () => {
  render(
    <>
      <main>
        <div data-agent-confirm="Pauses every alert.">
          <Label>
            <Switch />
            Do not disturb
          </Label>
        </div>
      </main>
      <Page />
    </>
  );

  const first = agent.act(turnOn);
  const second = tools.get("act")?.execute({
    steps: [{ action: "setChecked", args: [true], ref: "Do not disturb" }],
  });
  const dialog = await askedDialog();
  expect(dialog.textContent).toContain("Airplane mode");
  fireEvent.click(screen.getByRole("button", { name: "Allow" }));
  const result = await first;
  expect(await Promise.race([second, Promise.resolve("pending")])).toBe(
    "pending"
  );
  expect(result.ok, result.error?.message).toBe(true);
  expect(checked("Airplane mode")).toBe("true");
  expect(checked("Do not disturb")).toBe("false");

  await waitFor(() => {
    expect(
      screen.getByRole("alertdialog", { name: "Allow the assistant?" })
        .textContent
    ).toContain("Do not disturb");
  });
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  await expect(second).resolves.toMatchObject({ ok: false });
  expect(checked("Do not disturb")).toBe("false");
});

const regions = [
  { label: "Europe", value: "europe" },
  { label: "North America", value: "north-america" },
];

function RegionPicker() {
  return (
    <div data-agent-confirm="Moves your data to another region.">
      <Select defaultValue="europe" items={regions}>
        <SelectLabel>Region</SelectLabel>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {regions.map((region) => (
            <SelectItem key={region.value} value={region.value}>
              {region.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

test("an agent setting a marked Select by an item's label asks the person once, with the item's value", async () => {
  render(
    <>
      <main>
        <RegionPicker />
      </main>
      <AgentLoop path="/" />
    </>
  );

  const running = agent.act({
    steps: [{ action: "setValue", args: ["North America"], ref: "Region" }],
  });
  const dialog = await askedDialog();
  expect(within(dialog).getByText(/It asked to/u).textContent).toBe(
    "Moves your data to another region. It asked to setValue Region with north-america."
  );
  fireEvent.click(screen.getByRole("button", { name: "Allow" }));
  await expectNoDialog();

  const askedAgain = await Promise.race([
    askedDialog(),
    running.then(() => null),
  ]);
  expect(askedAgain).toBeNull();
  const result = await running;
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen.getByRole("combobox", { name: "Region" }).textContent
  ).toContain("North America");
});

test("a step that stops waiting closes the dialog and doesn't run", async () => {
  render(<Page />);
  const stop = new AbortController();

  const running = tools.get("act")?.execute(turnOn, { signal: stop.signal });
  await askedDialog();
  stop.abort();

  await expectNoDialog();
  await expect(running).resolves.toMatchObject({ ok: false });
  expect(checked("Airplane mode")).toBe("false");
});

test("undo puts back the assistant's change and keeps the person's", async () => {
  render(<Page />);
  const panel = await openPanel();
  const undo = await panel.findByRole("button", {
    name: "Undo assistant changes (0)",
  });
  expect(undo.getAttribute("aria-disabled")).toBe("true");
  expect(screen.getByText("No assistant changes")).toBeTruthy();

  const result = await agent.act({
    steps: [{ action: "setChecked", args: [true], ref: "Weekly digest" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  fireEvent.click(screen.getByRole("switch", { name: "Dark mode" }));
  expect(checked("Dark mode")).toBe("true");

  expect(await panel.findByText("Weekly digest")).toBeTruthy();
  expect(panel.getByText(/false → true/u)).toBeTruthy();
  expect(panel.queryByText("Dark mode")).toBeNull();
  const undoOne = await panel.findByRole("button", {
    name: "Undo assistant changes (1)",
  });
  undoOne.focus();
  fireEvent.click(undoOne);

  const done = await panel.findByRole("button", {
    name: "Undo assistant changes (0)",
  });
  expect(checked("Weekly digest")).toBe("false");
  expect(checked("Dark mode")).toBe("true");
  expect(panel.getAllByText("Weekly digest")).toHaveLength(1);
  expect(panel.getByText("Undone")).toBeTruthy();
  expect(panel.queryByText(/true → false/u)).toBeNull();
  expect(done.getAttribute("aria-disabled")).toBe("true");
  expect(done.hasAttribute("disabled")).toBe(false);
  expect(document.activeElement).toBe(done);
  fireEvent.keyDown(done, { key: "Escape" });
  await waitFor(() => {
    expect(
      screen.queryByRole("dialog", { name: "Assistant activity" })
    ).toBeNull();
  });
});

test("the panel lists changes the assistant made while it was shut", async () => {
  render(<Page />);

  await agent.act({
    steps: [{ action: "setChecked", args: [true], ref: "Weekly digest" }],
  });

  const panel = await openPanel();
  expect(await panel.findByText("Weekly digest")).toBeTruthy();
});

test("a change outside the page's main isn't listed in the panel", async () => {
  render(<Page />);

  const result = await agent.act({
    steps: [
      { action: "setChecked", args: [true], ref: "Compact header" },
      { action: "setChecked", args: [true], ref: "Weekly digest" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);

  const panel = await openPanel();
  expect(await panel.findByText("Weekly digest")).toBeTruthy();
  expect(panel.queryByText("Compact header")).toBeNull();
  expect(
    await panel.findByRole("button", { name: "Undo assistant changes (1)" })
  ).toBeTruthy();
});

test("a new page starts the panel empty", async () => {
  const { rerender } = render(<Page path="/" />);

  const result = await agent.act({
    steps: [{ action: "setChecked", args: [true], ref: "Weekly digest" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  rerender(<Page path="/other" />);

  const panel = await openPanel();
  expect(await panel.findByText("No assistant changes")).toBeTruthy();
  expect(
    await panel.findByRole("button", { name: "Undo assistant changes (0)" })
  ).toBeTruthy();
});

test("the activity button opens and closes the panel, and focus comes back to it", async () => {
  render(<Page />);
  expect(activityButton().getAttribute("aria-haspopup")).toBe("dialog");
  expect(activityButton().getAttribute("aria-expanded")).toBe("false");

  await openPanel();
  expect(activityButton().getAttribute("aria-expanded")).toBe("true");
  fireEvent.click(activityButton());
  await waitFor(() => {
    expect(
      screen.queryByRole("dialog", { name: "Assistant activity" })
    ).toBeNull();
  });
  expect(activityButton().getAttribute("aria-expanded")).toBe("false");

  const panel = await openPanel();
  fireEvent.keyDown(panel.getByRole("button", { name: /Undo assistant/u }), {
    key: "Escape",
  });
  await waitFor(() => {
    expect(
      screen.queryByRole("dialog", { name: "Assistant activity" })
    ).toBeNull();
  });
  expect(activityButton().getAttribute("aria-expanded")).toBe("false");
  await waitFor(() => {
    expect(document.activeElement).toBe(activityButton());
  });
});
