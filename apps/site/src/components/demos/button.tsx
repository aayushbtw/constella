import {
  Add01Icon,
  ArrowRight02Icon,
  ArrowUpRight01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { Fragment } from "react";

import { Button, buttonStyles, buttonVariants } from "@/components/ui/button";
import type { ButtonSize, ButtonVariant } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { sizes, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/trigger";

const labels = {
  danger: "Danger",
  ghost: "Ghost",
  link: "Link",
  outline: "Outline",
  primary: "Primary",
  secondary: "Secondary",
} satisfies Record<ButtonVariant, string>;

// Each text size beside the icon size of the same height, and the glyph size that square takes.
const scale = [
  { glyph: sizes.iconXs, icon: "icon-xs", label: "Extra small", size: "xs" },
  { glyph: sizes.icon, icon: "icon-sm", label: "Small", size: "sm" },
  { glyph: sizes.icon, icon: "icon-md", label: "Medium", size: "md" },
  { glyph: sizes.icon, icon: "icon-lg", label: "Large", size: "lg" },
] as const satisfies readonly {
  glyph: string;
  icon: ButtonSize;
  label: string;
  size: ButtonSize;
}[];

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

function ButtonDemo() {
  return (
    <DemoRow>
      <Button>Button</Button>
    </DemoRow>
  );
}

function ButtonVariantsDemo() {
  return (
    <DemoRow>
      {buttonVariants.map((variant) => (
        <Button key={variant} variant={variant}>
          {labels[variant]}
        </Button>
      ))}
    </DemoRow>
  );
}

function ButtonSizesDemo() {
  return (
    <DemoRow>
      {scale.map(({ glyph, icon, label, size }) => (
        <Fragment key={size}>
          <Button size={size} variant="outline">
            {label}
          </Button>
          <Button aria-label="Open" size={icon} variant="outline">
            <Glyph icon={ArrowUpRight01Icon} size={glyph} />
          </Button>
        </Fragment>
      ))}
    </DemoRow>
  );
}

function ButtonIconDemo() {
  return (
    <DemoRow>
      <Button variant="outline">
        <Glyph data-icon="inline-start" icon={Add01Icon} />
        New project
      </Button>
      <Button variant="outline">
        Continue
        <Glyph data-icon="inline-end" icon={ArrowRight02Icon} />
      </Button>
    </DemoRow>
  );
}

function ButtonIconOnlyDemo() {
  return (
    <DemoRow>
      {scale.map(({ glyph, icon }) => (
        <Button aria-label="Search" key={icon} size={icon} variant="outline">
          <Glyph icon={Search01Icon} size={glyph} />
        </Button>
      ))}
    </DemoRow>
  );
}

function ButtonPillDemo() {
  return (
    <DemoRow>
      <Button corners="pill" variant="outline">
        Get started
      </Button>
      <Button aria-label="Add" corners="pill" size="icon-md" variant="outline">
        <Glyph icon={Add01Icon} />
      </Button>
    </DemoRow>
  );
}

function ButtonLoadingDemo() {
  return (
    <DemoRow>
      <Button disabled variant="outline">
        <Spinner data-icon="inline-start" />
        Saving
      </Button>
    </DemoRow>
  );
}

function ButtonLinkDemo() {
  return (
    <DemoRow>
      <a
        href="/docs/components/toast"
        {...stylex.props(buttonStyles({ variant: "outline" }))}
      >
        Read the toast docs
      </a>
    </DemoRow>
  );
}

export {
  ButtonDemo,
  ButtonIconDemo,
  ButtonIconOnlyDemo,
  ButtonLinkDemo,
  ButtonLoadingDemo,
  ButtonPillDemo,
  ButtonSizesDemo,
  ButtonVariantsDemo,
};
