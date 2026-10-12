import { AiBrain01Icon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ui/reasoning";
import { Shimmer } from "@/components/ui/shimmer";
import { sizes, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { alignItems: "flex-start", minHeight: 240, width: "100%" },
  width: { maxWidth: "100%", width: 384 },
});

function Brain() {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={AiBrain01Icon}
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

const thought =
  "The user wants a weekend in Lisbon in March. Flights from Dubai run daily; the cheapest land Friday evening. Saturday is free on their calendar, so I'll suggest Belém in the morning and Alfama after lunch, and keep Sunday light before the flight back.";

function ReasoningDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Reasoning defaultOpen sx={styles.width}>
        <ReasoningTrigger>
          <Brain />
          Thought for 4s
        </ReasoningTrigger>
        <ReasoningContent>{thought}</ReasoningContent>
      </Reasoning>
    </DemoRow>
  );
}

const words = thought.split(" ");
const wordEvery = 60;
const closeAfter = 1000;

function ReasoningControlledDemo() {
  const [shown, setShown] = useState(0);
  const [open, setOpen] = useState(true);
  const thinking = shown < words.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setShown((value) => Math.min(value + 1, words.length));
    }, wordEvery);
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Closes a moment after the thinking ends, once the answer would start.
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!thinking) {
        setOpen(false);
      }
    }, closeAfter);
    return () => {
      clearTimeout(timer);
    };
  }, [thinking]);

  const seconds = Math.ceil((words.length * wordEvery) / 1000);

  return (
    <DemoRow
      sx={styles.stage}
      controls={
        <div>
          <Button
            disabled={thinking}
            onClick={() => {
              setShown(0);
              setOpen(true);
            }}
            size="sm"
            variant="outline"
          >
            <HugeiconsIcon
              aria-hidden
              icon={PlayIcon}
              size={sizes.icon}
              strokeWidth={Number(strokes.icon)}
            />
            Think again
          </Button>
        </div>
      }
    >
      <Reasoning onOpenChange={setOpen} open={open} sx={styles.width}>
        <ReasoningTrigger>
          <Brain />
          {thinking ? <Shimmer>Thinking</Shimmer> : `Thought for ${seconds}s`}
        </ReasoningTrigger>
        <ReasoningContent>{words.slice(0, shown).join(" ")}</ReasoningContent>
      </Reasoning>
    </DemoRow>
  );
}

export { ReasoningControlledDemo, ReasoningDemo };
