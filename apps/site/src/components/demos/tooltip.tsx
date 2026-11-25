import { FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/primitives/button";
import { Kbd } from "@/components/primitives/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { sizes, strokes } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const sides = ["left", "top", "bottom", "right"] as const;

function TooltipDemo() {
  return (
    <DemoRow>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>
          Hover
        </TooltipTrigger>
        <TooltipContent>Add to library</TooltipContent>
      </Tooltip>
    </DemoRow>
  );
}

function TooltipSideDemo() {
  return (
    <DemoRow>
      {sides.map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline" />}>
            {side}
          </TooltipTrigger>
          <TooltipContent side={side}>Add to library</TooltipContent>
        </Tooltip>
      ))}
    </DemoRow>
  );
}

function TooltipKbdDemo() {
  return (
    <DemoRow>
      <Tooltip>
        <TooltipTrigger
          aria-label="Save"
          render={<Button size="icon-sm" variant="outline" />}
        >
          <HugeiconsIcon
            aria-hidden
            icon={FloppyDiskIcon}
            size={sizes.icon}
            strokeWidth={Number(strokes.icon)}
          />
        </TooltipTrigger>
        <TooltipContent>
          Save Changes <Kbd>S</Kbd>
        </TooltipContent>
      </Tooltip>
    </DemoRow>
  );
}

function TooltipDisabledDemo() {
  return (
    <DemoRow>
      <Tooltip>
        <TooltipTrigger
          render={<Button disabled focusableWhenDisabled variant="outline" />}
        >
          Disabled
        </TooltipTrigger>
        <TooltipContent>This feature is currently unavailable</TooltipContent>
      </Tooltip>
    </DemoRow>
  );
}

export { TooltipDemo, TooltipDisabledDemo, TooltipKbdDemo, TooltipSideDemo };
