"use client";

import { useVirtualizer, useWindowVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useLayoutEffect, useState } from "react";
import type { RefObject } from "react";

// The server has no window, so it renders the rows that fit a typical one.
const serverRect = { height: 900, width: 1280 };

// Measures now and again whenever one of the targets changes size; returns the cleanup.
const trackMargin = (measure: () => void, targets: readonly Element[]) => {
  measure();
  const observer = new ResizeObserver(measure);
  for (const target of targets) {
    observer.observe(target);
  }
  return () => {
    observer.disconnect();
  };
};

// The cleanup for an effect that tracks nothing, as the other mode does the measuring.
const keepMargin = () => null;

// Virtualizes against the window, or the element `scrollRef` names. Both hooks always run,
// as hooks can't be conditional, and only the one in use is enabled.
function useDataTableVirtualizer({
  body,
  rowHeight,
  rows,
  scrollRef,
}: {
  body: RefObject<HTMLTableSectionElement | null>;
  rowHeight: number;
  rows: readonly { id: string }[];
  scrollRef: RefObject<HTMLElement | null> | undefined;
}) {
  const [scrollMargin, setScrollMargin] = useState(0);

  // The body's distance from the top of what scrolls, which the scroll offset is
  // measured from; measured again whenever the content above it changes height.
  useLayoutEffect(() => {
    if (scrollRef !== undefined) {
      return keepMargin;
    }
    return trackMargin(() => {
      const top = body.current?.getBoundingClientRect().top ?? 0;
      setScrollMargin(top + window.scrollY);
    }, [document.body]);
  }, [body, scrollRef]);

  // Passive, as a parent's ref attaches only after its children's layout effects run.
  useEffect(() => {
    const scroller = scrollRef?.current;
    if (scroller === undefined || scroller === null) {
      return keepMargin;
    }
    return trackMargin(() => {
      const top = body.current?.getBoundingClientRect().top ?? 0;
      setScrollMargin(
        // `scrollTop` counts from inside the border.
        top -
          scroller.getBoundingClientRect().top -
          scroller.clientTop +
          scroller.scrollTop
      );
    }, [scroller, ...scroller.children]);
  }, [body, scrollRef]);

  const options = {
    count: rows.length,
    estimateSize: () => rowHeight,
    getItemKey: (index: number) => rows[index]?.id ?? index,
    overscan: 8,
    scrollMargin,
  };
  // oxlint-disable-next-line react/incompatible-library -- the virtualizer re-renders on scroll by design
  const onWindow = useWindowVirtualizer({
    ...options,
    enabled: scrollRef === undefined,
    initialRect: serverRect,
  });
  // oxlint-disable-next-line react/incompatible-library -- the virtualizer re-renders on scroll by design
  const inElement = useVirtualizer({
    ...options,
    enabled: scrollRef !== undefined,
    getScrollElement: () => scrollRef?.current ?? null,
  });
  const virtualizer = scrollRef === undefined ? onWindow : inElement;
  const items = virtualizer.getVirtualItems();
  const [first] = items;
  const last = items.at(-1);
  return {
    items,
    // The height of the rows not rendered above and below the ones that are.
    padAfter:
      last === undefined
        ? 0
        : virtualizer.getTotalSize() - (last.end - scrollMargin),
    padBefore: first === undefined ? 0 : first.start - scrollMargin,
    virtualizer,
  };
}

export { useDataTableVirtualizer };
