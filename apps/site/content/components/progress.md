---
title: Progress
description: Shows how far along a task is.
draft: true
---

<!-- ::demo name="progress" -->

```tsx
<Progress aria-label="Upload" value={66} />
```

## Installation

<!-- ::install name="progress" -->

## Usage

```tsx
import { Progress } from "@/components/ui/progress";
```

```tsx
<Progress aria-label="Upload" value={33} />
```

## Composition

```
Progress
├── ProgressLabel
├── ProgressValue
└── ProgressTrack
    └── ProgressIndicator
```

## Progress Label

Put a `ProgressLabel` and `ProgressValue` in `Progress` to name it and show its value above the track.

<!-- ::demo name="progress-label" -->

```tsx
<Progress value={56}>
  <ProgressLabel>Upload progress</ProgressLabel>
  <ProgressValue />
</Progress>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Progress` | Renders `ProgressTrack` and `ProgressIndicator` after its children |

Every part takes `sx`, applied last. For the rest, see [Base UI Progress](https://base-ui.com/react/components/progress).
