import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { separator } from "@ui-sdk/core/separator";
import { mount, setPlatform } from "@ui-sdk/core/testing";
import { createAgent } from "@ui-sdk/react/agent";
import { StrictMode, useState } from "react";
import type { ReactNode } from "react";
import { afterAll, expect, test, vi } from "vite-plus/test";

import { InputGroupButton } from "@/components/primitives/input-group";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentGroup,
  AttachmentTitle,
} from "./attachment";
import {
  PromptInput,
  PromptInputCommand,
  PromptInputCommandContent,
  PromptInputCommandEmpty,
  PromptInputCommandItem,
  PromptInputCommandItemIcon,
  PromptInputCommandList,
  PromptInputCommandTextarea,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "./prompt-input";
import type { PromptInputCommandProps, PromptInputState } from "./prompt-input";

const agent = createAgent();

// Trigger Menu ignores untrusted events, so a throwaway primitive's view types, presses keys and clicks for real.
const driver = mount(separator, {}, "<root></root>");

afterAll(() => {
  driver.unmount();
});

async function type(text: string) {
  await act(async () => {
    await driver.type(text);
    await driver.settle();
  });
}

async function press(key: string) {
  await act(async () => {
    await driver.keys(key);
    await driver.settle();
  });
}

async function click(element: Element) {
  await act(async () => {
    await driver.click(element);
    await driver.settle();
  });
}

const commands = [
  { label: "Summarize", value: "summarize" },
  { label: "Weekly report", value: "weekly-report" },
  { label: "Draft an email", value: "draft-email" },
  { label: "Translate", value: "translate" },
];

const triggers: PromptInputCommandProps["triggers"] = [
  { boundary: "start", char: "/", insert: (item) => `/${item.value} ` },
];

function CommandComposer({
  empty = false,
  onSubmit,
}: {
  empty?: boolean;
  onSubmit?: (text: string) => void;
}) {
  const [text, setText] = useState("");
  return (
    <PromptInputCommand triggers={triggers}>
      <PromptInput
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.(text);
          setText("");
        }}
      >
        <PromptInputCommandTextarea
          aria-label="Message"
          onValueChange={setText}
          value={text}
        />
        <PromptInputFooter>
          <PromptInputSubmit disabled={text.trim() === ""} />
        </PromptInputFooter>
      </PromptInput>
      <PromptInputCommandContent>
        {empty && (
          <PromptInputCommandEmpty>No commands found.</PromptInputCommandEmpty>
        )}
        <PromptInputCommandList>
          {commands.map((command) => (
            <PromptInputCommandItem key={command.value} value={command.value}>
              <PromptInputCommandItemIcon>
                <svg>
                  <title>Icon</title>
                </svg>
              </PromptInputCommandItemIcon>
              {command.label}
            </PromptInputCommandItem>
          ))}
        </PromptInputCommandList>
      </PromptInputCommandContent>
    </PromptInputCommand>
  );
}

const box = () =>
  screen.getByRole<HTMLTextAreaElement>("textbox", { name: "Message" });

function renderComposer(props: { empty?: boolean } = {}) {
  const onSubmit = vi.fn<(text: string) => void>();
  render(<CommandComposer {...props} onSubmit={onSubmit} />);
  box().focus();
  return onSubmit;
}

function accessibleOptions() {
  const names = new Map<Element, string>();
  return screen
    .queryAllByRole("option", {
      name: (name, option) => {
        names.set(option, name);
        return true;
      },
    })
    .map((option) => ({
      highlighted: Object.hasOwn(option.dataset, "highlighted"),
      name: names.get(option),
    }));
}
const options = () => accessibleOptions().map((option) => option.name);
const highlighted = () =>
  accessibleOptions().find((option) => option.highlighted)?.name;
const isOpen = () => screen.queryAllByRole("listbox").length > 0;
const send = () =>
  screen.getByRole<HTMLButtonElement>("button", { name: "Send" });

test("Enter submits the form; Shift+Enter and Enter while an IME composes don't", () => {
  const onSubmit = vi.fn<() => void>();
  render(
    <PromptInput
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <PromptInputTextarea aria-label="Message" />
    </PromptInput>
  );

  fireEvent.keyDown(box(), { key: "Enter", shiftKey: true });
  fireEvent.keyDown(box(), { isComposing: true, key: "Enter" });
  expect(onSubmit).not.toHaveBeenCalled();

  fireEvent.keyDown(box(), { key: "Enter" });
  expect(onSubmit).toHaveBeenCalledOnce();
});

