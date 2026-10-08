import { UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import {
  colors,
  fontSizes,
  fontWeights,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { alignItems: "flex-start", minHeight: 240, width: "100%" },
  root: {
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
    width: 352,
  },
  header: {
    alignItems: "center",
    color: colors.textPrimary,
    display: "flex",
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    gap: space.md,
    justifyContent: "space-between",
    paddingInlineStart: space.md,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    paddingBlockStart: space.xs,
  },
});

const repos = ["@radix-ui/primitives", "@radix-ui/colors", "@stitches/react"];

function Repo({ name }: { name: string }) {
  return (
    <Item size="sm" variant="outline">
      <ItemContent>
        <ItemTitle>{name}</ItemTitle>
      </ItemContent>
    </Item>
  );
}

function CollapsibleDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Collapsible {...stylex.props(styles.root)}>
        <div {...stylex.props(styles.header)}>
          @peduarte starred 3 repositories
          <CollapsibleTrigger
            render={
              <Button aria-label="Toggle" size="icon-sm" variant="ghost" />
            }
          >
            <HugeiconsIcon
              aria-hidden
              icon={UnfoldMoreIcon}
              size={sizes.icon}
              strokeWidth={Number(strokes.icon)}
            />
          </CollapsibleTrigger>
        </div>
        <div {...stylex.props(styles.list)}>
          <Repo name={repos[0] ?? ""} />
        </div>
        <CollapsibleContent>
          <div {...stylex.props(styles.list)}>
            {repos.slice(1).map((name) => (
              <Repo key={name} name={name} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </DemoRow>
  );
}

export { CollapsibleDemo };
