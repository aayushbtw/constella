import {
  ArrowUpRight01Icon,
  Bookmark01Icon,
  CheckmarkBadge01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";

import {
  Badge,
  BadgeDot,
  badgeSizes,
  badgeStatuses,
  badgeVariants,
} from "@/components/ui/badge";
import type {
  BadgeSize,
  BadgeStatus,
  BadgeVariant,
} from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  rows: { flexDirection: "column" },
  row: { alignItems: "center", display: "flex", gap: space.xs },
});

const sizeLabels = {
  default: "Default",
  lg: "Large",
  sm: "Small",
} satisfies Record<BadgeSize, string>;

const statusLabels = {
  danger: "Failed",
  info: "Syncing",
  success: "Paid",
  warning: "Pending",
} satisfies Record<BadgeStatus, string>;

const labels = {
  danger: "Danger",
  ghost: "Ghost",
  link: "Link",
  outline: "Outline",
  primary: "Primary",
  secondary: "Secondary",
} satisfies Record<BadgeVariant, string>;

function Glyph({
  size = sizes.iconXs,
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
      <Badge>
        Generating
        <Spinner data-icon="inline-end" />
      </Badge>
      <Badge variant="outline">
        <BadgeDot />
        Draft
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

const statusVariants = ["secondary", "outline"] as const;

function BadgeStatusDemo() {
  return (
    <DemoRow sx={styles.rows}>
      {statusVariants.map((variant) => (
        <div key={variant} {...stylex.props(styles.row)}>
          {badgeStatuses.map((status) => (
            <Badge key={status} status={status} variant={variant}>
              {variant === "outline" && <BadgeDot />}
              {statusLabels[status]}
            </Badge>
          ))}
        </div>
      ))}
    </DemoRow>
  );
}

function BadgeSizeDemo() {
  return (
    <DemoRow>
      {badgeSizes.map((size) => (
        <Badge key={size} size={size}>
          <Glyph
            data-icon="inline-start"
            icon={Tick02Icon}
            size={size === "lg" ? sizes.iconSm : sizes.iconXs}
          />
          {sizeLabels[size]}
        </Badge>
      ))}
    </DemoRow>
  );
}

export {
  BadgeDemo,
  BadgeIconDemo,
  BadgeLinkDemo,
  BadgeSizeDemo,
  BadgeStatusDemo,
  BadgeVariantsDemo,
};
