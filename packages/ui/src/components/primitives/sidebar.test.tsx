import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

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
  await screen.findByRole("button", { name: "Collapse sidebar" });

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
    "Toggle Sidebar",
    "Collapse sidebar",
  ]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }
});

test("an agent presses rows to switch pages, presses the actions, and collapses through the rail", async () => {
  const { onAddProject, onMarkRead } = renderApp();
  const page = screen.getByTestId("page");

  const toInbox = await agent.act({
    steps: [{ action: "press", ref: "Inbox" }],
  });
  expect(toInbox.ok, toInbox.error?.message).toBe(true);
  expect(page.textContent).toBe("Inbox");
  expect(Object.hasOwn(row("Inbox").dataset, "active")).toBe(true);
  expect(Object.hasOwn(row("Home").dataset, "active")).toBe(false);

  const toHome = await agent.act({ steps: [{ action: "press", ref: "Home" }] });
  expect(toHome.ok, toHome.error?.message).toBe(true);
  expect(page.textContent).toBe("Home");
  expect(Object.hasOwn(row("Home").dataset, "active")).toBe(true);

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
    steps: [{ action: "press", ref: "Toggle Sidebar" }],
  });
  expect(collapsed.ok, collapsed.error?.message).toBe(true);
  expect(sidebar?.dataset.collapsible).toBe("icon");
  expect(
    await screen.findByRole("button", { name: "Expand sidebar" })
  ).toBeTruthy();
});

test("a link row stays a link, with its own slot and no type", () => {
  render(
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              {/* oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the row renders its children into the link */}
              <SidebarMenuButton render={<a href="#docs" />}>
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
});
