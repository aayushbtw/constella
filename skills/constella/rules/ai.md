# AI and Data

The `ai` and `tanstack` groups. In both, the app owns the state and the component owns the markup.

## Contents

- Chat composes the chat parts
- Streaming
- Assistant activity uses Trace
- Prompt input
- Markdown and Code Block
- Data Table
- Chart

---

## Chat composes the chat parts

A conversation is `MessageScrollerProvider` > `MessageScroller` > `MessageScrollerViewport` > `MessageScrollerContent` > `MessageScrollerItem` > `Message`. Never a hand-rolled bubble `div` or a raw scroll container.

**Incorrect:**

```tsx
<div className="overflow-y-auto" ref={endRef}>
  {turns.map((t) => (
    <div className={t.from === "user" ? "bubble-right" : "bubble-left"}>
      {t.text}
    </div>
  ))}
</div>
```

**Correct:**

```tsx
<MessageScrollerProvider>
  <MessageScroller>
    <MessageScrollerViewport aria-label="Conversation">
      <MessageScrollerContent>
        {turns.map((turn) => (
          <MessageScrollerItem
            key={turn.id}
            messageId={turn.id}
            scrollAnchor={turn.from === "user"}
          >
            <Message from={turn.from}>
              <MessageContent>{turn.text}</MessageContent>
            </Message>
          </MessageScrollerItem>
        ))}
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton />
  </MessageScroller>
</MessageScrollerProvider>
```

- `MessageScroller` owns scroll behavior: it opens at the newest message, follows a streaming answer while the reader is at the end, keeps their place when history loads above, and shows `MessageScrollerButton` to jump back. Don't write a stick-to-bottom hook or a `ResizeObserver`.
- Mark each user message `scrollAnchor`, so a new question scrolls to the top.
- `Message` takes `from="user" | "assistant"`. A user's message sits at the end in a bubble; an answer reads as the page. Answer actions go in `MessageActions` (a `CopyButton`).
- `useMessageScroller` gives `scrollToEnd`, `scrollToStart`, `scrollToMessage`.
- Starter prompts for an empty chat are `Suggestions` + `Suggestion`. Files are `Attachment` in an `AttachmentGroup`. A system note is `Marker`.

---

## Streaming

Set `streaming` on `Markdown` while the answer arrives, so unclosed code fences, lists and emphasis render as if closed.

```tsx
<Markdown streaming={status === "streaming"}>{text}</Markdown>
```

`PromptInputSubmit` takes the chat `status` and an `onStop`, so the same button submits and stops.

---

## Assistant activity uses Trace

Reasoning, tool calls and steps are `TraceLine`s in a `Trace`, one line each. Don't build them from a `Collapsible` and a `div`.

**Incorrect:**

```tsx
<Collapsible>
  <CollapsibleTrigger>Thought for 5s</CollapsibleTrigger>…
</Collapsible>
```

**Correct:**

```tsx
<Trace>
  <TraceStep open={thinking} state={thinking ? "running" : undefined}>
    <TraceLine>
      <TraceMarker>
        <IdeaIcon />
      </TraceMarker>
      <TraceTitle>{thinking ? "Thinking" : "Thought for 5s"}</TraceTitle>
    </TraceLine>
    <TraceStepContent>
      <TraceReasoning>{reasoning}</TraceReasoning>
    </TraceStepContent>
  </TraceStep>
  <TraceStep state="running">
    <TraceLine>
      <TraceMarker>
        <GlobeIcon />
      </TraceMarker>
      <TraceTitle>Searching the web</TraceTitle>
    </TraceLine>
  </TraceStep>
</Trace>
```

- Every step's `TraceMarker` holds its icon; the marker is the node on the rail.
- Behavior wraps the line: `TraceStepTrigger` to open a tool step's content, or a link or dialog trigger around a `TraceLine`. Reasoning shows while the model thinks and shuts after; a finished thought doesn't open.
- `state` on `TraceStep` is `running`, `error` or `pending`; leave it out when done. Color and motion carry it, so say it in the title ("Failed to run pnpm lint", not "pnpm lint").
- The marker is hidden from screen readers, so write the title as a sentence.

---

## Prompt input

`PromptInput` is a form around an `InputGroup`. Enter submits; Shift+Enter, and Enter while an IME is composing, add a line.

```tsx
<PromptInput onSubmit={send}>
  <PromptInputTextarea value={text} onChange={(e) => setText(e.target.value)} />
  <PromptInputFooter>
    <PromptInputTools>…</PromptInputTools>
    <PromptInputSubmit onStop={stop} status={status} />
  </PromptInputFooter>
</PromptInput>
```

Attachments go in a `PromptInputHeader` above the text; a submit can send files with no text. Context around the composer (a project, connected apps) goes in a `PromptInputWell` with `PromptInputBar`s.

---

## Markdown and Code Block

- `Markdown` renders an answer's tables on `Table` and fences in a `CodeBlock`, with a copy button. Links open in a new tab. Replace a tag, or add a custom one like a citation, with `components`.
- Constella ships **no highlighter**. Pass one from TanStack Highlight to `Markdown`'s `highlighter` and add its theme CSS once; in a bare `CodeBlock`, render your tokens inside each `CodeBlockLine`.
- `CodeBlockContent` takes a string or a `CodeBlockLine` per line, and always reads left to right.

---

## Data Table

Build the table with TanStack Table's `useTable` and the features you need, then pass it to `DataTable`. Only the visible rows render.

```tsx
const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
});
const column = createColumnHelper<typeof features, Payment>();
const columns = column.columns([
  column.accessor("email", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    sortFn: "alphanumeric",
  }),
]);

const table = useTable({ columns, data, features });
<DataTable empty="No payments." label="Payments" table={table} />;
```

- **Keep `features` and `columns` outside the component.** A new array each render rebuilds every row model.
- Register the feature a part needs: `rowSortingFeature` for `DataTableColumnHeader`, `rowSelectionFeature` for `DataTableSelectAll` and `DataTableSelectRow`, `columnVisibilityFeature` for `DataTableViewOptions`, filtering features for search.
- Narrow columns take `columnSx` widths and the table a `minWidth` in `sx`; the layout is fixed.
- In a container that scrolls on its own, pass it as `scrollRef`. Loading, stale and error states come from a TanStack Query `useQuery` result.

---

## Chart

Build the chart with TanStack Charts' `defineChart` and pass it to `Chart` with an `ariaLabel` naming the metric and period.

```tsx
const config = {
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile" },
} satisfies ChartConfig;

<Chart
  ariaLabel="Monthly visitors, January to June"
  config={config}
  definition={definition}
  height={240}
/>;
```

- **Keep the definition outside the component,** or in a `useMemo` on the values it reads. A new definition rebuilds the chart.
- `chartColor(config)` gives the definition its color scale, so series take the theme's palette (`colors.chart1` … `chart6`).
- The legend is `ChartLegendContent` outside the chart, bound to it by your state (`value`, `onValueChange`).
- Import `ChartConfig`, `chartColor`, `chartFold`, `ChartIndicator` and the legend from `@/components/tanstack/chart-legend`, which loads no TanStack Charts, so a legend beside a lazy `Chart` stays light.
- Compose a custom tooltip from `ChartTooltip`, `ChartTooltipRow` and `ChartIndicator` through `renderTooltipBody`.
