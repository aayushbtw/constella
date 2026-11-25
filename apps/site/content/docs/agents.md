---
title: Agents
description: Configure coding agents with the Constella skill, MCP server, and Markdown docs, and connect in-app agents through ui-sdk's agent bridge.
order: 3
---

## Skill

Install the Constella skill to give coding agents framework setup instructions, component documentation paths, and Constella conventions such as using `sx` instead of `className`:

```bash
npx skills add aayushbtw/constella
```

## MCP

The shadcn MCP server reads registries configured in your `components.json`. After adding `@constella` (see [Installation](/docs/installation)), coding agents can search components, read their source, and install them. Initialize the MCP server for your client:

```bash
npx shadcn@latest mcp init --client claude
```

| Client      | Flag                |
| ----------- | ------------------- |
| Claude Code | `--client claude`   |
| Cursor      | `--client cursor`   |
| VS Code     | `--client vscode`   |
| Codex       | `--client codex`    |
| OpenCode    | `--client opencode` |

Each component publishes a `<name>-demo` registry item containing one usage snippet per docs section. Requesting `button-demo` returns usage examples for Button. **Do not install `-demo` items into your project.** They contain standalone snippets rather than compilable modules.

## Markdown

Every documentation page is served as Markdown at `<url>/index.md`, such as `/docs/components/button/index.md`, or at the page URL when requested with an `Accept: text/markdown` header. Each page also provides **Copy as Markdown** and **View as Markdown** actions below its description.

| File             | Contents                            |
| ---------------- | ----------------------------------- |
| `/llms.txt`      | Index of all pages with titles      |
| `/llms-full.txt` | All documentation pages in one file |

## AGENTS.md

If you do not install the skill, add the following block to your `AGENTS.md` or `CLAUDE.md`:

```md
## Constella

UI components come from the `@constella` shadcn registry, built on ui-sdk and styled with StyleX rather than Tailwind. Before using a component, read its page at https://constella.aayush.cv/docs/components/<name>/index.md (all pages are listed at https://constella.aayush.cv/llms.txt).

- Style components with `sx` from `stylex.create`, never `className`, `style`, or Tailwind classes.
- In a `render` chain, place `sx` only on the part that renders the element, such as `Button` in `<PopoverTrigger render={<Button />}>` or `Item` in `<Item render={<SidePanelTrigger />}>`.
- Use tokens from `@/lib/constella/tokens.stylex` instead of raw values.
- Compose the parts listed on each component page and never run `shadcn init`.
- Edit `theme.stylex.ts` for theming and toggle the `dark` class on `<html>` for dark mode.
```

## Agent bridge

The ui-sdk agent bridge lets an in-app agent inspect mounted ui-sdk components with `agent.snapshot()` and invoke their actions with `agent.act()`. Because Constella components are built on ui-sdk, they register with the bridge automatically.

Create the bridge once in the browser with `createAgent`:

```ts
import { createAgent } from "@ui-sdk/react/agent";

const agent = createAgent();
```

