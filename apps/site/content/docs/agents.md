---
title: Agents
description: Give your coding agent the skill, the registry and the docs as Markdown, and let an agent inside your app drive its UI through ui-sdk's agent bridge, with a person confirming what matters.
order: 3
---

## Skill

Install the Constella skill. It tells the agent how to install for your framework, where usage lives, and the rules it would otherwise guess at, like `sx` over `className`.

```bash
npx skills add aayushbtw/constella
```

## MCP

shadcn's MCP server reads the registries in your `components.json`, so once `@constella` is there (see [Installation](/docs/installation)) the agent can search components, read their source and add them. Set it up for your client:

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

Each component has a `<name>-demo` item with its usage snippets, one per docs section, so asking for "button-demo" returns how Button is used. **Don't add a `-demo` item.** Its files are snippets, not modules, and won't compile.

## Markdown

Every page is Markdown at its URL plus `/index.md`, like `/docs/components/button/index.md`, or at its URL when requested with `Accept: text/markdown`. Under each page's description, Copy as Markdown copies it and View as Markdown opens it.

| File             | Holds                       |
| ---------------- | --------------------------- |
| `/llms.txt`      | Every page, linked by title |
| `/llms-full.txt` | Every page in one file      |

## AGENTS.md

Without the skill, add this to your `AGENTS.md` or `CLAUDE.md`:

```md
## Constella

UI components are Constella: ui-sdk styled with StyleX, not Tailwind, from the `@constella` shadcn registry. Before using one, read its page at https://constella.aayush.cv/docs/components/<name>/index.md (every page: https://constella.aayush.cv/llms.txt).

- Style with `sx` (from `stylex.create`), never `className`, `style` or Tailwind classes.
- Use tokens from `@/lib/constella/tokens.stylex`, not raw values.
- Compose the parts each page lists; never run `shadcn init`.
- Theme in `theme.stylex.ts`; dark mode is a `dark` class on `<html>`.
```

## Agent Bridge

ui-sdk's agent bridge lets an agent inside your app read the page's ui-sdk components with `agent.snapshot()` and call their actions with `agent.act()`. Constella's components are ui-sdk components, so they join the bridge with no setup.

Create the bridge once, in the browser, with `createAgent`:

```ts
import { createAgent } from "@ui-sdk/react/agent";

const agent = createAgent();
```

