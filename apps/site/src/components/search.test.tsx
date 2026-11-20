import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setPlatform } from "@ui-sdk/core/testing";
import { renderToString } from "react-dom/server";
import { afterEach, expect, test, vi } from "vite-plus/test";

Object.assign(document, {
  modelContext: {
    registerTool: async () => {
      await Promise.resolve();
    },
  },
});

vi.mock("@tanstack/react-router", () => ({
  useLoaderData: () => ({ blocks: [], components: [], docs: [] }),
  useNavigate: () => async () => {
    await Promise.resolve();
  },
}));

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

test("the agent sees the closed search dialog by name", () => {
  render(<Search />);
  const dialogs = agent
    .snapshot()
    .filter((entry) => entry.component === "dialog");
  expect(dialogs.map((entry) => entry.label)).toEqual(["Search documentation"]);
});

test.each([{ key: "k", metaKey: true }, { key: "/" }])(
  "$key doesn't open search behind an open modal dialog",
  async (keys) => {
    setPlatform("apple");
    render(<Page modal />);
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
    render(<Page modal={false} />);
    fireEvent.keyDown(document.body, { key: "k", ...skip });
    expect(searchOpen()).toBe(false);
    fireEvent.keyDown(document.body, { key: "k", ...press });
    await screen.findByRole("dialog", { name: "Search documentation" });
  }
);

test("/ opens search, but not while typing in a text field", async () => {
  render(<Page modal={false} />);
  fireEvent.keyDown(screen.getByRole("textbox", { name: "Note" }), {
    key: "/",
  });
  expect(searchOpen()).toBe(false);
  fireEvent.keyDown(document.body, { key: "/" });
  await screen.findByRole("dialog", { name: "Search documentation" });
});

test("the trigger's hint is Ctrl+K in server HTML and ⌘K on a Mac", async () => {
  expect(renderToString(<Search />).replaceAll(isolates, "")).toContain(
    "Ctrl+K"
  );
  setPlatform("apple");
  render(<Search />);
  const trigger = screen.getByRole("button", { name: "Search documentation" });
  await waitFor(() => {
    expect(trigger.textContent?.replaceAll(isolates, "")).toContain("⌘K");
  });
  expect(trigger.getAttribute("aria-keyshortcuts")).toBe("Meta+K");
});
