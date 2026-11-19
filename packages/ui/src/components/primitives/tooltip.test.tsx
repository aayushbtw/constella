import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { createTooltipController } from "@ui-sdk/react/tooltip";
import { useState } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import { durations } from "@/lib/constella/tokens.stylex";

import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { Dialog, DialogContent, DialogTitle } from "./dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Sheet, SheetContent, SheetTitle } from "./sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

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
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function hover(element: HTMLElement) {
  fireEvent.pointerEnter(element, { pointerType: "mouse" });
  fireEvent.pointerMove(element, { pointerType: "mouse" });
}

function Save() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button size="icon" variant="outline" />}>
        <svg aria-hidden />
      </TooltipTrigger>
      <TooltipContent>Save changes</TooltipContent>
    </Tooltip>
  );
}

test("an icon trigger is named by its tooltip, which waits hidden until opened", async () => {
  render(<Save />);

  // ui-sdk guesses whether the tooltip names or describes its trigger a tick after mounting.
  expect(
    await screen.findByRole("button", { name: "Save changes" })
  ).toBeTruthy();
  const content = screen.getByRole("tooltip", { hidden: true });
  expect(content.hidden).toBe(true);
});

test("hover opens it after the 300ms delay", async () => {
  vi.useFakeTimers();
  render(<Save />);
  const trigger = screen.getByRole("button");
  const delay = Number.parseFloat(durations.tooltipDelay);

  hover(trigger);
  await act(async () => {
    await vi.advanceTimersByTimeAsync(delay - 50);
  });
  expect(screen.queryByRole("tooltip")).toBeNull();

  await act(async () => {
    await vi.advanceTimersByTimeAsync(50);
  });
  expect(screen.getByRole("tooltip").textContent).toBe("Save changes");
});

// ui-sdk reads a change's source only from trusted events, so the keyboard path is checked in a browser.
test("focus leaving closes it with no exit motion, after a hover opened it with one", async () => {
  render(
    <>
      <Tooltip delay={0}>
        <TooltipTrigger render={<Button />}>Share</TooltipTrigger>
        <TooltipContent>Anyone with the link can view</TooltipContent>
      </Tooltip>
      <Button>Elsewhere</Button>
    </>
  );
  const trigger = screen.getByRole("button", { name: "Share" });
  hover(trigger);
  const content = await screen.findByRole("tooltip");
  expect(Object.hasOwn(content.dataset, "skipMotion")).toBe(false);

  fireEvent.keyDown(trigger, { key: "Escape" });
  await waitFor(() => {
    expect(content.hidden).toBe(true);
  });

  trigger.focus();
  await screen.findByRole("tooltip");
  screen.getByRole("button", { name: "Elsewhere" }).focus();

  await waitFor(() => {
    expect(content.hidden).toBe(true);
  });
  expect(Object.hasOwn(content.dataset, "skipMotion")).toBe(true);
});

function CopyLink() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button />}>Copy link</TooltipTrigger>
      <TooltipContent>Anyone with the link can view</TooltipContent>
    </Tooltip>
  );
}

async function focusOpen() {
  const trigger = await screen.findByRole("button", { name: "Copy link" });
  // A ui-sdk dialog focuses the trigger as it opens, which doesn't open the tooltip.
  act(() => {
    trigger.blur();
    trigger.focus();
  });
  return { content: await screen.findByRole("tooltip"), trigger };
}

test("Escape on a focused trigger closes the tooltip without reaching the document", async () => {
  const onKeyDown = vi.fn<() => void>();
  document.addEventListener("keydown", onKeyDown);
  render(<CopyLink />);
  const { content, trigger } = await focusOpen();

  fireEvent.keyDown(trigger, { key: "Escape" });
  await waitFor(() => {
    expect(content.hidden).toBe(true);
  });
  expect(onKeyDown).not.toHaveBeenCalled();

  fireEvent.keyDown(trigger, { key: "Escape" });
  expect(onKeyDown).toHaveBeenCalledOnce();
  document.removeEventListener("keydown", onKeyDown);
});

test("in a Base UI sheet, the first Escape closes the tooltip and the second the sheet", async () => {
  const onOpenChange = vi.fn<(open: boolean) => void>();
  render(
    <Sheet defaultOpen onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetTitle>Share</SheetTitle>
        <CopyLink />
      </SheetContent>
    </Sheet>
  );
  const { content, trigger } = await focusOpen();

  fireEvent.keyDown(trigger, { key: "Escape" });
  await waitFor(() => {
    expect(content.hidden).toBe(true);
  });
  expect(onOpenChange).not.toHaveBeenCalled();

  fireEvent.keyDown(trigger, { key: "Escape" });
  expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
});

