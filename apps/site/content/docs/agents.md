---
title: Agents
description: Give your coding agent the skill, the registry and the docs as Markdown, and mark what an agent inside your app must not do alone.
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

Every page is Markdown at its URL plus `/index.md`, like `/docs/components/button/index.md`. or at its URL when requested with `Accept: text/markdown`. Under each page's description, Copy as Markdown copies it and View as Markdown opens it.

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

## Agent Marks

When your app lets an agent drive its UI through ui-sdk's agent bridge, `createAgent` from `@ui-sdk/react/agent`, mark what the agent must not do or see. To set up the bridge, see [ui-sdk's Agents docs](https://ui-sdk.dev/docs/agents).

| Attribute | Put it on | What the agent gets |
| --- | --- | --- |
| `data-agent-confirm` | Anything an agent must not do alone, like delete, pay or send, with a sentence that says what it does | A step that waits for your `allow` callback. Without `allow`, the step fails with "Needs a person". |
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

**Don't put `data-agent-hidden` on the Toaster.** It hides every toast and its actions from the agent, and an empty Toaster already shows the agent nothing.
