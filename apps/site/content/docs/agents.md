---
title: Agents
description: Give your coding agent the skill, the registry and the docs as Markdown, so it builds with Constella the way the docs do.
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

UI components are Constella: Base UI styled with StyleX, not Tailwind, from the `@constella` shadcn registry. Before using one, read its page at https://constella.aayush.cv/docs/components/<name>/index.md (every page: https://constella.aayush.cv/llms.txt).

- Style with `sx` (from `stylex.create`), never `className`, `style` or Tailwind classes.
- Use tokens from `@/lib/constella/tokens.stylex`, not raw values.
- Compose the parts each page lists; never run `shadcn init`.
- Theme in `theme.stylex.ts`; dark mode is a `dark` class on `<html>`.
```
