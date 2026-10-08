import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { SwapIcon, SwapIconItem } from "@/components/ui/swap-icon";
import { SwapText } from "@/components/ui/swap-text";
import {
  colors,
  fontSizes,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";
import { fonts } from "~/lib/tokens.stylex";

const styles = stylex.create({
  command: {
    alignItems: "center",
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    color: colors.textPrimary,
    display: "flex",
    fontFamily: fonts.mono,
    fontSize: fontSizes.sm,
    gap: space.xs,
    paddingBlockEnd: space.xxs,
    paddingBlockStart: space.xxs,
    paddingInlineEnd: space.xxs,
    paddingInlineStart: space.sm,
  },
});

function CopyButtonDemo() {
  return (
    <DemoRow>
      <div {...stylex.props(styles.command)}>
        pnpm dlx shadcn add card
        <CopyButton value="pnpm dlx shadcn add card" />
      </div>
    </DemoRow>
  );
}

function CopyButtonVariantDemo() {
  return (
    <DemoRow>
      <CopyButton value="Hello" variant="outline" />
      <CopyButton value="Hello" variant="secondary" />
    </DemoRow>
  );
}

function SwapIconDemo() {
  const [playing, setPlaying] = useState(false);
  return (
    <DemoRow>
      <Button
        aria-label={playing ? "Pause" : "Play"}
        onClick={() => {
          setPlaying(!playing);
        }}
        size="icon"
        variant="outline"
      >
        <SwapIcon aria-hidden value={playing ? "pause" : "play"}>
          <SwapIconItem value="play">
            <HugeiconsIcon
              icon={PlayIcon}
              size={sizes.icon}
              strokeWidth={Number(strokes.icon)}
            />
          </SwapIconItem>
          <SwapIconItem value="pause">
            <HugeiconsIcon
              icon={PauseIcon}
              size={sizes.icon}
              strokeWidth={Number(strokes.icon)}
            />
          </SwapIconItem>
        </SwapIcon>
      </Button>
    </DemoRow>
  );
}

function SwapTextDemo() {
  const [following, setFollowing] = useState(false);
  return (
    <DemoRow>
      <Button
        onClick={() => {
          setFollowing(!following);
        }}
        variant="outline"
      >
        <SwapText>{following ? "Following" : "Follow"}</SwapText>
      </Button>
    </DemoRow>
  );
}

export { CopyButtonDemo, CopyButtonVariantDemo, SwapIconDemo, SwapTextDemo };
