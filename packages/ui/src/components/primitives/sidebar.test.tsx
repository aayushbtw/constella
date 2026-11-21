import { fireEvent, render, screen } from "@testing-library/react";
import { setPlatform } from "@ui-sdk/core/testing";
import { createAgent } from "@ui-sdk/react/agent";
import { withSource } from "@ui-sdk/react/observe";
import { useState } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "./sidebar";

const agent = createAgent();

beforeEach(() => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    addEventListener: () => {},
    matches: query.includes("min-width"),
    media: query,
    removeEventListener: () => {},
  }));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

const pages = ["Home", "Inbox"] as const;

function App({
  onAddProject,
  onMarkRead,
}: {
  onAddProject: () => void;
  onMarkRead: () => void;
}) {
  const [page, setPage] = useState<(typeof pages)[number]>("Home");
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupAction aria-label="Add project" onClick={onAddProject}>
              +
            </SidebarGroupAction>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={page === "Home"}
                  onClick={() => {
                    setPage("Home");
                  }}
                >
                  Home
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={page === "Inbox"}
                  onClick={() => {
                    setPage("Inbox");
                  }}
                  tooltip="Inbox"
                >
                  Inbox
                </SidebarMenuButton>
                <SidebarMenuAction
                  aria-label="Mark all read"
                  onClick={onMarkRead}
                >
                  …
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <main>
        <SidebarTrigger />
        <p data-testid="page">{page}</p>
      </main>
    </SidebarProvider>
  );
}

function renderApp() {
  const onAddProject = vi.fn<() => void>();
  const onMarkRead = vi.fn<() => void>();
  render(<App onAddProject={onAddProject} onMarkRead={onMarkRead} />);
  return { onAddProject, onMarkRead };
}

function row(name: string) {
  return screen.getByRole("button", { name });
}

test("an agent finds every sidebar control by name", async () => {
  renderApp();
  await screen.findByRole("button", { expanded: true, name: "Toggle sidebar" });

  const components = entries();
  for (const entry of components) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const labels = components.map((entry) => entry.label);
  for (const label of [
    "Home",
    "Inbox",
    "Add project",
    "Mark all read",
    "Sidebar rail",
    "Toggle sidebar",
  ]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }
});

test("an agent presses rows to switch pages, presses the actions, and collapses through the rail", async () => {
  const { onAddProject, onMarkRead } = renderApp();
  const page = screen.getByTestId("page");

  // The row action's row text holds "Inbox" too, so a step names that row by its ref.
  const inbox = entries().find((entry) => entry.label === "Inbox")?.ref;
  expect(inbox, "Inbox is missing from the snapshot").toBeDefined();
  const toInbox = await agent.act({
    steps: [{ action: "press", ref: inbox ?? "" }],
  });
  expect(toInbox.ok, toInbox.error?.message).toBe(true);
  expect(page.textContent).toBe("Inbox");
  expect(Object.hasOwn(row("Inbox").dataset, "active")).toBe(true);
  expect(row("Inbox").getAttribute("aria-current")).toBe("page");
  expect(Object.hasOwn(row("Home").dataset, "active")).toBe(false);
  expect(row("Home").hasAttribute("aria-current")).toBe(false);

  const toHome = await agent.act({ steps: [{ action: "press", ref: "Home" }] });
  expect(toHome.ok, toHome.error?.message).toBe(true);
  expect(page.textContent).toBe("Home");
  expect(Object.hasOwn(row("Home").dataset, "active")).toBe(true);
  expect(row("Home").getAttribute("aria-current")).toBe("page");
  expect(row("Inbox").hasAttribute("aria-current")).toBe(false);

  const actions = await agent.act({
    steps: [
      { action: "press", ref: "Add project" },
      { action: "press", ref: "Mark all read" },
    ],
  });
  expect(actions.ok, actions.error?.message).toBe(true);
  expect(onAddProject).toHaveBeenCalledOnce();
  expect(onMarkRead).toHaveBeenCalledOnce();

  const sidebar = document.querySelector<HTMLElement>("[data-slot='sidebar']");
  expect(sidebar?.dataset.collapsible).toBeUndefined();
  const collapsed = await agent.act({
    steps: [{ action: "press", ref: "Sidebar rail" }],
  });
  expect(collapsed.ok, collapsed.error?.message).toBe(true);
  expect(sidebar?.dataset.collapsible).toBe("icon");
  expect(
    await screen.findByRole("button", {
      expanded: false,
      name: "Toggle sidebar",
    })
  ).toBeTruthy();
});

