import { Activity01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { AgentAction, ObservedChange } from "@ui-sdk/react/agent";
import { createDialogController } from "@ui-sdk/react/dialog";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

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
import { Button } from "@/components/primitives/button";
import { DialogTrigger } from "@/components/primitives/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/primitives/empty";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/primitives/item";
import {
  SidePanel,
  SidePanelBody,
  SidePanelContent,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelTitle,
} from "@/components/primitives/side-panel";
import { sizes, strokes } from "@/lib/constella/tokens.stylex";
import { agent, confirm, history, mountConfirm } from "~/lib/agent";
import { layers, layout } from "~/lib/tokens.stylex";

const feedSize = 50;

const activity = createDialogController();

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

interface Row {
  change: ObservedChange;
  id: number;
}

const shift = ({ previous, value }: ObservedChange) =>
  `${JSON.stringify(previous ?? null)} → ${JSON.stringify(value ?? null)}`;

const sentence = (text: string) => (/[.!?]$/u.test(text) ? text : `${text}.`);

const asked = ({ action, args, label, component }: AgentAction) =>
  `It asked to ${action} ${label ?? component}${args.length > 0 ? ` with ${args.join(", ")}` : ""}.`;

const question = (step: AgentAction) =>
  step.confirm === undefined
    ? asked(step)
    : `${sentence(step.confirm)} ${asked(step)}`;

const onHistory = (listener: () => void) => history.subscribe(listener);

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
    <AlertDialog controller={confirm.controller}>
      <AlertDialogContent size="sm">
        {() => {
          const step = confirm.controller.getPayload();
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
  );
}

function AgentFeed() {
  const [rows, setRows] = useState<Row[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const counted = useRef(0);
  const applied = useSyncExternalStore(onHistory, appliedAgentChanges, () => 0);

  useEffect(() => {
    history.clear();
    return agent.subscribe((change) => {
      if (change.source !== "agent") {
        return;
      }
      counted.current += 1;
      const row = { change, id: counted.current };
      setRows((previous) => [row, ...previous].slice(0, feedSize));
    });
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
            {rows.map(({ change, id }) => (
              <Item key={id} render={<li />} size="sm">
                <ItemContent>
                  <ItemTitle>{change.label ?? change.component}</ItemTitle>
                  <ItemDescription>
                    {shift(change)}, {change.reason}
                  </ItemDescription>
                </ItemContent>
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
    <DialogTrigger
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
    </DialogTrigger>
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

export { AgentActivityButton, AgentLoop };
