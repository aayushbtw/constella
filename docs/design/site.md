# Docs site

## Layout

Only the navigation a reader needs, added as it's needed: a header, a sidebar grouped by section (Getting started, Components, AI, TanStack; Blocks has its own), and an "On this page" outline of the h2s and h3s that marks the section being read. The sidebar appears once it fits beside the content, the outline once both fit; below that the page is one column. Header, sidebar and outline stay put; only the content scrolls. The sidebar scrolls on its own, with no scrollbar and fading edges; a wheel at its end doesn't scroll the page. Content starts 32px below the 64px header (`layout.pageTop`), and a linked section lands at that same line. Sidebar and outline sit at the window's edges with the content centered between them, so nothing is squeezed together. Sidebar rows sit `space.xxxs` apart, so a hovered row's fill never merges into the active one. The header holds the logo, then Docs, Components and Blocks as `sm` ghost button links, and the theme toggle at the end. The current section reads `textPrimary`, the rest `textSecondary`.

## Type

Text is Inter; code is Geist Mono with ligatures off, so `</` and `...` read as the characters typed. Line numbers stay pinned while long lines scroll.

## Demo stage

The stage is the page's own `background`, so a demo looks as it will in an app; the frame's inset edge holds it.

| Part | Rule |
| --- | --- |
| Frame | `radii.md`, inset edge, `space.xxs` padding |
| Stage | `radii.sm`, its own inset edge, so a demo without controls reads as a double border |
| Controls | Knobs and demo-only actions (replay, "Think again") go in the stage's `controls`, never beside the component. With controls, the stage drops its edge, so the frame is the one outer border. The panel sits at the stage's foot with a `raised` fill, its own edge, `radii.sm` concentric with the frame, and `space.md` padding |
| Context | A component shown inside another (a model picker in a composer) gets that host as a wireframe: a dashed `edge` outline at the host's size and corner, Skeleton's `fill` for its text and controls, no real text. Only the subject is live |

## Home page

The tagline set large with Docs, GitHub and X links under it, then a bento of live components, then the index of every component. No prose beyond the tagline.

| Part | Rule |
| --- | --- |
| Bento | 3 columns from `media.sidebar`, 2 from `md`, 1 below; rows 232px from `md`. Tiles are 1×1, 1×2 (`tall`) or 2×2 (`large`), counted so every row fills at 3 and 2 columns |
| Tile | `stage` surface, inset edge, `space.md` padding, the component's name top-left in muted `sm` linking to its page. Corner `radii.xl` + `space.xs`, concentric with the chat's composer, which bleeds to the tile's edge |
| Tile content | Built for the tile from real components, never a docs demo with its stage; content fills the tile, and nothing is faked |
| Index | A muted label in a sidebar-width column, the names beside it in 4/3/2 columns (stacked below `media.sidebar`) |

The one motion exception, seen rarely and there to sell: on the first document load the logo spins in and the page staggers in inside that spin, landing as it settles. Each tile's surface rises, and its content comes into focus inside it 80ms later (`crossfadeBlur` to sharp). It never replays on client navigation.
