import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { expect, test } from "vite-plus/test";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";

const agent = createAgent();

function Order() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Order #4189</CollapsibleTrigger>
      <CollapsibleContent>Shipped to Lisbon</CollapsibleContent>
    </Collapsible>
  );
}

// jsdom events are untrusted, so ui-sdk reports every source as programmatic; the keyboard snap needs a browser.
test("a press opens and closes the content, with no instant flag", async () => {
  render(<Order />);
  const trigger = screen.getByRole("button", { name: "Order #4189" });
  expect(screen.queryByText("Shipped to Lisbon")).toBeNull();

  fireEvent.click(trigger);

  const content = await screen.findByText("Shipped to Lisbon");
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  expect(Object.hasOwn(trigger.dataset, "collapsibleInstant")).toBe(false);
  expect(Object.hasOwn(content.dataset, "collapsibleInstant")).toBe(false);

  fireEvent.click(trigger);

  await waitFor(() => {
    expect(screen.queryByText("Shipped to Lisbon")).toBeNull();
  });
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
});

test("a controlled open follows onOpenChange", async () => {
  const changes: boolean[] = [];
  function Controlled() {
    const [open, setOpen] = useState(false);
    return (
      <Collapsible
        onOpenChange={(next) => {
          changes.push(next);
          setOpen(next);
        }}
        open={open}
      >
        <CollapsibleTrigger>Order #4189</CollapsibleTrigger>
        <CollapsibleContent>Shipped to Lisbon</CollapsibleContent>
      </Collapsible>
    );
  }
  render(<Controlled />);

  fireEvent.click(screen.getByRole("button", { name: "Order #4189" }));

  expect(await screen.findByText("Shipped to Lisbon")).toBeTruthy();
  expect(changes).toEqual([true]);
});

test("an agent finds each collapsible by its trigger and opens it", async () => {
  render(
    <>
      <Order />
      <Collapsible>
        <CollapsibleTrigger>Gift options</CollapsibleTrigger>
        <CollapsibleContent>Add a message</CollapsibleContent>
      </Collapsible>
    </>
  );

  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(entries.map((entry) => entry.label)).toEqual([
    "Order #4189",
    "Gift options",
  ]);

  const result = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "Order #4189" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(await screen.findByText("Shipped to Lisbon")).toBeTruthy();
});
