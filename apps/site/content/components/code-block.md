---
title: Code Block
description: Code in a tray, with a title, actions, line numbers and diffs.
section: AI
---

<!-- ::demo name="code-block" -->

```tsx
<CodeBlock>
  <CodeBlockHeader>
    <HugeiconsIcon icon={SourceCodeIcon} />
    <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
    <CodeBlockActions>
      <CopyButton aria-label="Copy code" value={code} />
    </CodeBlockActions>
  </CodeBlockHeader>
  <CodeBlockContent lineNumbers>{lines}</CodeBlockContent>
</CodeBlock>
```

## Installation

<!-- ::install name="code-block" -->

## Usage

```tsx
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
} from "@/components/ai/code-block";
import { CopyButton } from "@/components/primitives/copy-button";
```

```tsx
<CodeBlock>
  <CodeBlockContent>{code}</CodeBlockContent>
  <CodeBlockActions>
    <CopyButton value={code} />
  </CodeBlockActions>
</CodeBlock>
```

## Composition

```text
CodeBlock
├── CodeBlockHeader
│   ├── Icon
│   ├── CodeBlockTitle
│   └── CodeBlockActions
├── CodeBlockContent
│   └── CodeBlockLine
├── CodeBlockActions (without a header)
└── CodeBlockFooter
```

`CodeBlockContent` takes a string, or a `CodeBlockLine` per line. Your app highlights the code: render its tokens inside each line, and add your highlighter's theme CSS. The content always reads left to right, and copying a selection leaves out line numbers and diff marks.

## Code Block Actions

Put `CodeBlockActions` straight in the `CodeBlock`, with no header, and it sits on the first line.

<!-- ::demo name="code-block-actions" -->

```tsx
<CodeBlock>
  <CodeBlockContent>pnpm add ai @ai-sdk/react zod</CodeBlockContent>
  <CodeBlockActions>
    <CopyButton aria-label="Copy command" value={command} />
  </CodeBlockActions>
</CodeBlock>
```

## Wrap

Set `wrap` on `CodeBlockContent` to wrap long lines instead of scrolling. For a toggle, keep the state yourself.

<!-- ::demo name="code-block-wrap" -->

```tsx
const [wrap, setWrap] = useState(true);

<CodeBlockActions>
  <Toggle aria-label="Wrap lines" pressed={wrap} onPressedChange={setWrap} size="icon-sm">
    <HugeiconsIcon icon={TextWrapIcon} />
  </Toggle>
  <CopyButton aria-label="Copy output" value={output} />
</CodeBlockActions>
<CodeBlockContent wrap={wrap}>{output}</CodeBlockContent>
```

## Line Numbers

Set `lineNumbers` on `CodeBlockContent`. Use `startLine` when the code is an excerpt.

<!-- ::demo name="code-block-line-numbers" -->

```tsx
<CodeBlockContent lineNumbers startLine={18}>
  {lines}
</CodeBlockContent>
```

## Code Block Line

Use the `variant` prop on `CodeBlockLine` to mark a line.

| Variant       | Use                                 |
| ------------- | ----------------------------------- |
| `default`     | A plain line                        |
| `highlighted` | A line to point at                  |
| `added`       | A line a change adds, marked `+`    |
| `removed`     | A line a change removes, marked `−` |

### Highlighted

<!-- ::demo name="code-block-highlighted" -->

```tsx
<CodeBlockContent lineNumbers>
  <CodeBlockLine>{"export async function GET() {"}</CodeBlockLine>
  <CodeBlockLine>{"  const user = await getUser();"}</CodeBlockLine>
  <CodeBlockLine variant="highlighted">{"  if (!user) {"}</CodeBlockLine>
</CodeBlockContent>
```

### Diff

<!-- ::demo name="code-block-diff" -->

```tsx
<CodeBlockContent>
  <CodeBlockLine variant="removed">
    {"  return <p>Hello, {name}</p>;"}
  </CodeBlockLine>
  <CodeBlockLine variant="added">{"  return ("}</CodeBlockLine>
</CodeBlockContent>
```

## Size

Use the `size` prop on `CodeBlock`: `sm` or `default`.

| Size      | Text | Padding                 |
| --------- | ---- | ----------------------- |
| `sm`      | 12px | `space.sm` × `space.xs` |
| `default` | 13px | `space.md` × `space.sm` |

<!-- ::demo name="code-block-size" -->

```tsx
<CodeBlock size="sm">
  <CodeBlockContent>{command}</CodeBlockContent>
  <CodeBlockActions>
    <CopyButton aria-label="Copy command" size="icon-xs" value={command} />
  </CodeBlockActions>
</CodeBlock>
```

## Status

Use `status="danger"` for an error's output. `CodeBlockFooter` holds a line under the code.

<!-- ::demo name="code-block-danger" -->

```tsx
<CodeBlock status="danger">
  <CodeBlockHeader>
    <HugeiconsIcon icon={Alert02Icon} />
    <CodeBlockTitle>Build failed</CodeBlockTitle>
  </CodeBlockHeader>
  <CodeBlockContent>{error}</CodeBlockContent>
  <CodeBlockFooter>Exited with code 1 after 2.4s</CodeBlockFooter>
</CodeBlock>
```

## Markdown

[Markdown](/docs/components/markdown) renders its fenced code in a `CodeBlock`, with a copy button on the first line.

## API Reference

Every part takes `sx`, applied last.

| Part | Adds |
| --- | --- |
| `CodeBlock` | `status`: `danger`; `size`: `sm` or `default` |
| `CodeBlockContent` | `lineNumbers`; `startLine` (default `1`); `wrap` |
| `CodeBlockLine` | `variant`: `default`, `highlighted`, `added` or `removed` |
| `CodeBlockTitle` | `render`, to make it a heading: `render={<h3 />}` |
| `CodeBlockHeader`, `CodeBlockActions`, `CodeBlockFooter` | Nothing; a `div` each |
