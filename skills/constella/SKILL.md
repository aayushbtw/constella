---
name: constella
description: Install and build with Constella, React components on Base UI styled with StyleX, added with the shadcn CLI from the @constella registry. Use when a project has @constella in components.json, imports from @/components/{primitives,typography,ai,tanstack}/* or @/lib/constella/*, uses stylex, or the user asks to set up, theme, add or fix a Constella component, or to build UI, forms or a chat screen with it.
---

# Constella

React components on Base UI, styled with StyleX, copied into the project with the shadcn CLI. They look like shadcn's, but the API differs: Base UI underneath, `sx` instead of `className`, tokens instead of utility classes. **What you remember about shadcn is a starting point; the component's page wins.**

## Docs

Everything is Markdown, so read it instead of guessing.

- Index of every page: https://constella.aayush.cv/llms.txt
- A component: `https://constella.aayush.cv/docs/components/<name>/index.md`
- With shadcn's MCP server, `get_item_examples_from_registries` with `<name>-demo` returns the page's snippets. They're snippets, not modules: read them, never `add` them.
- `shadcn add` prints each item's docs URL after install.

**Before using or changing a component, read its page.** It has the Usage, the Composition tree, a section per prop or part, and the API Reference.

## Principles

1. **Use an existing component first.** Search `llms.txt` before writing markup. A callout is `Alert`, an empty state `Empty`, a loading placeholder `Skeleton`, a line `Separator`.
2. **Compose parts.** One part per element (`Card`, `CardHeader`, `CardTitle`); no config-object props. The page's Composition tree lists them.
3. **Variants before custom styles.** `variant="outline"`, `size="sm"`. Every control has the same size scale: `xs`, `sm`, `default`, `lg`.
4. **Tokens, not values.** Colors, space, radii, sizes and motion come from `@/lib/constella/tokens.stylex`.

## Rules

Each links to a file with Incorrect/Correct pairs.

### Styling → [styling.md](./rules/styling.md)

- **`sx`, never `className` or `style`.** Parts take `sx?: Sx` from `stylex.create` and apply it last. Its colors, space, radii, shadows, type sizes, layers and motion must be tokens, so a raw value is a type error.
- **No utility classes.** Not `flex gap-4`, not `bg-primary`.
- **No raw values.** Not `#fff`, `16px`, `200ms`, `z-index: 50`. Use `colors`, `space`, `radii`, `sizes`, `durations`, `layers`.
- **Longhands only.** `paddingBlock`, `paddingInline`, `borderTopWidth`. Not `padding`, `margin`, `border`, `borderRadius`: a shorthand loses to any longhand merged in through `sx`.
- **Hover is behind `media.hover`.** Otherwise touch sticks.
- **Text is `Text`, `Heading`, `Caption`; inline links and code are `Link`, `Code`.** Not a raw `<p>` with a font size.

### Composition → [composition.md](./rules/composition.md)

- **A custom trigger takes `render`, not `asChild`.** `<DialogTrigger render={<Button />}>`.
- **A link that looks like a button spreads `buttonStyles`** onto an `<a>`. Not `<Button render={<a />}>`.
- **Dialog, Sheet and AlertDialog always need a Title.** Hide it with `sx={visuallyHidden.base}`.
- **`Select` and `Command` take `items`.** Don't map your own children into `Command`.
- **Button has no `isLoading`.** Compose `Spinner` + `data-icon` + `aria-busy` + `disabled`.
- **Full Card composition**, `TabsTrigger` inside `TabsList`, `Avatar` always with `AvatarFallback`.
- **Don't wrap a component to restyle it.** Pass `sx`, or use the variant.

### Forms → [forms.md](./rules/forms.md)

- **`FieldGroup` + `Field` for layout.** Never a `div` with a gap. Label, description and error link to the control with no `id`.
- **Validation is `invalid` on `Field`, `disabled` on `Field`.** Not `aria-invalid` by hand.
- **Related checkboxes or radios go in `FieldSet` + `FieldLegend`.**
- **A button or icon inside an input is `InputGroup` + `InputGroupAddon`.**
- **Pick one of 2–7 options with `ToggleGroup`** (its value is an array), not a loop of `Button`s.

### Icons → [icons.md](./rules/icons.md)

- **Hugeicons only,** through `HugeiconsIcon`, at `sizes.icon` and `strokeWidth={Number(strokes.icon)}`.
- **In a button, `data-icon="inline-start"` or `"inline-end"`.**
- **Decorative icons get `aria-hidden`;** an icon-only button gets `aria-label`.
- **An icon that points along the line gets `data-rtl-flip`.**

### AI and data → [ai.md](./rules/ai.md)

- **Chat composes the AI parts:** `MessageScroller`, `Message`, `PromptInput`, `Trace`. No hand-rolled bubbles or scroll-to-bottom hooks.
- **The app owns state, the component owns markup.** `DataTable` renders a `useTable` instance; `Chart` renders a `defineChart` definition. Keep both outside the component or memoized.

### Setup → [setup.md](./setup.md)

- **Never run `shadcn init`.** It writes a setup these components do not use. Write `components.json` by hand.
- **Theme in `theme.stylex.ts`,** the one file you own. Dark mode is a `dark` class on `<html>`.
- **Keep the `@/*` alias** in `tsconfig.json` and StyleX's config in step.

## Component selection

| Need | Use |
| --- | --- |
| Action | `Button` (`primary` once per view) |
| Link that looks like a button | `buttonStyles` on an `<a>` |
| Text input | `Input`, `Textarea`, `InputGroup` |
| Choice | `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `ToggleGroup`, `SegmentedControl` |
| Form layout | `Field`, `FieldGroup`, `FieldSet` |
| Data | `Table`, `DataTable`, `Card`, `Badge`, `Avatar`, `Item`, `Meter`, `Chart` |
| Navigation | `Sidebar`, `Tabs`, `DropdownMenu` |
| Overlays | `Dialog` (task), `AlertDialog` (confirm), `Sheet` (side panel), `Popover`, `HoverCard`, `Tooltip` |
| Feedback | `toast`, `Alert`, `Progress`, `Skeleton`, `Spinner` |
| Command palette | `CommandDialog` + `Command` |
| Empty state | `Empty` |
| Chat | `MessageScroller`, `Message`, `PromptInput`, `Trace`, `Attachment`, `Markdown`, `CodeBlock` |
| Text | `Text`, `Heading`, `Caption`, `Link`, `Code`, `Kbd` |

## Workflow

1. **Check the project.** Is a StyleX compiler set up? Is Tailwind there too? See [setup.md](./setup.md#check-the-project-first); warn the user about Tailwind before adding. `npx shadcn@latest info --json` lists the config and components. Don't import one that isn't added, and don't re-add one that is.
2. **Read the page** for every component you'll use, plus any it names as a dependency.
3. **Add:** `npx shadcn@latest add @constella/<name>`. The first adds StyleX, the tokens and `theme.stylex.ts`. Preview an update with `--dry-run` and `--diff`; never `--overwrite` without the user's approval.
4. **Build** with the rules above.
5. **Check the result.** Typecheck, then render it in dev. A component that renders unstyled means the StyleX compiler isn't running on it: see the framework page's Troubleshooting table in [setup.md](./setup.md).
6. **Registry must be explicit.** Add Constella components as `@constella/<name>`. If the user names no registry for a block, ask.

## References

- [rules/styling.md](./rules/styling.md): `sx`, tokens, shorthands, hover, type, dark mode
- [rules/composition.md](./rules/composition.md): triggers, groups, overlays, Card, Button states, Select and Command `items`, Toast
- [rules/forms.md](./rules/forms.md): Field, InputGroup, ToggleGroup, validation
- [rules/icons.md](./rules/icons.md): Hugeicons, sizes, `data-icon`, RTL
- [rules/ai.md](./rules/ai.md): chat parts, Trace, PromptInput, DataTable, Chart
- [setup.md](./setup.md): install, StyleX config per framework, theming, fonts, dark mode, RTL
