# Type

## Scale

After Interfere's: headings rank 1 (largest) to 6, text steps around `textBase`, captions under `textSm`. Every step matches Interfere's, and so do titles: a dialog's is `textBase`, a drawer's `textLg`, both medium. Each step is a `fontSizes` and `lineHeights` pair of the same name, set together (`constella/type-scale` enforces it); weight is separate. Every size is a multiple of `typeUnit` and every line height of `leadingUnit`, both `0.25rem` (4px at a 16px root) in `tokens.stylex.ts`, so text follows the reader's browser font size; 15, 13 and 11 add 1px.

| Step | Size / line height (px at a 16px root) | For |
| --- | --- | --- |
| `heading1`–`heading6` | 56/56, 44/56, 36/44, 28/36, 24/32, 20/24, `letterSpacings.heading` | Page and section titles in the app; a Markdown h1 takes `heading6` |
| `textLg` | 18/24 | A side panel's title; Markdown h2–h4 and a docs page's h2, in semibold |
| `textBase` | 15/24 | Reading copy: the docs, an app's pages, a chat's answers, messages and composer; a dialog, card or field set's title, in medium; a docs page's h3, in semibold |
| `textMd` | 14/20 | A sidebar's rows: navigation read at a glance, a step over the controls around it |
| `textSm` | 13/20 | Every control and the text inside components: labels, descriptions, rows, menus |
| `captionLg` | 12/16 | Keycaps, `xs` controls, badges, menu labels and shortcuts |
| `captionBase` | 11/16 | Metadata under a title, timestamps |
| `captionSm` | 10/16 | Fine print |
| `captionXs` | 8/12 | A mark too small to read as a line, like a count on an icon |

Controls are 13px, as Interfere's are, so a dense UI stays a step under the reading size. A sidebar's rows (and sub-rows) are the exception, at `textMd`; its `sm` rows and group labels keep their size. Peers share a step: two titles in one row never differ in size because one string is longer. `Text`, `Heading` and `Caption` set a step for an app; `Caption` takes `uppercase`, which adds `letterSpacings.caps`. Inside running text, `Link` underlines in `border` and turns `textPrimary` on hover; `Code` is mono at `0.875em` on `fill`, relative so it sits a step under any text around it; it adds no block padding, so it never grows the line, and a wrapped chip keeps its corners and side padding on each line.

## Weight

- **Four steps: 400, 450, 500, 550.** `semimedium` (450) sits between body and label, as Interfere's does. 450 and 550 need the variable font, which the theme names.
- **Stops at 550.** `fontWeights.semibold` is the heaviest, for headings and bold in prose. Heavier type shouts in a quiet interface.
- **Medium marks what you act on or name**: control labels, titles, field labels. Body copy is regular.

## Agent process

What an agent did on the way to an answer (a trace, its reasoning, its steps) stays a step back from the answer, so the answer is the only `textPrimary` in a run:

| Part | Color | Weight |
| --- | --- | --- |
| A step's verb ("Read", "Searching"), a finished line ("Done thinking"), a run's title | `textSecondary` | regular |
| What it acted on ("Swedish orders") | `textMuted` | regular |
| Counts, durations (`textSecondary` in a run's trigger) | `textMuted` | regular, tabular |
| Reasoning text | `textMuted` | regular |

A source's chip keeps its own `textPrimary` name: it's a link out, not narration.

## Rendering

- **Crisp text.** Grayscale antialiasing on the root; subpixel rendering makes light text on dark look heavy on macOS.
- **Wrapping.** Headings and titles `text-wrap: balance`; body and descriptions `pretty`, so no line ends on one word. `Text` is `pretty`, which turns wrapping back on in a `nowrap` parent; pass `truncate` there.
- **Numbers.** Anything that changes in place (counts, timers, prices, table columns) sets `font-variant-numeric: tabular-nums`, so digits don't shift as they update. A Table sets it on every cell, so a column of figures lines up by default. `Text` takes `tabularNums`.
- **Figures to compare take `fonts.mono`** (a chart tooltip's values): Geist Mono, drawn for one width, reads crisper at 13px than proportional digits made tabular. Text stays in `fonts.sans`. Both are theme variables (`--font-sans`, `--font-mono`) naming Inter and Geist Mono, not shipped: an app that loads them gets them, otherwise the system's fonts.
- **Fields never make iOS zoom.** iOS zooms the page when a field under 16px takes focus. On a touch screen (`pointer: coarse`), an input renders at 16px and scales down by `inputVars.scale` to `textSm` (`captionLg` at `sm`), as Interfere's does. A textarea takes 16px there, since a growing one can't scale without its layout height staying at 16px's.

## Icons

- **Stroke follows text weight.** `strokes.icon` is tuned for medium text; one icon set (Hugeicons) everywhere.
- **Centered on the first line** of text, not the block.
