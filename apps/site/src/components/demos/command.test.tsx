import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setPlatform } from "@ui-sdk/core/testing";
import { renderToString } from "react-dom/server";
import { afterEach, expect, test } from "vite-plus/test";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/primitives/dialog";

import { CommandDemo, CommandDialogDemo } from "./command";

afterEach(() => {
  setPlatform("other");
});

const isolates = /[⁦-⁩]/gu;
const paletteOpen = () =>
  screen.queryByRole("dialog", { name: "Command Palette" }) !== null;

function Page({ modal }: { modal: boolean }) {
  return (
    <>
      <CommandDialogDemo />
      <Dialog defaultOpen={modal}>
        <DialogContent>
          <DialogTitle>Settings</DialogTitle>
        </DialogContent>
      </Dialog>
    </>
  );
}

test("⌘J doesn't open the palette behind an open modal dialog", async () => {
  setPlatform("apple");
  render(<Page modal />);
  await screen.findByRole("dialog", { name: "Settings" });
  fireEvent.keyDown(document.body, { key: "j", metaKey: true });
  expect(paletteOpen()).toBe(false);
});

test.each([
  { platform: "apple", press: { metaKey: true }, skip: { ctrlKey: true } },
  { platform: "other", press: { ctrlKey: true }, skip: { metaKey: true } },
] as const)(
  "on $platform only the platform's modifier with J opens the palette",
  async ({ platform, press, skip }) => {
    setPlatform(platform);
    render(<Page modal={false} />);
    fireEvent.keyDown(document.body, { key: "j", ...skip });
    expect(paletteOpen()).toBe(false);
    fireEvent.keyDown(document.body, { key: "j", ...press });
    await screen.findByRole("dialog", { name: "Command Palette" });
  }
);

test("hints are the Ctrl form in server HTML and ⌘ on a Mac", async () => {
  const html = renderToString(
    <>
      <CommandDemo />
      <CommandDialogDemo />
    </>
  ).replaceAll(isolates, "");
  for (const text of ["Ctrl+J", "Ctrl+P", "Ctrl+B", "Ctrl+S"]) {
    expect(html).toContain(text);
  }

  setPlatform("apple");
  render(<CommandDemo />);
  render(<CommandDialogDemo />);
  const trigger = screen.getByRole("button", { name: /Open Menu/u });
  await waitFor(() => {
    expect(trigger.textContent?.replaceAll(isolates, "")).toContain("⌘J");
  });
  expect(trigger.getAttribute("aria-keyshortcuts")).toBe("Meta+J");
  expect(screen.getByRole("option", { name: "Profile" }).textContent).toContain(
    "⌘P"
  );
});
