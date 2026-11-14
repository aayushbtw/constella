---
title: Progress
description: Shows how far along a task is.
---

<!-- ::demo name="progress" -->

```tsx
<Progress aria-label="Upload" value={66} />
```

## Installation

<!-- ::install name="progress" -->

## Usage

```tsx
import { Progress } from "@/components/primitives/progress";
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

## Progress Value

Set `max` to count in its own units, like a file's size, and pass `format` a function of the value to write it your way. `ProgressValue` shows that text, and screen readers read it too. The fill travels to each new value.

<!-- ::demo name="progress-value" -->

```tsx
<Progress
  format={(sent) =>
    sent >= file.size ? "Done" : `${mb(sent)} of ${mb(file.size)}`
  }
  max={file.size}
  value={sent}
>
  <ProgressLabel>{file.name}</ProgressLabel>
  <ProgressValue />
</Progress>
```

## Indeterminate

Pass `value={null}` while the amount isn't known yet. A segment sweeps across the track; under reduced motion it breathes in place.

<!-- ::demo name="progress-indeterminate" -->

```tsx
<Progress value={null}>
  <ProgressLabel>Preparing export</ProgressLabel>
</Progress>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Progress` | Renders `ProgressTrack` and `ProgressIndicator` after its children |

Every part takes `sx`, applied last. For the rest, see [UI SDK Progress](https://ui-sdk.dev/docs/components/progress).
