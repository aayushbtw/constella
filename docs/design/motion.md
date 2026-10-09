# Motion

## Should it animate

Ask how often it's seen. Something used dozens of times a day gets little or no motion. Keyboard-initiated actions never animate.

Restraint is the default. A component used every day gets one motion that explains a change, not several that decorate it: no blur-ins, no timers drawing on screen, and no bounce on a surface or anything that travels far. `overshoot` is only for a small mark landing where it already almost is.

## Easing

| Token | For |
| --- | --- |
| `out` | Entrances and presses: moves at once, so it feels responsive |
| `inOut` | Things traveling across the screen, and the sidebar morphing in place: leave and arrive gently |
| `overshoot` | A small mark landing in place: a switch thumb, a radio dot |
| `ease` | Color and hover changes (the CSS keyword, no token) |
| `crossfade` | One state replacing another in place: icons, text |
| `layout` | A surface changing size: leaves at once, settles gently |

Never `ease-in`: it delays the moment the eye is watching.

## Duration

| Token            | For                                               |
| ---------------- | ------------------------------------------------- |
| `hover`          | Color changes on hover                            |
| `press`          | Scale on `:active`                                |
| `popover`        | Small surfaces that open from a trigger           |
| `popoverExit`    | The same surfaces leaving, and submenus           |
| `dialog`         | A dialog and its backdrop                         |
| `sidebar`        | The sidebar opening to its full width             |
| `sidebarExit`    | The sidebar narrowing to its rail or out of view  |
| `move`           | Indicators and thumbs that travel                 |
| `crossfade`      | Cross-fades between states                        |
| `layout`         | A surface growing or shrinking to fit             |
| `spin`           | One turn of a spinner                             |
| `pulse`          | One breath of a skeleton or indeterminate bar     |
| `confirm`        | How long a confirmation (copied, saved) holds     |
| `tooltipDelay`   | Rest before a tooltip opens                       |
| `hoverCardDelay` | Rest before a hover card opens, twice a tooltip's |

Interface motion stays at or under 300ms. A spinner and a pulse are the exceptions: unhurried, so waiting reads as working, not urgent.

## Entrances

Never from `scale(0)` or full transparency in place. Start close to the final state (a few px of translate, a slight scale) with opacity, so the element arrives rather than appears. Popovers scale from their trigger via Base UI's `--transform-origin`. A dialog belongs to no trigger, so it scales from its own center (`motion.dialogScale`).

## Crossfades

When one state replaces another in place, both stay on screen and cross-fade, so there's never an empty frame. An icon arrives from `motion.crossfadeScale` and `motion.crossfadeBlur`, on transitions so a quick change back reverses. Text can't stay mounted (it's the same node), so the old copy is kept as a layer that fades out under the new one, both blurred by `motion.crossfadeTextBlur` so they read as one changing. A status change only fades color, on `ease` + `hover`.

`SwapIcon` and `SwapText` are these two crossfades as parts. The sidebar trigger's mark is the one crossfade that isn't a state change: it reveals the toggle while the trigger is pointed at, so it runs on CSS hover at `hover` speed, scaling from `motion.popoverScale` under `motion.crossfadeTextBlur`, rather than through `SwapIcon`.

## Layout animation

When content changes, the layout takes its new size at once and only the surface and content travel from the old size, with transforms and clipping, on `layout`. Anything measuring the layout (Base UI does, for stacks) then always reads the truth; animating `height` itself feeds the animation back into the measurement. The exceptions, a collapsible's height, a shared hover card's height and the sidebar's width, are in [components](components.md). Indicators (a progress fill, a tab's line) animate their width freely: nothing measures them.

## Reduced motion

Fewer and gentler, not none. Under `media.reducedMotion`, entrances keep their fade and drop the movement, and things that travel land instantly. Press feedback and reveals that don't move (a skeleton's breath) stay. There is no global kill, so every animation that moves something says what it does under `media.reducedMotion`.
