---
title: Side Panel
description: A panel floating beside the page for details, a form or anything else, full height.
---

<!-- ::demo name="side-panel" -->

```tsx
const slot = useRef<HTMLDivElement>(null);

<div {...stylex.props(styles.row)}>
  <Page onSelect={setSelected} />
  <SidePanelSlot ref={slot} />
  <SidePanel
    onOpenChange={(open) => !open && setSelected(null)}
    open={selected !== null}
  >
    <SidePanelContent container={slot}>
      <SidePanelHeader>
        <SidePanelTitle>Signed in</SidePanelTitle>
      </SidePanelHeader>
      <SidePanelBody>…</SidePanelBody>
      <SidePanelFooter>…</SidePanelFooter>
    </SidePanelContent>
  </SidePanel>
</div>;
```

## Installation

<!-- ::install name="side-panel" -->

## Usage

```tsx
import {
  SidePanel,
  SidePanelBody,
  SidePanelContent,
  SidePanelDescription,
  SidePanelFooter,
  SidePanelHeader,
  SidePanelSlot,
  SidePanelTitle,
} from "@/components/primitives/side-panel";
```

The panel floats beside the page: inset from the content and the window's edges, rounded, with a hairline all round and no shadow.

Put a `SidePanelSlot` after the whole page, header included, in a flex row, so the panel runs the full height of it. Pass its ref to `SidePanelContent` as `container`.

The panel opens there, so the content narrows beside it instead of being covered. It's a non-modal dialog: the content stays usable, and Escape or Close shuts it.

The header is one row, so a `SidePanelDescription` goes first in the body. It names the panel's description for screen readers, as a dialog's does.

On a narrow window, show the same details in a [Sheet](/docs/components/sheet) instead.

## Composition

```
SidePanelSlot
SidePanel
└── SidePanelContent
    ├── SidePanelHeader
    │   └── SidePanelTitle
    ├── SidePanelBody
    │   └── SidePanelDescription
    └── SidePanelFooter

Panel
├── PanelHeader
│   └── PanelTitle
└── PanelBody
```

## Panel

Use `Panel` for a panel that's always on the page, such as a project's files beside its chat. It has the side panel's look without the dialog: no Close, no Escape, and the page sizes and places it. Use `SidePanel` for details that open from a row and Escape or Close shuts.

<!-- ::demo name="side-panel-panel" -->

```tsx
<div {...stylex.props(styles.row)}>
  <Page />
  <Panel sx={styles.panel}>
    <PanelHeader>
      <PanelTitle>Files</PanelTitle>
    </PanelHeader>
    <PanelBody>…</PanelBody>
  </Panel>
</div>
```

## API Reference

| Part | Adds |
| --- | --- |
| `SidePanel` | Base UI Dialog, non-modal, not closed by an outside click |
| `SidePanelContent` | `container`: the slot's ref; renders the portal and popup |
| `SidePanelHeader` | A row `sizes.header` tall, pinned: the title, any actions, then Close |
| `SidePanelDescription` | Muted text first in the body; the panel's accessible description |
| `SidePanelBody` | Scrolls on its own |
| `SidePanelFooter` | Pinned below the body |
| `Panel` | An `aside` with the side panel's surface; size and place it with `sx` |
| `PanelHeader` | A row `sizes.header` tall: the title, then any actions |
| `PanelTitle` | The panel's heading, an `h2` |
| `PanelBody` | Scrolls on its own |

Every part takes `sx`, applied last. For the rest, see [Base UI Dialog](https://base-ui.com/react/components/dialog).
