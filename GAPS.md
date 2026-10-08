# Gaps

What Constella needs before netigen-v2 can run on it, from the netigen-v2 audit (2026-10-08). netigen adopts Constella's look and colors with its own `theme.stylex.ts`; these are the missing pieces. Tick one off as it lands, and record its decisions in `DESIGN.md` or `ARCHITECTURE.md`, not here.

## Changes to existing components

- [x] **Menu and select row sizes.** `size` (`sm` 24, `default` 28, `lg` 32) on `DropdownMenuContent` and `SelectContent`, passed to every row through context, as `TabsList` sizes its triggers. netigen's rows are 32px.
- [x] **Select opens below its trigger**, like a dropdown menu, instead of over it (`alignItemWithTrigger` off by default).

## Tokens

- [x] **`radii.lg`** (16px, cards) and **`radii.xl`** (20px, the composer), derived from `--radius` like the others.
- [x] **Surface roles:** `sidebar` (gray-2); `track` is `fillOpaque` and `selected` is `fill`.
- [ ] **Chart roles:** a categorical set for data series, added with the first chart. Meter needed none: `fill` track, `accent` fill, `dangerSolid` at the cap.

## Components

### Layout

- [x] **Card**, with a `well` variant (a muted tray around one card) and `sm`/flush sizes.
- [x] **Item** and **ItemGroup**: list rows with media, content, actions and separators.
- [x] **Empty**: an empty state with media, title, description and content.
- [ ] **Sidebar**: sections, nav items with sizes, collapse to a rail, a header row the page's height. netigen's is 965 lines.
- [ ] **Side panel**: row details beside the content under the header, split by a hairline, not floating.
- [x] **Sheet**: the same panel as a dialog, for narrow windows.

### Feedback

- [x] **Alert**, with icon, title, description and action (`ARCHITECTURE.md` already uses it as the composition example).
- [x] **AlertDialog**: destructive confirms.
- [x] **Meter** and **Progress**: usage against a cap; progress of a task.
- [x] **Skeleton**: content still arriving.

### Disclosure

- [x] **Collapsible**: tool steps, reasoning.
- [x] **PreviewCard**: a citation's preview on hover.
- [x] **Command**: a searchable palette and list, for chat search and the model picker.
- [x] **ScrollArea**.

### Input

- [x] **Toggle** and **ToggleGroup**: segmented filters.
- [ ] **PromptInput**: the chat composer on `InputGroup`. Grows with its text, submits on Enter (not Shift+Enter or mid-IME), a header for attachments, a footer for tools, and a submit that turns into Stop while streaming.

### Chat

- [ ] **MessageScroller**: sticks to the newest message, keeps its place when history loads above, and offers a scroll-to-end button (`@shadcn/react/message-scroller` underneath).
- [ ] **Message**: a user message and an assistant answer, with an actions row.
- [ ] **CopyButton**: copy with the tick cross-fade (the site has one to promote).
- [ ] **SwapIcon** and **SwapText**: one icon or label cross-fading into another.

### Text

- [x] **Text**, **Heading** and **Icon**: not components. Type is set with `fontSizes`, `fontWeights` and `lineHeights`, adding heading sizes when the migration first needs them; an icon wrapper is the app's, since the icon set is its choice.

### Data

- [ ] **DataTable**: `Table` driven by TanStack Table, with sorting and selection.

## Chat parts

netigen builds these today. Each could become a Constella part once the components above exist.

- [ ] **Tool steps**: a collapsible list of steps, each with a status and a live label.
- [ ] **Suggestions**: starter prompts as chips.
- [ ] **Attachment**: a file tile with upload progress.
- [ ] **Citation**: a pill that opens a PreviewCard.
- [ ] **Model picker**: a Command of models with their details.
- [ ] **Approval**: a card asking to allow a tool call.
- [ ] **Questionnaire**: questions the model asks, one at a time.
- [ ] **Answer rendering**: markdown, code blocks, result tables and charts.

## Motion

- [ ] **Sidebar section change**: slides like a stack, forward into a section and back out, with a light blur; the page swaps at once.
- [ ] **Sidebar collapse**: labels fade as the width clips them; the logo stays put.

## Open

- [ ] **Lift on secondary and danger buttons.** Today only outline and primary climb the shadow ladder; netigen lifts every pressable surface.