It finds the components already on the page and adds new ones as they mount. It has no `destroy`, so the docs site keeps its bridge on `globalThis` and a hot reload reuses it. For the rest of the API, see [ui-sdk's Get Started](https://ui-sdk.dev/docs/agents/connect-an-agent) and [Reference](https://ui-sdk.dev/docs/agents/connect-an-agent/reference).

## Allow

Pass `allow` to `createAgent` to decide each step before it runs. A step on a control with an [agent mark](#agent-marks) carries the mark's sentence as `step.confirm`, so let other steps run and ask the person about those.

This bridge asks through `createConfirm`, which drives a Constella [Alert Dialog](/docs/components/alert-dialog). Put it in a module like `lib/agent.ts`:

```ts
import { createAgent } from "@ui-sdk/react/agent";
import type { AgentAction } from "@ui-sdk/react/agent";
import { createConfirm } from "@ui-sdk/react/alert-dialog";

const confirm = createConfirm<AgentAction>();
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
  const { returnValue } = await confirm.controller.open({
    payload: step,
    signal,
  });
  return returnValue === "confirm";
};
const agent = createAgent({
  allow: async (step, { signal }) =>
    step.confirm === undefined || (await ask(step, signal)),
});

export { agent, confirm, mountConfirm };
```

| When | The step |
| --- | --- |
| It has no `step.confirm` | Runs without asking. |
| No confirm dialog is mounted | Is refused, so nothing runs without a person. |
| The person presses **Cancel** | Is refused. |
| The person presses **Allow** | Runs. |
| Its `signal` aborts | Closes the dialog and doesn't run. |
| Another confirm step is still asking | Waits for its own answer. |

Render the dialog once on the page:

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
import { confirm, mountConfirm } from "@/lib/agent";

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
```

**Keep the dialog inside `data-agent-hidden`.** There the agent can't see the dialog, so it can't press **Allow** for the person. For the `allow` options, see [ui-sdk's Permissions](https://ui-sdk.dev/docs/agents/connect-an-agent/permissions).

## Agent Marks

Mark what the agent must not do or see.

| Attribute | Put it on | What the agent gets |
| --- | --- | --- |
| `data-agent-confirm` | Anything an agent must not do alone, like delete, pay or send, with a sentence that says what it does | A step that waits for your [`allow`](#allow) callback. Without `allow`, the step fails with "Needs a person". |
| `data-agent-secret` | A field the agent may fill but never read | The field, with its value shown as `[redacted]`. Password, card and one-time-code fields are secret already. |
| `data-agent-hidden` | A region the agent shouldn't see | Nothing. Components inside are left out of `snapshot` and `query`. |

Put `data-agent-confirm` on the button that confirms, like `AlertDialogAction` or a menu item. **Don't put it on the trigger or the content.** Opening the dialog is harmless, and a mark on the content gates Cancel too. Give the button text that the trigger's text doesn't hold, like "Delete forever" under a "Delete chat" trigger. A press looks among the buttons already on the page first, so "Delete" would match the trigger. Write the sentence for the person who is asked, from app state.

```tsx
<AlertDialogFooter>
  <AlertDialogCancel>Cancel</AlertDialogCancel>
  <AlertDialogAction
    color="danger"
    data-agent-confirm={`Deletes “${chat.title}” and its files`}
  >
    Delete forever
  </AlertDialogAction>
</AlertDialogFooter>
```

[Approval](/docs/components/approval)'s `ApprovalConfirm` carries the mark by default. The destructive actions in the [Alert Dialog](/docs/components/alert-dialog), [Dropdown Menu](/docs/components/dropdown-menu) and [Data Table](/docs/components/data-table) examples show it.

For a component you build with `definePrimitive`, set `secret: true` in its `agent` key to redact its value wherever it renders. That's how ui-sdk's OTP Input is secret by default. See [ui-sdk's Your Components](https://ui-sdk.dev/docs/agents/connect-an-agent/your-components).

```ts
agent: { actions: ["setValue", "clear"], secret: true },
```

History can't put back a secret value, since it records `[redacted]`. Seeking or undoing leaves a secret field as it is and lists it among the changes it couldn't put back.

**Don't put `data-agent-hidden` on the Toaster.** It hides every toast and its actions from the agent, and an empty Toaster already shows the agent nothing.

## WebMCP

Call `registerTools` to give the browser's own agent the bridge's tools through WebMCP. Its `allow` is required and runs after the bridge's `allow`:

```ts
import { registerTools } from "@ui-sdk/react/agent";

registerTools(agent, { allow: () => true });
```

| Your bridge's `allow` | Pass to `registerTools` | Why |
| --- | --- | --- |
| Asks the person when `step.confirm` is set, like the one in [Allow](#allow) | `allow: () => true` | The person already answered. A check on `step.confirm` here would refuse a step they allowed. |
| Doesn't ask the person | `allow: (step) => step.confirm === undefined` | Marked steps are refused, and every other step runs. |

**Return `true` only when the bridge's `allow` already asked.** An `allow` that returns `true` without reading `step.confirm` answers for the person. In a browser without `document.modelContext`, `registerTools` does nothing. See [ui-sdk's WebMCP](https://ui-sdk.dev/docs/agents/connect-an-agent/webmcp).

## Staged Edits and Undo

Use `createHistory` and `stageChanges` from `@ui-sdk/react/history` to undo an agent's changes, or to put them on the page until the person keeps or discards them. Both are experimental in ui-sdk beta.

| Call | What it does | Pair it with |
| --- | --- | --- |
| `createHistory(agent)` | Records changes from people, agents and your app. | One history, created next to the bridge. |
| `history.entries()`, `history.position()`, `history.subscribe(listener)` | `entries()` lists the changes, oldest first, each with its `label`, `previous`, `value`, `source` and `reason`. `position()` is how many entries are applied, from `0` to `entries().length`. `subscribe` calls the listener when either changes. | A list of the assistant's changes, the entries whose `source` is `"agent"`. |
| `history.seek(n)` | Puts the page back as it was after `n` entries, or forward again. A new change after seeking back drops the entries after that point. It resolves with the changes it couldn't put back. | A timeline or rewind slider over the entries. |
| `history.undoSource("agent")` | Puts back only the agent's changes. It resolves with the changes it couldn't put back. | A button that undoes the assistant's changes and names what it couldn't put back. |
| `stageChanges(agent, changes)` | Writes each `{ ref, key?, value }` onto the real controls. `applied` lists each change as `{ ref, key, before, value }`. | An [Approval](/docs/components/approval) card that lists each `before → value`. |
| `staged.revert()` | Puts each `before` value back. It resolves with the changes it couldn't put back. | **Discard**, an `ApprovalCancel`. |

Create the history in the bridge's module, `lib/agent.ts`, and export it:

```ts
import { createHistory } from "@ui-sdk/react/history";

const history = createHistory(agent);

export { agent, confirm, history, mountConfirm };
```

Read it with `useSyncExternalStore`:

```tsx
import type { HistoryEntry } from "@ui-sdk/react/history";
import { useSyncExternalStore } from "react";

import { history } from "@/lib/agent";

const onHistory = (listener: () => void) => history.subscribe(listener);
const entries = () => history.entries();
const noEntries: readonly HistoryEntry[] = [];

function useAgentChanges() {
  const recorded = useSyncExternalStore(onHistory, entries, () => noEntries);
  return recorded.filter((entry) => entry.source === "agent");
}
```

**Keep changes** leaves the staged values on the page. Mark it with `data-agent-confirm`, so the agent can't keep its own changes:

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

Staging and reverting both go through `allow`, so a marked control asks the person when it's staged and again on **Discard**. See [ui-sdk's History and Undo](https://ui-sdk.dev/docs/agents/connect-an-agent/history-and-undo).

## What Constella's Parts Guarantee

Constella's AI and TanStack components are tested against the bridge. Each component's page lists what the agent sees in its Agent section.

- Every control has a name, except the [Known Gaps](#known-gaps).
- An agent's change reaches your change callback, like `onValueChange`, with `details.source === "agent"`, and `details.cancel()` keeps the current value. Suggestions' `onClick` and Data Table's `onRowSelectionChange` get the agent's changes too.
- `data-agent-confirm`, `data-agent-secret` and `data-agent-hidden` work on the primitives, such as Button, `AlertDialogAction`, `DropdownMenuItem`, Field and Input.
- Data Table's action bar is inert while no row is selected, so the agent can't press its buttons.

### Known Gaps

| Component | Gap |
| --- | --- |
| [Questionnaire](/docs/components/questionnaire#agent) | The agent can't see or check the choices. It sees the freeform answer and the buttons that move between questions. |
| [Trace](/docs/components/trace#agent) | A step with no trigger is listed with no name. |
| [Markdown](/docs/components/markdown#agent) | Two code blocks in the same language share a copy button name, so a press by that name fails. |
| [Message](/docs/components/message#agent) | Copy, Retry and Good answer repeat on every reply in a chat. |
| [Data Table](/docs/components/data-table#agent) | A press on a column header by its title fails, since ui-sdk reads the header row's text as row text for every header. |
| [Prompt Input](/docs/components/prompt-input#agent) | The agent can't insert a slash command. ui-sdk beta.13's `insert` puts the raw text in place of the query. |
| [Questionnaire](/docs/components/questionnaire#agent), [Message Scroller](/docs/components/message-scroller#agent) | They don't pass ui-sdk's change `details` on, since they're built on `@shadcn/react`. |
| Scroll Area, as in [Data Table](/docs/components/data-table#agent), [Markdown](/docs/components/markdown#agent) and [Suggestions](/docs/components/suggestions#agent) | Some scroll areas are listed with no name and no actions. |
| [Citation](/docs/components/citation#agent) | `setOpen` on a card shared by several pills opens it empty, since no pill picked its sources. |
