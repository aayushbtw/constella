# Design

## Personality

Quiet, crisp, and finished, with a pulse. Near-monochrome by default, so the craft shows in the details: a press that gives, a hover that answers, a popover that settles. Most go unnoticed one at a time. Together they are the point.

A few moments carry the character, and only these: a primary button that reads as a key, lit on top and shaded below; a switch thumb that stretches under the finger and lands with a little give; a radio dot that pops; floating surfaces that sit at a distance, with a near shadow and a far one, and a step lighter than the page in dark. A brand theme adds one hue to the accent, the focus ring, the text selection and the caret, and changes nothing else. Everything outside these stays still.

## When rules conflict

Protect them in this order:

1. Access: contrast, focus, keyboard, screen readers, reduced motion.
2. Light and dark parity.
3. One family: a control looks like its peers, by size, edge and state.
4. Restraint: the quieter option.
5. The character moments above.

## Where it lives

| File | Covers |
| --- | --- |
| [color](docs/design/color.md) | Roles, accent, status, theme switch |
| [type](docs/design/type.md) | Type roles, weights, rendering, icons |
| [space](docs/design/space.md) | Gaps, control heights, insets, corners, alignment |
| [surfaces](docs/design/surfaces.md) | Edges, shadows, layout and floating surfaces |
| [states](docs/design/states.md) | Focus, disabled, busy, hover, selected, press |
| [motion](docs/design/motion.md) | Easing, durations, entrances, crossfades, reduced motion |
| [components](docs/design/components.md) | What each component adds to the above |
| [site](docs/design/site.md) | The docs site's layout, stage and home page |

A rule that holds for several components goes in its topic file; one that holds for one component goes in components.

## Never

- A weight above 600.
- A saturated status fill behind text, or status color on body copy.
- Color as the only signal.
- A hue on the default accent, or the accent on a tooltip.
- A shadow ring as a control's edge, or `edgeSubtle` around a control.
- Focus styled by a component, or an offset ring.
- A per-control disabled look.
- `ease-in`; an entrance from `scale(0)` or full transparency; bounce on a surface.
- Motion on a keyboard action, or motion over 300ms outside a spinner, pulse or the home page.
- Animating a surface's `height` or `width` to fit its content, except a collapsible, a shared hover card and the sidebar.
- Hover without `media.hover`, so touch sticks.
- Corners that aren't concentric.
- A hardcoded value where a token exists.

## Review

Before calling a component done:

- Light and dark, at rest, hovered, pressed, focused, disabled, open.
- Keyboard only: reachable, no motion, ring visible.
- Reduced motion: says what each moving thing does.
- Touch: no sticky hover, targets at `sizes.hitArea`.
- Every size, next to a button and an input of the same size.
- Inside a button group, an input group and a dialog, if it can sit there.
- RTL.
