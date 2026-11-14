import { fireEvent, render, screen } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import { afterEach, expect, test, vi } from "vite-plus/test";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const agent = createAgent();

afterEach(() => {
  vi.useRealTimers();
});

function Ranges({ orientation }: { orientation?: "horizontal" | "vertical" }) {
  return (
    <Tabs defaultValue="day" orientation={orientation}>
      <TabsList aria-label="Range" size="sm" variant="line">
        <TabsTrigger value="day">Day</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="year">Year</TabsTrigger>
      </TabsList>
      <TabsContent value="day">128 visitors today.</TabsContent>
      <TabsContent value="week">1,024 visitors this week.</TabsContent>
      <TabsContent value="year">48,930 visitors this year.</TabsContent>
    </Tabs>
  );
}

function layOut() {
  const list = screen.getByRole("tablist");
  const writes: number[] = [];
  Object.defineProperties(list, {
    clientWidth: { value: 200 },
    scrollLeft: {
      get: () => 0,
      set: (value: number) => {
        writes.push(value);
      },
    },
  });
  list.style.scrollPadding = "0 24px";
  Object.defineProperties(screen.getByRole("tab", { name: "Year" }), {
    offsetLeft: { value: 300 },
    offsetWidth: { value: 100 },
  });
  return writes;
}

test("the list mirrors its variant and size", () => {
  render(<Ranges />);
  expect(screen.getByRole("tablist", { name: "Range" }).dataset).toMatchObject({
    size: "sm",
    slot: "tabs-list",
    variant: "line",
  });
});

test("a pick in a row scrolls the tab clear of the edge on the next frame", async () => {
  render(<Ranges />);
  const writes = layOut();
  vi.useFakeTimers({ toFake: ["requestAnimationFrame"] });

  fireEvent.click(screen.getByRole("tab", { name: "Year" }));
  await Promise.resolve();
  expect(writes).toEqual([]);
  vi.advanceTimersToNextFrame();

  expect(writes).toEqual([224]);
});

test("a pick in a column leaves its scroll alone", async () => {
  render(<Ranges orientation="vertical" />);
  const writes = layOut();
  vi.useFakeTimers({ toFake: ["requestAnimationFrame"] });

  fireEvent.click(screen.getByRole("tab", { name: "Year" }));
  await Promise.resolve();
  vi.advanceTimersToNextFrame();

  expect(
    screen.getByRole("tab", { name: "Year" }).getAttribute("aria-selected")
  ).toBe("true");
  expect(writes).toEqual([]);
});

test("an agent finds the tabs by the list's name and picks one", async () => {
  render(<Ranges />);
  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  expect(entries.map((entry) => entry.label)).toEqual(["Range"]);

  const result = await agent.act({
    steps: [{ action: "setValue", args: ["week"], ref: "Range" }],
  });
  expect(result.ok, result.error?.message).toBe(true);
  expect(
    screen.getByRole("tab", { name: "Week" }).getAttribute("aria-selected")
  ).toBe("true");
});
