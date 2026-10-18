# Architecture

## Stack

- **Base UI underneath.** Behavior, focus and accessibility come from the primitive. A component adds styling and composition, never its own version of what Base UI already handles.
- **StyleX only.** Most shadcn registries ship Tailwind, so another one adds nothing.
- **Command is Base UI too.** shadcn's Command is cmdk; ours is Base UI's Autocomplete, inline and always open, so it filters the `items` it's given rather than its children.
- **TanStack for data.** A data table renders a `useTable` instance the app builds with its own features (Table v9), virtualizes with TanStack Virtual against the window or a `scrollRef`, and reads its loading, stale and error states from a TanStack Query `useQuery` result; the app owns state, the component owns markup. A chart renders a TanStack Charts definition the app builds; the definition owns marks, scales, focus and the tooltip's behavior, the component owns the surface, the tooltip's markup and the legend. The palette reaches the library through the `--ts-chart-*` names it reads, set in `base.css`, so a definition needs no theme. Markdown renders TanStack Markdown with Constella's parts mapped onto its tags, its fences in a Code Block; the app passes the highlighter and adds its theme CSS, since the language set and code colors are its choice. Code Block ships no highlighter for the same reason. The app renders its tokens inside each `CodeBlockLine`. Docs list these under their own TanStack sidebar section.
- **Motion is StyleX and CSS.** No animation library: transitions, keyframes and Base UI's data attributes (`data-starting-style`, `data-ending-style`) cover it, and consumers install nothing extra.
- **Except a chart's data.** SVG geometry has no CSS transition, so `useChartTween` eases the values and the chart redraws each frame, timed by a Web Animation so it keeps the `out` curve and DevTools' playback speed. TanStack's own `svgAnimation` and `motion()` morph shapes instead: arcs bend across the ring and the axis disagrees with the marks mid-change, so neither is used.

## Workspace

`packages/ui` is the registry and holds only what ships; `apps/site` is the docs site and never ships. The library imports with `@/` because the shadcn CLI only rewrites `@/lib/*` and `@/components/*` to the consumer's aliases. The site maps `@/` to the library, as a consumer would, and uses `~/` for its own code. `shadcn build` writes the registry into the site's `public/r`. `packages/lint` is `@constella/lint`, an oxlint plugin for the rules below that a type check can't catch; the root config loads it like a consumer would.

## Registry

Every `registry:lib` file lives in `src/lib/constella/`, so an install keeps it apart from the app's own `lib` files. `base` is the floor every component depends on: the tokens, plus `base.css` with the Radix scales, theme and focus ring, imported by `tokens.stylex.ts` so it arrives with the first token, `motion.ts` for behavior two popups share, and `styles.ts` with the styles parts share: `joinStyles`, the ButtonGroup corners and edges every joinable part applies after its own styles, `typeStyles`, the type scale's steps (size and line height together) a part puts before its own styles, `textWeights` and `textColors`, the weights and colors those three take as props, as lists with their styles in `textWeightStyles` and `textColorStyles`, and `visuallyHidden`, for text only screen readers get. Parts take `typeStyles` rather than Text, Heading and Caption, since a part already renders its own element and its size often follows a selector; app code and the site's demos use `Text`, `Heading` and `Caption`. `Link` and `Code` are different: they style an inline element rather than set a step, so parts compose them as they do Table (Markdown renders its links and inline code with them). `base.css` imports `reset.css`: what the browser styles that components need otherwise, border-box sizing and preflight's font rules. Never margins, which would restyle the app's own pages; the site's page reset (margins, links) stays in the site. StyleX can't evaluate an imported helper inside `stylex.create`, but a created style passes across files like any value. Shared foundations stay in `base` even if a component skips some of them; colors are small. A component gets its own item only for something specific to it and heavy.

**Components and blocks.** A component (`registry:ui`) is a part an app assembles, including AI parts built on other components (Citation is a Badge and a Hover Card). Its files live in `src/components/<group>/` and import as `@/components/primitives/alert`, grouped like Interfere's. The group is its docs section (`primitives`, `typography`, `ai`, `tanstack`), and the page lint fails when they disagree. Its files are typed `registry:component`, not `registry:ui`: `shadcn add` flattens a `registry:ui` file outside `components/ui` into the app's `ui` folder and leaves its imports dangling, while a `registry:component` file keeps its group under the app's `components` alias. A block (`registry:block`, its files `registry:component` in `src/components/`, so they install where an app keeps its own) is a whole section: a page, a form, a chat screen, copied in to edit. Blocks are exempt from the part rules below and are documented at `/blocks`.

