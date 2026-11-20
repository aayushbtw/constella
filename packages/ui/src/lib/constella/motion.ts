import { useState } from "react";
import { flushSync } from "react-dom";

interface OpenChangeDetails {
  reason: string;
  source: string;
}

// ui-sdk marks no change `data-instant` outside Tooltip, but reports how each one came about.
function skipsMotion(_open: boolean, { reason, source }: OpenChangeDetails) {
  return (
    source === "keyboard" || reason === "focus-out" || reason === "item-press"
  );
}

/** Wraps a popup root's `onOpenChange`; `skip` is true while `skips` holds, by default while the keyboard, Esc or a picked item moved it. */
function useSkipMotion<Details extends OpenChangeDetails>(
  onOpenChange?: (open: boolean, details: Details) => void,
  skips: (open: boolean, details: Details) => boolean = skipsMotion
) {
  const [skip, setSkip] = useState(false);
  function handleOpenChange(open: boolean, details: Details) {
    const next = skips(open, details);
    if (next !== skip) {
      // ui-sdk reads the content's transitions right after this callback, so the attribute lands first.
      flushSync(() => {
        setSkip(next);
      });
    }
    onOpenChange?.(open, details);
  }
  return [skip, handleOpenChange] as const;
}

export { skipsMotion, useSkipMotion };
