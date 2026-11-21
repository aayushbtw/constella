import { act, fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { useState } from "react";
import { beforeEach, expect, onTestFinished, test, vi } from "vite-plus/test";

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

beforeEach(() => {
  layout.top = 0;
  layout.height = 0;
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

function Controls({ onAsk }: { onAsk: () => void }) {
  const { scrollToMessage, scrollToStart } = useMessageScroller();
  const { following } = useMessageScrollerState();
  return (
    <>
      <output aria-label="Following">{String(following)}</output>
      <button onClick={onAsk} type="button">
        Ask
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
      />
    </MessageScrollerProvider>
  );
}

const following = () => screen.getByLabelText("Following").textContent;

test("at the end, Scroll to end is the scroller's only entry: named, with nothing to press", () => {
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
