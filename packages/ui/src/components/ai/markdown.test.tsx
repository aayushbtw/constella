import { render, screen, within } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, onTestFinished, test, vi } from "vite-plus/test";

import { Markdown } from "./markdown";

const agent = createAgent();

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

function stubClipboard() {
  const writeText = vi.fn<(text: string) => void>();
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  onTestFinished(() => {
    Reflect.deleteProperty(navigator, "clipboard");
  });
  return writeText;
}

const answer = `Active users grew **12%** in March.

| Month    |  Users |
| :------- | -----: |
| February | 19,880 |
| March    | 22,270 |

\`\`\`ts
const users = await acme.metrics.activeUsers();
\`\`\`
`;

// ui-sdk 0.1.0-beta.13 lists every scroll area unnamed and with no actions.
test("an agent finds Copy code by name and copies the block, and sees only the table's scroll area besides", async () => {
  const writeText = stubClipboard();
  render(<Markdown>{answer}</Markdown>);

  expect(
    entries()
      .filter((entry) => entry.component === "button")
      .map((entry) => entry.label)
  ).toEqual(["Copy code, ts"]);
  expect(
    entries()
      .filter((entry) => entry.label === undefined)
      .map(({ actions, component }) => ({ actions, component }))
  ).toEqual([{ actions: [], component: "scroll-area" }]);

  const result = await agent.act({
    steps: [{ action: "press", ref: "Copy code" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(writeText.mock.calls).toEqual([
    ["const users = await acme.metrics.activeUsers();"],
  ]);
});

const blocks = `\`\`\`ts
const users = 1;
\`\`\`

\`\`\`sh
vp install
\`\`\`

\`\`\`
plain text
\`\`\`
`;

test("each code block's copy button names its language, and an agent copies the one it names", async () => {
  const writeText = stubClipboard();
  render(<Markdown>{blocks}</Markdown>);

  expect(
    entries()
      .filter((entry) => entry.component === "button")
      .map((entry) => entry.label)
  ).toEqual(["Copy code, ts", "Copy code, sh", "Copy code"]);

  const result = await agent.act({
    steps: [{ action: "press", ref: "Copy code, sh" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(writeText.mock.calls).toEqual([["vp install"]]);
});

test("two blocks of the same language share a name, so a press by it is ambiguous", async () => {
  stubClipboard();
  render(
    <Markdown>
      {"```ts\nconst a = 1;\n```\n\n```ts\nconst b = 2;\n```\n"}
    </Markdown>
  );
  const refs = entries()
    .filter((entry) => entry.component === "button")
    .map((entry) => entry.ref);
  expect(refs).toHaveLength(2);

  const result = await agent.act({
    steps: [{ action: "press", ref: "Copy code, ts" }],
  });
  expect(result.ok).toBe(false);
  for (const ref of refs) {
    expect(result.error?.message).toContain(ref);
  }
});

test("a footnote's links stay in the tab while an outside link opens a new one, and its heading stays readable", () => {
  render(
    <Markdown>
      {"Claim.[^1] See [site](https://example.com).\n\n[^1]: Source."}
    </Markdown>
  );

  expect(
    screen.getAllByRole("link").map((link) => ({
      backref: "footnoteBackref" in link.dataset,
      href: link.getAttribute("href")?.replace(/^#.*user-content-/u, "#"),
      slot: link.dataset.slot,
      target: link.getAttribute("target"),
    }))
  ).toEqual([
    { backref: false, href: "#fn-1", slot: "link", target: null },
    {
      backref: false,
      href: "https://example.com",
      slot: "link",
      target: "_blank",
    },
    { backref: true, href: "#fnref-1", slot: "link", target: null },
  ]);
  const heading = screen.getByRole("heading", { name: "Footnotes" });
  expect(heading.id).toMatch(/footnote-label$/u);
  expect(screen.getAllByRole("link")[0]?.getAttribute("aria-describedby")).toBe(
    heading.id
  );
});

test("two answers that both use [^1] keep their footnotes apart", () => {
  const { container } = render(
    <>
      <Markdown>{"First.[^1]\n\n[^1]: First source."}</Markdown>
      <Markdown>{"Second.[^1]\n\n[^1]: Second source."}</Markdown>
    </>
  );

  const ids = [...container.querySelectorAll("[id]")].map((el) => el.id);
  expect(ids).toHaveLength(6);
  expect(new Set(ids).size).toBe(ids.length);

  for (const root of container.querySelectorAll<HTMLElement>(
    "[data-slot=markdown]"
  )) {
    const block = within(root);
    const [ref, backref] = block.getAllByRole("link");
    const note = root.querySelector(
      `[id="${ref?.getAttribute("href")?.slice(1)}"]`
    );
    expect(note?.tagName).toBe("LI");
    expect(backref?.getAttribute("href")).toBe(`#${ref?.id}`);
    expect(note?.contains(backref ?? null)).toBe(true);
    expect(ref?.getAttribute("aria-describedby")).toBe(
      block.getByRole("heading", { name: "Footnotes" }).id
    );
  }
});

test("a table and inline code render on their parts", () => {
  render(
    <Markdown>
      {
        "Run `vp install`.\n\n| Month | Users |\n| :-- | --: |\n| March | 22,270 |\n"
      }
    </Markdown>
  );

  expect(screen.getByRole("cell", { name: "22,270" }).dataset.slot).toBe(
    "table-cell"
  );
  expect(screen.getByText("vp install").dataset.slot).toBe("code");
});
