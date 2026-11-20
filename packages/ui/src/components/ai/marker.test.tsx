import { render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { expect, test } from "vite-plus/test";

import { Spinner } from "@/components/primitives/spinner";

import { Marker, MarkerContent, MarkerIcon } from "./marker";
import { Shimmer } from "./shimmer";

const agent = createAgent();

test("markers add nothing an agent could act on, in every variant, as a status and as a link", () => {
  render(
    <>
      <Marker>
        <MarkerIcon>
          <svg aria-hidden />
        </MarkerIcon>
        <MarkerContent>Switched to a faster model for this chat.</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerContent>Context compacted to fit the window.</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker render={<output />}>
        <Spinner />
        <MarkerContent>
          <Shimmer>Searching the web…</Shimmer>
        </MarkerContent>
      </Marker>
      <Marker
        // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the marker renders its children into the link
        render={<a href="#marker" />}
      >
        <MarkerContent>Branched from “Plan the launch”</MarkerContent>
      </Marker>
    </>
  );

  expect(
    screen.getByRole("link", { name: "Branched from “Plan the launch”" })
  ).toBeTruthy();
  expect(agent.snapshot().filter((entry) => entry.offPage !== true)).toEqual(
    []
  );
});