test("in a dialog, the first Escape closes the tooltip and the second the dialog", async () => {
  const onOpenChange = vi.fn<(open: boolean) => void>();
  render(
    <Dialog defaultOpen onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Share</DialogTitle>
        <CopyLink />
      </DialogContent>
    </Dialog>
  );
  const { content, trigger } = await focusOpen();

  fireEvent.keyDown(trigger, { key: "Escape" });
  await waitFor(() => {
    expect(content.hidden).toBe(true);
  });
  expect(onOpenChange).not.toHaveBeenCalled();

  fireEvent.keyDown(trigger, { key: "Escape" });
  expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
});

test("in a popover, the first Escape closes the tooltip and the second the popover", async () => {
  const onOpenChange = vi.fn<(open: boolean) => void>();
  render(
    <Popover defaultOpen onOpenChange={onOpenChange}>
      <PopoverTrigger render={<Button />}>Share</PopoverTrigger>
      <PopoverContent>
        <CopyLink />
      </PopoverContent>
    </Popover>
  );
  const { content, trigger } = await focusOpen();

  fireEvent.keyDown(trigger, { key: "Escape" });
  await waitFor(() => {
    expect(content.hidden).toBe(true);
  });
  expect(onOpenChange).not.toHaveBeenCalled();

  fireEvent.keyDown(trigger, { key: "Escape" });
  expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
});

function SharedCopyLink() {
  // oxlint-disable-next-line react/hook-use-state -- created once and never set, as ui-sdk's controller docs do
  const [controller] = useState(() => createTooltipController());
  return (
    <>
      <TooltipTrigger controller={controller} render={<Button />}>
        Copy link
      </TooltipTrigger>
      <Tooltip controller={controller}>
        <TooltipContent>Anyone with the link can view</TooltipContent>
      </Tooltip>
    </>
  );
}

test("Escape on a trigger connected by its own controller stops at the trigger", async () => {
  const onKeyDown = vi.fn<() => void>();
  document.addEventListener("keydown", onKeyDown);
  render(<SharedCopyLink />);
  const { content, trigger } = await focusOpen();

  fireEvent.keyDown(trigger, { key: "Escape" });
  await waitFor(() => {
    expect(content.hidden).toBe(true);
  });
  expect(onKeyDown).not.toHaveBeenCalled();
  document.removeEventListener("keydown", onKeyDown);
});

// StyleX CSS never reaches jsdom, so this checks the hidden content the corner join skips.
test("a closed tooltip in a group stays hidden, so the last button keeps its end corners", () => {
  render(
    <ButtonGroup>
      <Button>Archive</Button>
      <Tooltip>
        <TooltipTrigger render={<Button />}>Report</TooltipTrigger>
        <TooltipContent>Flag as spam</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
  const content = screen.getByRole("tooltip", { hidden: true });
  expect(content.hidden).toBe(true);
  const shown = screen
    .getByRole("group")
    .querySelectorAll(":scope > [data-slot]:not([hidden])");
  expect([...shown].map((part) => part.textContent)).toEqual([
    "Archive",
    "Report",
  ]);
});

function Nav() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton aria-describedby="home-hint" tooltip="Home">
                Home
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              {/* oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the row renders its children into the link */}
              <SidebarMenuButton render={<a href="#docs" />} tooltip="Docs">
                Docs
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarTrigger />
    </SidebarProvider>
  );
}

test("sidebar rows and the trigger keep their own slots under a tooltip, and each reads its name once", async () => {
  render(<Nav />);

  const home = screen.getByRole("button", { name: "Home" });
  expect(home.dataset.slot).toBe("sidebar-menu-button");
  expect(home.getAttribute("aria-labelledby")).toBeNull();
  expect(home.getAttribute("aria-describedby")).toBe("home-hint");

  const docs = screen.getByRole("link", { name: "Docs" });
  expect(docs.dataset.slot).toBe("sidebar-menu-button");
  expect(docs.hasAttribute("type")).toBe(false);
  expect(docs.getAttribute("aria-labelledby")).toBeNull();
  expect(docs.getAttribute("aria-describedby")).toBeNull();

  const trigger = await screen.findByRole("button", {
    description: "",
    name: "Collapse sidebar",
  });
  expect(trigger.dataset.slot).toBe("sidebar-trigger");
  expect(trigger.getAttribute("aria-describedby")).toBeNull();
});

test("a sidebar trigger with a shortcut is described by its tooltip", async () => {
  render(
    <SidebarProvider>
      <SidebarTrigger kbd="⌘B" />
    </SidebarProvider>
  );

  expect(
    await screen.findByRole("button", {
      description: "Collapse sidebar⌘B",
      name: "Collapse sidebar",
    })
  ).toBeTruthy();
});

test("an agent finds every control and tooltip by name", async () => {
  render(
    <>
      <Save />
      <Nav />
    </>
  );
  await screen.findByRole("button", { name: "Save changes" });

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
  for (const label of ["Save changes", "Home", "Docs", "Collapse sidebar"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }
});
