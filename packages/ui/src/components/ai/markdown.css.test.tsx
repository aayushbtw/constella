import { render, screen } from "@testing-library/react";
import { expect, test } from "vite-plus/test";

import { Markdown } from "./markdown";

test("the footnotes heading is visually hidden", () => {
  render(<Markdown>{"Claim.[^1]\n\n[^1]: Source."}</Markdown>);

  const style = getComputedStyle(
    screen.getByRole("heading", { name: "Footnotes" })
  );
  expect({
    clipPath: style.clipPath,
    height: style.height,
    overflow: style.overflow,
    position: style.position,
    width: style.width,
  }).toEqual({
    clipPath: "inset(50%)",
    height: "1px",
    overflow: "hidden",
    position: "absolute",
    width: "1px",
  });
});
