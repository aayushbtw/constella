import * as stylex from "@stylexjs/stylex";
import { stageChanges } from "@ui-sdk/react/history";
import type { StagedChange } from "@ui-sdk/react/history";
import { useState } from "react";
import { z } from "zod";

import {
  Approval,
  ApprovalCancel,
  ApprovalConfirm,
  ApprovalContent,
  ApprovalField,
  ApprovalFieldLabel,
  ApprovalFields,
  ApprovalFieldValue,
  ApprovalFooter,
  ApprovalHeader,
  ApprovalTitle,
} from "@/components/ai/approval";
import { Alert, AlertDescription } from "@/components/primitives/alert";
import { Button } from "@/components/primitives/button";
import { Field, FieldGroup, FieldLabel } from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { Switch } from "@/components/primitives/switch";
import { space } from "@/lib/constella/tokens.stylex";
import { agent } from "~/lib/agent";

import { AgentConfirm } from "./agent-loop";

const styles = stylex.create({
  page: {
    display: "flex",
    justifyContent: "center",
    paddingBlock: space.xl,
    paddingInline: space.md,
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
    maxWidth: "100%",
    width: 384,
  },
  full: { width: "100%" },
});

const regions = [
  { label: "Europe", value: "europe" },
  { label: "North America", value: "north-america" },
  { label: "Asia Pacific", value: "asia-pacific" },
];

const proposals = [
  { ref: "Project name", value: "Atlas v2" },
  { ref: "Region", value: "north-america" },
  { key: "checked", ref: "Weekly digest", value: true },
] satisfies StagedChange[];

type Staged = Awaited<ReturnType<typeof stageChanges>>;

interface Row {
  before: string;
  label: string;
  ref: string;
  value: string;
}

type State =
  | { kind: "idle" }
  | { kind: "staging" }
  | { kind: "unapplied" }
  | {
      kind: "review";
      revert: Staged["revert"];
      rows: Row[];
      skipped: string[];
    }
  | { kind: "reverting"; rows: Row[]; skipped: string[] }
  | { kind: "kept" }
  | { kind: "discarded"; missed: string[] };

const controlValue = z.union([
  z.boolean().transform((on) => (on ? "On" : "Off")),
  z.string(),
]);

const shown = (label: string, text = "Unknown") =>
  label === "Region"
    ? (regions.find((region) => region.value === text)?.label ?? text)
    : text;

async function suggest(): Promise<State> {
  const staged = await stageChanges(agent, proposals);
  if (staged.applied.length === 0) {
    return { kind: "unapplied" };
  }
  const labels = new Map(
    agent.snapshot().map(({ label, ref }) => [ref, label ?? ref])
  );
  const rows = staged.applied.map(({ before, ref, value }) => {
    const label = labels.get(ref) ?? ref;
    return {
      before: shown(label, controlValue.safeParse(before).data),
      label,
      ref,
      value: shown(label, controlValue.safeParse(value).data),
    };
  });
  const skipped = proposals
    .map((proposal) => proposal.ref)
    .filter((label) => !rows.some((row) => row.label === label));
  return {
    kind: "review",
    revert: async () => await staged.revert(),
    rows,
    skipped,
  };
}

const title = (count: number) =>
  `Keep ${count} suggested ${count === 1 ? "change" : "changes"}?`;

function Suggestion({
  onDiscard,
  onKeep,
  state,
}: {
  onDiscard: () => void;
  onKeep: () => void;
  state: Extract<State, { kind: "review" | "reverting" }>;
}) {
  const reverting = state.kind === "reverting";
  return (
    <Approval>
      <ApprovalHeader>
        <ApprovalTitle>{title(state.rows.length)}</ApprovalTitle>
      </ApprovalHeader>
      <ApprovalContent>
        <ApprovalFields>
          {state.rows.map((row) => (
            <ApprovalField key={row.ref}>
              <ApprovalFieldLabel>{row.label}</ApprovalFieldLabel>
              <ApprovalFieldValue>
                {row.before} → {row.value}
              </ApprovalFieldValue>
            </ApprovalField>
          ))}
        </ApprovalFields>
      </ApprovalContent>
      {state.skipped.length > 0 && (
        <ApprovalContent>
          <Alert>
            <AlertDescription>
              Not applied: {state.skipped.join(", ")}.
            </AlertDescription>
          </Alert>
        </ApprovalContent>
      )}
      <ApprovalFooter>
        <ApprovalCancel disabled={reverting} onClick={onDiscard}>
          Discard
        </ApprovalCancel>
        <ApprovalConfirm
          data-agent-confirm="Keeps the assistant's changes"
          disabled={reverting}
          onClick={onKeep}
        >
          Keep changes
        </ApprovalConfirm>
      </ApprovalFooter>
    </Approval>
  );
}

function Settings() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel>Project name</FieldLabel>
        <Input defaultValue="Atlas" />
      </Field>
      <Field>
        <FieldLabel>Region</FieldLabel>
        <Select defaultValue="europe" items={regions}>
          <SelectTrigger sx={styles.full}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {regions.map((region) => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel>Weekly digest</FieldLabel>
        <Switch />
      </Field>
    </FieldGroup>
  );
}

function AgentStaged() {
  const [state, setState] = useState<State>({ kind: "idle" });

  const discard = async (
    review: Extract<State, { kind: "review" }>
  ): Promise<void> => {
    setState({ kind: "reverting", rows: review.rows, skipped: review.skipped });
    const failed = await review.revert();
    const missed = failed.map(
      ({ ref }) => review.rows.find((row) => row.ref === ref)?.label ?? ref
    );
    setState({ kind: "discarded", missed });
  };

  const stage = async (): Promise<void> => {
    setState({ kind: "staging" });
    setState(await suggest());
  };

  return (
    <main {...stylex.props(styles.page)}>
      <div {...stylex.props(styles.column)}>
        <Settings />
        <Button
          disabled={
            state.kind === "staging" ||
            state.kind === "review" ||
            state.kind === "reverting"
          }
          onClick={() => {
            void stage();
          }}
          variant="outline"
        >
          Suggest changes
        </Button>
        {(state.kind === "review" || state.kind === "reverting") && (
          <Suggestion
            onDiscard={() => {
              if (state.kind === "review") {
                void discard(state);
              }
            }}
            onKeep={() => {
              setState({ kind: "kept" });
            }}
            state={state}
          />
        )}
        {state.kind === "unapplied" && (
          <Alert>
            <AlertDescription>
              None of the suggested changes could be applied.
            </AlertDescription>
          </Alert>
        )}
        {state.kind === "discarded" && state.missed.length > 0 && (
          <Alert color="warning">
            <AlertDescription>
              Couldn&apos;t put back {state.missed.join(", ")}.
            </AlertDescription>
          </Alert>
        )}
      </div>
      <AgentConfirm />
    </main>
  );
}

export { AgentStaged };
