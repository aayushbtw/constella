import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { DemoRow } from "@/components/demos/trigger";
import { Button } from "@/components/ui/button";
import { sizes, strokes } from "@/lib/tokens.stylex";

function ButtonDemo() {
  return (
    <DemoRow>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </DemoRow>
  );
}

function ButtonSizesDemo() {
  return (
    <DemoRow>
      <Button size="sm" variant="outline">
        Small
      </Button>
      <Button size="md" variant="outline">
        Medium
      </Button>
      <Button size="lg" variant="outline">
        Large
      </Button>
    </DemoRow>
  );
}

function ButtonIconDemo() {
  return (
    <DemoRow>
      <Button variant="primary">
        <HugeiconsIcon
          aria-hidden
          icon={Add01Icon}
          size={sizes.icon}
          strokeWidth={Number(strokes.icon)}
        />
        New project
      </Button>
      <Button variant="danger">
        <HugeiconsIcon
          aria-hidden
          icon={Delete02Icon}
          size={sizes.icon}
          strokeWidth={Number(strokes.icon)}
        />
        Delete
      </Button>
    </DemoRow>
  );
}

function ButtonDisabledDemo() {
  return (
    <DemoRow>
      <Button disabled variant="primary">
        Primary
      </Button>
      <Button disabled variant="outline">
        Outline
      </Button>
    </DemoRow>
  );
}

export { ButtonDemo, ButtonDisabledDemo, ButtonIconDemo, ButtonSizesDemo };
