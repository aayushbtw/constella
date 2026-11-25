import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { expect, test } from "vite-plus/test";

import { Field, FieldDescription, FieldLabel } from "./field";
import { Input } from "./input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
  InputGroupToggle,
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

interface ValueChange {
  source: string;
  value: string;
}

function Website({
  changes,
  reject = false,
}: {
  changes: ValueChange[];
  reject?: boolean;
}) {
  const [text, setText] = useState("old.dev");
  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Website"
        onValueChange={(value, details) => {
          changes.push({ source: details.source, value });
          if (reject) {
            details.cancel();
            return;
          }
          setText(value);
        }}
        value={text}
      />
    </InputGroup>
  );
}

const website = () =>
  screen.getByRole<HTMLInputElement>("textbox", { name: "Website" });

test("an agent's setValue reaches a controlled input's onValueChange as the agent's", async () => {
  const changes: ValueChange[] = [];
  render(<Website changes={changes} />);

  const result = await agent.act({
    steps: [{ action: "setValue", args: ["constella.dev"], ref: "Website" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(changes).toEqual([{ source: "agent", value: "constella.dev" }]);
  expect(website().value).toBe("constella.dev");
});

test("a controlled input whose onValueChange cancels the agent's setValue keeps its value and tells the agent", async () => {
  const changes: ValueChange[] = [];
  render(<Website changes={changes} reject />);

  const result = await agent.act({
    steps: [{ action: "setValue", args: ["constella.dev"], ref: "Website" }],
  });
  expect(result.ok).toBe(false);
  expect(result.error?.message).toContain("didn't take");
  expect(changes).toEqual([{ source: "agent", value: "constella.dev" }]);
  expect(website().value).toBe("old.dev");
});

function Favorite() {
  const [favorite, setFavorite] = useState(false);
  return (
    <InputGroup>
      <InputGroupInput aria-label="Website" />
      <InputGroupAddon align="inline-end">
        <InputGroupToggle
          aria-label="Favorite"
          onPressedChange={setFavorite}
          pressed={favorite}
        />
      </InputGroupAddon>
    </InputGroup>
  );
}

test("a toggle flips once per press and takes the addon's button inset", () => {
  render(<Favorite />);
  const favorite = screen.getByRole("button", { name: "Favorite" });
  expect(favorite.getAttribute("type")).toBe("button");
  expect(favorite.dataset).toMatchObject({
    inputGroupButton: "",
    size: "icon-xs",
    slot: "toggle",
  });
  expect(favorite.getAttribute("aria-pressed")).toBe("false");

  fireEvent.click(favorite);
  expect(favorite.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(favorite);
  expect(favorite.getAttribute("aria-pressed")).toBe("false");
});

test("an agent sees a toggle as one toggle entry", () => {
  render(<Favorite />);
  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.label === "Favorite");
  expect(entries.map((entry) => entry.component)).toEqual(["toggle"]);
});
