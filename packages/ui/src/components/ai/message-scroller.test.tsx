import { fireEvent, render, waitFor } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, onTestFinished, test, vi } from "vite-plus/test";

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "./message-scroller";

const agent = createAgent();

const entries = () =>
  agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");

function Thread() {
  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <MessageScroller>
        <MessageScrollerViewport aria-label="Conversation">
          <MessageScrollerContent>
            <MessageScrollerItem messageId="question" scrollAnchor>
              What is Constella?
            </MessageScrollerItem>
            <MessageScrollerItem messageId="answer">
              A component library on ui-sdk and StyleX.
            </MessageScrollerItem>
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}

const viewportHeight = 200;
const threadHeight = 1000;

function stubLayout() {
  let top = 0;
  const scrollTo = vi.fn<(options: ScrollToOptions) => void>((options) => {
    top = options.top ?? top;
  });
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(
    function rect(this: Element) {
      if (!(this instanceof HTMLElement)) {
        return new DOMRect();
      }
      switch (this.dataset.slot ?? "") {
        case "message-scroller":
        case "message-scroller-viewport": {
          return new DOMRect(0, 0, 300, viewportHeight);
        }
        case "message-scroller-content": {
          return new DOMRect(0, -top, 300, threadHeight);
        }
        case "message-scroller-item": {
          return new DOMRect(0, threadHeight / 2 - top, 300, threadHeight / 2);
        }
        default: {
          return new DOMRect();
        }
      }
    }
  );
  onTestFinished(() => {
    vi.restoreAllMocks();
  });
  const viewport = render(<Thread />).container.querySelector(
    "[data-slot='message-scroller-viewport']"
  );
  if (!(viewport instanceof HTMLElement)) {
    throw new TypeError("The scroller has no viewport.");
  }
  Object.defineProperties(viewport, {
    clientHeight: { configurable: true, get: () => viewportHeight },
    scrollHeight: { configurable: true, get: () => threadHeight },
    scrollTop: {
      configurable: true,
      get: () => top,
      set: (value: number) => {
        top = value;
      },
    },
    scrollTo: { configurable: true, value: scrollTo },
  });
  fireEvent.scroll(viewport);
  return scrollTo;
}

test("at the end, Scroll to end is the scroller's only entry: named, with nothing to press", () => {
  render(<Thread />);

  expect(entries()).toEqual([
    expect.objectContaining({
      actions: [],
      component: "button",
      disabled: true,
      label: "Scroll to end",
    }),
  ]);
});

test("an aria-label on the button names it for agents and screen readers", () => {
  const { getByRole } = render(
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
  expect(getByRole("button", { name: "Scroll chat to end" })).toBeDefined();
});

test("with more below, an agent presses Scroll to end and the thread scrolls to its end", async () => {
  const scrollTo = stubLayout();
  await waitFor(() => {
    expect(entries()).toEqual([
      expect.objectContaining({
        actions: ["press"],
        component: "button",
        label: "Scroll to end",
      }),
    ]);
  });

  const result = await agent.act({
    steps: [{ action: "press", ref: "Scroll to end" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(scrollTo).toHaveBeenCalledWith(
    expect.objectContaining({ top: threadHeight - viewportHeight })
  );
});
