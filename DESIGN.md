# Design

## Stack

- **Base UI underneath.** Behavior, focus and accessibility come from the primitive. A component adds styling and composition, never its own version of what Base UI already handles.
- **StyleX only.** Most shadcn registries ship Tailwind, so another one adds nothing.
- **Motion is StyleX and CSS.** No animation library: transitions, keyframes and Base UI's data attributes (`data-starting-style`, `data-ending-style`) cover it, and consumers install nothing extra.

## Registry

Source imports use `@/` because the shadcn CLI only rewrites `@/lib/*` and `@/components/ui/*` to the consumer's aliases. Components live in `src/components/ui` and tokens in `src/lib`, so the site and the registry share one copy.

`registryDependencies` reference this registry by URL. A bare name like `tokens` means shadcn's official registry.

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
- **Variants are style keys.** `variant` and `size` index a `satisfies Record<Variant, StyleXStyles>` map. No cva, no class strings.
- **State comes from Base UI's data attributes** (`[data-open]`, `[data-disabled]`, `[data-starting-style]`), never mirrored into React state.

## Docs pages

Pages are Markdown in `content/components`, parsed once at build time by tomekit, so a page ships no Markdown parser. Live previews are site-only components registered in `src/components/demos` and placed with `<!-- ::demo name="…" -->`; they never go in the registry.

Each component page is the same short sections, in order: preview, installation, usage, composition tree, examples (one idea each), API (only what's added on top of Base UI; link to Base UI for the rest).

## Tokens

Components hold no design values. Every size, weight, color, layer, distance, blur, opacity, duration and curve comes from `src/lib/tokens.stylex.ts`; a value a component needs that no token covers becomes a token first. Only structural values stay inline: `0`, `1`, `100%`, flex and position keywords, and `calc()` over tokens.

Tokens are constants, so JS reads the same values the styles do: a Web Animations call takes `durations` and `easings`, an icon takes `sizes` and `strokes`.

## Personality

Quiet, crisp, and finished. Near-monochrome, so the craft shows in the details: a press that gives, a hover that answers, a popover that settles. Most go unnoticed one at a time. Together they are the point.

## Color

Tokens are named by role (`textMuted`, `fillSubtle`), never by hue, and valued by Radix gray step. A component asks for what it means, so a palette change is one file.

The accent is near-black (near-white in dark), not a hue, so color stays out of the way and type, spacing and motion carry the design.

Hue is reserved for status: `danger` (red), `success` (green), `warning` (amber), `info` (blue). The accent is gray, so none of them collides with it. Each has the base for icons and short labels, `FillSubtle` and `Fill` as tints that mirror the neutral fills, and `Edge`. Status color marks the small thing that carries the meaning and never body text: step 11 clears text contrast on `FillSubtle` but drops just under on `Fill`, so copy inside an alert stays neutral. And never alone: the icon's shape or the text says it too.

Status is never a saturated solid. A destructive action is red text on a red tint: a full red fill shouts in a quiet interface, and white on it can't reach text contrast in both themes anyway.

## Theme

Light and dark, switched by a `.dark` class on `<html>`: Radix's dark scales are scoped to that class, and it's what shadcn and next-themes already set, so a consumer's existing toggle works. The site follows the system until the visitor picks one.

Components never branch on the theme. Every color is a token valued by a Radix step, so the `.dark` class flips it. Not `light-dark()`: Lightning CSS lowers it to fallbacks that ignore the class, and the color comes out invalid.

## Surfaces

Edges are box-shadows, never `border`: borders render unevenly across pixel densities, a shadow stays crisp and takes no layout. Every edge comes from `shadows`. An edge that needs a hover color composes `colors.edgeStrong` into an inset shadow in place.

## Focus

One keyboard-only ring, set once in the reset. A strong gray, offset so it never fights a hover fill. Components don't style focus themselves.

## Motion

### Should it animate

Ask how often it's seen. Something used dozens of times a day gets little or no motion. Keyboard-initiated actions never animate.

### Easing

| Token       | For                                                          |
| ----------- | ------------------------------------------------------------ |
| `out`       | Entrances and presses: moves at once, so it feels responsive |
| `inOut`     | Things traveling across the screen: leave and arrive gently  |
| `overshoot` | Small elements that should feel alive                        |
| `ease`      | Color and hover changes (the CSS keyword, no token)          |
| `crossfade` | One state replacing another in place: icons, text            |
| `layout`    | A surface changing size: leaves at once, settles gently      |

Never `ease-in`: it delays the moment the eye is watching.

### Duration

| Token       | For                                     |
| ----------- | --------------------------------------- |
| `hover`     | Color changes on hover                  |
| `press`     | Scale on `:active`                      |
| `popover`   | Small surfaces that open from a trigger |
| `move`      | Indicators and thumbs that travel       |
| `crossfade` | Cross-fades between states              |
| `layout`    | A surface growing or shrinking to fit   |
| `spin`      | One turn of a spinner                   |

Interface motion stays under 300ms. A spinner is the exception: unhurried, so waiting reads as working, not urgent.

Restraint is the default. A component used every day gets one motion that explains a change, not several that decorate it: no bounce, no blur-ins, no timers drawing on screen.

### Crossfades

When one state replaces another in place, both stay on screen and cross-fade, so there's never an empty frame. An icon arrives from `motion.crossfadeScale` and `motion.crossfadeBlur`, on transitions so a quick change back reverses. Text can't stay mounted (it's the same node), so the old copy is kept as a layer that fades out under the new one, both blurred by `motion.crossfadeTextBlur` so they read as one changing.

### Layout animation

When content changes, the layout takes its new size at once and only the surface and content travel from the old size, with transforms and clipping, on `layout`. Anything measuring the layout (Base UI does, for stacks) then always reads the truth; animating `height` itself feeds the animation back into the measurement.

### Press and hover

Pressables scale down on `:active`, from `presses`: `icon` for icon buttons, `link` for buttons, `row` for full-width rows. The smaller the target, the bigger the give.

A pressable that also changes color on hover transitions both, each on its own clock: color on `ease` + `hover`, transform on `out` + `press`. Hover styles sit behind `media.hover` so touch doesn't stick.

### Entrances

Never from `scale(0)` or full transparency in place. Start close to the final state (a few px of translate, a slight scale) with opacity, so the element arrives rather than appears. Popovers scale from their trigger via Base UI's `--transform-origin`.

### Reduced motion

Fewer and gentler, not none. Under `media.reducedMotion`, entrances keep their fade and drop the movement, and things that travel land instantly. Press feedback and reveals that don't move stay. There is no global kill, so every animation that moves something says what it does under `media.reducedMotion`.
