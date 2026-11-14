import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { Field, FieldDescription, FieldLabel } from "./field";
import { Input } from "./input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group";

const agent = createAgent();

function Profile() {
  return (
    <>
      <Field name="website">
        <FieldLabel>Website</FieldLabel>
        <InputGroup size="sm">
          <InputGroupInput placeholder="example.com" />
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>Shown on your profile.</FieldDescription>
      </Field>
      <Field disabled>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" />
      </Field>
      <Field invalid>
        <FieldLabel>Bio</FieldLabel>
        <InputGroup>
          <InputGroupTextarea />
          <InputGroupAddon align="block-end">
            <InputGroupText>0 / 280</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Input aria-label="Search" size="lg" />
    </>
  );
}

test("the control sits where the group's child selectors look for it", () => {
  render(<Profile />);
  const website = screen.getByRole("textbox", { name: "Website" });
  expect(website.dataset).toMatchObject({ slot: "input" });
  expect(website.parentElement?.dataset).toMatchObject({
    slot: "input-group-input",
  });
  expect(
    website.closest<HTMLElement>("[data-slot='input-group']")?.dataset.size
  ).toBe("sm");

  const bio = screen.getByRole("textbox", { name: "Bio" });
  expect(bio.dataset).toMatchObject({ slot: "textarea" });
  expect(bio.parentElement?.dataset).toMatchObject({ slot: "input-group" });

  const search = screen.getByRole("textbox", { name: "Search" });
  expect(
    search.closest<HTMLElement>("[data-slot='input-group']")?.dataset.size
  ).toBe("lg");
  expect(
    search.closest("[data-slot='input-group']")?.getAttribute("role")
  ).toBe("none");
});

test("a Field names, describes, disables and invalidates the group's control", () => {
  render(<Profile />);
  const website = screen.getByRole("textbox", { name: "Website" });
  expect(website.getAttribute("name")).toBe("website");
  expect(website.getAttribute("aria-describedby")).toBe(
    screen.getByText("Shown on your profile.").id
  );
  expect(
    screen
      .getByRole("textbox", { name: "Email" })
      .matches(":disabled[data-disabled]")
  ).toBe(true);
  expect(
    screen
      .getByRole("textbox", { name: "Bio" })
      .matches("[aria-invalid='true'][data-invalid]")
  ).toBe(true);
});

test("pressing an addon's text focuses the control", () => {
  render(<Profile />);
  fireEvent.click(screen.getByText("https://"));
  expect(document.activeElement).toBe(
    screen.getByRole("textbox", { name: "Website" })
  );
  fireEvent.click(screen.getByText("0 / 280"));
  expect(document.activeElement).toBe(
    screen.getByRole("textbox", { name: "Bio" })
  );
});

test("an agent finds every input by its label and fills it", async () => {
  render(<Profile />);
  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(entries.map((entry) => entry.label)).toEqual([
    "Website",
    "Email",
    "Bio",
    "Search",
  ]);

  const result = await agent.act({
    steps: [
      { action: "setValue", args: ["constella.dev"], ref: "Website" },
      { action: "setValue", args: ["Builds things."], ref: "Bio" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen.getByRole<HTMLInputElement>("textbox", { name: "Website" }).value
  ).toBe("constella.dev");
  expect(
    screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Bio" }).value
  ).toBe("Builds things.");
});
