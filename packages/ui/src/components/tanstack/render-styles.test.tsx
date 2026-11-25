import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";

import { Badge } from "@/components/primitives/badge";
import {
  ChartTooltip,
  ChartTooltipLabel,
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
} from "@/components/tanstack/chart";
import { ChartIndicator } from "@/components/tanstack/chart-legend";

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

test.each<[string, ReactElement]>([
  ["ChartTooltip", <ChartTooltip key="tooltip" />],
  ["ChartTooltipTitle", <ChartTooltipTitle key="title" />],
  ["ChartTooltipRow", <ChartTooltipRow key="row" />],
  ["ChartTooltipLabel", <ChartTooltipLabel key="label" />],
  ["ChartTooltipValue", <ChartTooltipValue key="value" />],
  ["ChartIndicator", <ChartIndicator color="red" key="indicator" />],
])("a Badge over a %s throws, since both draw", (_name, part) => {
  expect(() => render(<Badge render={part}>New</Badge>)).toThrow(
    "Two parts style one element"
  );
});
