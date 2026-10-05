# Architecture

## Stack

- **Base UI underneath.** Behavior, focus and accessibility come from the primitive. A component adds styling and composition, never its own version of what Base UI already handles.
- **StyleX only.** Most shadcn registries ship Tailwind, so another one adds nothing.
- **Motion is StyleX and CSS.** No animation library: transitions, keyframes and Base UI's data attributes (`data-starting-style`, `data-ending-style`) cover it, and consumers install nothing extra.

## Workspace

`packages/ui` is the registry and holds only what ships; `apps/site` is the docs site and never ships. The library imports with `@/` because the shadcn CLI only rewrites `@/lib/*` and `@/components/ui/*` to the consumer's aliases. The site maps `@/` to the library, as a consumer would, and uses `~/` for its own code. `shadcn build` writes the registry into the site's `public/r`.

## Registry

`base` is the floor every component depends on: the tokens, plus `base.css` with the Radix scales, theme and focus ring, imported by `tokens.stylex.ts` so it arrives with the first token. Shared foundations stay in `base` even if a component skips some of them; colors are small. A component gets its own item only for something specific to it and heavy.

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
- **Styles for other elements are a function.** When an element must keep its own semantics (a link styled as a button), the component exports a style getter (`buttonStyles`) instead of rendering through `render`.
- **State comes from Base UI's data attributes** (`[data-open]`, `[data-disabled]`, `[data-starting-style]`), never mirrored into React state.
- **Repeated style shapes are helpers.** StyleX evaluates arrow functions inside `stylex.create`, not function declarations, so those helpers are arrows with `func-style` disabled around them.

## Tokens

Components hold no design values. Every size, weight, color, layer, distance, blur, opacity, duration and curve comes from `packages/ui/src/lib/tokens.stylex.ts`; a value a component needs that no token covers becomes a token first. Only structural values stay inline: `0`, `1`, `100%`, flex and position keywords, and `calc()` over tokens.

Tokens are constants, so JS reads the same values the styles do: a Web Animations call takes `durations` and `easings`, an icon takes `sizes` and `strokes`.

## Theme

Switched by a `.dark` class on `<html>`: Radix's dark scales are scoped to that class, and it's what shadcn and next-themes already set, so a consumer's existing toggle works. The site follows the system until the visitor picks one.

Components never branch on the theme. Every color is a token valued by a Radix step, so the `.dark` class flips it. Not `light-dark()`: Lightning CSS lowers it to fallbacks that ignore the class, and the color comes out invalid.
