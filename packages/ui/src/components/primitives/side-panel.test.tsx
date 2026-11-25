import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { Button } from "./button";
import { Item, ItemContent, ItemDescription, ItemTitle } from "./item";
import {
  createSidePanelController,
  SidePanel,
  SidePanelBody,
  SidePanelContent,
  SidePanelDescription,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelSlot,
  SidePanelTitle,
  SidePanelTrigger,
} from "./side-panel";

const agent = createAgent();

interface Event {
  actor: string;
  name: string;
}

const events: Event[] = [
  { actor: "ana@acme.com", name: "Signed in" },
  { actor: "ben@acme.com", name: "Changed model" },
];

const activity = createSidePanelController<Event>();

function Activity({ keepMounted = false }: { keepMounted?: boolean }) {
  return (
    <div data-testid="row">
      <div data-testid="page">
        {events.map((event) => (
          <Item
            key={event.name}
            render={<SidePanelTrigger controller={activity} payload={event} />}
            size="sm"
          >
            <ItemContent>
              <ItemTitle>{event.name} row</ItemTitle>
              <ItemDescription>{event.actor}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>
      <SidePanel controller={activity}>
        <SidePanelSlot data-testid="slot">
          <SidePanelContent<Event>
            aria-label="Event details"
            keepMounted={keepMounted}
          >
            {({ payload }) => (
              <>
                <SidePanelHeader>
                  <SidePanelTitle>{payload?.name}</SidePanelTitle>
                </SidePanelHeader>
                <SidePanelBody>
                  <SidePanelDescription>
                    From {payload?.actor}
                  </SidePanelDescription>
                </SidePanelBody>
                <SidePanelFooter>
                  <Button variant="outline">Copy event ID</Button>
                </SidePanelFooter>
              </>
            )}
          </SidePanelContent>
        </SidePanelSlot>
      </SidePanel>
    </div>
  );
}

const row = (name: string) =>
  screen.getByRole("button", {
    name: `${name} row ${events.find((event) => event.name === name)?.actor}`,
  });

async function openRow(name = "Signed in") {
  fireEvent.click(row(name));
  return await screen.findByRole("dialog", { name });
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

test("a row rendered as the trigger keeps the item's size rules", () => {
  render(<Activity />);

  const trigger = row("Signed in");
  expect(trigger.dataset.slot).toBe("dialog-trigger");
  expect(trigger.matches("[data-item][data-size='sm']")).toBe(true);
});

test("another row takes the open panel over: it shows that row's payload, and the open mark moves", async () => {
  render(<Activity />);
  await openRow();
  expect(Object.hasOwn(row("Signed in").dataset, "open")).toBe(true);

  await openRow("Changed model");

  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  expect(screen.getByRole("dialog").textContent).toContain("ben@acme.com");
  expect(Object.hasOwn(row("Signed in").dataset, "open")).toBe(false);
  expect(Object.hasOwn(row("Changed model").dataset, "open")).toBe(true);
});

test("Close shuts it, leaves the slot empty and returns focus to the row that opened it last", async () => {
  render(<Activity />);
  await openRow();
  await openRow("Changed model");
  fireEvent.click(screen.getByRole("button", { name: "Close" }));

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  expect(screen.getByTestId("slot").childElementCount).toBe(0);
  expect(document.activeElement).toBe(row("Changed model"));
});

test("a press on the page beside it leaves it open", async () => {
  render(<Activity />);
  await openRow();
  const page = screen.getByTestId("page");
  fireEvent.pointerDown(page);
  fireEvent.pointerUp(page);
  fireEvent.click(page);

  expect(screen.getByRole("dialog")).toBeTruthy();
});

test("the header ends in a Close button with the X and its own slot", async () => {
  render(<Activity />);
  await openRow();

  const close = screen.getByRole("button", { name: "Close" });
  expect(close.dataset.slot).toBe("side-panel-close-button");
  expect(close.querySelector("svg")).not.toBeNull();
  expect(close.parentElement?.lastElementChild).toBe(close);
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
  const other = row("Changed model");
  other.focus();
  const escape = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    key: "Escape",
  });
  other.dispatchEvent(escape);

  expect(screen.getByRole("dialog")).toBeTruthy();
  expect(escape.defaultPrevented).toBe(true);
});

test("kept mounted, the closed panel is named, and an agent opens a row by its words", async () => {
  render(<Activity keepMounted />);
  const closed = agent
    .snapshot()
    .find((entry) => entry.component === "dialog" && entry.offPage !== true);
  expect(closed?.label).toBe("Event details");

  const opened = await agent.act({
    steps: [{ action: "press", args: ["Changed model"], ref: "Event details" }],
  });
  expect(opened.ok, opened.error?.message).toBe(true);
  await screen.findByRole("dialog", { name: "Changed model" });

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
  for (const label of ["Changed model", "Close", "Copy event ID"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const pressed = await agent.act({
    steps: [{ action: "press", args: ["Close"], ref: "Changed model" }],
  });
  expect(pressed.ok, pressed.error?.message).toBe(true);
  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