test("a keyboard press on the trigger toggles at once, an agent's press animates", async () => {
  renderApp();
  const wrapper = document.querySelector<HTMLElement>(
    "[data-slot='sidebar-wrapper']"
  );
  const sidebar = document.querySelector<HTMLElement>("[data-slot='sidebar']");

  const trigger = await screen.findByRole("button", {
    expanded: true,
    name: "Toggle sidebar",
  });
  withSource("keyboard", () => {
    fireEvent.click(trigger);
  });
  expect(sidebar?.dataset.collapsible).toBe("icon");
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(Object.hasOwn(wrapper?.dataset ?? {}, "instant")).toBe(true);

  const expanded = await agent.act({
    steps: [{ action: "press", ref: "Toggle sidebar" }],
  });
  expect(expanded.ok, expanded.error?.message).toBe(true);
  expect(sidebar?.dataset.collapsible).toBeUndefined();
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  expect(Object.hasOwn(wrapper?.dataset ?? {}, "instant")).toBe(false);
});

test("a link row stays a link, with its own slot and no type", () => {
  render(
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              {/* oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the row renders its children into the link */}
              <SidebarMenuButton isActive render={<a href="#docs" />}>
                Docs
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );

  const docs = screen.getByRole("link", { name: "Docs" });
  expect(docs.dataset.slot).toBe("sidebar-menu-button");
  expect(docs.hasAttribute("type")).toBe(false);
  expect(docs.getAttribute("aria-current")).toBe("page");
});

test("a provider given only onOpenChange still toggles, and reports each change", async () => {
  const onOpenChange = vi.fn<(open: boolean) => void>();
  render(
    <SidebarProvider onOpenChange={onOpenChange}>
      <Sidebar collapsible="icon">
        <SidebarContent />
      </Sidebar>
      <main>
        <SidebarTrigger />
      </main>
    </SidebarProvider>
  );
  const sidebar = document.querySelector<HTMLElement>("[data-slot='sidebar']");

  fireEvent.click(
    await screen.findByRole("button", {
      expanded: true,
      name: "Toggle sidebar",
    })
  );
  expect(sidebar?.dataset.collapsible).toBe("icon");
  expect(onOpenChange).toHaveBeenLastCalledWith(false);

  fireEvent.click(
    await screen.findByRole("button", {
      expanded: false,
      name: "Toggle sidebar",
    })
  );
  expect(sidebar?.dataset.collapsible).toBeUndefined();
  expect(onOpenChange).toHaveBeenLastCalledWith(true);
});

test("a controlled provider stays where its open prop puts it", async () => {
  const onOpenChange = vi.fn<(open: boolean) => void>();
  render(
    <SidebarProvider onOpenChange={onOpenChange} open>
      <Sidebar collapsible="icon">
        <SidebarContent />
      </Sidebar>
      <main>
        <SidebarTrigger />
      </main>
    </SidebarProvider>
  );

  const trigger = await screen.findByRole("button", {
    expanded: true,
    name: "Toggle sidebar",
  });
  fireEvent.click(trigger);
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
  expect(
    document.querySelector<HTMLElement>("[data-slot='sidebar']")?.dataset
      .collapsible
  ).toBeUndefined();
});

test("with the rail mounted, an agent's Toggle sidebar names only the trigger", async () => {
  renderApp();
  const trigger = await screen.findByRole("button", {
    expanded: true,
    name: "Toggle sidebar",
  });

  const matches = entries().filter(
    (entry) => entry.label?.toLowerCase() === "toggle sidebar"
  );
  expect(matches).toHaveLength(1);
  expect(matches[0]?.component).toBe("button");

  const pressed = await agent.act({
    steps: [{ action: "press", ref: "Toggle sidebar" }],
  });
  expect(pressed.ok, pressed.error?.message).toBe(true);
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(
    document.querySelector<HTMLElement>("[data-slot='sidebar']")?.dataset
      .collapsible
  ).toBe("icon");
});

