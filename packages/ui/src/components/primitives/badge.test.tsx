import { render, screen } from "@testing-library/react";
import { expect, test } from "vite-plus/test";

import { Badge } from "./badge";

test("renders a span named by its slot, size and variant", () => {
  render(<Badge variant="outline">New</Badge>);

  const badge = screen.getByText("New");
  expect(badge.tagName).toBe("SPAN");
  expect(badge.dataset).toMatchObject({
    size: "default",
    slot: "badge",
    variant: "outline",
  });
  expect(Object.hasOwn(badge.dataset, "color")).toBe(false);
});

test("render swaps the element and keeps the badge's attributes", () => {
  render(
    <Badge
      color="success"
      // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the badge renders its children into the link
      render={<a href="/changelog" />}
    >
      v2
    </Badge>
  );

  const link = screen.getByRole("link", { name: "v2" });
  expect(link.getAttribute("href")).toBe("/changelog");
  expect(link.dataset).toMatchObject({ color: "success", slot: "badge" });
  expect(link.className).not.toBe("");
});
