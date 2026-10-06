import { FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { sizes, strokes } from "@/lib/tokens.stylex";
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
      <TooltipProvider>
        {sides.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger render={<Button variant="outline" />}>
              {side}
            </TooltipTrigger>
            <TooltipContent side={side}>Add to library</TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
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
        <TooltipTrigger render={<span />}>
          <Button disabled variant="outline">
            Disabled
          </Button>
        </TooltipTrigger>
        <TooltipContent>This feature is currently unavailable</TooltipContent>
      </Tooltip>
    </DemoRow>
  );
}

export { TooltipDemo, TooltipDisabledDemo, TooltipKbdDemo, TooltipSideDemo };
