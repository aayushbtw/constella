import { useState } from "react";
import { flushSync } from "react-dom";

// Base UI's details carry no `source`; ui-sdk's always do.
interface OpenChangeDetails {
  event?: Event;
  reason: string;
  source?: string;
}

function skipsMotion({ event, reason, source }: OpenChangeDetails) {
  // ui-sdk marks no change `data-instant` outside Tooltip, but reports how each one came about.
  if (source !== undefined) {
    return source === "keyboard" || reason === "focus-out";
  }
  // Base UI marks only some keyboard changes `data-instant`, and differently per primitive.
  switch (reason) {
    case "escape-key":
    case "item-press":
    case "list-navigation": {
      return true;
    }
    case "trigger-press": {
      // A click from Enter or Space has no click count.
      return event instanceof UIEvent && event.detail === 0;
    }
    default: {
      return false;
    }
  }
}

/** Wraps a popup root's `onOpenChange`; `skip` is true while the keyboard, Esc or a picked item moved it. */
function useSkipMotion<Details extends OpenChangeDetails>(
  onOpenChange?: (open: boolean, details: Details) => void
) {
  const [skip, setSkip] = useState(false);
  function handleOpenChange(open: boolean, details: Details) {
    const next = skipsMotion(details);
    if (details.source === undefined) {
      setSkip(next);
    } else if (next !== skip) {
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