The bridge discovers components already mounted on the page and registers new ones as they mount. Because `createAgent` has no `destroy` method, store the instance on `globalThis` in development so hot reloads reuse it. For the full API, see [ui-sdk's Get Started](https://ui-sdk.dev/docs/agents/connect-an-agent) and [Reference](https://ui-sdk.dev/docs/agents/connect-an-agent/reference).

## Allow

Pass an `allow` callback to `createAgent` to approve or reject each action before it runs. When a control has an [agent mark](#agent-marks), the action includes the mark text in `step.confirm`. Allow unmarked steps to run and prompt the user for marked steps.

The example below uses `createAlertDialogController` to open a Constella [Alert Dialog](/docs/components/alert-dialog) for confirmation. It does not use `createConfirm` because `confirm()` cannot forward the step's `AbortSignal`. Place this setup in a module such as `lib/agent.ts`:

```ts
import { createAgent } from "@ui-sdk/react/agent";
import type { AgentAction } from "@ui-sdk/react/agent";
import { createAlertDialogController } from "@ui-sdk/react/alert-dialog";

const confirmController = createAlertDialogController<AgentAction>();
let mounted = false;
const mountConfirm = () => {
  mounted = true;
  return () => {
    mounted = false;
  };
};
const ask = async (step: AgentAction, signal: AbortSignal) => {
  if (!mounted) {
    return false;
  }
  const { returnValue } = await confirmController.open({
    payload: step,
    signal,
  });
  return returnValue === "confirm";
};
const agent = createAgent({
  allow: async (step, { signal }) =>
    step.confirm === undefined || (await ask(step, signal)),
});

export { agent, confirmController, mountConfirm };
```

| Condition | Behavior |
| --- | --- |
| `step.confirm` is `undefined` | The step runs without prompting. |
| No confirmation dialog is mounted | The step is refused so marked actions cannot run without a user. |
| The user clicks **Cancel** | The step is refused. |
| The user clicks **Allow** | The step runs. |
| The step's `signal` aborts | The dialog closes and the step does not run. |
| Another confirmation is already open | The step waits for its turn because the bridge runs one `act` call at a time. |

Mount the confirmation dialog once near the root of your app:

```tsx
import type { AgentAction } from "@ui-sdk/react/agent";
import { useEffect } from "react";

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
import { confirmController, mountConfirm } from "@/lib/agent";

const sentence = (text: string) => (/[.!?]$/u.test(text) ? text : `${text}.`);

const asked = ({ action, args, label, component }: AgentAction) =>
  `It asked to ${action} ${label ?? component}${args.length > 0 ? ` with ${args.join(", ")}` : ""}.`;

const question = (step: AgentAction) =>
  step.confirm === undefined
    ? asked(step)
    : `${sentence(step.confirm)} ${asked(step)}`;

function AgentConfirm() {
  useEffect(() => mountConfirm(), []);

  return (
    <div data-agent-hidden>
      <AlertDialog controller={confirmController}>
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
```

**Wrap the dialog in `data-agent-hidden`.** Hiding the dialog from the bridge prevents the agent from clicking **Allow** itself. For all `allow` options, see [ui-sdk's Permissions](https://ui-sdk.dev/docs/agents/connect-an-agent/permissions).

## Agent marks

Use data attributes to restrict which controls an agent can inspect or trigger without confirmation.

| Attribute | Placement | Effect on the agent |
| --- | --- | --- |
| `data-agent-confirm` | Any control that requires user confirmation, such as delete, pay, or send, with a sentence describing the effect | The step waits for your [`allow`](#allow) callback. Without an `allow` callback, the step fails with "Needs a person". |
| `data-agent-secret` | Any field the agent may fill but must not read | The field remains actionable, and its value is reported as `[redacted]`. Password, card, and one-time-code fields are redacted by default. |
| `data-agent-hidden` | Any region the agent should not inspect | Components inside the region are excluded from `snapshot` and `query`. |

Place `data-agent-confirm` on the confirming control, such as `AlertDialogAction` or a menu item. **Do not place it on the dialog trigger or dialog content.** Opening a dialog has no side effects, and placing the attribute on the dialog content also blocks **Cancel**. Give the confirmation button a label that is not a substring of the trigger label, such as "Delete forever" for a "Delete chat" trigger. Button lookups match existing buttons on the page first, so a label like "Delete" would match the trigger instead. Write the confirmation text from app state so the user sees the exact target.

```tsx
<AlertDialogFooter>
  <AlertDialogCancel>Cancel</AlertDialogCancel>
  <AlertDialogAction
    color="danger"
    data-agent-confirm={`Deletes "${chat.title}" and its files`}
  >
    Delete forever
  </AlertDialogAction>
</AlertDialogFooter>
```

[Approval](/docs/components/approval) includes `data-agent-confirm` on `ApprovalConfirm` by default. For other controls, your app must add the attribute. See the destructive action examples in [Alert Dialog](/docs/components/alert-dialog), [Dropdown Menu](/docs/components/dropdown-menu), and [Data Table](/docs/components/data-table).

For custom components built with `definePrimitive`, set `secret: true` in the `agent` configuration to redact the value wherever the component renders. This is how ui-sdk's OTP Input redacts its value by default. See [ui-sdk's Your Components](https://ui-sdk.dev/docs/agents/connect-an-agent/your-components).

```ts
agent: { actions: ["setValue", "clear"], secret: true },
```

History cannot restore secret values because it stores `[redacted]`. Seeking or undoing leaves secret fields unchanged and reports them in the list of unrestored changes.

**Do not place `data-agent-hidden` on `Toaster`.** Hiding the toaster prevents the agent from reading notifications triggered by its actions or clicking a toast's **Undo** button. An empty `Toaster` does not need the attribute because ui-sdk omits toast regions from `snapshot` until a toast is active.

## WebMCP

Call `registerTools` to expose the bridge's tools to the browser's built-in agent through WebMCP. The `allow` option is required and runs after the bridge's `allow` callback:

```ts
import { registerTools } from "@ui-sdk/react/agent";

registerTools(agent, { allow: () => true });
```

| Bridge `allow` behavior | Option for `registerTools` | Reason |
| --- | --- | --- |
| Prompts the user when `step.confirm` is set, as in [Allow](#allow) | `allow: () => true` | The user has already confirmed the step. Checking `step.confirm` again would reject an approved step. |
| Does not prompt the user | `allow: (step) => step.confirm === undefined` | Marked steps are rejected and all unmarked steps run. |

**Return `true` only when the bridge's `allow` callback already prompts the user.** Returning `true` without checking `step.confirm` bypasses confirmation. In browsers without `document.modelContext`, `registerTools` is a no-op. See [ui-sdk's WebMCP](https://ui-sdk.dev/docs/agents/connect-an-agent/webmcp).

## Staged edits and undo

Use `createHistory` and `stageChanges` from `@ui-sdk/react/history` to undo agent changes or preview them on the page until the user keeps or discards them. Both APIs are experimental in the ui-sdk beta.

| API | Behavior | Common pairing |
| --- | --- | --- |
| `createHistory(agent, { within })` | Records changes from users, agents, and app code inside the `within` element. Without `within`, it records the entire page. | One history instance per undoable region, created on mount and destroyed on unmount. |
| `history.entries()`, `history.position()`, `history.subscribe(listener)` | `entries()` returns recorded changes oldest first, each with `label`, `previous`, `value`, `source`, and `reason`. `position()` returns the count of applied entries from `0` to `entries().length`. `subscribe` notifies the listener when either value changes. | A list of assistant changes filtered by `source === "agent"`. |
| `history.seek(n)` | Restores the page state to entry `n`. Making a new change after seeking backward discards entries after that point. Resolves with any changes that could not be restored. | A timeline or rewind slider over history entries. |
| `history.undoSource("agent")` | Reverts only changes made by the agent. Resolves with any changes that could not be restored. | A button that undoes assistant changes and reports any fields that could not be reverted. |
| `stageChanges(agent, changes)` | Applies each `{ ref, key?, value }` directly to the mounted controls. `applied` lists each change as `{ ref, key, before, value }`. | An [Approval](/docs/components/approval) card displaying each `before` and `value` pair. |
| `staged.revert()` | Restores each recorded `before` value. Resolves with any changes that could not be restored. | A **Discard** button rendered with `ApprovalCancel`. |

Create the history inside an effect with `within` pointing to the container element. Call `destroy()` in the cleanup function so unmounted regions stop recording:

```tsx
import { createHistory } from "@ui-sdk/react/history";
import type { HistoryEntry } from "@ui-sdk/react/history";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

import { agent } from "@/lib/agent";

function AgentChanges({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<readonly HistoryEntry[]>([]);

  useEffect(() => {
    const history = createHistory(agent, { within: () => rootRef.current });
    const stop = history.subscribe(() => setEntries(history.entries()));
    return () => {
      stop();
      history.destroy();
    };
  }, []);

  const changes = entries.filter((entry) => entry.source === "agent");

  return (
    <div ref={rootRef}>
      {children}
      <p>{changes.length} assistant changes</p>
    </div>
  );
}
```

Clicking **Keep changes** leaves the staged values in place. Add `data-agent-confirm` to the confirmation button so the agent cannot approve its own staged changes:

```tsx
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
```

Both staging and reverting pass through `allow`. A marked control prompts the user when staged and again when discarded. See [ui-sdk's History and Undo](https://ui-sdk.dev/docs/agents/connect-an-agent/history-and-undo).

## What Constella guarantees

Constella's AI and TanStack components are tested against the ui-sdk agent bridge. Each component page lists what the agent sees in its Agent section.

- Every control has an accessible name, except those listed in [Known gaps](#known-gaps).
- Agent-initiated updates invoke change callbacks such as `onValueChange` with `details.source === "agent"`. Calling `details.cancel()` rejects the update in both uncontrolled and controlled fields. In a controlled field, skipping the state update without calling `details.cancel()` preserves the value but triggers a ui-sdk development warning. When canceled, the agent action fails with an error stating that the value was not applied. `Suggestions` `onClick` and `Data Table` `onRowSelectionChange` also receive agent-initiated changes.
- `data-agent-confirm`, `data-agent-secret`, and `data-agent-hidden` work on primitives including `Button`, `AlertDialogAction`, `DropdownMenuItem`, `Field`, and `Input`.
- The `Data Table` action bar is inert when no row is selected, preventing agents from triggering its buttons.

### Known gaps

| Component | Gap |
| --- | --- |
| [Trace](/docs/components/trace#agent) | A step without a trigger is listed with no name. |
| [Markdown](/docs/components/markdown#agent) | Two code blocks in the same language share a copy button name, so clicking by name fails. |
| [Message](/docs/components/message#agent) | Actions on a standalone Message (outside a Message Scroller) or on two replies starting with the same words share a name and must be clicked by ref. |
| [Prompt Input](/docs/components/prompt-input#agent) | Agents cannot insert a slash command. In ui-sdk beta.17, `insert` replaces the query with raw text. |
| Scroll Area in [Data Table](/docs/components/data-table#agent), [Markdown](/docs/components/markdown#agent), and [Suggestions](/docs/components/suggestions#agent) | Some scroll areas are listed with no name and no actions. |
| [Citation](/docs/components/citation#agent) | Calling `setOpen` on a card shared by multiple pills opens it empty because no pill selected its sources. |
