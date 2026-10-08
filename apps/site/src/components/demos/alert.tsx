import {
  Alert02Icon,
  AlertCircleIcon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import type { AlertStatus } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    maxWidth: "100%",
    width: 448,
  },
});

function Glyph(props: Omit<HugeiconsIconProps, "size" | "strokeWidth">) {
  return (
    <HugeiconsIcon
      aria-hidden
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
      {...props}
    />
  );
}

function AlertDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Alert>
          <Glyph icon={CheckmarkCircle02Icon} />
          <AlertTitle>Payment successful</AlertTitle>
          <AlertDescription>
            Your payment of $29.99 has been processed. A receipt has been sent
            to your email address.
          </AlertDescription>
        </Alert>
        <Alert>
          <Glyph icon={InformationCircleIcon} />
          <AlertTitle>New feature available</AlertTitle>
          <AlertDescription>
            We&apos;ve added dark mode support. You can enable it in your
            account settings.
          </AlertDescription>
        </Alert>
      </div>
    </DemoRow>
  );
}

const statuses = [
  {
    description: "Your changes have been saved.",
    icon: CheckmarkCircle02Icon,
    status: "success",
    title: "Saved",
  },
  {
    description: "Maintenance is scheduled for Sunday at 2am.",
    icon: InformationCircleIcon,
    status: "info",
    title: "Heads up",
  },
  {
    description: "You've used 90% of your monthly quota.",
    icon: Alert02Icon,
    status: "warning",
    title: "Almost out",
  },
  {
    description: "We couldn't charge your card. Update it to keep access.",
    icon: AlertCircleIcon,
    status: "danger",
    title: "Payment failed",
  },
] satisfies {
  description: string;
  icon: HugeiconsIconProps["icon"];
  status: AlertStatus;
  title: string;
}[];

function AlertStatusDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        {statuses.map((item) => (
          <Alert key={item.status} status={item.status}>
            <Glyph icon={item.icon} />
            <AlertTitle>{item.title}</AlertTitle>
            <AlertDescription>{item.description}</AlertDescription>
          </Alert>
        ))}
      </div>
    </DemoRow>
  );
}

function AlertActionDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Alert>
          <Glyph icon={InformationCircleIcon} />
          <AlertTitle>Dark mode is now available</AlertTitle>
          <AlertDescription>
            Enable it under your profile settings to get started.
          </AlertDescription>
          <AlertAction>
            <Button size="sm" variant="outline">
              Enable
            </Button>
          </AlertAction>
        </Alert>
      </div>
    </DemoRow>
  );
}

export { AlertActionDemo, AlertDemo, AlertStatusDemo };
