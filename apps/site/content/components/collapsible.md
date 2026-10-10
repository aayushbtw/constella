---
title: Collapsible
description: Shows and hides a section of content.
---

<!-- ::demo name="collapsible" -->

```tsx
<Collapsible>
  <div>
    @peduarte starred 3 repositories
    <CollapsibleTrigger
      render={<Button aria-label="Toggle" size="icon-sm" variant="ghost" />}
    >
      <HugeiconsIcon icon={UnfoldMoreIcon} />
    </CollapsibleTrigger>
  </div>
  <Item size="sm" variant="outline">
    …
  </Item>
  <CollapsibleContent>
    <Item size="sm" variant="outline">
      …
    </Item>
  </CollapsibleContent>
</Collapsible>
```

## Installation

<!-- ::install name="collapsible" -->

## Usage

```tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
```

```tsx
<Collapsible>
  <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
  <CollapsibleContent>
    Yes. Free to use for personal and commercial projects.
  </CollapsibleContent>
</Collapsible>
```

## Composition

```
Collapsible
├── CollapsibleTrigger
└── CollapsibleContent
```

## Nested

Collapsibles nest, for a tree. Each folder's `CollapsibleTrigger` carries `data-panel-open` while it's open, so its chevron can turn.

<!-- ::demo name="collapsible-tree" -->

```tsx
<Collapsible defaultOpen>
  <CollapsibleTrigger>components</CollapsibleTrigger>
  <CollapsibleContent>
    <Collapsible>
      <CollapsibleTrigger>ui</CollapsibleTrigger>
      <CollapsibleContent>…</CollapsibleContent>
    </Collapsible>
  </CollapsibleContent>
</Collapsible>
```

## Controlled

Use `open` and `onOpenChange` to hold the state yourself, here to swap the trigger's label.

<!-- ::demo name="collapsible-controlled" -->

```tsx
const [open, setOpen] = useState(false);

<Collapsible onOpenChange={setOpen} open={open}>
  <CollapsibleTrigger>
    <SwapText>{open ? "Hide details" : "Show details"}</SwapText>
  </CollapsibleTrigger>
  <CollapsibleContent>…</CollapsibleContent>
</Collapsible>;
```

## Disabled

Add `disabled` to `Collapsible` so its trigger does nothing.

<!-- ::demo name="collapsible-disabled" -->

```tsx
<Collapsible disabled>…</Collapsible>
```

## API Reference

| Part | Adds |
| --- | --- |
| `CollapsibleContent` | Grows to its height and fades in as it opens; takes `sx` |

For the rest, see [Base UI Collapsible](https://base-ui.com/react/components/collapsible).
