import { useSyncExternalStore } from "react";

const variable = /^var\((?<name>--[\w-]+)\)$/u;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributeFilter: ["class", "data-theme"],
  });
  return () => {
    observer.disconnect();
  };
}

/** A token's value as the page resolves it, so a theme's override shows. Empty until hydrated. */
function useTokenValue(token: string) {
  const name = variable.exec(token)?.groups?.name;
  return useSyncExternalStore(
    subscribe,
    () =>
      name === undefined
        ? token
        : getComputedStyle(document.documentElement)
            .getPropertyValue(name)
            .trim(),
    () => (name === undefined ? token : "")
  );
}

export { useTokenValue };
