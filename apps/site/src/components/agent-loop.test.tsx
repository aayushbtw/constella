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
const { AgentLoop } = await import("./agent-loop");

const turnOn = {
  steps: [{ action: "setChecked", args: [true], ref: "Airplane mode" }],
};

function Settings() {
  return (
    <>
      <div data-agent-confirm="Cuts every connection.">
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

function Page({ open = false }: { open?: boolean }) {
  return (
    <>
      <Settings />
      <AgentLoop onOpenChange={() => {}} open={open} path="/" />
    </>
  );
}

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
  expect(dialog.textContent).toContain("Cuts every connection.");
  expect(dialog.textContent).toContain("Airplane mode");
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
  render(<Page open />);
  const undo = await screen.findByRole("button", {
    name: "Undo assistant changes (0)",
  });
  expect(undo.hasAttribute("disabled")).toBe(true);
  expect(screen.getByText("No assistant changes")).toBeTruthy();

  const result = await agent.act({
    steps: [{ action: "setChecked", args: [true], ref: "Weekly digest" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  fireEvent.click(screen.getByRole("switch", { name: "Dark mode" }));
  expect(checked("Dark mode")).toBe("true");

  const panel = within(
    screen.getByRole("dialog", { name: "Assistant activity" })
  );
  expect(await panel.findByText("Weekly digest")).toBeTruthy();
  expect(panel.getByText(/false → true/u)).toBeTruthy();
  expect(panel.queryByText("Dark mode")).toBeNull();
  fireEvent.click(
    await screen.findByRole("button", { name: "Undo assistant changes (1)" })
  );

  await screen.findByRole("button", { name: "Undo assistant changes (0)" });
  expect(checked("Weekly digest")).toBe("false");
  expect(checked("Dark mode")).toBe("true");
});

test("the panel lists changes the assistant made while it was shut", async () => {
  const { rerender } = render(<Page />);

  await agent.act({
    steps: [{ action: "setChecked", args: [true], ref: "Weekly digest" }],
  });
  rerender(<Page open />);

  const panel = within(
    await screen.findByRole("dialog", { name: "Assistant activity" })
  );
  expect(await panel.findByText("Weekly digest")).toBeTruthy();
});
