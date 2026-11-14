import { act, fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { renderToString } from "react-dom/server";
import { afterEach, expect, test, vi } from "vite-plus/test";

import { durations } from "@/lib/constella/tokens.stylex";

import { Citation, Citations } from "../ai/citation";
import type { Source } from "../ai/citation";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";

const agent = createAgent();

function Profile() {
  return (
    <Avatar>
      <AvatarImage alt="Ada Lovelace" src="/avatars/ada.png" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  );
}

const photo = () => screen.getByRole("img", { name: "Ada Lovelace" });
const initials = () => screen.queryByText("AL");

afterEach(() => {
  vi.useRealTimers();
});

test("while the photo loads, the initials show and the photo stays hidden", () => {
  render(<Profile />);

  expect(initials()).not.toBeNull();
  const image = screen.getByAltText("Ada Lovelace");
  expect(image.style.opacity).toBe("0");
  expect(image.className).not.toBe("");
});

test("a loaded photo replaces the initials and keeps no inline style", () => {
  render(<Profile />);

  fireEvent.load(screen.getByAltText("Ada Lovelace"));

  expect(photo().style.cssText).toBe("");
  expect(initials()).toBeNull();
});

test("a broken photo keeps the initials", () => {
  render(<Profile />);
  const image = screen.getByAltText("Ada Lovelace");

  fireEvent.error(image);

  expect(image.style.opacity).toBe("0");
  expect(initials()).not.toBeNull();
});

test("size and corners are carried for styling", () => {
  const { container } = render(
    <Avatar corners="rounded" size="lg">
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  );

  expect(
    container.querySelector<HTMLElement>("[data-slot='avatar']")?.dataset
  ).toMatchObject({ corners: "rounded", size: "lg" });
});

test("leading a badge, the avatar matches the selectors the badge rounds by", () => {
  const { container } = render(
    <Badge>
      <Profile />
      Ada
    </Badge>
  );

  expect(
    container.querySelector(
      "[data-slot='badge'] > [data-slot='avatar'][data-corners='pill']:first-child"
    )
  ).not.toBeNull();
});

test("server markup holds the photo and the initials", () => {
  const html = renderToString(<Profile />);

  expect(html).toContain("<img");
  expect(html).toContain("AL");
});

const withoutLogo: Source = {
  name: "Acme Journal",
  title: "A headline",
  url: "https://acme.example/story",
};
const withLogo: Source = { ...withoutLogo, icon: "/logos/acme.png" };

function Cited({ source }: { source: Source }) {
  return (
    <Citations>
      <Citation sources={[source]} />
    </Citations>
  );
}

const globe = (root: ParentNode = document) =>
  root.querySelector("[data-slot='avatar-fallback'] svg");

test("a citation's logo is fetched without a referrer and holds the globe back while it loads", async () => {
  vi.useFakeTimers();
  const { container } = render(<Cited source={withLogo} />);

  expect(container.querySelector("img")?.getAttribute("referrerpolicy")).toBe(
    "no-referrer"
  );
  expect(globe(container)).toBeNull();

  await act(async () => {
    await vi.advanceTimersByTimeAsync(
      Number.parseFloat(durations.fallbackDelay)
    );
  });

  expect(globe(container)).not.toBeNull();
});

test("a citation's server markup holds no globe while its logo loads", () => {
  const html = renderToString(<Cited source={withLogo} />);

  expect(html).toContain("<img");
  expect(html).not.toContain("<svg");
});

test("a citation without a logo shows the globe at once", () => {
  const { container } = render(<Cited source={withoutLogo} />);

  expect(globe(container)).not.toBeNull();
});

test("an agent sees the trigger around an avatar by name, and the avatar only as a picture it can't act on", () => {
  render(
    <>
      <Popover>
        <PopoverTrigger aria-label="Account">
          <Profile />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Account</PopoverTitle>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger>Sort</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Sort</PopoverTitle>
        </PopoverContent>
      </Popover>
    </>
  );

  const components = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  expect(
    components.map(({ actions, component, label }) => ({
      actions: actions.length,
      component,
      label,
    }))
  ).toEqual([
    { actions: 0, component: "avatar", label: "Ada Lovelace" },
    { actions: 2, component: "popover", label: "Account" },
    { actions: 2, component: "popover", label: "Sort" },
  ]);
});

test("an agent doesn't see a citation's logo", () => {
  render(
    <>
      <Cited source={withLogo} />
      <Cited source={withoutLogo} />
    </>
  );

  expect(agent.snapshot().some((entry) => entry.component === "avatar")).toBe(
    false
  );
});
