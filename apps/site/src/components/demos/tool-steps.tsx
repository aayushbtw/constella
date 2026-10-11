import {
  DatabaseIcon,
  Globe02Icon,
  RepeatIcon,
  Search01Icon,
  WrenchIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shimmer } from "@/components/ui/shimmer";
import { Spinner } from "@/components/ui/spinner";
import { SwapIcon, SwapIconItem } from "@/components/ui/swap-icon";
import {
  ToolStep,
  ToolStepContent,
  ToolStepDescription,
  ToolStepHeader,
  ToolStepIndicator,
  ToolStepMedia,
  ToolSteps,
  ToolStepsContent,
  ToolStepsTrigger,
  ToolStepTitle,
  ToolStepTrigger,
} from "@/components/ui/tool-steps";
import type { ToolStepStatus } from "@/components/ui/tool-steps";
import { sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { alignItems: "flex-start", minHeight: 240, width: "100%" },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    maxWidth: "100%",
    width: 384,
  },
  width: { maxWidth: "100%", width: 384 },
  results: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.xxs,
  },
});

function Glyph({
  size = sizes.icon,
  ...props
}: Omit<HugeiconsIconProps, "strokeWidth">) {
  return (
    <HugeiconsIcon
      aria-hidden
      size={size}
      strokeWidth={Number(strokes.icon)}
      {...props}
    />
  );
}

const sources = ["ui.shadcn.com", "base-ui.com", "stylexjs.com"];

function ToolStepsDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <ToolSteps defaultOpen sx={styles.width}>
        <ToolStepsTrigger>
          <Glyph icon={WrenchIcon} />
          Used 3 tools
        </ToolStepsTrigger>
        <ToolStepsContent>
          <ToolStep>
            <ToolStepTrigger>
              <ToolStepIndicator />
              <ToolStepMedia>
                <Glyph icon={Search01Icon} size={sizes.iconXs} />
              </ToolStepMedia>
              <ToolStepTitle>Web search</ToolStepTitle>
              <ToolStepDescription>
                collapsible accessibility
              </ToolStepDescription>
            </ToolStepTrigger>
            <ToolStepContent>
              <div {...stylex.props(styles.results)}>
                {sources.map((source) => (
                  <Badge key={source} variant="secondary">
                    {source}
                  </Badge>
                ))}
              </div>
            </ToolStepContent>
          </ToolStep>
          <ToolStep>
            <ToolStepHeader>
              <ToolStepIndicator />
              <ToolStepMedia>
                <Glyph icon={Globe02Icon} size={sizes.iconXs} />
              </ToolStepMedia>
              <ToolStepTitle>Read page</ToolStepTitle>
              <ToolStepDescription>
                base-ui.com/react/components/collapsible
              </ToolStepDescription>
            </ToolStepHeader>
          </ToolStep>
          <ToolStep>
            <ToolStepHeader>
              <ToolStepIndicator />
              <ToolStepMedia>
                <Glyph icon={DatabaseIcon} size={sizes.iconXs} />
              </ToolStepMedia>
              <ToolStepTitle>Query issues</ToolStepTitle>
              <ToolStepDescription>
                label:a11y, last 30 days
              </ToolStepDescription>
            </ToolStepHeader>
          </ToolStep>
        </ToolStepsContent>
      </ToolSteps>
    </DemoRow>
  );
}

const run = [
  {
    description: "flights to Lisbon in March",
    failure: "Timed out after 30s",
    icon: Search01Icon,
    title: "Web search",
  },
  {
    description: "tap.pt/en/flights",
    failure: "Page not found",
    icon: Globe02Icon,
    title: "Read page",
  },
  {
    description: "Calendar, March 2027",
    failure: "Calendar unreachable",
    icon: DatabaseIcon,
    title: "Check calendar",
  },
];

const tick = 1200;

// Each step runs for a tick, then finishes; the last one fails.
function statusAt(index: number, elapsed: number): ToolStepStatus | null {
  if (elapsed < index) {
    return null;
  }
  if (elapsed === index) {
    return "running";
  }
  return index === run.length - 1 ? "failed" : "done";
}

function ToolStepsStatusDemo() {
  const [elapsed, setElapsed] = useState(0);
  const finished = elapsed > run.length - 1;

  // Ticks for the demo's life; it holds once every step is in, until "Run again".
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((value) => Math.min(value + 1, run.length));
    }, tick);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <ToolSteps defaultOpen>
          <ToolStepsTrigger>
            <SwapIcon value={finished ? "done" : "running"}>
              <SwapIconItem value="running">
                <Spinner />
              </SwapIconItem>
              <SwapIconItem value="done">
                <Glyph icon={WrenchIcon} />
              </SwapIconItem>
            </SwapIcon>
            {finished ? "Used 3 tools" : <Shimmer>Using 3 tools</Shimmer>}
          </ToolStepsTrigger>
          <ToolStepsContent>
            {run.map((step, index) => {
              const status = statusAt(index, elapsed);
              return status === null ? null : (
                <ToolStep key={step.title} status={status}>
                  <ToolStepHeader>
                    <ToolStepIndicator />
                    <ToolStepMedia>
                      <Glyph icon={step.icon} size={sizes.iconXs} />
                    </ToolStepMedia>
                    <ToolStepTitle>{step.title}</ToolStepTitle>
                    <ToolStepDescription>
                      {status === "failed" ? step.failure : step.description}
                    </ToolStepDescription>
                  </ToolStepHeader>
                </ToolStep>
              );
            })}
          </ToolStepsContent>
        </ToolSteps>
        <div>
          <Button
            disabled={!finished}
            onClick={() => {
              setElapsed(0);
            }}
            size="sm"
            variant="outline"
          >
            <Glyph icon={RepeatIcon} />
            Run again
          </Button>
        </div>
      </div>
    </DemoRow>
  );
}

export { ToolStepsDemo, ToolStepsStatusDemo };