test.each([
  ["apple", { metaKey: true }, false],
  ["apple", { ctrlKey: true }, true],
  ["other", { ctrlKey: true }, false],
  ["other", { altKey: true }, false],
  ["other", { metaKey: true }, true],
] as const)(
  "on %s, Enter with %o submits: %s",
  (platform, modifier, submits) => {
    setPlatform(platform);
    try {
      const onSubmit = vi.fn<() => void>();
      render(
        <PromptInput
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <PromptInputTextarea aria-label="Message" />
        </PromptInput>
      );

      fireEvent.keyDown(box(), { key: "Enter", ...modifier });
      expect(onSubmit).toHaveBeenCalledTimes(submits ? 1 : 0);
    } finally {
      setPlatform("other");
    }
  }
);

test("a caller's onKeyDown that prevents default keeps Enter from submitting", () => {
  const onSubmit = vi.fn<() => void>();
  render(
    <PromptInput
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <PromptInputTextarea
        aria-label="Message"
        onKeyDown={(event) => {
          event.preventDefault();
        }}
      />
    </PromptInput>
  );

  fireEvent.keyDown(box(), { key: "Enter" });
  expect(onSubmit).not.toHaveBeenCalled();
});

test("/ lists every command, named by its text and not its icon, with the first highlighted", async () => {
  renderComposer();
  await type("/");

  expect(options()).toEqual([
    "Summarize",
    "Weekly report",
    "Draft an email",
    "Translate",
  ]);
  expect(highlighted()).toBe("Summarize");
});

test("filtering ignores a command's icon", async () => {
  renderComposer();
  await type("/icon");

  expect(isOpen()).toBe(false);
});

test("typing after / keeps the commands that contain it", async () => {
  renderComposer();
  await type("/tr");

  expect(options()).toEqual(["Translate"]);
  expect(highlighted()).toBe("Translate");
});

test("Enter inserts the highlighted command into the draft instead of submitting", async () => {
  const onSubmit = renderComposer();
  await type("/tr");
  await press("Enter");

  expect(box().value).toBe("/translate ");
  expect(send().disabled).toBe(false);
  expect(isOpen()).toBe(false);
  expect(onSubmit).not.toHaveBeenCalled();
});

test("a click on a command inserts it and keeps focus in the textarea", async () => {
  renderComposer();
  await type("/");
  await click(screen.getByRole("option", { name: "Draft an email" }));

  expect(box().value).toBe("/draft-email ");
  expect(document.activeElement).toBe(box());
});

test("Tab picks the highlighted command", async () => {
  const onSubmit = renderComposer();
  await type("/su");
  await press("Tab");

  expect(box().value).toBe("/summarize ");
  expect(document.activeElement).toBe(box());
  expect(onSubmit).not.toHaveBeenCalled();
});

test("Escape closes the list and keeps the text, then Enter submits it", async () => {
  const onSubmit = renderComposer();
  await type("/tr");
  await press("Escape");

  expect(isOpen()).toBe(false);
  expect(box().value).toBe("/tr");

  await press("Enter");
  expect(onSubmit.mock.calls).toEqual([["/tr"]]);
});

test("without an empty message, a query that matches nothing closes the list and Enter submits", async () => {
  const onSubmit = renderComposer();
  await type("/zz");

  expect(isOpen()).toBe(false);

  await press("Enter");
  expect(onSubmit.mock.calls).toEqual([["/zz"]]);
});

test("with an empty message, a query that matches nothing shows it and Enter doesn't submit", async () => {
  const onSubmit = renderComposer({ empty: true });
  await type("/zz");

  expect(screen.getByText("No commands found.")).toBeTruthy();

  await press("Enter");
  expect(onSubmit).not.toHaveBeenCalled();
});

test.each([
  ["apple", "Meta+Enter"],
  ["other", "Control+Enter"],
] as const)(
  "on %s, %s with the list open neither picks nor submits",
  async (platform, keys) => {
    setPlatform(platform);
    try {
      const onSubmit = renderComposer();
      await type("/tr");
      await press(keys);

      expect(box().value).toBe("/tr");
      expect(onSubmit).not.toHaveBeenCalled();
    } finally {
      setPlatform("other");
    }
  }
);

