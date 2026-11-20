import { useState } from "react";
import { flushSync } from "react-dom";

interface OpenChangeDetails {
  reason: string;
  source: string;
}

// ui-sdk marks no change `data-instant` outside Tooltip, but reports how each one came about.
function skipsMotion({ reason, source }: OpenChangeDetails) {
  return (
    source === "keyboard" || reason === "focus-out" || reason === "item-press"
  );
}

/** Wraps a popup root's `onOpenChange`; `skip` is true while the keyboard, Esc, a picked item or `alsoSkips` moved it. */
function useSkipMotion<Details extends OpenChangeDetails>(
  onOpenChange?: (open: boolean, details: Details) => void,
  alsoSkips?: (open: boolean, details: Details) => boolean
) {
  const [skip, setSkip] = useState(false);
  function handleOpenChange(open: boolean, details: Details) {
    const next = skipsMotion(details) || (alsoSkips?.(open, details) ?? false);
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

export { useSkipMotion };
