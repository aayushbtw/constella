# Design

## Personality

Quiet, crisp, and finished. Near-monochrome, so the craft shows in the details: a press that gives, a hover that answers, a popover that settles. Most go unnoticed one at a time. Together they are the point.

## Color

Tokens are named by role (`textMuted`, `fillSubtle`), never by hue, and valued by Radix gray step. A component asks for what it means, so a palette change is one file.

The accent is near-black (near-white in dark), not a hue, so color stays out of the way and type, spacing and motion carry the design.

Hue is reserved for status: `danger` (red), `success` (green), `warning` (amber), `info` (blue). The accent is gray, so none of them collides with it. Each has the base for icons and short labels, `FillSubtle` and `Fill` as tints that mirror the neutral fills, and `Edge`. Status color marks the small thing that carries the meaning and never body text: step 11 clears text contrast on `FillSubtle` but drops just under on `Fill`, so copy inside an alert stays neutral. And never alone: the icon's shape or the text says it too.

Status is never a saturated solid. A destructive action is red text on a red tint: a full red fill shouts in a quiet interface, and white on it can't reach text contrast in both themes anyway.

## Theme

Light and dark get the same care. Every color is a role token, so a component looks right in both without knowing which one it's in.

## Surfaces

Controls (buttons, inputs) have a real border and a light `shadows.control`. The edge takes space, so what the user sees is what's laid out. Every variant reserves the border, transparent when it has no edge, so a fill and an outline are the same size. A bordered control sets `background-clip: padding-box`: otherwise the fill paints under the translucent edge and muddies it, and bleeds through anti-aliased corners.

Controls have fixed heights from `sizes.control*`, so a button and an input in one row line up.

Floating surfaces (toasts, popovers) draw their edge with `shadows`. They sit above the layout, so the edge taking no space is right for them.

On the site, the demo stage is the stage color: in dark, `#050505`, a step below the page, so the preview sits in a well instead of washing into the page.

A surface set into a tinted frame draws its edge inside itself. An outer edge would stack on the frame's tint and leave a light halo around the inner surface.

Nested corners are concentric: outer radius = inner radius + the padding between them (`radii.md` 12 around `radii.sm` 8 at `space.xxs` 4). When the padding is at least the outer radius, the inner corner no longer reads against the outer one and keeps its own radius.

## Details

- **Crisp text.** Grayscale antialiasing on the root; subpixel rendering makes light text on dark look heavy on macOS.
- **Wrapping.** Headings and titles `text-wrap: balance`; body and descriptions `pretty`, so no line ends on one word.
- **Weights stop at 600.** `fontWeights.semibold` is the heaviest, for bold in prose; nothing is 700. Heavier type shouts in a quiet interface.
- **Numbers.** Anything that changes in place (counts, timers, prices, table columns) sets `font-variant-numeric: tabular-nums`, so digits don't shift as they update.
- **Optical alignment.** Align what the eye sees, not the box: an icon marked `data-icon="inline-start"` or `"inline-end"` tightens its side's padding; Button's sizes take shadcn's numbers exactly (padding, icon side, gap, icon size per size). An icon centers on the first line of text, not the block.
- **Icon stroke follows text weight.** `strokes.icon` is tuned for medium text; one icon set (Hugeicons) everywhere.
- **Hit areas.** Anything smaller than `sizes.hitArea` grows its target with an invisible `::before` to that size. Neighbouring targets never overlap.

## Docs site

Only the navigation a reader needs, added as it's needed: a header (name, theme toggle), a sidebar grouped by section (Getting started, Components), and an "On this page" outline of the h2s and h3s that marks the section being read. The sidebar appears once it fits beside the content, the outline once both fit; below that the page is one column. Header, sidebar and outline stay put; only the content scrolls. Content starts right under the header, so a linked section lands at its edge with nothing showing above it. Sidebar and outline sit at the window's edges with the content centered between them, so nothing is squeezed together. Line numbers stay pinned while long lines scroll. Sidebar rows sit `space.xxxs` apart, so a hovered row's fill never merges into the active one.

The home page is the tagline set large with Docs, GitHub and X links under it, then labeled sections: a muted label in a sidebar-width column, its content beside it (stacked below `media.sidebar`). No prose beyond the tagline.

## Focus

One keyboard-only ring, set once for everything. A strong gray, offset so it never fights a hover fill. Components don't style focus themselves.

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

Pressables scale down on `:active`, from `presses`: `icon` for icon buttons, `link` for buttons, `row` for full-width rows. The smaller the target, the bigger the give. Two exceptions: a trigger (`[aria-haspopup]`) doesn't give, since pressing it opens something rather than acting, and keeps its hover look while its popup is open (`[data-popup-open]`); a text link answers with an underline, not a press.

A pressable that also changes color on hover transitions both, each on its own clock: color on `ease` + `hover`, transform on `out` + `press`. Hover styles sit behind `media.hover` so touch doesn't stick.

### Entrances

Never from `scale(0)` or full transparency in place. Start close to the final state (a few px of translate, a slight scale) with opacity, so the element arrives rather than appears. Popovers scale from their trigger via Base UI's `--transform-origin`.

### Reduced motion

Fewer and gentler, not none. Under `media.reducedMotion`, entrances keep their fade and drop the movement, and things that travel land instantly. Press feedback and reveals that don't move stay. There is no global kill, so every animation that moves something says what it does under `media.reducedMotion`.