test("on other, Meta+Enter with the list open submits the draft without picking", async () => {
  const onSubmit = renderComposer();
  await type("/tr");
  await press("Meta+Enter");

  expect(onSubmit.mock.calls).toEqual([["/tr"]]);
  expect(box().value).toBe("");
});

test("the list opens as one popup, as wide as the composer", async () => {
  const popups = new Set<Element>();
  const observer = new MutationObserver((records) => {
    for (const node of records.flatMap((record) => [...record.addedNodes])) {
      if (node instanceof Element) {
        for (const popup of [node, ...node.querySelectorAll("*")]) {
          if (popup.matches("[data-slot='trigger-menu-content']")) {
            popups.add(popup);
          }
        }
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  render(
    <StrictMode>
      <CommandComposer />
    </StrictMode>
  );
  const composer = box().closest("[data-slot='input-group']");
  if (!(composer instanceof HTMLElement)) {
    throw new TypeError("The textarea isn't in the composer's input group.");
  }
  composer.getBoundingClientRect = () => new DOMRect(0, 300, 480, 100);
  box().focus();

  await type("/");
  observer.disconnect();

  expect(popups.size).toBe(1);
  const [popup] = popups;
  expect(popup?.isConnected).toBe(true);
  expect(
    popup instanceof HTMLElement &&
      popup.style.getPropertyValue("--anchor-width")
  ).toBe("480px");
});

test("a screen reader hears how many commands match", async () => {
  renderComposer();
  await type("/");

  await waitFor(() => {
    expect(screen.getByRole("status").textContent).toContain("4 suggestions");
  });
});

function Submit({
  disabled,
  onStop,
  onSubmit,
  state,
}: {
  disabled?: boolean;
  onStop?: () => void;
  onSubmit: () => void;
  state: PromptInputState;
}) {
  return (
    <PromptInput
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <PromptInputTextarea aria-label="Message" />
      <PromptInputFooter>
        <PromptInputSubmit disabled={disabled} onStop={onStop} state={state} />
      </PromptInputFooter>
    </PromptInput>
  );
}

test("while streaming, the submit button is Stop: a press calls onStop and doesn't submit", async () => {
  const onStop = vi.fn<() => void>();
  const onSubmit = vi.fn<() => void>();
  render(<Submit onStop={onStop} onSubmit={onSubmit} state="streaming" />);

  await click(screen.getByRole("button", { name: "Stop" }));

  expect(onStop).toHaveBeenCalledOnce();
  expect(onSubmit).not.toHaveBeenCalled();
});

const buttonRef = (label: string) =>
  agent
    .snapshot()
    .find(
      (entry) =>
        entry.offPage !== true &&
        entry.component === "button" &&
        entry.label === label
    )?.ref;

// ui-sdk retires an unmounted part's ref a microtask later, so each swap settles as it would on a page.
async function swapTo(rerender: (ui: ReactNode) => void, ui: ReactNode) {
  await act(async () => {
    rerender(ui);
    await Promise.resolve();
  });
}

test("Send and Stop are separate refs, and Send keeps its ref across a stream", async () => {
  const { rerender } = render(
    <Submit onStop={() => {}} onSubmit={() => {}} state="ready" />
  );
  const sendBefore = buttonRef("Send");

  await swapTo(
    rerender,
    <Submit onStop={() => {}} onSubmit={() => {}} state="streaming" />
  );
  const stop = buttonRef("Stop");

  await swapTo(
    rerender,
    <Submit onStop={() => {}} onSubmit={() => {}} state="ready" />
  );
  const sendAfter = buttonRef("Send");

  expect(sendBefore).toBeTruthy();
  expect(stop).toBeTruthy();
  expect(stop).not.toBe(sendBefore);
  expect(sendAfter).toBe(sendBefore);
});

test("an agent pressing Send's ref while streaming doesn't stop the stream", async () => {
  const onStop = vi.fn<() => void>();
  const onSubmit = vi.fn<() => void>();
  const { rerender } = render(
    <Submit onStop={onStop} onSubmit={onSubmit} state="ready" />
  );
  const sendRef = buttonRef("Send");
  expect(sendRef).toBeTruthy();

  rerender(<Submit onStop={onStop} onSubmit={onSubmit} state="streaming" />);
  await agent.act({ steps: [{ action: "press", ref: sendRef ?? "" }] });

  expect(onStop).not.toHaveBeenCalled();
});

test("while streaming, an agent sees Stop and no leftover Send", async () => {
  const { rerender } = render(<Submit onSubmit={() => {}} state="ready" />);
  agent.snapshot();

  await swapTo(rerender, <Submit onSubmit={() => {}} state="streaming" />);

  expect(
    agent
      .snapshot()
      .map(
        (entry) =>
          `${entry.component} ${entry.label}${entry.offPage === true ? " (off page)" : ""}`
      )
      .toSorted()
  ).toEqual(["button Stop", "textarea Message"]);
});

test("focus on Send moves to Stop when the stream starts", async () => {
  const { rerender } = render(<Submit onSubmit={() => {}} state="ready" />);
  send().focus();

  await swapTo(rerender, <Submit onSubmit={() => {}} state="streaming" />);

  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: "Stop" })
  );
});

test("focus on Stop moves to the textarea when Send comes back disabled", async () => {
  const { rerender } = render(
    <Submit disabled onSubmit={() => {}} state="streaming" />
  );
  screen.getByRole<HTMLButtonElement>("button", { name: "Stop" }).focus();

  await swapTo(rerender, <Submit disabled onSubmit={() => {}} state="ready" />);

  expect(send().disabled).toBe(true);
  expect(document.activeElement).toBe(box());
});

test("focus in the textarea stays there as Send and Stop swap", async () => {
  const { rerender } = render(<Submit onSubmit={() => {}} state="ready" />);
  box().focus();

  await swapTo(rerender, <Submit onSubmit={() => {}} state="streaming" />);
  expect(document.activeElement).toBe(box());

  await swapTo(rerender, <Submit onSubmit={() => {}} state="ready" />);
  expect(document.activeElement).toBe(box());
});

test("a custom stopLabel names Stop", () => {
  render(
    <PromptInput>
      <PromptInputSubmit state="streaming" stopLabel="Stop answering" />
    </PromptInput>
  );

  expect(screen.getByRole("button", { name: "Stop answering" })).toBeTruthy();
});

test("once submitted, the submit button is busy", () => {
  render(<Submit onSubmit={() => {}} state="submitted" />);

  expect(send().getAttribute("aria-busy")).toBe("true");
});

test.each([
  ["ready", "Send"],
  ["submitted", "Send"],
  ["streaming", "Stop"],
] as const)("while %s, %s writes the state as data-state", (state, name) => {
  render(<Submit onSubmit={() => {}} state={state} />);

  expect(screen.getByRole("button", { name }).dataset.state).toBe(state);
});

test("a disabled submit button doesn't submit", async () => {
  const onSubmit = vi.fn<() => void>();
  render(<Submit disabled onSubmit={onSubmit} state="ready" />);

  await click(send());

  expect(onSubmit).not.toHaveBeenCalled();
});

test("an agent finds the message field, its command menu and Send by name", () => {
  render(<CommandComposer />);

  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(
    entries.map((entry) => `${entry.component} ${entry.label}`).toSorted()
  ).toEqual(["button Send", "textarea Message", "trigger-menu Message"]);
});

const onPage = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

function expectNamedExactly(expected: string[]) {
  for (const entry of onPage()) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(
    onPage()
      .map((entry) => `${entry.component} ${entry.label}`)
      .toSorted()
  ).toEqual(expected.toSorted());
}

const noFiles: string[] = [];

function Composer({
  files: initialFiles = noFiles,
  onAttach,
  onSubmit,
}: {
  files?: string[];
  onAttach?: () => void;
  onSubmit?: (text: string) => void;
}) {
  const [files, setFiles] = useState(initialFiles);
  const [text, setText] = useState("");
  return (
    <PromptInput
      onSubmit={(event) => {
        event.preventDefault();
        if (text.trim() === "") {
          return;
        }
        onSubmit?.(text);
        setText("");
      }}
    >
      {files.length > 0 && (
        <PromptInputHeader>
          <AttachmentGroup>
            {files.map((file) => (
              <Attachment key={file} size="sm">
                <AttachmentContent>
                  <AttachmentTitle>{file}</AttachmentTitle>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    aria-label={`Remove ${file}`}
                    onClick={() => {
                      setFiles(files.filter((other) => other !== file));
                    }}
                  >
                    x
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            ))}
          </AttachmentGroup>
        </PromptInputHeader>
      )}
      <PromptInputTextarea
        aria-label="Message"
        onChange={(event) => {
          setText(event.target.value);
        }}
        value={text}
      />
      <PromptInputFooter>
        <PromptInputTools>
          <InputGroupButton
            aria-label="Attach"
            onClick={onAttach}
            size="icon-sm"
          >
            +
          </InputGroupButton>
        </PromptInputTools>
        <PromptInputSubmit disabled={text.trim() === ""} />
      </PromptInputFooter>
    </PromptInput>
  );
}

test("an agent writes a message, attaches and sends it", async () => {
  const onAttach = vi.fn<() => void>();
  const onSubmit = vi.fn<(text: string) => void>();
  render(<Composer onAttach={onAttach} onSubmit={onSubmit} />);
  expectNamedExactly(["button Attach", "button Send", "textarea Message"]);

  const result = await agent.act({
    steps: [
      { action: "setValue", args: ["Summarize Q3"], ref: "Message" },
      { action: "press", ref: "Attach" },
      { action: "press", ref: "Send" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(onAttach).toHaveBeenCalledOnce();
  expect(onSubmit.mock.calls).toEqual([["Summarize Q3"]]);
  expect(box().value).toBe("");
});

test("an agent finds each attachment's Remove by name and removes one", async () => {
  render(<Composer files={["q3-report.xlsx", "brand-guidelines.pdf"]} />);
  expectNamedExactly([
    "button Attach",
    "button Remove brand-guidelines.pdf",
    "button Remove q3-report.xlsx",
    "button Send",
    "textarea Message",
  ]);

  const result = await agent.act({
    steps: [{ action: "press", ref: "Remove q3-report.xlsx" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(screen.queryByText("q3-report.xlsx")).toBeNull();
  expect(screen.getByText("brand-guidelines.pdf")).toBeTruthy();
});

test("an agent's setValue on Message lands on the textarea, not the command menu that shares its name", async () => {
  const onSubmit = vi.fn<(text: string) => void>();
  render(<CommandComposer onSubmit={onSubmit} />);

  const result = await agent.act({
    steps: [
      { action: "setValue", args: ["Translate this"], ref: "Message" },
      { action: "press", ref: "Send" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(onSubmit.mock.calls).toEqual([["Translate this"]]);
});

interface ValueChange {
  source: string;
  value: string;
}

function Draft({
  changes,
  reject = false,
}: {
  changes: ValueChange[];
  reject?: boolean;
}) {
  const [text, setText] = useState("Hello");
  return (
    <PromptInput>
      <PromptInputTextarea
        aria-label="Message"
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
    </PromptInput>
  );
}

test("an agent's setValue reaches a controlled textarea's onValueChange as the agent's", async () => {
  const changes: ValueChange[] = [];
  render(<Draft changes={changes} />);

  const result = await agent.act({
    steps: [{ action: "setValue", args: ["Summarize Q3"], ref: "Message" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(changes).toEqual([{ source: "agent", value: "Summarize Q3" }]);
  expect(box().value).toBe("Summarize Q3");
});

test("a controlled textarea whose onValueChange cancels the agent's setValue keeps its text and tells the agent", async () => {
  const changes: ValueChange[] = [];
  render(<Draft changes={changes} reject />);

  const result = await agent.act({
    steps: [{ action: "setValue", args: ["Summarize Q3"], ref: "Message" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(result.steps.map((step) => step.result)).toEqual([false]);
  expect(changes).toEqual([{ source: "agent", value: "Summarize Q3" }]);
  expect(box().value).toBe("Hello");
});

// ui-sdk 0.1.0-beta.13's trigger-menu `insert` puts the raw text in place of the query, skipping the trigger's own `insert`; expect "/translate " once it doesn't.
test("an agent's insert through the command menu skips the trigger's insert", async () => {
  render(<CommandComposer />);
  box().focus();

  const result = await agent.act({
    steps: [
      { action: "setValue", args: ["/"], ref: "Message" },
      { action: "insert", args: ["translate"], ref: "Message" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(box().value).toBe("/translate");
});
