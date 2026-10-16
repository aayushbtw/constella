import {
  ArrowUpRight01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";

import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { Shimmer } from "@/components/ui/shimmer";
import { Spinner } from "@/components/ui/spinner";
import {
  colors,
  fontSizes,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
    maxWidth: "100%",
    width: 448,
  },
  thinking: {
    color: colors.textMuted,
    fontSize: fontSizes.md,
  },
});

function Glyph({ icon }: { icon: typeof InformationCircleIcon }) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

function MarkerDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Marker>
          <MarkerIcon>
            <Glyph icon={InformationCircleIcon} />
          </MarkerIcon>
          <MarkerContent>
            Switched to a faster model for this chat.
          </MarkerContent>
        </Marker>
      </div>
    </DemoRow>
  );
}

function MarkerVariantsDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Marker>
          <MarkerContent>Memory updated.</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerContent>Context compacted to fit the window.</MarkerContent>
        </Marker>
        <Marker variant="separator">
          <MarkerContent>Today</MarkerContent>
        </Marker>
      </div>
    </DemoRow>
  );
}

function MarkerStatusDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Marker render={<output />}>
          <Spinner />
          <MarkerContent>
            <Shimmer>Searching the web…</Shimmer>
          </MarkerContent>
        </Marker>
      </div>
    </DemoRow>
  );
}

function MarkerLinkDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Marker
          // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the marker renders its children into the link
          render={<a href="#marker" />}
        >
          <MarkerContent>Branched from “Plan the launch”</MarkerContent>
          <MarkerIcon>
            <Glyph icon={ArrowUpRight01Icon} />
          </MarkerIcon>
        </Marker>
      </div>
    </DemoRow>
  );
}

function ShimmerDemo() {
  return (
    <DemoRow>
      <Shimmer sx={styles.thinking}>Thinking…</Shimmer>
    </DemoRow>
  );
}

export {
  MarkerDemo,
  MarkerLinkDemo,
  MarkerStatusDemo,
  MarkerVariantsDemo,
  ShimmerDemo,
};
