import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { beforeEach, expect, onTestFinished, test, vi } from "vite-plus/test";

import { Button } from "@/components/primitives/button";
import { CopyButton } from "@/components/primitives/copy-button";

import { Message, MessageActions, MessageContent } from "./message";
import type { MessageScrollerPosition } from "./message-scroller";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerState,
} from "./message-scroller";

const agent = createAgent();

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

const viewportHeight = 200;
const itemHeight = 250;

const layout = { top: 0, height: 0 };

const resizeObservers = new Set<FakeResizeObserver>();

const entryFor = (target: Element): ResizeObserverEntry => ({
  borderBoxSize: [],
  contentBoxSize: [],
  contentRect: target.getBoundingClientRect(),
  devicePixelContentBoxSize: [],
  target,
});

class FakeResizeObserver implements ResizeObserver {
  readonly #notify: ResizeObserverCallback;
  readonly #targets = new Set<Element>();

  constructor(notify: ResizeObserverCallback) {
    this.#notify = notify;
    resizeObservers.add(this);
  }

  observe(target: Element) {
    this.#targets.add(target);
  }

  unobserve(target: Element) {
    this.#targets.delete(target);
  }

  disconnect() {
    this.#targets.clear();
  }

  resize() {
    this.#notify(
      [...this.#targets].map((target) => entryFor(target)),
      this
    );
  }
}

function resize() {
  for (const observer of resizeObservers) {
    observer.resize();
  }
}

beforeEach(() => {
  layout.top = 0;
  layout.height = 0;
  resizeObservers.clear();
  vi.stubGlobal("ResizeObserver", FakeResizeObserver);
  vi.stubGlobal("matchMedia", () => ({ matches: false }));
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function rect(this: Element) {
      if (
        this instanceof HTMLElement &&
        this.dataset.slot === "message-scroller-item"
      ) {
        const index = [...(this.parentElement?.children ?? [])].indexOf(this);
        return new DOMRect(0, index * itemHeight - layout.top, 300, itemHeight);
      }
      return new DOMRect(0, 0, 300, viewportHeight);
    }
  );
  onTestFinished(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });
});

function viewport() {
  const element = document.querySelector(
    "[data-slot='message-scroller-viewport']"
  );
  if (!(element instanceof HTMLElement)) {
    throw new TypeError("The scroller has no viewport.");
  }
  return element;
}

function stubScroller(height: number) {
  layout.height = height;
  const element = viewport();
  Object.defineProperties(element, {
    clientHeight: { configurable: true, get: () => viewportHeight },
    scrollHeight: { configurable: true, get: () => layout.height },
    scrollTop: {
      configurable: true,
      get: () => layout.top,
      set: (value: number) => {
        layout.top = value;
        element.dispatchEvent(new Event("scroll"));
      },
    },
    scrollTo: {
      configurable: true,
      value: (options: ScrollToOptions) => {
        element.scrollTop = options.top ?? layout.top;
      },
    },
  });
  fireEvent.scroll(element);
}

interface Turn {
  from: "user" | "assistant";
  id: string;
}

const firstTurns: Turn[] = [
  { from: "user", id: "question" },
  { from: "assistant", id: "answer" },
];

function Controls({
  onAsk,
  onLoadOlder,
}: {
  onAsk: () => void;
  onLoadOlder: () => void;
}) {
  const { prepend, scrollToMessage, scrollToStart } = useMessageScroller();
  const { following } = useMessageScrollerState();
  return (
    <>
      <output aria-label="Following">{String(following)}</output>
      <button onClick={onAsk} type="button">
        Ask
      </button>
      <button
        onClick={() => {
          prepend();
          onLoadOlder();
        }}
        type="button"
      >
        Load older
      </button>
      <button
        onClick={() => {
          scrollToMessage("answer");
        }}
        type="button"
      >
        To answer
      </button>
      <button
        onClick={() => {
          scrollToStart();
        }}
        type="button"
      >
        To start
      </button>
    </>
  );
}

