import {
  ArrowRight01Icon,
  File01Icon,
  Folder01Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { SwapText } from "@/components/ui/swap-text";
import {
  colors,
  durations,
  easings,
  fontSizes,
  media,
  radii,
  fontWeights,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const panelOpen = ":is([data-panel-open] *)";
const rtl = ":is([dir='rtl'] *)";

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
  tree: {
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    fontSize: fontSizes.sm,
    maxWidth: "100%",
    width: 256,
  },
  leaf: {
    alignItems: "center",
    display: "flex",
    gap: space.xs,
    height: sizes.controlSm,
    paddingInlineStart: `calc(${space.xs} + ${sizes.icon} + ${space.xs})`,
  },
  branch: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      [media.hover]: { default: "transparent", ":hover": colors.fillSubtle },
    },
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    color: "inherit",
    cursor: "pointer",
    display: "flex",
    fontSize: "inherit",
    gap: space.xs,
    height: sizes.controlSm,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
    width: "100%",
  },
  // Turns a quarter as its folder opens.
  chevron: {
    color: colors.textMuted,
    display: "flex",
    transform: {
      default: "none",
      [panelOpen]: "rotate(90deg)",
      [rtl]: "scaleX(-1)",
      [`${panelOpen}${rtl}`]: "scaleX(-1) rotate(90deg)",
    },
    transitionDuration: durations.move,
    transitionProperty: "transform",
    transitionTimingFunction: easings.out,
  },
  nested: {
    borderInlineStartColor: colors.edgeSubtle,
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: strokes.border,
    display: "flex",
    flexDirection: "column",
    marginInlineStart: `calc(${space.xs} + ${sizes.icon} / 2)`,
    paddingInlineStart: space.xxs,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    paddingBlockStart: space.xs,
  },
});

const repos = ["@radix-ui/primitives", "@radix-ui/colors", "@stitches/react"];

function Glyph({ icon }: { icon: typeof File01Icon }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

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

function CollapsibleControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <DemoRow sx={styles.stage}>
      <Collapsible
        onOpenChange={setOpen}
        open={open}
        {...stylex.props(styles.root)}
      >
        <div {...stylex.props(styles.header)}>
          Order #4189
          <CollapsibleTrigger render={<Button size="sm" variant="outline" />}>
            <SwapText>{open ? "Hide details" : "Show details"}</SwapText>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div {...stylex.props(styles.list)}>
            <Repo name="Shipped to Lisbon, Portugal" />
            <Repo name="Arrives Thursday, Oct 12" />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </DemoRow>
  );
}

function CollapsibleDisabledDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Collapsible disabled {...stylex.props(styles.root)}>
        <div {...stylex.props(styles.header)}>
          Archived repositories
          <CollapsibleTrigger
            render={
              <Button aria-label="Toggle" size="icon-sm" variant="ghost" />
            }
          >
            <Glyph icon={UnfoldMoreIcon} />
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </DemoRow>
  );
}

interface Node {
  children?: Node[];
  name: string;
}

const tree: Node[] = [
  {
    children: [
      { children: [{ name: "button.tsx" }, { name: "card.tsx" }], name: "ui" },
      { name: "app-sidebar.tsx" },
    ],
    name: "components",
  },
  {
    children: [{ name: "tokens.stylex.ts" }, { name: "theme.stylex.ts" }],
    name: "lib",
  },
  { name: "package.json" },
];

function TreeNode({ node }: { node: Node }) {
  if (node.children === undefined) {
    return (
      <div {...stylex.props(styles.leaf)}>
        <Glyph icon={File01Icon} />
        {node.name}
      </div>
    );
  }
  return (
    <Collapsible defaultOpen={node.name === "components"}>
      <CollapsibleTrigger {...stylex.props(styles.branch)}>
        <span {...stylex.props(styles.chevron)}>
          <Glyph icon={ArrowRight01Icon} />
        </span>
        <Glyph icon={Folder01Icon} />
        {node.name}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div {...stylex.props(styles.nested)}>
          {node.children.map((child) => (
            <TreeNode key={child.name} node={child} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function CollapsibleTreeDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.tree)}>
        {tree.map((node) => (
          <TreeNode key={node.name} node={node} />
        ))}
      </div>
    </DemoRow>
  );
}

export {
  CollapsibleControlledDemo,
  CollapsibleDemo,
  CollapsibleDisabledDemo,
  CollapsibleTreeDemo,
};
