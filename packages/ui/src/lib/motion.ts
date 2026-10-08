import { useState } from "react";

interface OpenChangeDetails {
  event: Event;
  reason: string;
}

// Base UI marks only some keyboard changes `data-instant`, and differently per primitive.
function skipsMotion({ event, reason }: OpenChangeDetails) {
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
    setSkip(skipsMotion(details));
    onOpenChange?.(open, details);
  }
  return [skip, handleOpenChange] as const;
}

export { useSkipMotion };
