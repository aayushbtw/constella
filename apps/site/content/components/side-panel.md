---
title: Side Panel
description: Details of a row, beside the content instead of over it.
draft: true
---

<!-- ::demo name="side-panel" -->

```tsx
const slot = useRef<HTMLDivElement>(null);

<div {...stylex.props(styles.row)}>
  <List onSelect={setSelected} />
  <SidePanelSlot ref={slot} />
  <SidePanel
    onOpenChange={(open) => !open && setSelected(null)}
    open={selected !== null}
  >
    <SidePanelContent container={slot}>
      <SidePanelHeader>
        <SidePanelTitle>Signed in</SidePanelTitle>
        <SidePanelDescription>ana@acme.com</SidePanelDescription>
      </SidePanelHeader>
      <SidePanelBody>…</SidePanelBody>
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
  SidePanelHeader,
  SidePanelSlot,
  SidePanelTitle,
} from "@/components/ui/side-panel";
```

Put a `SidePanelSlot` after the content in a flex row, and pass its ref to `SidePanelContent` as `container`. The panel opens there, so the content narrows beside it instead of being covered. It's a non-modal dialog: the content stays usable, and Escape or Close shuts it.

On a narrow window, show the same details in a [Sheet](/docs/components/sheet) instead.

## Composition

```
SidePanelSlot
SidePanel
└── SidePanelContent
    ├── SidePanelHeader
    │   ├── SidePanelTitle
    │   └── SidePanelDescription
    └── SidePanelBody
```

## API Reference

| Part | Adds |
| --- | --- |
| `SidePanel` | Base UI Dialog, non-modal, not closed by an outside click |
| `SidePanelContent` | `container`: the slot's ref; renders the portal and popup |
| `SidePanelHeader` | Renders a Close button at its end |

Every part takes `sx`, applied last. For the rest, see [Base UI Dialog](https://base-ui.com/react/components/dialog).