**For agents.** Every item's `docs` names its page's Markdown URL, which `shadcn add` prints; a draft's item gets one when its page leaves draft, since drafts aren't built. After `shadcn build`, the site's build runs `scripts/registry-examples.ts`, which adds a `registry:example` `<name>-demo` per component page to `public/r`, so shadcn's MCP server returns usage snippets; they're labelled as snippets, since they don't compile alone. The agent skill is `skills/constella/`, installed from the repo with `npx skills add`: `SKILL.md` holds the rules that always apply and links `rules/*.md` (incorrect/correct pairs per topic) and `setup.md`, after shadcn's own skill. A rule that drifts goes there and in `@constella/lint`, not in one only. We'll build our own MCP server only if shadcn's turns out too limiting.

**Markdown.** The worker entry is `src/server.ts`: with `runWorkerFirst`, every page request passes through it, and `Accept: text/markdown` gets the page's `/index.md` route instead of HTML, with `Vary: Accept`; a miss is a Markdown 404 that links `llms.txt`. Markdown is served at request time, not prerendered. `/docs/installation/index.md`, `/docs/components/index.md` and `/blocks/index.md` have their own routes, since the `$slug` page routes would take `index.md` as a slug.

`registryDependencies` reference this registry by URL. A bare name like `base` means shadcn's official registry.

`vpr check` runs `packages/ui/scripts/check-registry.ts`: an item's direct imports must equal its `dependencies` (React aside, which the app provides) and its `registryDependencies`, even ones another dependency already brings, and every file in `src` belongs to exactly one item. `devDependencies` aren't checked.

## Composition

Components compose like shadcn: one file per component, made of small parts the consumer assembles. Data Table is the exception. Past 1,000 lines, it splits into parts (`data-table-pagination`, `-selection`, `-view-options`) and hooks (`use-data-table-keys`, `-virtualizer`), all files of one registry item. `data-table.tsx` re-exports the parts, so imports stay `@/components/tanstack/data-table`.

Chart keeps the rule across a library boundary. TanStack Charts paints its own tooltip, so `Chart` hands it `ChartTooltipContent`, which builds the tooltip from parts (`ChartTooltip`, `-Title`, `-Row`, `-Label`, `-Value`, `ChartIndicator`) the consumer can compose through `renderTooltipBody` instead. The legend is parts outside the chart (`ChartLegend`, `ChartLegendItem`, `ChartIndicator`), bound to it only by the app's state, so either can be replaced whole. A `ChartConfig` names and paints each series once, as shadcn's does, but as a plain value passed where it's read, not a context: `chartColor(config)` gives the definition its color scale, `Chart` and `ChartLegendContent` take it to label the tooltip and legend.

```
Alert
├── Icon
├── AlertTitle
├── AlertDescription
└── AlertAction
```

- **One part, one element.** Each part wraps a single element or Base UI part and is a named export (`Alert`, `AlertTitle`). No config-object props that hide structure; if it renders, it's a part. A part that announces (Copy Button's "Copied") renders its live region as a slot-less sibling, since inside the control its text would join the control's name and a slot would make it a group's last part.
- **A text input is three elements.** `Input` is an `InputGroup` box around `InputGroupInput`, a slot holding a bare `<input>`, after Interfere's. On a touch screen the input renders at 16px, so iOS doesn't zoom on focus, and scales by `inputVars.scale` back to the box's text size. It outgrows its slot in layout, and the slot keeps that from pushing the addons. `sx` styles the box; every other prop goes to the `<input>`.
- **Customizing a part, in this order.** Each kind of part has one way in, so the same need is always met the same way:
  1. **Inline marks** (Shimmer, Code, Link, Swap Text) take their font and size from the text around them and have no size or color props. They set a color only when the color is what they mean (Link's `textPrimary`, Shimmer's sweep). To size one, put it in a `Text`: `<Text color="muted"><Shimmer>…</Shimmer></Text>`.
  2. **A part with its own look** (Button, Badge, Kbd) takes `variant`, `size` and `status`.
  3. **Containers** take parts and children. Text inside is a `Text`; with no `size` or `weight` it takes its parent's, so it fits the part it sits in.
  4. **`render`** swaps the element. Every part that renders one element takes it. A part that bundles another component (`DialogContent`, `DialogCloseButton`, `ToastAction`, `AlertDialogCancel`, `DropdownMenuInput`, `TraceCollapsibleTrigger`) omits it, since a caller's element would replace the bundled one and its styles; build from the underlying parts instead.
  5. **`sx`** for the rest, on the element that draws the part. An input's goes to its `InputGroup` box. A part whose surface sits in a shell (Sidebar's panel, Trace's collapsible content) puts it on the surface. Table's container is out of reach, as in shadcn.
