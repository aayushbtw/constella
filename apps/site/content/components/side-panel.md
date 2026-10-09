---
title: Side Panel
description: A panel beside the page for details, a form or anything else, full height.
draft: true
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
  SidePanelFooter,
  SidePanelHeader,
  SidePanelSlot,
  SidePanelTitle,
} from "@/components/ui/side-panel";
```

Put a `SidePanelSlot` after the whole page, header included, in a flex row, so the panel runs the full height of it. Pass its ref to `SidePanelContent` as `container`.

The panel opens there, so the content narrows beside it instead of being covered. It's a non-modal dialog: the content stays usable, and Escape or Close shuts it.

On a narrow window, show the same details in a [Sheet](/docs/components/sheet) instead.

## Composition

```
SidePanelSlot
SidePanel
└── SidePanelContent
    ├── SidePanelHeader
    │   └── SidePanelTitle
    ├── SidePanelBody
    └── SidePanelFooter
```

## API Reference

| Part | Adds |
| --- | --- |
| `SidePanel` | Base UI Dialog, non-modal, not closed by an outside click |
| `SidePanelContent` | `container`: the slot's ref; renders the portal and popup |
| `SidePanelHeader` | A row `sizes.header` tall, pinned: the title, any actions, then Close |
| `SidePanelBody` | Scrolls on its own |
| `SidePanelFooter` | Pinned below the body |

Every part takes `sx`, applied last. For the rest, see [Base UI Dialog](https://base-ui.com/react/components/dialog).
