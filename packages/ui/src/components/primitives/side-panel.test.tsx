import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { expect, test } from "vite-plus/test";

import { Button } from "./button";
import {
  SidePanel,
  SidePanelBody,
  SidePanelContent,
  SidePanelDescription,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelSlot,
  SidePanelTitle,
} from "./side-panel";

const agent = createAgent();

const events = ["Signed in", "Changed model"];

function Activity() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div data-testid="row">
      <div data-testid="page">
        {events.map((event) => (
          <button
            key={event}
            onClick={() => {
              setSelected(event);
            }}
            type="button"
          >
            {event} row
          </button>
        ))}
      </div>
      <SidePanel
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
          }
        }}
        open={selected !== null}
      >
        <SidePanelSlot data-testid="slot">
          <SidePanelContent>
            <SidePanelHeader>
              <SidePanelTitle>{selected}</SidePanelTitle>
            </SidePanelHeader>
            <SidePanelBody>
              <SidePanelDescription>From ana@acme.com</SidePanelDescription>
            </SidePanelBody>
            <SidePanelFooter>
              <Button variant="outline">Copy event ID</Button>
            </SidePanelFooter>
          </SidePanelContent>
        </SidePanelSlot>
      </SidePanel>
    </div>
  );
}

async function openRow(event = "Signed in") {
  fireEvent.click(screen.getByRole("button", { name: `${event} row` }));
  return await screen.findByRole("dialog", { name: event });
}

test("the panel opens inside its slot, in the page's flow, named by its title and described by its description", async () => {
  render(<Activity />);
  const panel = await openRow();

  expect(panel.parentElement).toBe(screen.getByTestId("slot"));
  expect(panel.hasAttribute("popover")).toBe(false);
  expect(panel.hasAttribute("aria-modal")).toBe(false);
  expect(panel.dataset.slot).toBe("dialog-content");
  expect(panel.getAttribute("aria-describedby")).toBe(
    screen.getByText("From ana@acme.com").id
  );
});

test("picking another row leaves it open and swaps what it shows", async () => {
  render(<Activity />);
  await openRow();
  await openRow("Changed model");

  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  expect(screen.getByRole("dialog").textContent).toContain("Changed model");
});

test("Close shuts it and leaves the slot empty", async () => {
  render(<Activity />);
  await openRow();
  fireEvent.click(screen.getByRole("button", { name: "Close" }));

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  expect(screen.getByTestId("slot").childElementCount).toBe(0);
});

test("Escape closes it while focus is in it", async () => {
  render(<Activity />);
  await openRow();
  const close = screen.getByRole("button", { name: "Close" });
  close.focus();
  fireEvent.keyDown(close, { key: "Escape" });

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

test("Escape with focus on the page leaves it open, as ui-sdk documents for a non-modal dialog", async () => {
  render(<Activity />);
  await openRow();
  const row = screen.getByRole("button", { name: "Changed model row" });
  row.focus();
  const escape = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: "Escape",
  });
  row.dispatchEvent(escape);

  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(escape.defaultPrevented).toBe(true);
});

test("an agent finds the open panel by its title and names every control inside", async () => {
  render(<Activity />);
  await openRow();

  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const labels = entries.map((entry) => entry.label);
  for (const label of ["Signed in", "Close", "Copy event ID"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const pressed = await agent.act({
    steps: [{ action: "press", args: ["Close"], ref: "Signed in" }],
  });
  expect(pressed.ok, pressed.error?.message).toBe(true);
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