- **Base UI pass-throughs take `sx` too.** A Trigger, Close, Group or Portal renders an element, so it omits `className` and `style` and takes `sx`; a Root or Provider renders none and passes its props through. Given `render={<Button />}`, put `sx` on the Button: it applies its own classes last, so the Trigger's would be dropped.
- **One name per concept.** `status` is severity: `success`, `info`, `warning`, `danger`. `state` is lifecycle (Trace, Attachment, Prompt Input's submit). `variant` is a look, and `variant="danger"` is only the destructive look (Button, Badge, menu items). Avatar Badge's dot is `presence`. Toast keeps Base UI's `type` and its `error`, since `toast.promise` sets it.
- **Every value list is exported and mirrored.** Each prop's values are an `as const` list the type derives from (`textSizes`, `codeBlockStatuses`), and the part writes the value as a `data-*` attribute through `state` or by hand. The control scale below is for controls; type (`base`, heading levels) and containers (Card's `flush`, Dialog's `full`) keep their own.
- **Every part has a `data-slot`.** Even unstyled Base UI wrappers, so a parent can style around a child (`:has(> [data-slot="alert-action"])`) without a prop. Variants and sizes are mirrored as `data-variant`, `data-size`.
- **A part reused unchanged keeps its parent's slot.** `ApprovalHeader` is `CardHeader` re-exported, with `card-header`, because Card's selectors read those slots (`[data-slot='card'][data-size='sm']` sizes the title). Only a part that adds styles gets its own slot.
- **Convenience parts bundle the boilerplate.** `DialogContent` renders Portal, Backdrop and Popup, as in shadcn. The underlying parts stay exported for when it doesn't fit.
- **`sx` overrides, not `className`.** Parts omit `className` and `style` and take `sx?: StyleXStyles`, applied last in `stylex.props(...)` so the caller wins. The type is declared in each file, so every component installs alone.
- **Variants are style keys.** `variant` and `size` index a `satisfies Record<Variant, StyleXStyles>` map, and the allowed values are one exported `as const` list (`buttonVariants`) the type derives from. No cva, no class strings.
- **The caller picks meaning, not the component.** Never derive a variant or status from the value (a full meter turning red); the same value means different things in different apps, so expose the prop and leave the choice to the caller.
- **Every control has the size scale.** `xs`, `sm`, `default`, `lg` (and `icon-xs`, `icon-sm`, `icon`, `icon-lg` where it has icon-only sizes), shadcn's names. Text fields skip `xs`: 24px is too short for typed text. The default is a real value, so `size="default"` can be passed, not only implied.
- **Styles for other elements are a function.** When an element must keep its own semantics (a link styled as a button), the component exports a style getter (`buttonStyles`) instead of rendering through `render`.
- **State comes from Base UI's data attributes** (`[data-open]`, `[data-disabled]`, `[data-starting-style]`), never mirrored into React state.
- **Groups talk to their children through variables.** A `ButtonGroup` sets the `joins` vars (`inline`, `block`, `either`) to `0`; a joinable child multiplies its corners and start edge by them, by whether it's the group's first or last part: `:nth-child(1 of [data-slot])`, not `:first-child`, because Base UI drops focus guards and a portal placeholder beside an open popup's trigger. Outside a group they stay `1`, so nothing changes. A part that must stay whole inside a group (an input group's addon) resets them to `1`.
- **A component's own variables are `defineVars` in `tokens.stylex.ts`** (`joins`, `avatarVars`). StyleX's types reject a raw `--custom-property` key, and `defineVars` only compiles in a `.stylex.ts` file.
- **Repeated style shapes are helpers.** StyleX evaluates arrow functions inside `stylex.create`, not function declarations, so those helpers are arrows with `func-style` disabled around them.

