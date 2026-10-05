# Design

## Stack

- **Base UI underneath.** Behavior, focus and accessibility come from the primitive. A component adds styling and composition, never its own version of what Base UI already handles.
- **StyleX only.** Most shadcn registries ship Tailwind, so another one adds nothing.
- **Motion is StyleX and CSS.** No animation library: transitions, keyframes and Base UI's data attributes (`data-starting-style`, `data-ending-style`) cover it, and consumers install nothing extra.

## Registry

Source imports use `@/` because the shadcn CLI only rewrites `@/lib/*` and `@/components/ui/*` to the consumer's aliases. Components live in `src/components/ui` and tokens in `src/lib`, so the site and the registry share one copy.

`registryDependencies` reference this registry by URL. A bare name like `tokens` means shadcn's official registry.

## Personality

Quiet, crisp, and finished. Near-monochrome, so the craft shows in the details: a press that gives, a hover that answers, a popover that settles. Most go unnoticed one at a time. Together they are the point.

## Color

Tokens are named by role (`textMuted`, `fillSubtle`), never by hue, and valued by Radix gray step. A component asks for what it means, so a palette change is one file.

The accent is near-black, not a hue, so color stays out of the way and type, spacing and motion carry the design.

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

Never `ease-in`: it delays the moment the eye is watching.

### Duration

| Token     | For                                     |
| --------- | --------------------------------------- |
| `hover`   | Color changes on hover                  |
| `press`   | Scale on `:active`                      |
| `popover` | Small surfaces that open from a trigger |
| `move`    | Indicators and thumbs that travel       |

Interface motion stays under 300ms.

### Press and hover

Pressables scale down on `:active`, from `presses`: `icon` for icon buttons, `link` for buttons, `row` for full-width rows. The smaller the target, the bigger the give.

A pressable that also changes color on hover transitions both, each on its own clock: color on `ease` + `hover`, transform on `out` + `press`. Hover styles sit behind `media.hover` so touch doesn't stick.

### Entrances

Never from `scale(0)` or full transparency in place. Start close to the final state (a few px of translate, a slight scale) with opacity, so the element arrives rather than appears. Popovers scale from their trigger via Base UI's `--transform-origin`.

### Reduced motion

Fewer and gentler, not none. Under `media.reducedMotion`, entrances keep their fade and drop the movement, and things that travel land instantly. Press feedback and reveals that don't move stay. There is no global kill, so every animation that moves something says what it does under `media.reducedMotion`.