function Thread({
  defaultScrollPosition,
}: {
  defaultScrollPosition?: MessageScrollerPosition;
}) {
  const [turns, setTurns] = useState(firstTurns);
  return (
    <MessageScrollerProvider defaultScrollPosition={defaultScrollPosition}>
      <MessageScroller>
        <MessageScrollerViewport aria-label="Conversation">
          <MessageScrollerContent>
            {turns.map((turn) => (
              <MessageScrollerItem
                key={turn.id}
                messageId={turn.id}
                scrollAnchor={turn.from === "user"}
              >
                {turn.id}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
      <Controls
        onAsk={() => {
          setTurns([
            ...turns,
            { from: "user", id: "follow-up" },
            { from: "assistant", id: "follow-up-answer" },
          ]);
        }}
        onLoadOlder={() => {
          layout.height += itemHeight;
          setTurns([{ from: "assistant", id: "older" }, ...turns]);
        }}
      />
    </MessageScrollerProvider>
  );
}

const following = () => screen.getByLabelText("Following").textContent;

test("at the end, the snapshot lists the scroll area by the viewport's name and Scroll to end with nothing to press", () => {
  render(
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport aria-label="Conversation">
          <MessageScrollerContent>
            <MessageScrollerItem messageId="question">
              What is Constella?
            </MessageScrollerItem>
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );

  expect(entries()).toEqual([
    expect.objectContaining({
      actions: [],
      component: "scroll-area",
      label: "Conversation",
    }),
    expect.objectContaining({
      actions: [],
      component: "button",
      disabled: true,
      label: "Scroll to end",
    }),
  ]);
  expect(screen.getByRole("region", { name: "Conversation" })).toBeDefined();
});

test("an aria-label on the button names it for agents and screen readers", () => {
  render(
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerButton aria-label="Scroll chat to end" />
      </MessageScroller>
    </MessageScrollerProvider>
  );

  expect(entries()).toEqual([
    expect.objectContaining({
      component: "button",
      label: "Scroll chat to end",
    }),
  ]);
});

test("opened at the start with more below, an agent presses Scroll to end and the thread follows its end", async () => {
  render(<Thread defaultScrollPosition="start" />);
  stubScroller(1000);
  expect(following()).toBe("false");
  expect(entries()).toContainEqual(
    expect.objectContaining({ actions: ["press"], label: "Scroll to end" })
  );

  const result = await agent.act({
    steps: [{ action: "press", ref: "Scroll to end" }],
  });

  expect(result.ok, result.error?.message).toBe(true);
  expect(layout.top).toBe(1000 - viewportHeight);
  expect(following()).toBe("true");
  expect(entries()).toContainEqual(
    expect.objectContaining({ actions: [], label: "Scroll to end" })
  );
});

test("scrollToMessage brings a registered message to the top, and scrollToStart goes back", () => {
  render(<Thread defaultScrollPosition="start" />);
  stubScroller(1000);

  fireEvent.click(screen.getByRole("button", { name: "To answer" }));
  expect(layout.top).toBe(itemHeight);

  fireEvent.click(screen.getByRole("button", { name: "To start" }));
  expect(layout.top).toBe(0);
  expect(following()).toBe("false");
});

test("prepend before older messages load above keeps the message in view where it was", () => {
  render(<Thread defaultScrollPosition="start" />);
  stubScroller(1000);
  expect(layout.top).toBe(0);

  fireEvent.click(screen.getByRole("button", { name: "Load older" }));
  act(() => {
    resize();
  });

  expect(layout.top).toBe(itemHeight);
  expect(following()).toBe("false");
});

test("the viewport is a tab stop only while it overflows and holds no control", async () => {
  const { rerender } = render(
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport aria-label="Conversation">
          <MessageScrollerContent>
            <MessageScrollerItem messageId="question">
              What is Constella?
            </MessageScrollerItem>
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
  );
  const conversation = screen.getByRole("region", { name: "Conversation" });
  expect(conversation.hasAttribute("tabindex")).toBe(false);

  stubScroller(1000);
  await waitFor(() => {
    expect(conversation.getAttribute("tabindex")).toBe("0");
  });

  rerender(
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport aria-label="Conversation">
          <MessageScrollerContent>
            <MessageScrollerItem messageId="question">
              <button type="button">Copy</button>
            </MessageScrollerItem>
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
    </MessageScrollerProvider>
  );
  fireEvent.scroll(conversation);
  await waitFor(() => {
    expect(conversation.hasAttribute("tabindex")).toBe(false);
  });
});

test("pressing Scroll to end while it has focus moves focus into the log, not the page", async () => {
  render(<Thread defaultScrollPosition="start" />);
  stubScroller(1000);
  const button = screen.getByRole("button", { name: "Scroll to end" });
  button.focus();

  await agent.act({ steps: [{ action: "press", ref: "Scroll to end" }] });

  expect(document.activeElement).toBe(screen.getByRole("log"));
});

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

function Chat({
  onRetry,
  replies,
}: {
  onRetry?: (reply: string) => void;
  replies: string[];
}) {
  return (
    <MessageScrollerProvider>
      <MessageScroller>
        <MessageScrollerViewport aria-label="Conversation">
          <MessageScrollerContent>
            {replies.map((reply) => (
              <MessageScrollerItem key={reply} messageId={reply}>
                <Message from="assistant">
                  <MessageContent>{reply}</MessageContent>
                  <MessageActions>
                    <CopyButton value={reply} />
                    <Button
                      aria-label="Retry"
                      onClick={() => onRetry?.(reply)}
                      size="icon-sm"
                      variant="ghost"
                    />
                  </MessageActions>
                </Message>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
      </MessageScroller>
      <Button>Send</Button>
    </MessageScrollerProvider>
  );
}

const replies = [
  "Constella is a component library on ui-sdk and StyleX.",
  "Themes are one file of tokens.",
];

test("each reply is a row, so an agent copies or retries one reply by its words", async () => {
  const writeText = stubClipboard();
  const onRetry = vi.fn<(reply: string) => void>();
  render(<Chat onRetry={onRetry} replies={replies} />);

  expect(
    entries()
      .filter((entry) => entry.label === "Copy")
      .map((entry) => entry.row)
  ).toEqual(replies);

  const plain = await agent.act({ steps: [{ action: "press", ref: "Copy" }] });
  expect(plain.error?.message).toContain('"Copy" names 2 components');

  const result = await agent.act({
    steps: [
      { action: "press", ref: "Copy themes" },
      { action: "press", ref: "Retry component library" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(writeText.mock.calls).toEqual([[replies[1]]]);
  expect(onRetry.mock.calls).toEqual([[replies[0]]]);
});

test("the thread is a list of turns that announces each new one", () => {
  render(<Chat replies={replies} />);

  const thread = screen.getByRole("list");
  expect(thread.getAttribute("aria-live")).toBe("polite");
  expect(thread.getAttribute("aria-relevant")).toBe("additions");
  expect(screen.getAllByRole("listitem")).toHaveLength(replies.length);
});

// Known gap, upstream: an exact label doesn't outrank row words, so a reply
// that says "send" makes the composer's Send ambiguous.
test("a reply's words join its actions' names, so a reply that says send collides with Send", async () => {
  render(<Chat replies={["To send a file, attach it first."]} />);

  const result = await agent.act({ steps: [{ action: "press", ref: "Send" }] });

  expect(result.error?.message).toContain('"Send" names 3 components');
});

test("a new question marked scrollAnchor lets go of the end, so the answer streams below it", () => {
  render(<Thread />);
  stubScroller(1000);
  act(() => {
    viewport().scrollTop = 1000 - viewportHeight;
  });
  expect(following()).toBe("true");

  fireEvent.click(screen.getByRole("button", { name: "Ask" }));

  expect(following()).toBe("false");
});
