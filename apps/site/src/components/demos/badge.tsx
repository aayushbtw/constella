import {
  ArrowUpRight01Icon,
  Bookmark01Icon,
  CheckmarkBadge01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";

import { Badge, badgeVariants } from "@/components/ui/badge";
import type { BadgeVariant } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { colors, sizes, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  success: { backgroundColor: colors.successFillSubtle, color: colors.success },
  info: { backgroundColor: colors.infoFillSubtle, color: colors.info },
  warning: { backgroundColor: colors.warningFillSubtle, color: colors.warning },
});

const labels = {
  danger: "Danger",
  ghost: "Ghost",
  link: "Link",
  outline: "Outline",
  primary: "Primary",
  secondary: "Secondary",
} satisfies Record<BadgeVariant, string>;

function Glyph(props: Omit<HugeiconsIconProps, "size" | "strokeWidth">) {
  return (
    <HugeiconsIcon
      aria-hidden
      size={sizes.iconXs}
      strokeWidth={Number(strokes.icon)}
      {...props}
    />
  );
}

function BadgeDemo() {
  return (
    <DemoRow>
      <Badge>Badge</Badge>
    </DemoRow>
  );
}

function BadgeVariantsDemo() {
  return (
    <DemoRow>
      {badgeVariants.map((variant) => (
        <Badge key={variant} variant={variant}>
          {labels[variant]}
        </Badge>
      ))}
    </DemoRow>
  );
}

function BadgeIconDemo() {
  return (
    <DemoRow>
      <Badge>
        <Glyph data-icon="inline-start" icon={CheckmarkBadge01Icon} />
        Verified
      </Badge>
      <Badge variant="outline">
        Bookmark
        <Glyph data-icon="inline-end" icon={Bookmark01Icon} />
      </Badge>
    </DemoRow>
  );
}

function BadgeSpinnerDemo() {
  return (
    <DemoRow>
      <Badge variant="danger">
        <Spinner data-icon="inline-start" />
        Deleting
      </Badge>
      <Badge>
        Generating
        <Spinner data-icon="inline-end" />
      </Badge>
    </DemoRow>
  );
}

function BadgeLinkDemo() {
  return (
    <DemoRow>
      <Badge
        // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the badge renders its children into the link
        render={<a href="#link" />}
        variant="outline"
      >
        Open Link
        <Glyph data-icon="inline-end" icon={ArrowUpRight01Icon} />
      </Badge>
    </DemoRow>
  );
}

function BadgeColorsDemo() {
  return (
    <DemoRow>
      <Badge sx={styles.success}>Success</Badge>
      <Badge sx={styles.info}>Info</Badge>
      <Badge sx={styles.warning}>Warning</Badge>
    </DemoRow>
  );
}

export {
  BadgeColorsDemo,
  BadgeDemo,
  BadgeIconDemo,
  BadgeLinkDemo,
  BadgeSpinnerDemo,
  BadgeVariantsDemo,
};
