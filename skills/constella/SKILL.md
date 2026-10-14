---
name: constella
description: Install and build with Constella, React components on Base UI styled with StyleX (not Tailwind), added with the shadcn CLI from the @constella registry. Use when a project has @constella in components.json, imports from @/components/ui/* with StyleX, or the user asks to set up or use Constella.
---

# Constella

React components on Base UI, styled with StyleX, copied into the project with the shadcn CLI. The docs are Markdown for agents: start at https://constella.aayush.cv/llms.txt, and read a component's page at `https://constella.aayush.cv/docs/components/<name>/index.md` before using it. Every rule there wins over what you remember about shadcn.

## Install

Follow the page for the project's framework, listed at https://constella.aayush.cv/docs/installation/index.md, not the shadcn default.

Then `npx shadcn@latest add @constella/<name>`. The first component also adds StyleX, the tokens and `theme.stylex.ts`.

**Never run `shadcn init`.** It sets up Tailwind, which these components don't use. Write `components.json` by hand as the install page shows.

## Find usage

- Read the component's `index.md` page: Usage, Composition, then a section per prop or part.
- With shadcn's MCP server, `get_item_examples_from_registries` with `<name>-demo` returns the same snippets, one per docs section. They're snippets, not modules: read them, never `add` them.
- `shadcn add` prints each item's docs URL after install.

## Rules

- **Style with `sx`, never `className` or `style`.** Parts take `sx?: StyleXStyles`, from `stylex.create`, and apply it last.
- **No Tailwind classes, no raw values.** Import tokens from `@/lib/tokens.stylex` (`colors`, `space`, `radii`, `sizes`, `durations`) and use them inside `stylex.create`.
- **Compose parts, as shadcn does.** One part per element (`Card`, `CardHeader`, `CardTitle`); no config-object props. The page's Composition tree lists them.
- **A link that looks like a button spreads `stylex.props(buttonStyles({ variant, size }))`** onto the link. Don't wrap a component to restyle it.
- **Theme in `theme.stylex.ts`**, the one file you own: accent, grays, radius, sizing. https://constella.aayush.cv/docs/theming/index.md
- **Dark mode is a `dark` class on `<html>`.** Components never branch on the theme.
- **Icons are Hugeicons** at `sizes.icon` with `strokeWidth={Number(strokes.icon)}`; add `data-rtl-flip` to one that points along the line.
- **Keep the `@/*` alias** in `tsconfig.json` and StyleX's config in step; StyleX resolves imports itself.

## Check

- A component renders unstyled: the StyleX compiler isn't running on it. See the framework page's Troubleshooting table.
- Styled in dev but not in a build, or the reverse: same table.
