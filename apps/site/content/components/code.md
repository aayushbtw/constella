---
title: Code
description: Code inside running text.
section: Typography
---

<!-- ::demo name="code" -->

```tsx
<Text color="secondary">
  Set <Code>NODE_ENV</Code> to <Code>production</Code> before you run the build.
</Text>
```

## Installation

<!-- ::install name="code" -->

## Usage

```tsx
import { Code } from "@/components/typography/code";
```

```tsx
<Code>NODE_ENV</Code>
```

Its size is relative, so it sits a step under the text around it at any size. For a block of code, use [Code Block](/docs/components/code-block).

## API Reference

| Prop     | Type                         | Default  |
| -------- | ---------------------------- | -------- |
| `render` | `ReactElement \| function`   | `<code>` |
| `sx`     | `StyleXStyles`, applied last | -        |
