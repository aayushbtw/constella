import { act } from "@testing-library/react";
import { button } from "@ui-sdk/core/button";
import { mount } from "@ui-sdk/core/testing";

// `keys` isn't exported from `@ui-sdk/core/testing`; remove this helper when it is.
export async function pressKeys(...names: string[]): Promise<void> {
  if (names.some((name) => name === "Tab" || name === "Shift+Tab")) {
    throw new Error(
      "pressKeys can't press Tab: mount scopes it to its own markup"
    );
  }
  const view = mount(button, {}, "<root data-agent-hidden>x</root>");
  try {
    await act(async () => {
      await view.keys(...names);
    });
  } finally {
    view.unmount();
  }
}
