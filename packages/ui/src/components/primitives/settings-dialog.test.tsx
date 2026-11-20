import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import {
  SettingsDialog,
  SettingsDialogNav,
  SettingsDialogPage,
} from "./settings-dialog";
import { SidebarMenuButton, SidebarMenuItem } from "./sidebar";

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

// Titles share no words with the rows: the open dialog's label is its title, and a
// ref matches every label holding its words.
const pages = [
  { label: "General", title: "Workspace profile" },
  { label: "Notifications", title: "Alerts and emails" },
  { label: "Billing", title: "Plan and invoices" },
] as const;

type PageLabel = (typeof pages)[number]["label"];

function Settings() {
  const [current, setCurrent] = useState<PageLabel>("General");
  const page = pages.find((entry) => entry.label === current) ?? pages[0];
  return (
    <SettingsDialog defaultOpen>
      <SettingsDialogNav label="Settings">
        {pages.map((entry) => (
          <SidebarMenuItem key={entry.label}>
            <SidebarMenuButton
              isActive={entry.label === current}
              onClick={() => {
                setCurrent(entry.label);
              }}
            >
              {entry.label}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SettingsDialogNav>
      <SettingsDialogPage title={page.title} />
    </SettingsDialog>
  );
}

test("an agent finds every settings page and switches between them", async () => {
  render(<Settings />);
  const title = await screen.findByRole("heading", {
    name: "Workspace profile",
  });

  const components = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of components) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const labels = components.map((entry) => entry.label);
  for (const label of ["General", "Notifications", "Billing"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const toNotifications = await agent.act({
    steps: [{ action: "press", ref: "Notifications" }],
  });
  expect(toNotifications.ok, toNotifications.error?.message).toBe(true);
  expect(title.textContent).toBe("Alerts and emails");

  const toBilling = await agent.act({
    steps: [{ action: "press", ref: "Billing" }],
  });
  expect(toBilling.ok, toBilling.error?.message).toBe(true);
  expect(title.textContent).toBe("Plan and invoices");
});
