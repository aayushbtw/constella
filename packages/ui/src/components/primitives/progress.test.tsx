import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { Progress, ProgressLabel, ProgressValue } from "./progress";

const agent = createAgent();

test("a labelled bar is named by its label and shows its value", () => {
  render(
    <Progress value={56}>
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
  const bar = screen.getByRole("progressbar", { name: "Upload progress" });

  expect(bar.getAttribute("aria-valuenow")).toBe("56");
  expect(bar.querySelector("[data-slot='progress-value']")?.textContent).toBe(
    "56%"
  );
});

test("the track and indicator follow the children, filled to the value's share of max", () => {
  render(
    <Progress max={5} value={3}>
      <ProgressLabel>Account setup</ProgressLabel>
    </Progress>
  );
  const bar = screen.getByRole("progressbar", { name: "Account setup" });
  const indicator = bar.querySelector<HTMLElement>(
    "[data-slot='progress-indicator']"
  );

  expect(
    [...bar.querySelectorAll<HTMLElement>(":scope > *")].map(
      (child) => child.dataset.slot
    )
  ).toEqual(["progress-label", "progress-track"]);
  expect(indicator?.parentElement?.dataset.slot).toBe("progress-track");
  expect(indicator?.style.width).toBe("60%");
});

test("a function child replaces the value's text", () => {
  render(
    <Progress max={8.4} value={8.4}>
      <ProgressLabel>brand-guidelines.pdf</ProgressLabel>
      <ProgressValue>{() => "Done"}</ProgressValue>
    </Progress>
  );
  const bar = screen.getByRole("progressbar", {
    name: "brand-guidelines.pdf",
  });

  expect(bar.querySelector("[data-slot='progress-value']")?.textContent).toBe(
    "Done"
  );
});

test("an unknown amount marks the indicator indeterminate and reads no value", () => {
  render(
    <Progress value={null}>
      <ProgressLabel>Preparing export</ProgressLabel>
    </Progress>
  );
  const bar = screen.getByRole("progressbar", { name: "Preparing export" });

  expect(bar.hasAttribute("aria-valuenow")).toBe(false);
  expect(
    bar
      .querySelector("[data-slot='progress-indicator']")
      ?.matches("[data-indeterminate]")
  ).toBe(true);
});

test("an agent sees every named bar, and not one hidden with aria-hidden", () => {
  render(
    <>
      <Progress value={40}>
        <ProgressLabel>Exporting video</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress aria-label="Upload" value={66} />
      <Progress aria-hidden max={4} value={2}>
        <ProgressLabel>Question 2 of 4</ProgressLabel>
      </Progress>
    </>
  );

  const components = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of components) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(components.map((entry) => entry.label)).toEqual([
    "Exporting video",
    "Upload",
  ]);
});
