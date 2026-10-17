# Type

## Scale

After Interfere's: headings rank 1 (largest) to 6, text steps around `textBase`. Each step is a `fontSizes` and `lineHeights` pair of the same name, set together (`constella/type-scale` enforces it); weight is separate.

| Step | Size / line height | For |
| --- | --- | --- |
| `heading1`–`heading5` | 36/44, 28/36, 24/32, 20/28, 18/26, `letterSpacings.heading` | Page and section titles in the app; Markdown takes `heading4` |
| `heading6` | 16/24 | Small group titles, Markdown h2 |
| `textLg` | 16/24 | Long copy: an answer, a message, the composer; a dialog, card or side panel's title |
| `textBase` | 15/24 | Reading copy: the docs, an app's pages |
| `textSm` | 13/20 | Every control and the text inside components: labels, descriptions, rows, menus |
| `caption` | 12/16 | Keycaps, `xs` controls, badges, menu labels and shortcuts |

Controls are 13px, as Interfere's are, so a dense UI stays a step under the reading size. Peers share a step: two titles in one row never differ in size because one string is longer. `Text`, `Heading` and `Caption` set a step for an app.

## Weight

- **Four steps: 400, 450, 500, 600.** `semimedium` (450) sits between body and label, as Interfere's does; it needs the variable font, which the theme names.
- **Stops at 600.** `fontWeights.semibold` is the heaviest, for bold in prose; nothing is 700. Heavier type shouts in a quiet interface.
- **Medium marks what you act on or name**: control labels, titles, field labels. Body copy is regular.

## Rendering

- **Crisp text.** Grayscale antialiasing on the root; subpixel rendering makes light text on dark look heavy on macOS.
- **Wrapping.** Headings and titles `text-wrap: balance`; body and descriptions `pretty`, so no line ends on one word.
- **Numbers.** Anything that changes in place (counts, timers, prices, table columns) sets `font-variant-numeric: tabular-nums`, so digits don't shift as they update.
- **Figures to compare take `fonts.mono`** (a chart tooltip's values): Geist Mono, drawn for one width, reads crisper at 13px than proportional digits made tabular. Text stays in `fonts.sans`. Both are theme variables (`--font-sans`, `--font-mono`) naming Inter and Geist Mono, not shipped: an app that loads them gets them, otherwise the system's fonts.
- **Inputs stay 16px below 640px**, so iOS doesn't zoom on focus. Above it, they take `textSm`.

## Icons

- **Stroke follows text weight.** `strokes.icon` is tuned for medium text; one icon set (Hugeicons) everywhere.
- **Centered on the first line** of text, not the block.
