import { Activity01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { AgentAction } from "@ui-sdk/react/agent";
import type { HistoryEntry } from "@ui-sdk/react/history";
import { useEffect, useState, useSyncExternalStore } from "react";

import { Alert, AlertDescription } from "@/components/primitives/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/primitives/alert-dialog";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/primitives/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/primitives/item";
import {
  createSidePanelController,
  SidePanel,
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelTitle,
  SidePanelTrigger,
} from "@/components/primitives/side-panel";
import { sizes, strokes } from "@/lib/constella/tokens.stylex";
import { confirm, mountConfirm } from "~/lib/agent";
import { history } from "~/lib/agent-history";
import { layers, layout } from "~/lib/tokens.stylex";

const activity = createSidePanelController();

const styles = stylex.create({
  place: {
    display: "flex",
    insetBlockEnd: 0,
    insetBlockStart: layout.header,
    insetInlineEnd: 0,
    position: "fixed",
    zIndex: layers.header,
  },
});

const shift = ({ previous, value }: HistoryEntry) =>
  `${JSON.stringify(previous ?? null)} → ${JSON.stringify(value ?? null)}`;

const sentence = (text: string) => (/[.!?]$/u.test(text) ? text : `${text}.`);

const asked = ({ action, args, label, component }: AgentAction) =>
  `It asked to ${action} ${label ?? component}${args.length > 0 ? ` with ${args.join(", ")}` : ""}.`;

const question = (step: AgentAction) =>
  step.confirm === undefined
    ? asked(step)
    : `${sentence(step.confirm)} ${asked(step)}`;

const onHistory = (listener: () => void) => history.subscribe(listener);

const entries = () => history.entries();

const noEntries: readonly HistoryEntry[] = [];

const serverEntries = () => noEntries;

const appliedAgentChanges = () =>
  history
    .entries()
    .slice(0, history.position())
    .filter((entry) => entry.source === "agent" && entry.reverted !== true)
    .length;

const labelOf = (ref: string) =>
  history.entries().find((entry) => entry.ref === ref)?.label ?? ref;

function AgentConfirm() {
  useEffect(() => mountConfirm(), []);

  return (
    <div data-agent-hidden>
      <AlertDialog controller={confirm.controller}>
        <AlertDialogContent<AgentAction> size="sm">
          {(state) => {
            const step = state.payload;
            return (
              <>
                <AlertDialogHeader>
                  <AlertDialogTitle>Allow the assistant?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {step && question(step)}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Allow</AlertDialogAction>
                </AlertDialogFooter>
              </>
            );
          }}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AgentFeed() {
  const [missed, setMissed] = useState<string[]>([]);
  const recorded = useSyncExternalStore(onHistory, entries, serverEntries);
  const applied = useSyncExternalStore(onHistory, appliedAgentChanges, () => 0);
  const rows = recorded
    .filter((entry) => entry.source === "agent")
    .toReversed();

  useEffect(() => {
    history.clear();
  }, []);

  const undo = async () => {
    const left = await history.undoSource("agent");
    setMissed(left.map(({ key, ref }) => `${labelOf(ref)} (${key})`));
  };

  return (
    <>
      <SidePanelBody>
        {rows.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No assistant changes</EmptyTitle>
              <EmptyDescription>
                What an agent changes on this page shows here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <ItemGroup render={<ol />}>
            {rows.map((entry) => (
              <Item key={entry.id} render={<li />} size="sm">
                <ItemContent>
                  <ItemTitle>{entry.label}</ItemTitle>
                  <ItemDescription>
                    {shift(entry)}, {entry.reason}
                  </ItemDescription>
                </ItemContent>
                {entry.reverted === true && (
                  <ItemActions>
                    <Badge variant="secondary">Undone</Badge>
                  </ItemActions>
                )}
              </Item>
            ))}
          </ItemGroup>
        )}
      </SidePanelBody>
      <SidePanelFooter>
        {missed.length > 0 && (
          <Alert color="warning">
            <AlertDescription>
              Couldn&apos;t put back {missed.join(", ")}.
            </AlertDescription>
          </Alert>
        )}
        <Button
          disabled={applied === 0}
          focusableWhenDisabled
          onClick={() => {
            void undo();
          }}
          variant="outline"
        >
          Undo assistant changes ({applied})
        </Button>
      </SidePanelFooter>
    </>
  );
}

function AgentActivityButton() {
  return (
    <SidePanelTrigger
      aria-label="Assistant activity"
      controller={activity}
      data-agent-hidden
      render={<Button size="icon" variant="ghost" />}
    >
      <HugeiconsIcon
        icon={Activity01Icon}
        size={sizes.icon}
        strokeWidth={Number(strokes.icon)}
      />
    </SidePanelTrigger>
  );
}

function AgentLoop({ path }: { path: string }) {
  return (
    <div data-agent-hidden>
      <AgentConfirm />
      <div {...stylex.props(styles.place)}>
        <SidePanel controller={activity}>
          <SidePanelContent keepMounted>
            <SidePanelHeader>
              <SidePanelTitle>Assistant activity</SidePanelTitle>
            </SidePanelHeader>
            <AgentFeed key={path} />
          </SidePanelContent>
        </SidePanel>
      </div>
    </div>
  );
}

export { AgentActivityButton, AgentConfirm, AgentLoop };
