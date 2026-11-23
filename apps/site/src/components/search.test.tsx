import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { setPlatform } from "@ui-sdk/core/testing";
import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, test } from "vite-plus/test";

Object.assign(document, {
  modelContext: {
    registerTool: async () => {
      await Promise.resolve();
    },
  },
});

const { agent } = await import("~/lib/agent");
const { Search } = await import("./search");
const { Dialog, DialogContent, DialogTitle } =
  await import("@/components/primitives/dialog");

afterEach(() => {
  setPlatform("other");
});

const isolates = /[\u2066-\u2069]/gu;
const searchOpen = () =>
  screen.queryByRole("dialog", { name: "Search documentation" }) !== null;

function routerFor(page: ReactNode) {
  const root = createRootRoute({
    component: () => (
      <>
        {page}
        <Outlet />
      </>
    ),
    loader: () => ({
      blocks: [],
      components: [
        { slug: "badge", title: "Badge" },
        { slug: "button", title: "Button" },
      ],
      docs: [],
    }),
  });
  const docsPage = createRoute({
    component: () => null,
    getParentRoute: () => root,
    path: "/docs/components/$slug",
  });
  const router = createRouter({
    history: createMemoryHistory({ initialEntries: ["/"] }),
    routeTree: root.addChildren([docsPage]),
  });
  return router;
}

async function renderIn(page: ReactNode) {
  const router = routerFor(page);
  render(<RouterProvider router={router} />);
  await screen.findByRole("button", { name: "Search documentation" });
  const visited: string[] = [];
  router.subscribe("onBeforeNavigate", ({ toLocation }) => {
    visited.push(toLocation.pathname);
  });
  return visited;
}

async function openSearch() {
  const visited = await renderIn(<Search />);
  fireEvent.click(screen.getByRole("button", { name: "Search documentation" }));
  await screen.findByRole("dialog", { name: "Search documentation" });
  return visited;
}

function Page({ modal }: { modal: boolean }) {
  return (
    <>
      <Search />
      <input aria-label="Note" />
      <Dialog defaultOpen={modal}>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
        </DialogContent>
      </Dialog>
    </>
  );
}

test("the agent sees the closed search dialog by name", async () => {
  await renderIn(<Search />);
  const dialogs = agent
    .snapshot()
    .filter((entry) => entry.component === "dialog");
  expect(dialogs.map((entry) => entry.label)).toEqual(["Search documentation"]);
});

test.each([{ key: "k", metaKey: true }, { key: "/" }])(
  "$key doesn't open search behind an open modal dialog",
  async (keys) => {
    setPlatform("apple");
    await renderIn(<Page modal />);
    await screen.findByRole("dialog", { name: "Settings" });
    fireEvent.keyDown(document.body, keys);
    expect(searchOpen()).toBe(false);
  }
);

test.each([
  { platform: "apple", press: { metaKey: true }, skip: { ctrlKey: true } },
  { platform: "other", press: { ctrlKey: true }, skip: { metaKey: true } },
] as const)(
  "on $platform only the platform's modifier with K opens search",
  async ({ platform, press, skip }) => {
    setPlatform(platform);
    await renderIn(<Page modal={false} />);
    fireEvent.keyDown(document.body, { key: "k", ...skip });
    expect(searchOpen()).toBe(false);
    fireEvent.keyDown(document.body, { key: "k", ...press });
    await screen.findByRole("dialog", { name: "Search documentation" });
  }
);

test("/ opens search, but not while typing in a text field", async () => {
  await renderIn(<Page modal={false} />);
  fireEvent.keyDown(screen.getByRole("textbox", { name: "Note" }), {
    key: "/",
  });
  expect(searchOpen()).toBe(false);
  fireEvent.keyDown(document.body, { key: "/" });
  await screen.findByRole("dialog", { name: "Search documentation" });
});

test("the trigger's hint is Ctrl+K in server HTML and ⌘K on a Mac", async () => {
  const router = routerFor(<Search />);
  await router.load();
  expect(
    renderToString(<RouterProvider router={router} />).replaceAll(isolates, "")
  ).toContain("Ctrl+K");
  setPlatform("apple");
  await renderIn(<Search />);
  const trigger = screen.getByRole("button", { name: "Search documentation" });
  await waitFor(() => {
    expect(trigger.textContent?.replaceAll(isolates, "")).toContain("⌘K");
  });
  expect(trigger.getAttribute("aria-keyshortcuts")).toBe("Meta+K");
});

test("each result is a link to its page", async () => {
  await openSearch();
  const result = screen.getByRole("option", { name: "Button" });
  expect(result.tagName).toBe("A");
  expect(result.getAttribute("href")).toBe("/docs/components/button");
});

test("clicking a result goes to its page once and closes search", async () => {
  const visited = await openSearch();
  act(() => {
    fireEvent.click(screen.getByRole("option", { name: "Button" }));
  });
  expect(visited).toEqual(["/docs/components/button"]);
  await waitFor(() => {
    expect(searchOpen()).toBe(false);
  });
});

test("Enter goes to the highlighted result's page once", async () => {
  const visited = await openSearch();
  const input = screen.getByRole("combobox", { name: "Search pages" });
  fireEvent.change(input, { target: { value: "Badge" } });
  act(() => {
    fireEvent.keyDown(input, { key: "Enter" });
  });
  expect(visited).toEqual(["/docs/components/badge"]);
  await waitFor(() => {
    expect(searchOpen()).toBe(false);
  });
});

test.each([
  { metaKey: true },
  { ctrlKey: true },
  { shiftKey: true },
  { altKey: true },
])("a click with %o leaves the page to the browser", async (modifier) => {
  const visited = await openSearch();
  act(() => {
    fireEvent.click(screen.getByRole("option", { name: "Button" }), modifier);
  });
  expect(visited).toEqual([]);
  expect(searchOpen()).toBe(true);
});

test("an agent's run goes to the result's page once and closes search", async () => {
  const visited = await openSearch();
  const command = agent
    .snapshot()
    .find((entry) => entry.label === "Search pages");
  expect(command?.items?.map((item) => item.label)).toEqual([
    "Badge",
    "Button",
  ]);
  const result = await act(
    async () =>
      await agent.act({
        steps: [{ action: "run", args: ["Button"], ref: "Search pages" }],
      })
  );
  expect(result.ok, result.error?.message).toBe(true);
  expect(visited).toEqual(["/docs/components/button"]);
  await waitFor(() => {
    expect(searchOpen()).toBe(false);
  });
});
