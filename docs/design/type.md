# Type

## Roles

| Role | Size | Line height | Weight | For |
| --- | --- | --- | --- | --- |
| Heading | `xl` 24, `lg` 20 | — | — | Page headings and figures in the app; no component uses them |
| Reading | `md` 16 | `prose` 24 | `regular` | Long copy: an answer, the composer |
| Surface title | `md` 16 | `text` 20 | `medium` | A dialog, card or side panel's title |
| UI | `sm` 14 | `text` 20 | `regular`, `medium` for labels | Labels, descriptions, rows, default controls |
| Compact | `xs` 13 | `row` 18 | `regular`, `medium` for labels | `sm` controls, field descriptions and errors, `lg` badges |
| Small | `xxs` 12 | — | `regular`, `medium` for labels | Keycaps, `xs` controls, badges, `sm` avatar initials, menu labels and shortcuts |

Peers share a role: two titles in one row never differ in size because one string is longer.

## Weight

- **Stops at 600.** `fontWeights.semibold` is the heaviest, for bold in prose; nothing is 700. Heavier type shouts in a quiet interface.
- **Medium marks what you act on or name**: control labels, titles, field labels. Body copy is regular.

## Rendering

- **Crisp text.** Grayscale antialiasing on the root; subpixel rendering makes light text on dark look heavy on macOS.
- **Wrapping.** Headings and titles `text-wrap: balance`; body and descriptions `pretty`, so no line ends on one word.
- **Numbers.** Anything that changes in place (counts, timers, prices, table columns) sets `font-variant-numeric: tabular-nums`, so digits don't shift as they update.
- **Figures to compare take `fonts.mono`** (a chart tooltip's values): Geist Mono, drawn for one width, reads crisper at 13px than proportional digits made tabular. Text stays in `fonts.sans`. Both are theme variables (`--font-sans`, `--font-mono`) naming Inter and Geist Mono, not shipped: an app that loads them gets them, otherwise the system's fonts.
- **Inputs stay 16px below 640px**, so iOS doesn't zoom on focus. Above it, control text steps down with the height (13px at `sm`, 14px from `default`).

## Icons

- **Stroke follows text weight.** `strokes.icon` is tuned for medium text; one icon set (Hugeicons) everywhere.
- **Centered on the first line** of text, not the block.
