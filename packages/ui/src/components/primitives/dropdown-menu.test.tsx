import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test, vi } from "vite-plus/test";

import {
  createDropdownMenuController,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const agent = createAgent();

function Account({
  keepMounted,
  onBilling,
}: {
  keepMounted?: boolean;
  onBilling?: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent keepMounted={keepMounted} size="sm">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem shortcut="mod+shift+p">Profile</DropdownMenuItem>
          <DropdownMenuItem onSelect={onBilling}>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem value="status-bar">
          Status Bar
        </DropdownMenuCheckboxItem>
        <DropdownMenuRadioGroup defaultValue="top">
          <DropdownMenuLabel>Position</DropdownMenuLabel>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email</DropdownMenuItem>
            <DropdownMenuItem>Message</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function open() {
  fireEvent.click(screen.getByRole("button", { name: "Open" }));
  return await screen.findByRole("menu");
}

function tick(item: HTMLElement) {
  return item.querySelector<HTMLElement>("[data-slot='menu-item-indicator']");
}

// A skipped close finishes in the same task under jsdom, so the attribute is gone before a waitFor looks.
function watchSkipMotion(element: HTMLElement) {
  let added = false;
  const observer = new MutationObserver((records) => {
    added ||= records.some((record) => record.oldValue === null);
  });
  observer.observe(element, {
    attributeFilter: ["data-skip-motion"],
    attributeOldValue: true,
  });
  return () => added;
}

test("the trigger opens a sized menu", async () => {
  render(<Account />);
  const menu = await open();

  expect(menu.dataset).toMatchObject({ size: "sm", slot: "menu-content" });
});

test("a pointer pick runs onSelect and closes the menu without motion", async () => {
  const onBilling = vi.fn<() => void>();
  render(<Account keepMounted onBilling={onBilling} />);
  const menu = await open();
  expect(Object.hasOwn(menu.dataset, "skipMotion")).toBe(false);

  const skipped = watchSkipMotion(menu);
  fireEvent.click(screen.getByRole("menuitem", { name: "Billing" }));

  expect(onBilling).toHaveBeenCalledOnce();
  await waitFor(() => {
    expect(Object.hasOwn(menu.dataset, "closed")).toBe(true);
  });
  expect(skipped()).toBe(true);
});

test("checkbox and radio items toggle, keep the menu open and keep their tick mounted", async () => {
  render(<Account />);
  const menu = await open();
  const checkbox = screen.getByRole("menuitemcheckbox", { name: "Status Bar" });
  const bottom = screen.getByRole("menuitemradio", { name: "Bottom" });
  const top = screen.getByRole("menuitemradio", { name: "Top" });

  expect(tick(checkbox)?.dataset).toHaveProperty("unchecked");
  fireEvent.click(checkbox);
  expect(checkbox.getAttribute("aria-checked")).toBe("true");
  expect(tick(checkbox)?.dataset).toHaveProperty("checked");
  fireEvent.click(checkbox);
  expect(checkbox.getAttribute("aria-checked")).toBe("false");
  expect(tick(checkbox)?.dataset).toHaveProperty("unchecked");

  fireEvent.click(bottom);
  expect(bottom.getAttribute("aria-checked")).toBe("true");
  expect(tick(top)?.dataset).toHaveProperty("unchecked");

  expect(menu.isConnected).toBe(true);
  expect(screen.getByRole("menu")).toBe(menu);
});

test("ArrowRight opens a submenu at the parent's size, and ArrowLeft closes it", async () => {
  render(<Account />);
  await open();
  const subTrigger = screen.getByRole("menuitem", { name: "Invite users" });
  const chevron = subTrigger.querySelector<HTMLElement>(
    "[data-slot='menu-item-icon']"
  );
  expect(chevron?.dataset).toHaveProperty("mirror");
  expect(chevron?.getAttribute("aria-hidden")).toBe("true");

  subTrigger.focus();
  fireEvent.keyDown(subTrigger, { key: "ArrowRight" });
  const submenu = await screen.findByRole("menu", { name: "Invite users" });
  expect(submenu.dataset).toMatchObject({ size: "sm", slot: "menu-content" });
  expect(Object.hasOwn(subTrigger.dataset, "open")).toBe(true);

  fireEvent.keyDown(document.activeElement ?? submenu, { key: "ArrowLeft" });
  await waitFor(() => {
    expect(screen.queryByRole("menu", { name: "Invite users" })).toBeNull();
  });
  expect(document.activeElement).toBe(subTrigger);
});

interface Doc {
  name: string;
}

const controller = createDropdownMenuController<Doc>();

function Rows() {
  return (
    <>
      {["Roadmap", "Budget"].map((name) => (
        <DropdownMenuTrigger
          aria-label={`More for ${name}`}
          controller={controller}
          key={name}
          payload={{ name }}
        >
          …
        </DropdownMenuTrigger>
      ))}
      <DropdownMenu controller={controller}>
        <DropdownMenuContent<Doc>>
          {({ payload }) => (
            <DropdownMenuGroup>
              <DropdownMenuLabel>{payload?.name}</DropdownMenuLabel>
              <DropdownMenuItem>Rename</DropdownMenuItem>
            </DropdownMenuGroup>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

test("one controller shared by two triggers shows the opening trigger's payload", async () => {
  render(<Rows />);

  fireEvent.click(screen.getByRole("button", { name: "More for Roadmap" }));
  expect(await screen.findByText("Roadmap")).toBeTruthy();
  fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
  await waitFor(() => {
    expect(screen.queryByRole("menu")).toBeNull();
  });

  fireEvent.click(screen.getByRole("button", { name: "More for Budget" }));
  expect(await screen.findByText("Budget")).toBeTruthy();
  expect(screen.queryByText("Roadmap")).toBeNull();
});

test("an item's shortcut sets aria-keyshortcuts and shows its keys at the end, out of the name", async () => {
  render(<Account />);
  await open();

  const profile = screen.getByRole("menuitem", { name: "Profile" });
  expect(profile.getAttribute("aria-keyshortcuts")).toBe("Control+Shift+P");
  expect(
    profile.querySelector(":scope > [data-slot='menu-shortcut']:last-child")
      ?.textContent
  ).toContain("Ctrl+Shift+P");
});

test("a destructive item carries data-destructive", async () => {
  render(
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem destructive>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  const item = await screen.findByRole("menuitem", { name: "Delete" });
  expect(Object.hasOwn(item.dataset, "destructive")).toBe(true);
  expect(Object.hasOwn(item.dataset, "color")).toBe(false);
});

test("only an inset item carries data-inset", async () => {
  render(
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem inset>Inset</DropdownMenuItem>
        <DropdownMenuItem inset={false}>Flush</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  const insetItem = await screen.findByRole("menuitem", { name: "Inset" });
  const flush = screen.getByRole("menuitem", { name: "Flush" });
  expect(Object.hasOwn(insetItem.dataset, "inset")).toBe(true);
  expect(Object.hasOwn(flush.dataset, "inset")).toBe(false);
});

test("an agent finds the menu by its trigger, names every control, and presses an item", async () => {
  const onBilling = vi.fn<() => void>();
  render(<Account onBilling={onBilling} />);

  const closed = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  expect(closed.map((entry) => entry.label)).toContain("Open");

  const opened = await agent.act({
    steps: [{ action: "setOpen", args: [true], ref: "Open" }],
  });
  expect(opened.ok, opened.error?.message).toBe(true);
  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const labels = JSON.stringify(entries);
  for (const label of ["Profile", "Billing", "Status Bar", "Invite users"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const pressed = await agent.act({
    steps: [{ action: "press", args: ["Billing"], ref: "Open" }],
  });
  expect(pressed.ok, pressed.error?.message).toBe(true);
  expect(onBilling).toHaveBeenCalledOnce();
  await waitFor(() => {
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
