import * as stylex from "@stylexjs/stylex";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  SidePanel,
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelSlot,
  SidePanelTitle,
} from "@/components/ui/side-panel";
import {
  colors,
  fontSizes,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  frame: {
    backgroundColor: colors.background,
    borderBlockEndColor: colors.edge,
    borderBlockStartColor: colors.edge,
    borderInlineEndColor: colors.edge,
    borderInlineStartColor: colors.edge,
    borderBlockEndStyle: "solid",
    borderBlockStartStyle: "solid",
    borderInlineEndStyle: "solid",
    borderInlineStartStyle: "solid",
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    display: "flex",
    height: 360,
    overflow: "hidden",
    width: "100%",
  },
  page: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minWidth: 0,
  },
  topbar: {
    alignItems: "center",
    borderBlockEndColor: colors.edgeSubtle,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    display: "flex",
    flexShrink: 0,
    fontSize: fontSizes.sm,
    height: sizes.header,
    paddingInlineStart: space.md,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: space.xxs,
    overflowY: "auto",
    paddingBlockEnd: space.xs,
    paddingBlockStart: space.xs,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
  },
  row: { cursor: "pointer" },
  selected: { backgroundColor: colors.fill },
  facts: {
    display: "grid",
    gap: space.xs,
    gridTemplateColumns: "auto 1fr",
    marginBlockEnd: 0,
    marginBlockStart: 0,
  },
  term: { color: colors.textSecondary },
  value: { marginInlineStart: 0 },
});

const events = [
  {
    actor: "ana@acme.com",
    action: "Signed in",
    status: "Success",
    time: "09:41",
  },
  {
    actor: "ben@acme.com",
    action: "Changed model",
    status: "Success",
    time: "09:38",
  },
  {
    actor: "cy@acme.com",
    action: "Exported chat",
    status: "Denied",
    time: "09:12",
  },
  {
    actor: "dee@acme.com",
    action: "Invited member",
    status: "Success",
    time: "08:55",
  },
];

function SidePanelDemo() {
  const slot = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const event = selected === null ? undefined : events[selected];
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.frame)}>
        <div {...stylex.props(styles.page)}>
          <header {...stylex.props(styles.topbar)}>Activity</header>
          <div {...stylex.props(styles.list)}>
            {events.map((item, index) => (
              <Item
                key={item.time}
                onClick={() => {
                  setSelected(index);
                }}
                // oxlint-disable-next-line jsx-a11y/control-has-associated-label -- the item renders its children into the button
                render={<button type="button" />}
                size="sm"
                sx={[styles.row, selected === index && styles.selected]}
              >
                <ItemContent>
                  <ItemTitle>{item.action}</ItemTitle>
                  <ItemDescription>{item.actor}</ItemDescription>
                </ItemContent>
                <ItemActions>{item.time}</ItemActions>
              </Item>
            ))}
          </div>
        </div>
        <SidePanelSlot ref={slot} />
        <SidePanel
          onOpenChange={(open) => {
            if (!open) {
              setSelected(null);
            }
          }}
          open={event !== undefined}
        >
          <SidePanelContent container={slot}>
            <SidePanelHeader>
              <SidePanelTitle>{event?.action}</SidePanelTitle>
            </SidePanelHeader>
            <SidePanelBody>
              <dl {...stylex.props(styles.facts)}>
                <dt {...stylex.props(styles.term)}>User</dt>
                <dd {...stylex.props(styles.value)}>{event?.actor}</dd>
                <dt {...stylex.props(styles.term)}>Time</dt>
                <dd {...stylex.props(styles.value)}>{event?.time}</dd>
                <dt {...stylex.props(styles.term)}>Status</dt>
                <dd {...stylex.props(styles.value)}>
                  <Badge
                    status={event?.status === "Denied" ? "danger" : "success"}
                    variant="secondary"
                  >
                    {event?.status}
                  </Badge>
                </dd>
              </dl>
            </SidePanelBody>
            <SidePanelFooter>
              <Button variant="outline">Copy event ID</Button>
            </SidePanelFooter>
          </SidePanelContent>
        </SidePanel>
      </div>
    </DemoRow>
  );
}

export { SidePanelDemo };
