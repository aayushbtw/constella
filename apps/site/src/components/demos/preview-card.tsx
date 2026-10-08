import * as stylex from "@stylexjs/stylex";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonStyles } from "@/components/ui/button";
import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardTrigger,
} from "@/components/ui/preview-card";
import {
  colors,
  fontSizes,
  fontWeights,
  lineHeights,
  space,
} from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  row: { display: "flex", gap: space.md },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    lineHeight: lineHeights.text,
  },
  name: { fontWeight: fontWeights.medium },
  muted: { color: colors.textMuted, fontSize: fontSizes.xs },
});

function PreviewCardDemo() {
  return (
    <DemoRow>
      <PreviewCard>
        <PreviewCardTrigger
          href="https://nextjs.org"
          {...stylex.props(buttonStyles({ variant: "link" }))}
        >
          @nextjs
        </PreviewCardTrigger>
        <PreviewCardContent>
          <div {...stylex.props(styles.row)}>
            <Avatar>
              <AvatarImage alt="" src="https://github.com/vercel.png" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div {...stylex.props(styles.text)}>
              <div {...stylex.props(styles.name)}>@nextjs</div>
              <div>
                The React Framework – created and maintained by @vercel.
              </div>
              <div {...stylex.props(styles.muted)}>Joined December 2021</div>
            </div>
          </div>
        </PreviewCardContent>
      </PreviewCard>
    </DemoRow>
  );
}

export { PreviewCardDemo };