test("on a narrow screen the trigger keeps its name and opens the sheet as a dialog", async () => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    addEventListener: () => {},
    matches: false,
    media: query,
    removeEventListener: () => {},
  }));
  renderApp();

  const trigger = await screen.findByRole("button", {
    expanded: false,
    name: "Toggle sidebar",
  });
  expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");

  fireEvent.click(trigger);
  expect(await screen.findByRole("dialog", { name: "Sidebar" })).toBeTruthy();
  expect(trigger.getAttribute("aria-expanded")).toBe("true");
});

test("a row that opens a collapsible sub-menu is expanded, and an agent closes it", async () => {
  render(
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            <Collapsible defaultOpen render={<SidebarMenuItem />}>
              <CollapsibleTrigger render={<SidebarMenuButton tooltip="Docs" />}>
                Docs
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>Installation</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton>Theming</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );

  const docs = await screen.findByRole("button", {
    expanded: true,
    name: "Docs",
  });
  expect(screen.getByRole("button", { name: "Installation" })).toBeTruthy();

  const closed = await agent.act({ steps: [{ action: "press", ref: "Docs" }] });
  expect(closed.ok, closed.error?.message).toBe(true);
  expect(docs.getAttribute("aria-expanded")).toBe("false");
  expect(screen.queryByRole("button", { name: "Installation" })).toBeNull();
  expect(screen.queryByRole("button", { name: "Theming" })).toBeNull();
});

test("an agent finds and presses a sub row link, which stays a link", async () => {
  const onOpen = vi.fn<() => void>();
  render(
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    isActive
                    onClick={(event) => {
                      event.preventDefault();
                      onOpen();
                    }}
                    // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the row renders its children into the link
                    render={<a href="#installation" />}
                  >
                    Installation
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );

  const link = screen.getByRole("link", { name: "Installation" });
  expect(link.getAttribute("href")).toBe("#installation");
  expect(link.dataset.slot).toBe("sidebar-menu-sub-button");
  expect(Object.hasOwn(link.dataset, "active")).toBe(true);
  expect(link.getAttribute("aria-current")).toBe("page");
  expect(link.hasAttribute("type")).toBe(false);

  const entry = entries().find(
    (candidate) => candidate.label === "Installation"
  );
  expect(entry, "Installation is missing from the snapshot").toBeDefined();
  expect(entry?.actions).toContain("press");

  const pressed = await agent.act({
    steps: [{ action: "press", ref: "Installation" }],
  });
  expect(pressed.ok, pressed.error?.message).toBe(true);
  expect(onOpen).toHaveBeenCalledOnce();
});

function ShortcutApp({ dialog }: { dialog: boolean }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent />
      </Sidebar>
      <main>
        <SidebarTrigger />
        <input aria-label="Note" />
      </main>
      <Dialog defaultOpen={dialog}>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}

const collapsed = () =>
  document.querySelector<HTMLElement>("[data-slot='sidebar']")?.dataset
    .collapsible === "icon";

test("⌘B doesn't toggle the sidebar behind an open modal dialog", async () => {
  setPlatform("apple");
  try {
    render(<ShortcutApp dialog />);
    await screen.findByRole("dialog", { name: "Settings" });
    fireEvent.keyDown(document.body, { key: "b", metaKey: true });
    expect(collapsed()).toBe(false);
  } finally {
    setPlatform("other");
  }
});

test.each([
  { platform: "apple", press: { metaKey: true }, skip: { ctrlKey: true } },
  { platform: "other", press: { ctrlKey: true }, skip: { metaKey: true } },
] as const)(
  "on $platform only the platform's modifier with B toggles the sidebar",
  ({ platform, press, skip }) => {
    setPlatform(platform);
    try {
      render(<ShortcutApp dialog={false} />);
      fireEvent.keyDown(screen.getByRole("textbox", { name: "Note" }), {
        key: "b",
        ...skip,
      });
      expect(collapsed()).toBe(false);
      fireEvent.keyDown(document.body, { key: "b", ...press });
      expect(collapsed()).toBe(true);
    } finally {
      setPlatform("other");
    }
  }
);