## Styling boundaries

Learned from Linear's move to StyleX ([Styling Linear for the future](https://linear.app/now/styling-linear-for-the-future-stylex)): the patterns hardest to keep correct at scale are the ones that style at a distance. Every rule here keeps a component's look readable from its own file.

- **A component owns its look.** What a part looks like is written in its file. A child may adapt to where it sits by declaring the condition itself (Spinner's `:is([data-slot='badge'] *)`); a parent may change its own layout by what it holds (`:has(> [data-slot='field-content'])`). A parent never styles a component or element it didn't render.
- **`sx` is the only way in.** No `className`, no `style`, no wrapping a component to restyle it. A part that takes `sx` passes it last, and a wrapper passes it through, never drops it.
- **`base.css` is the only escape hatch.** Global CSS only for what StyleX can't reach: third-party DOM, and children a component doesn't render (the outline badge's icons). Each rule there says why it can't be StyleX.
- **Longhands only.** StyleX resolves a shorthand against its longhands by property priority, not by order, so mixing them across styles that merge silently changes the winner. No multi-value shorthands either.
- **Structure from JS before structural selectors.** When a parent can know a child's position or state without it leaking, pass it as a prop or `data-*`, not `:first-child`/`:nth-child`. Group joins stay CSS: context passes through portals, so every popup opened from a group would join too.
- **Nothing pinned covers content that scrolls under it.** A sticky cover and the content under it are anti-aliased apart where they're clipped, so at a fractional scroll offset the content shows through its edge. Pinned parts sit beside the scroller instead: Code Block's line numbers and diff marks are absolutely placed against the content outside its `pre`, so they neither scroll nor clip. A mask that must spare them goes on that ancestor (`scrollFade.xEndAround`, on the scroller's named timeline).
- **Shared interaction states.** Every highlight is the same pair: the hover value behind `media.hover`, and the same value ungated on `:active` (its specificity beats the media block's `default`), so touch gets a press highlight and never a sticky hover. StyleX can't import a helper into `stylex.create`, so the pair is a convention, written out per style.
- **Portals carry the theme.** The theme is a class on `<html>`, so a portaled popup inherits it. The one subtree theme, the color-roles demo panel, holds no popups. If a theme is ever set on a subtree, every portaled part must re-apply it, or its popups render in the page's theme.
- **Themes are tokens, never branches.** If themes are ever generated (a user's accent or contrast), they set the same `defineVars` tokens; components still read only tokens.

## Tokens

Components hold no design values. Every size, weight, color, layer, distance, blur, opacity, duration and curve comes from `packages/ui/src/lib/constella/tokens.stylex.ts`; a value a component needs that no token covers becomes a token first. Only structural values stay inline: `0`, `1`, `100%`, flex and position keywords, and `calc()` over tokens.

Fixed tokens are constants, so JS reads the same values the styles do: a Web Animations call takes `durations` and `easings`, an icon takes `sizes` and `strokes`, a popup takes `offsets`. Themeable tokens (`radii` but `full`, `sizes.control*`, `space` from `xs`) are `var()` references to variables `base.css` defaults, so JS never reads them.

Layout lengths are rem, so they grow with the reader's browser font size along with the type scale: `space`, `sizes` and `strokes.track` multiply a local `spaceUnit` (`0.25rem`, Tailwind's `--spacing`), and the theme's `--radius`, control heights and spacing are written in rem. Lines, shadows, blurs, motion distances and `offsets` stay px. [space.md](design/space.md#units) has the reasons for each group. Base UI takes its offsets in px, so a distance that has to follow rem is a CSS `translate` (a submenu's alignment), not a prop.

## Theme

Switched by a `.dark` class on `<html>`: Radix's dark scales are scoped to that class, and it's what shadcn and next-themes already set, so a consumer's existing toggle works. The site follows the system until the visitor picks one.

Components never branch on the theme. Every color is a token valued by a Radix step, so the `.dark` class flips it. Not `light-dark()`: Lightning CSS lowers it to fallbacks that ignore the class, and the color comes out invalid.

Two files hold the system's values. `tokens.stylex.ts` is the system: roles as tokens, durations, easings, layers; a consumer doesn't touch it. `theme.stylex.ts` is theirs: one `defineVars` of what a theme sets, under literal `--` names (StyleX keeps a key that starts with `--`) so `base.css` can read them: the `--neutral-*` and `--accent-*` scales, each step pointing at a [Radix Colors](https://www.radix-ui.com/colors) scale by name, the roles valued by those steps (`--border`, `--fill`), the accent's roles, `--radius`, control heights, spacing and the two fonts, `--font-sans` and `--font-mono`, named but not shipped. `base.css` sets `--font-sans` on the page; `reset.css` makes controls inherit it and sets `code`, `kbd`, `samp` and `pre` in `--font-mono`, as Tailwind's preflight does; Kbd and a chart value name the other. Our neutral scale isn't named `--gray-*` because a variable can't default to itself. Roles that differ between light and dark (muted text, raised surfaces) stay in `base.css`, since `defineVars` can't condition on the `.dark` class; Radix's own dark files switch on it, so a theme needs no dark values. Corners derive from one `--radius` there too, so they stay concentric at any value. Control heights and spacing come in presets, not a multiplier, so heights stay even; the builder writes each preset's px as rem at a 16px root. Themes are named after stars and set colors only (grays and a default accent); radius and sizing are picked on top. Polaris is the `theme.stylex.ts` Constella installs. A consumer edits the file, or replaces it with the site's builder output; runtime-switchable themes are `stylex.createTheme(theme, …)` on `<html>`. No package and no generator: accents are Radix's named scales, hand-tuned in both appearances, and `@radix-ui/colors` already comes with `base`.

## Lint

`@constella/lint` turns the rules here and in `DESIGN.md` that drift into errors, so a person or an agent building on the system hears about it at once. It follows `@shadcn/lint`: one file per rule in `src/rules`, `plugin.ts` maps them, no preset; the consumer lists the rules.

| Rule | Catches |
| --- | --- |
| `constella/box-edge` | `borderSubtle` on a whole-box border color (`borderBlockColor`, `borderInlineColor`) |
| `constella/no-focus-style` | Any `outline*` in a component's styles |
| `constella/no-raw-colors` | A Radix step or hex in styles, not a `colors` token |
| `constella/no-shorthand` | A four-side shorthand (`margin`, `padding`, `inset`, `border`, `borderRadius`, `borderWidth/Color/Style`) in styles; it loses to any longhand merged in through `sx` |
| `constella/no-shorthand-mix` | A two-side shorthand (`marginBlock`, `borderInlineColor`) in a file that also sets one of its longhands; StyleX lets the longhand win whatever the order |
| `constella/sx-last` | `sx` passed to `stylex.props` or in an `sx` array anywhere but last |
| `constella/type-scale` | A raw font size, or a plain `fontSizes` step outside `typeStyles`; raw steps are for a size that changes by condition, paired with the same `lineHeights` |

A rule earns its place when a correction comes up twice. Add one there before writing the same note again.

## Gotchas

- **Equal-specificity StyleX conditions emit in StyleX's own order.** Exclude one with `:not()` and check the built CSS.
- **Key order never makes a StyleX condition win; specificity does.** An override (like `:is([data-instant] *)`) loses to a more specific condition on the same property, so pair it with each one (``[`${iconOnly}${fromKeyboard}`]``) and check every state it covers.
- **Lightning CSS lowers `:dir(rtl)` to a `:lang()` list.** Write `:is([dir='rtl'], [dir='rtl'] *)` instead.
- **Base UI places thumbs and popups by its own direction, not `dir`.** An RTL app also wraps it in Base UI's `DirectionProvider`; a physical `translateX` in our styles flips under the `dir` selector.
- **Base UI Root `children` can be a render function.** Wrap providers outside Root, not around its children.
- **Chat demos stream through `@shadcn/helpers/tanstack-ai`, a site-only dependency.** Its peer range is `@tanstack/ai` 0.40, but it runs on the 0.65 that `@tanstack/ai-react` needs (checked 2026-10-10). Keep `@tanstack/ai` at `@tanstack/ai-client`'s version so only one copy installs.
