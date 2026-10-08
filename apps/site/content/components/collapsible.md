---
title: Collapsible
description: Shows and hides a section of content.
draft: true
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

## API Reference

| Part | Adds |
| --- | --- |
| `CollapsibleContent` | Grows to its height and fades in as it opens; takes `sx` |

For the rest, see [Base UI Collapsible](https://base-ui.com/react/components/collapsible).
