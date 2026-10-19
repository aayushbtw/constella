# Docs site

## Layout

Only the navigation a reader needs, added as it's needed: a header, a sidebar grouped by section (Getting started, Components, AI, TanStack; Blocks has its own), and an "On this page" outline of the h2s and h3s that marks the section being read. The sidebar appears once it fits beside the content, the outline once both fit; below that the page is one column. Header, sidebar and outline stay put; only the content scrolls. The sidebar scrolls on its own, with no scrollbar and fading edges; a wheel at its end doesn't scroll the page. Content starts 32px below the 64px header (`layout.pageTop`), and a linked section lands at that same line. Sidebar and outline sit at the window's edges with the content centered between them, so nothing is squeezed together. Sidebar rows sit `space.xxxs` apart, so a hovered row's fill never merges into the active one. The header holds the logo and a semibold `sm` "Constella" wordmark as one home link, so the name reads as the product; that the library is in beta is said once, at the top of Installation. Then come Docs, Components and Blocks as `sm` ghost button links, and at the end search, then the theme toggle. Search is a secondary button reading "Search documentation..." with a ⌘K `Kbd` (`layout.search` wide), an icon button below the sidebar's breakpoint. It opens a Command Dialog listing every sidebar group, so a page is two keys away. ⌘K or Ctrl+K toggles it, and `/` opens it outside a field; both open and close it with no motion, as keyboard actions do. The current section reads `textPrimary`, the rest `textSecondary`. A nested guide (a framework's installation) keeps its parent's sidebar row active. Under each page's description sit Copy as Markdown (a labelled Copy Button) and View as Markdown, `sm` ghost buttons in `textSecondary`, `space.xxs` apart. Copying swaps only the icon, so nothing shifts. Below the sidebar's breakpoint, header, home and docs fill the window (no narrow cap), and the header's links and the sidebar move into a menu button beside the theme toggle. The menu covers the page under a bar matching the header, so its close sits where the button was. Its rows are `heading4` in `textMuted` (semimedium, `space.sm` apart), `textPrimary` on hover and for the group or page being read. A group opens in place with a back arrow, sliding as the Sidebar's section change does. Installation opens on a grid of outline Item links, one per framework, 2 columns from `sm` and 1 below. Each logo is masked to `textPrimary` so it reads in both themes.

## Type

Text is Inter; code is Geist Mono with ligatures off, so `</` and `...` read as the characters typed. Line numbers stay pinned while long lines scroll.

## Demo stage

The stage is the page's own `background`, so a demo looks as it will in an app; the frame's inset edge holds it.

| Part | Rule |
| --- | --- |
| Frame | `radii.md`, inset edge, `space.xxs` padding |
| Stage | `radii.sm`, its own inset edge, so a demo without controls reads as a double border |
| Controls | Knobs and demo-only actions (replay, "Think again") go in the stage's `controls`, never beside the component. With controls, the stage drops its edge, so the frame is the one outer border. The panel sits at the stage's foot with a `raised` fill, its own edge, `radii.sm` concentric with the frame, and `space.md` padding |
| Context | A component shown inside another (a model picker in a composer) gets that host as a wireframe: a dashed `border` outline at the host's size and corner, Skeleton's `fill` for its text and controls, no real text. Only the subject is live |

## Home page

The tagline set large, one `textSecondary` line under it saying what Constella is, then Get started, GitHub and X links, then a bento of live components, then the index of every component. No other prose.

| Part | Rule |
| --- | --- |
| Bento | 3 columns from `media.sidebar`, 2 from `md`, 1 below; rows 232px from `md`. Tiles are 1×1, 1×2 (`tall`) or 2×2 (`large`), counted so every row fills at 3 and 2 columns |
| Tile | `stage` surface, inset edge, `space.md` padding, the component's name top-left in muted `sm` linking to its page. Corner `radii.xl` + `space.xs`, concentric with the chat's composer, which bleeds to the tile's edge |
| Tile content | Built for the tile from real components, never a docs demo with its stage; content fills the tile, and nothing is faked |
| Index | A muted label in a sidebar-width column, the names beside it in 4/3/2 columns (stacked below `media.sidebar`) |

The one motion exception, seen rarely and there to sell: on the first document load the logo spins in and the page staggers in inside that spin, landing as it settles. Each tile's surface rises, and its content comes into focus inside it 80ms later (`crossfadeBlur` to sharp). It never replays on client navigation.
