---
title: Side Panel
description: A panel floating beside the page for details, a form or anything else, full height.
---

<!-- ::demo name="side-panel" -->

```tsx
<div {...stylex.props(styles.row)}>
  <Page onSelect={setSelected} />
  <SidePanel
    onOpenChange={(open) => !open && setSelected(null)}
    open={selected !== null}
  >
    <SidePanelSlot>
      <SidePanelContent>
        <SidePanelHeader>
          <SidePanelTitle>Signed in</SidePanelTitle>
        </SidePanelHeader>
        <SidePanelBody>…</SidePanelBody>
        <SidePanelFooter>…</SidePanelFooter>
      </SidePanelContent>
    </SidePanelSlot>
  </SidePanel>
</div>
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

The panel floats beside the page, lifted off it as the composer is: inset from the content and the window's edges, rounded, on the `raised` fill, its edge a ring in its `shadows.panel` shadow.

Put a `SidePanelSlot` after the whole page, header included, in a flex row, with `SidePanelContent` inside it. The slot is sticky below the header row and the window's height less that row, so the panel stays in view while the page scrolls the window. In a box of its own height, reset that with the slot's `sx`.

The panel opens there, in the page's flow, so the content narrows beside it instead of being covered. It's a non-modal dialog: the content stays usable, Close shuts it, and so does Escape while focus is in the panel.

The header is one row, so a `SidePanelDescription` goes first in the body. It names the panel's description for screen readers, as a dialog's does.

On a narrow window, show the same details in a [Sheet](/docs/components/sheet) instead.

## Composition

```
SidePanel
└── SidePanelSlot
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

Use `Panel` for a panel that's always on the page, such as a project's files beside its chat. It has the side panel's look without the dialog: no Close, no Escape, and the page sizes and places it. Use `SidePanel` for details that open from a row and Close shuts.

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
| `SidePanel` | UI SDK Dialog, `modal={false}` and `closeOnOutsidePress={false}`: Escape closes it only while focus is in it |
| `SidePanelContent` | UI SDK `DialogContent` with `inline`, so it renders where it sits, in the slot, not in the top layer |
| `SidePanelSlot` | Holds `SidePanelContent`; sticky below the header row, the window's height less it |
| `SidePanelHeader` | A strip `sizes.header` less the panel's inset (44px), pinned: the title, any actions, then Close |
| `SidePanelDescription` | Muted text first in the body; the panel's accessible description |
| `SidePanelBody` | Scrolls on its own |
| `SidePanelFooter` | Pinned below the body |
| `Panel` | An `aside` with the side panel's surface; size and place it with `sx` |
| `PanelHeader` | The side panel's strip: the title, then any actions |
| `PanelTitle` | The panel's heading, an `h2` |
| `PanelBody` | Scrolls on its own |

Every part takes `sx`, applied last. For the rest, see [UI SDK Dialog](https://ui-sdk.dev/docs/react/components/dialog).
