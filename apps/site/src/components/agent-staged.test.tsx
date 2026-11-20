import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { expect, test } from "vite-plus/test";

Object.assign(document, {
  modelContext: {
    registerTool: async () => {
      await Promise.resolve();
    },
  },
});

const { agent } = await import("~/lib/agent");
const { AgentStaged } = await import("./agent-staged");

const button = (name: string) => screen.getByRole("button", { name });

const projectName = () =>
  screen.getByRole<HTMLInputElement>("textbox", { name: "Project name" }).value;

const region = () =>
  screen.getByRole("combobox", { name: "Region" }).textContent;

const digest = () =>
  screen
    .getByRole("switch", { name: "Weekly digest" })
    .getAttribute("aria-checked");

const card = async (name: string) =>
  within(await screen.findByRole("group", { name }));

const askedDialog = async () =>
  await screen.findByRole("alertdialog", { name: "Allow the assistant?" });

async function expectNoDialog() {
  await waitFor(() => {
    expect(screen.queryByRole("alertdialog")).toBeNull();
  });
}

async function expectNoCard() {
  await waitFor(() => {
    expect(screen.queryByRole("group", { name: /suggested/u })).toBeNull();
  });
}

async function suggest() {
  fireEvent.click(button("Suggest changes"));
  return await card("Keep 3 suggested changes?");
}

test("Suggest puts every change on the controls and lists each one's before and after", async () => {
  render(<AgentStaged />);
  expect(projectName()).toBe("Atlas");
  expect(region()).toContain("Europe");
  expect(digest()).toBe("false");

  const suggestion = await suggest();

  expect(suggestion.getByText("Atlas → Atlas v2")).toBeTruthy();
  expect(suggestion.getByText("Europe → North America")).toBeTruthy();
  expect(suggestion.getByText("Off → On")).toBeTruthy();
  for (const label of ["Project name", "Region", "Weekly digest"]) {
    expect(suggestion.getByText(label)).toBeTruthy();
  }
  expect(suggestion.queryByText(/Not applied/u)).toBeNull();
  expect(projectName()).toBe("Atlas v2");
  expect(region()).toContain("North America");
  expect(digest()).toBe("true");
  expect(button("Suggest changes").hasAttribute("disabled")).toBe(true);
});

test("Discard puts every control back and removes the card", async () => {
  render(<AgentStaged />);
  const suggestion = await suggest();

  fireEvent.click(suggestion.getByRole("button", { name: "Discard" }));

  await expectNoCard();
  expect(projectName()).toBe("Atlas");
  expect(region()).toContain("Europe");
  expect(digest()).toBe("false");
  expect(screen.queryByText(/Couldn't put back/u)).toBeNull();
  expect(button("Suggest changes").hasAttribute("disabled")).toBe(false);
  await waitFor(() => {
    expect(document.activeElement).toBe(button("Suggest changes"));
  });
});

test("Keep changes leaves the suggested values and removes the card", async () => {
  render(<AgentStaged />);
  const suggestion = await suggest();

  fireEvent.click(suggestion.getByRole("button", { name: "Keep changes" }));

  await expectNoCard();
  expect(projectName()).toBe("Atlas v2");
  expect(region()).toContain("North America");
  expect(digest()).toBe("true");
  expect(button("Suggest changes").hasAttribute("disabled")).toBe(false);
  await waitFor(() => {
    expect(document.activeElement).toBe(button("Suggest changes"));
  });
});

test("the agent can't keep its own changes: Keep changes asks the person, and Cancel refuses it", async () => {
  render(<AgentStaged />);
  await suggest();

  const pressing = agent.act({
    steps: [{ action: "press", ref: "Keep changes" }],
  });
  const dialog = await askedDialog();
  expect(dialog.textContent).toContain("Keeps the assistant's changes.");
  const seen = JSON.stringify(agent.snapshot());
  for (const word of ["Allow", "Cancel", "alert-dialog"]) {
    expect(seen).not.toContain(word);
  }
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));

  await expect(pressing).resolves.toMatchObject({ ok: false });
  await expectNoDialog();
  expect(
    screen.getByRole("group", { name: "Keep 3 suggested changes?" })
  ).toBeTruthy();
  expect(digest()).toBe("true");
});

test("a confirm-marked control asks on staging, asks again on Discard, and a refusal is reported", async () => {
  render(<AgentStaged />);
  const field = screen
    .getByRole("switch", { name: "Weekly digest" })
    .closest<HTMLElement>('[data-slot="field"]');
  if (!field) {
    throw new Error("Weekly digest has no Field");
  }
  field.dataset.agentConfirm = "Sends a summary every Monday";

  fireEvent.click(button("Suggest changes"));
  const staging = await askedDialog();
  expect(within(staging).getByText(/It asked to/u).textContent).toBe(
    "Sends a summary every Monday. It asked to setChecked Weekly digest with true."
  );
  fireEvent.click(within(staging).getByRole("button", { name: "Allow" }));
  const suggestion = await card("Keep 3 suggested changes?");
  expect(digest()).toBe("true");

  fireEvent.click(suggestion.getByRole("button", { name: "Discard" }));
  const reverting = await askedDialog();
  expect(within(reverting).getByText(/It asked to/u).textContent).toBe(
    "Sends a summary every Monday. It asked to setChecked Weekly digest with false."
  );
  expect(
    suggestion
      .getByRole("button", { name: "Keep changes" })
      .hasAttribute("disabled")
  ).toBe(true);
  fireEvent.click(within(reverting).getByRole("button", { name: "Cancel" }));

  const warning = await screen.findByText(/Couldn't put back/u);
  expect(warning.textContent).toBe("Couldn't put back Weekly digest.");
  await expectNoCard();
  expect(digest()).toBe("true");
  expect(projectName()).toBe("Atlas");
  expect(region()).toContain("Europe");
});
