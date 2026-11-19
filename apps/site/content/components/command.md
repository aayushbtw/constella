---
title: Command
description: A searchable list of commands, inline or as a palette.
---

<!-- ::demo name="command" -->

```tsx
<Command>
  <CommandInput
    aria-label="Search commands"
    placeholder="Type a command or search..."
  />
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    {groups.map((group, index) => (
      <Fragment key={group.value}>
        {index > 0 && <CommandSeparator />}
        <CommandGroup>
          <CommandGroupLabel>{group.value}</CommandGroupLabel>
          {group.items.map((entry) => (
            <CommandItem
              key={entry.value}
              onSelect={() => run(entry)}
              value={entry.value}
            >
              {entry.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </Fragment>
    ))}
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

Give the input an `aria-label` and each item a unique `value`. Typing keeps the items whose text matches. Handle a pick with the item's `onSelect`.

```tsx
<Command>
  <CommandInput aria-label="Search commands" placeholder="Search..." />
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    <CommandItem onSelect={createFile} value="new-file">
      New file
    </CommandItem>
    <CommandItem onSelect={createFolder} value="new-folder">
      New folder
    </CommandItem>
  </CommandList>
</Command>
```

**Use `onSelect`, not `onClick`.** Enter runs the highlighted item without a click, so `onClick` misses it.

## Composition

```
Command
├── CommandInput
├── CommandEmpty
├── CommandList
│   ├── CommandGroup
│   │   ├── CommandGroupLabel
│   │   └── CommandItem
│   │       └── CommandShortcut
│   └── CommandSeparator
└── CommandFooter
```

Put a `CommandSeparator` between groups. A group and its separator hide while the search leaves the group empty. Add `disabled` to a `CommandItem` to show it but skip it. `Command`'s `onAction` gets the `value` of any item that runs, after the item's `onSelect`.

## Filter

Use the `filter` prop to change how typing narrows the list. Items keep their order, and the first match is highlighted.

| Value          | Keeps                                                |
| -------------- | ---------------------------------------------------- |
| `"contains"`   | Items whose text contains the search. The default    |
| `"startsWith"` | Items whose text starts with the search              |
| `"fuzzy"`      | Items with the search's letters in order, even apart |
| A function     | Items it scores above 0                              |

```tsx
<Command filter="fuzzy">…</Command>
```

Add `keywords` to a `CommandItem` to match words that aren't in its text.

## Command Shortcut

Put a `CommandShortcut` at the end of an item and give it a `shortcut`. It shows ⌘P on Apple devices and Ctrl+P elsewhere. It only shows the keys, so listen for them yourself.

```tsx
<CommandItem onSelect={openProfile} value="profile">
  Profile
  <CommandShortcut shortcut="mod+p" />
</CommandItem>
```

The server's HTML carries the Ctrl form. Apple devices switch to ⌘ after the page loads. Pass children instead of `shortcut` to show fixed text.

## Command Footer

Use `CommandFooter` for key hints in a bar under the list, set into the command's edges.

```tsx
<CommandFooter>
  <span>
    <Kbd>↵</Kbd> Select
  </span>
  <span>
    <Kbd>esc</Kbd> Close
  </span>
</CommandFooter>
```

## Command Dialog

Use `CommandDialog` for a palette over the page, opened by a shortcut you listen for. It sits near the top of the window so the list can grow downward. It's named for screen readers by `title` and `description`, so give its input a different `aria-label`. Close it in the item's `onSelect`. Escape clears the search first, then closes the dialog. Set `instant` when the keyboard opened or closed it, so it skips its motion.

<!-- ::demo name="command-dialog" -->

```tsx
<CommandDialog onOpenChange={setOpen} open={open}>
  <Command>
    <CommandInput aria-label="Search commands" />
    <CommandList>
      <CommandItem onSelect={() => setOpen(false)} value="profile">
        Profile
      </CommandItem>
    </CommandList>
  </Command>
</CommandDialog>
```

## API Reference

| Part | Adds |
| --- | --- |
| `Command` | ui-sdk Command, with `filter="contains"` by default |
| `CommandInput` | ui-sdk's input in an `lg` Input Group with a search icon; `sx` styles the group |
| `CommandShortcut` | Shows its `shortcut` for the platform (⌘P on Apple, Ctrl+P elsewhere), or its children, at the item's end; registers no keys |
| `CommandDialog` | A dialog for the palette; `title` and `description` for screen readers, `instant` to skip its motion |
| `CommandFooter` | A tinted bar under the list, for key hints |

Every part takes `sx`, applied last. shadcn builds this on cmdk; this one is ui-sdk. For the rest, see [ui-sdk Command](https://ui-sdk.dev/docs/react/components/command).
