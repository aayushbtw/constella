import { render } from "@testing-library/react";
import { expect, test, vi } from "vite-plus/test";

import {
  TraceStep,
  TraceStepContent,
  TraceStepTrigger,
  TraceSubject,
  TraceTitle,
} from "./trace";

const onOpenChange = vi.fn<() => void>();

function Step({ open }: { open: boolean }) {
  return (
    <TraceStep onOpenChange={onOpenChange} open={open}>
      <TraceStepTrigger>
        <TraceTitle>Read</TraceTitle>
        <TraceSubject>Swedish orders</TraceSubject>
      </TraceStepTrigger>
      <TraceStepContent>Rows 1 to 40</TraceStepContent>
    </TraceStep>
  );
}

const panel = (root: ParentNode) =>
  root.querySelector("[data-slot='collapsible-panel']");

test("a step the app opens and shuts renders, and follows its open prop", () => {
  const { container, rerender } = render(<Step open={false} />);

  expect(panel(container)?.hasAttribute("hidden")).toBe(true);

  rerender(<Step open />);

  expect(panel(container)?.hasAttribute("hidden")).toBe(false);
});
