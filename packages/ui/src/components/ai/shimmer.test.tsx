import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { Text } from "@/components/typography/text";

import { Shimmer } from "./shimmer";

const agent = createAgent();

test("shimmering text adds nothing an agent could act on", () => {
  render(
    <Text color="muted">
      <Shimmer>Thinking…</Shimmer>
    </Text>
  );

  expect(screen.getByText("Thinking…")).toBeTruthy();
  expect(agent.snapshot().filter((entry) => entry.offPage !== true)).toEqual(
    []
  );
});
