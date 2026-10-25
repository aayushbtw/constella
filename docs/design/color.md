# Color and theme

## Roles

Tokens are named by role (`textMuted`, `fillSubtle`), never by hue, and valued by Radix gray step. A name is a family (`text`, `border`, `fill`, `accent`, `inverted`, each status) and a slot (`Solid`, `Subtle`, `Text`, `Border`, `On<Slot>` for what sits on it); a slot exists only where a component uses it. A component asks for what it means, so a palette change is one file. A few roles differ by theme, through variables in `base.css`. `textMuted` is halfway between `gray-10` and `gray-11` in both themes, since `gray-10` is too faint for small labels (APCA Lc 32 on the dark page) and `gray-11` would merge it with `textSecondary`. The status tints are step 9 mixed at 14% (`Subtle`) and 22% (`SubtleHover`) in both themes: Radix's dark alpha steps go muddy, and the vivid step stays the same hue on any page. Status text is step 11 in dark; in light it leans 30% toward step 12, since step 11 drops under 4.5:1 on its own tint. `invertedFill`, a fill on the inverted surface (a tooltip), is white `a4` in light and black `a2` in dark, since that surface flips from near-black to near-white. `raised` is white in light and `gray-2` in dark, so a floating surface sits above the page in both. `well`, a prompt input's tray, is `gray-a2` in light and `gray-a3` in dark, since a2 doesn't part from `raised` there. `fillOnStrong`, a mark on a `fillStrong` track like a switch's off thumb, is white in light and `gray-12` in dark, so it stands off that track in both themes.

One role per meaning, not per component: the current sidebar row and a selected table row both take `fill`; a resting track, avatar or user message takes `fillOpaque`.

## Accent

The default accent is near-black (near-white in dark), not a hue, so color stays out of the way and type, spacing and motion carry the design. A theme can make it a brand hue (`--accent-solid`, step 9 of a Radix named scale); a tooltip stays on `inverted`, the gray ink, so a hint never reads as a call to action.

## Status

Hue is reserved for status: `danger` (red), `success` (green), `warning` (amber), `info` (blue). The one other use is a switch's on state, which takes `infoSolid`, so on reads at a glance. The default accent is gray, so none of them collides with it; a theme's accent should keep its distance from them. Each has `Text` for icons and short labels, `Subtle` and `SubtleHover` as tints that mirror the neutral fills, and `Solid` for a dot that carries the status alone; `danger` adds `Border` for an invalid field. Status color marks the small thing that carries the meaning and never body text, so copy inside an alert stays neutral. And never alone: the icon's shape or the text says it too, and a dot with no text beside it has an accessible name.

Status is never a saturated solid behind text. A destructive action is red text on a red tint: a full red fill shouts in a quiet interface, and white on it can't reach text contrast in both themes anyway. Only a dot and a switch's on track are solid, step 9, and amber takes step 11 in light, since step 9 is 1.5:1 on the page.

## Chart series

A chart's series take six hues of their own, step 9 of Radix indigo, teal, violet, cyan, orange and pink, in that order (`chart1` to `chart6`). None is a status hue, so a series never reads as danger or success. The order keeps each neighbor apart under red-green color blindness and for everyone else, checked in both themes; orange takes step 8 in dark, where 9 is too light for the page. Cyan and orange sit under 3:1 on the light page, so a series is always named beside its color, in a legend or the tooltip. Past six series, fold the rest into "Other" (`chartFold`), in `textMuted`, rather than reuse a hue.

## Theme

Light and dark get the same care. Every color is a role token, so a component looks right in both without knowing which one it's in.

A theme switch cross-fades the whole page as one (a view transition, on `crossfade`'s duration and curve). Transitions pause for the flip, so no control fades into the new theme on its own clock after the page.
