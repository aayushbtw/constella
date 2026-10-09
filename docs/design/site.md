# Docs site

## Layout

Only the navigation a reader needs, added as it's needed: a header (name, theme toggle), a sidebar grouped by section (Getting started, Components), and an "On this page" outline of the h2s and h3s that marks the section being read. The sidebar appears once it fits beside the content, the outline once both fit; below that the page is one column. Header, sidebar and outline stay put; only the content scrolls. Content starts right under the header, so a linked section lands at its edge with nothing showing above it. Sidebar and outline sit at the window's edges with the content centered between them, so nothing is squeezed together. Sidebar rows sit `space.xxxs` apart, so a hovered row's fill never merges into the active one.

## Type

Text is Inter; code is JetBrains Mono with ligatures off, so `</` and `...` read as the characters typed. Line numbers stay pinned while long lines scroll.

## Demo stage

The stage color, a step below the page in both themes, so the preview sits in a well instead of washing into the page and controls lift off it: `gray-2` in light, `#050505` in dark (Radix has nothing below `gray-1`).

## Home page

The tagline set large with Docs, GitHub and X links under it, then labeled sections: a muted label in a sidebar-width column, its content beside it (stacked below `media.sidebar`). No prose beyond the tagline.

The one motion exception, seen rarely and there to sell: on the first document load the logo spins in and the page staggers in inside that spin, landing as it settles. It never replays on client navigation.
