# Architecture

## Stack

- **Base UI underneath.** Behavior, focus and accessibility come from the primitive. A component adds styling and composition, never its own version of what Base UI already handles.
- **StyleX only.** Most shadcn registries ship Tailwind, so another one adds nothing.
- **Motion is StyleX and CSS.** No animation library: transitions, keyframes and Base UI's data attributes (`data-starting-style`, `data-ending-style`) cover it, and consumers install nothing extra.

## Workspace

`packages/ui` is the registry and holds only what ships; `apps/site` is the docs site and never ships. The library imports with `@/` because the shadcn CLI only rewrites `@/lib/*` and `@/components/ui/*` to the consumer's aliases. The site maps `@/` to the library, as a consumer would, and uses `~/` for its own code. `shadcn build` writes the registry into the site's `public/r`. `packages/lint` is `@constella/lint`, an oxlint plugin for the rules below that a type check can't catch; the root config loads it like a consumer would.

## Registry

`base` is the floor every component depends on: the tokens, plus `base.css` with the Radix scales, theme and focus ring, imported by `tokens.stylex.ts` so it arrives with the first token, `motion.ts` for behavior two popups share, and `join.ts` with `joinStyles`, the ButtonGroup corners and edges every joinable part applies after its own styles. StyleX can't evaluate an imported helper inside `stylex.create`, but a created style passes across files like any value. Shared foundations stay in `base` even if a component skips some of them; colors are small. A component gets its own item only for something specific to it and heavy.

`registryDependencies` reference this registry by URL. A bare name like `base` means shadcn's official registry.

## Composition

Components compose like shadcn: one file per component, made of small parts the consumer assembles.

```
Alert
├── Icon
├── AlertTitle
├── AlertDescription
└── AlertAction
```

- **One part, one element.** Each part wraps a single element or Base UI part and is a named export (`Alert`, `AlertTitle`). No config-object props that hide structure; if it renders, it's a part.
- **Every part has a `data-slot`.** Even unstyled Base UI wrappers, so a parent can style around a child (`:has(> [data-slot="alert-action"])`) without a prop. Variants and sizes are mirrored as `data-variant`, `data-size`.
- **Convenience parts bundle the boilerplate.** `DialogContent` renders Portal, Backdrop and Popup, as in shadcn. The underlying parts stay exported for when it doesn't fit.
- **`sx` overrides, not `className`.** Parts omit `className` and `style` and take `sx?: StyleXStyles`, applied last in `stylex.props(...)` so the caller wins. The type is declared in each file, so every component installs alone.
- **Variants are style keys.** `variant` and `size` index a `satisfies Record<Variant, StyleXStyles>` map, and the allowed values are one exported `as const` list (`buttonVariants`) the type derives from. No cva, no class strings.
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
- **Shared interaction states.** Hover and press come from one shared definition: hover only on pointer devices, press for touch, so every control answers the same way.
- **Portals carry the theme.** The theme is a class on `<html>` today, so a portaled popup inherits it. If a theme is ever set on a subtree, every portaled part must re-apply it, or its popups render in the page's theme.
- **Themes are tokens, never branches.** If themes are ever generated (a user's accent or contrast), they set the same `defineVars` tokens; components still read only tokens.

## Tokens

Components hold no design values. Every size, weight, color, layer, distance, blur, opacity, duration and curve comes from `packages/ui/src/lib/tokens.stylex.ts`; a value a component needs that no token covers becomes a token first. Only structural values stay inline: `0`, `1`, `100%`, flex and position keywords, and `calc()` over tokens.

Tokens are constants, so JS reads the same values the styles do: a Web Animations call takes `durations` and `easings`, an icon takes `sizes` and `strokes`.

## Theme

Switched by a `.dark` class on `<html>`: Radix's dark scales are scoped to that class, and it's what shadcn and next-themes already set, so a consumer's existing toggle works. The site follows the system until the visitor picks one.

Components never branch on the theme. Every color is a token valued by a Radix step, so the `.dark` class flips it. Not `light-dark()`: Lightning CSS lowers it to fallbacks that ignore the class, and the color comes out invalid.

## Lint

`@constella/lint` turns the rules here and in `DESIGN.md` that drift into errors, so a person or an agent building on the system hears about it at once. It follows `@shadcn/lint`: one file per rule in `src/rules`, `plugin.ts` maps them, no preset; the consumer lists the rules.

| Rule | Catches |
| --- | --- |
| `constella/box-edge` | `edgeSubtle` on a `borderColor` |
| `constella/no-focus-style` | Any `outline*` in a component's styles |
| `constella/no-raw-colors` | A Radix step or hex in styles, not a `colors` token |
| `constella/no-shorthand` | A four-side shorthand (`margin`, `padding`, `inset`, `border`, `borderRadius`, `borderWidth/Color/Style`) in styles; it loses to any longhand merged in through `sx` |
| `constella/no-shorthand-mix` | A two-side shorthand (`marginBlock`, `borderInlineColor`) in a file that also sets one of its longhands; StyleX lets the longhand win whatever the order |

A rule earns its place when a correction comes up twice. Add one there before writing the same note again.
