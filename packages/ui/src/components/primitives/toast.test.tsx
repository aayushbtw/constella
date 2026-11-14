import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { afterEach, expect, test, vi } from "vite-plus/test";

import { toast, Toaster } from "./toast";

const agent = createAgent();

afterEach(() => {
  act(() => {
    toast.dismiss();
  });
});

function show(...args: Parameters<typeof toast>) {
  let id = "";
  act(() => {
    id = toast(...args);
  });
  return id;
}

function announcer(priority: "assertive" | "polite") {
  const node = document.querySelector(
    priority === "assertive"
      ? "[data-ui-sdk-announcer='assertive']"
      : "[data-ui-sdk-announcer='']"
  );
  if (!node) {
    throw new Error(`no ${priority} announcer`);
  }
  return node;
}

function icons() {
  return [
    ...document.querySelectorAll<HTMLElement>("[data-slot='toast-icon']"),
  ].map((icon) => icon.dataset.type);
}

test("a toast shows its title, description and action in the named Notifications region", () => {
  render(<Toaster />);
  show("Event created", {
    action: { label: "Undo" },
    description: "Friday at 10:00 AM",
  });

  const region = screen.getByRole("region", { name: "Notifications" });
  expect(within(region).getByText("Event created")).toBeTruthy();
  expect(within(region).getByText("Friday at 10:00 AM")).toBeTruthy();
  expect(within(region).getByRole("button", { name: "Undo" })).toBeTruthy();
});

test.each(["success", "info", "warning", "error", "loading"] as const)(
  "a %s toast shows our icon for its type",
  (type) => {
    render(<Toaster />);
    act(() => {
      toast[type]("Status");
    });

    expect(icons()).toEqual([type]);
  }
);

test("a default toast shows no icon", () => {
  render(<Toaster />);
  show("Plain");

  expect(screen.getByText("Plain")).toBeTruthy();
  expect(icons()).toEqual([]);
});

test("an update shows the new title over a hidden copy of the old one", () => {
  render(<Toaster />);
  const id = show("Uploading 0%");

  act(() => {
    toast.update(id, { title: "Uploading 40%" });
  });

  const title = screen.getByText("Uploading 40%");
  expect(title.closest("[aria-hidden]")).toBeNull();
  expect(
    screen.getByText("Uploading 0%").closest("[aria-hidden='true']")
  ).not.toBeNull();
});

test("a settled promise toast shows the result and its icon over the loading text", async () => {
  render(<Toaster />);
  act(() => {
    toast.promise(Promise.resolve(), {
      loading: "Saving changes",
      success: "Changes saved",
    });
  });
  expect(icons()).toEqual(["loading"]);

  expect(await screen.findByText("Changes saved")).toBeTruthy();
  expect(
    screen.getByText("Saving changes").closest("[aria-hidden='true']")
  ).not.toBeNull();
  expect(icons()).toEqual(["success"]);
});

test("pressing the action runs it and dismisses the toast", async () => {
  render(<Toaster />);
  const onAction = vi.fn();
  show("Message archived", { action: { label: "Undo", onAction } });

  fireEvent.click(screen.getByRole("button", { name: "Undo" }));

  expect(onAction).toHaveBeenCalledOnce();
  await waitFor(() => {
    expect(screen.queryByText("Message archived")).toBeNull();
  });
});

test("Close dismisses the toast", async () => {
  render(<Toaster />);
  show("Link copied");

  fireEvent.click(screen.getByRole("button", { name: "Close" }));

  await waitFor(() => {
    expect(screen.queryByText("Link copied")).toBeNull();
  });
});

test("a toast that can't be dismissed shows no Close", () => {
  render(<Toaster />);
  show("Session expires soon", { dismissible: false });

  expect(screen.getByText("Session expires soon")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
});

test("a link action renders a link, and a button action carries no href", () => {
  render(<Toaster />);
  show("Invoice sent", { action: { href: "/invoices/42", label: "View" } });
  show("Message sent", { action: { label: "Undo" } });

  expect(screen.getByRole("link", { name: "View" }).getAttribute("href")).toBe(
    "/invoices/42"
  );
  expect(
    screen.getByRole("button", { name: "Undo" }).hasAttribute("href")
  ).toBe(false);
});

test("at most three toasts show, and a fourth leaves the oldest waiting", async () => {
  render(<Toaster />);
  show("First");
  show("Second");
  show("Third");
  const fourth = show("Fourth");

  expect(screen.getAllByRole("listitem")).toHaveLength(3);
  expect(screen.queryByText("First")).toBeNull();

  act(() => {
    toast.dismiss(fourth);
  });
  expect(await screen.findByText("First")).toBeTruthy();
});

test("a toast is announced politely with its title and description", async () => {
  render(<Toaster />);
  show("Draft saved", { description: "Just now" });

  await waitFor(() => {
    expect(announcer("polite").textContent).toContain("Draft saved");
  });
  expect(announcer("polite").textContent).toContain("Just now");
  expect(announcer("assertive").textContent).not.toContain("Draft saved");
});

test("an error is announced assertively", async () => {
  render(<Toaster />);
  act(() => {
    toast.error("Couldn't save changes");
  });

  await waitFor(() => {
    expect(announcer("assertive").textContent).toContain(
      "Couldn't save changes"
    );
  });
  expect(announcer("polite").textContent).not.toContain(
    "Couldn't save changes"
  );
});

test("an agent finds a showing toast by its title and names its action", () => {
  render(<Toaster />);
  show("Event created", { action: { label: "Undo" } });

  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries.filter((item) => item.actions.length > 0)) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(entries).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ component: "toast", label: "Event created" }),
      expect.objectContaining({ component: "button", label: "Undo" }),
    ])
  );
});

// ui-sdk's ToastClose renders a plain button the bridge doesn't register, so an agent can't dismiss a toast.
test.fails("an agent can press a toast's Close", async () => {
  render(<Toaster />);
  show("Link copied");

  const result = await agent.act({
    steps: [{ action: "press", args: ["Close"], ref: "Link copied" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  await waitFor(() => {
    expect(screen.queryByText("Link copied")).toBeNull();
  });
});

// ui-sdk's bridge lists an empty region as an unnamed toast entry, and data-agent-hidden would hide showing toasts too.
test.fails("an empty region shows no unnamed entry to an agent", () => {
  render(<Toaster />);

  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
});
