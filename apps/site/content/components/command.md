---
title: Command
description: A searchable list of commands, inline or as a palette.
---

<!-- ::demo name="command" -->

```tsx
<Command items={groups}>
  <CommandInput placeholder="Type a command or search..." />
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    {(group) => (
      <CommandGroup items={group.items} key={group.value}>
        <CommandGroupLabel>{group.value}</CommandGroupLabel>
        <CommandCollection>
          {(entry) => (
            <CommandItem key={entry.value} value={entry}>
              {entry.label}
            </CommandItem>
          )}
        </CommandCollection>
      </CommandGroup>
    )}
  </CommandList>
</Command>
```

## Installation

<!-- ::install name="command" -->

## Usage

```tsx
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/primitives/command";
```

Pass the entries as `items`, and render each one in `CommandList`. Typing filters them by `label`.

```tsx
<Command items={entries}>
  <CommandInput placeholder="Search..." />
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    {(entry) => (
      <CommandItem key={entry.value} value={entry}>
        {entry.label}
      </CommandItem>
    )}
  </CommandList>
</Command>
```

**Don't map children yourself.** The list only filters what it renders from `items`.

## Composition

```
Command
├── CommandInput
├── CommandEmpty
├── CommandList
│   ├── CommandGroup
│   │   ├── CommandGroupLabel
│   │   └── CommandCollection
│   │       └── CommandItem
│   │           └── CommandShortcut
│   └── CommandSeparator
└── CommandFooter
```

Add `disabled` to a `CommandItem` to show it but skip it, and a `CommandSeparator` between groups. Handle a pick with the item's `onClick`, which Enter fires too. `CommandFooter` is a bar under the list for key hints, set into the command's edges.

## Command Dialog

Use `CommandDialog` for a palette over the page, opened by a shortcut you listen for. It sits near the top of the window so the list can grow downward. It's named for screen readers by `title` and `description`. Close it when an item runs. Set `instant` when the keyboard opened or closed it, so it skips its motion.

<!-- ::demo name="command-dialog" -->

```tsx
<CommandDialog onOpenChange={setOpen} open={open}>
  <Command items={groups}>…</Command>
</CommandDialog>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Command` | Base UI Autocomplete, inline and always open, highlighting the first match |
| `CommandDialog` | A dialog for the palette; `title` and `description` for screen readers, `instant` to skip its motion |
| `CommandFooter` | A tinted bar under the list, for key hints |

Every part takes `sx`, applied last. shadcn builds this on cmdk; this one is Base UI. For the rest, see [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete).
