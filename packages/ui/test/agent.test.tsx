import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { Switch, SwitchThumb } from "@ui-sdk/react/switch";
import { expect, test } from "vite-plus/test";

function Settings() {
  return (
    <>
      <label>
        Airplane mode
        <Switch>
          <SwitchThumb />
        </Switch>
      </label>
      <label>
        Weekly digest
        <Switch defaultChecked>
          <SwitchThumb />
        </Switch>
      </label>
    </>
  );
}

test("an agent can find and change every setting", async () => {
  const agent = createAgent();
  render(<Settings />);

  const components = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of components) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  const labels = components.map((entry) => entry.label);
  for (const label of ["Airplane mode", "Weekly digest"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label);
  }

  const result = await agent.act({
    steps: [
      { action: "setChecked", args: [true], ref: "Airplane mode" },
      { action: "setChecked", args: [false], ref: "Weekly digest" },
    ],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen
      .getByRole("switch", { name: "Airplane mode" })
      .getAttribute("aria-checked")
  ).toBe("true");
  expect(
    screen
      .getByRole("switch", { name: "Weekly digest" })
      .getAttribute("aria-checked")
  ).toBe("false");
});
