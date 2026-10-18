# Component Composition

## Contents

- Custom triggers take `render`
- A link that looks like a button
- Dialog, Sheet and AlertDialog need a Title
- Choosing an overlay
- Select and Command take `items`
- Groups
- Card structure
- Button states
- Tooltip on a disabled control
- Toast
- TabsTrigger inside TabsList
- Avatar needs AvatarFallback
- Use components, not custom markup

---

## Custom triggers take `render`

Base UI parts render a default element. To use your own, pass `render`. There is no `asChild`.

**Incorrect:**

```tsx
<DialogTrigger asChild>
  <Button variant="outline">Edit</Button>
</DialogTrigger>
```

**Correct:**

```tsx
<DialogTrigger render={<Button variant="outline" />}>Edit</DialogTrigger>
```

The same holds for `DropdownMenuTrigger`, `PopoverTrigger`, `TooltipTrigger`, `SheetTrigger`, `DialogClose` and `Text`/`Heading` (`render={<span />}`).

---

## A link that looks like a button

Base UI's `Button` always sets `role="button"`, so a link rendered through it is announced as a button.

**Incorrect:**

```tsx
<Button render={<a href="/settings" />} nativeButton={false}>
  Settings
</Button>
```

**Correct:**

```tsx
import * as stylex from "@stylexjs/stylex";

import { buttonStyles } from "@/components/primitives/button";

<a href="/settings" {...stylex.props(buttonStyles({ variant: "outline" }))}>
  Settings
</a>;
```

In a framework link, spread the same props onto it: `<Link href="/settings" {...stylex.props(buttonStyles({}))} />`.

---

## Dialog, Sheet and AlertDialog need a Title

Base UI names the dialog from its title. Without one the dialog has no accessible name.

**Incorrect:**

```tsx
<DialogContent>
  <Form />
</DialogContent>
```

**Correct:**

```tsx
<DialogContent>
  <DialogHeader>
    <DialogTitle>Edit profile</DialogTitle>
    <DialogDescription>Make changes to your profile here.</DialogDescription>
  </DialogHeader>
  <Form />
</DialogContent>
```

To hide it visually: `<DialogTitle sx={visuallyHidden.base}>` (from `@/lib/constella/styles`).

`DialogContent` already renders the portal, backdrop and popup. Don't add them. Close buttons are `DialogClose render={<Button />}`; `DialogCloseButton` is the corner X.

---

## Choosing an overlay

| Use case                           | Component       |
| ---------------------------------- | --------------- |
| A focused task that needs input    | `Dialog`        |
| Confirm a destructive action       | `AlertDialog`   |
| A side panel of details or filters | `Sheet`         |
| Small content on click             | `Popover`       |
| Quick info on hover                | `HoverCard`     |
| A label for an icon                | `Tooltip`       |
| A command palette                  | `CommandDialog` |

---

## Select and Command take `items`

Pass `items` so the trigger shows the picked item's label and the list filters what it renders.

**Incorrect:**

```tsx
<Select>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
  </SelectContent>
</Select>
```

**Correct:**

```tsx
const items = [
  { label: "Select a fruit", value: null },
  { label: "Apple", value: "apple" },
];

<Select items={items}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
  </SelectContent>
</Select>;
```

An item with `value: null` is the placeholder.

`Command` is Base UI's Autocomplete, not cmdk. It filters the `items` it's given and renders each through a function child. Mapping your own children shows them unfiltered.

**Incorrect:**

```tsx
<CommandList>
  {entries.map((e) => (
    <CommandItem key={e.value}>{e.label}</CommandItem>
  ))}
</CommandList>
```

**Correct:**

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

Handle a pick with the item's `onClick`; Enter fires it too. Grouped commands nest `CommandGroup items={group.items}` and `CommandCollection`: read the page.

---

## Groups

A group is for a label or a section, not a requirement. Items sit directly in `SelectContent` or `DropdownMenuContent`. Add `SelectGroup` + `SelectLabel`, or `DropdownMenuGroup` + `DropdownMenuLabel`, when the list has headed sections, with a `*Separator` between them.

`Command` is the exception: grouped entries go through `CommandGroup` and `CommandCollection` so filtering still works.

---

## Card structure

Use the full composition. Don't put everything in `CardContent`.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Team members</CardTitle>
    <CardDescription>Manage your team.</CardDescription>
    <CardAction>
      <Button size="sm">Invite</Button>
    </CardAction>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>…</CardFooter>
</Card>
```

---

## Button states

Button has no `isLoading` or `isPending`. Compose it.

**Incorrect:**

```tsx
<Button isLoading>Save</Button>
```

**Correct:**

```tsx
<Button aria-busy disabled>
  <Spinner data-icon="inline-start" />
  Saving
</Button>
```

- `aria-busy` + `disabled`: loading, can't be pressed twice.
- `aria-busy` alone: still pressable, for a button that acts on running work (Generate becomes Stop generating).
- `disabled` alone: unavailable. Don't add your own disabled look.
- `variant="primary"` once per view; `danger` for actions that delete.

---

## Tooltip on a disabled control

A disabled button takes no pointer events. Put the trigger on a wrapper.

```tsx
<Tooltip>
  <TooltipTrigger render={<span />}>
    <Button disabled>Export</Button>
  </TooltipTrigger>
  <TooltipContent>Nothing to export yet</TooltipContent>
</Tooltip>
```

Wrap neighbors in a `TooltipProvider` so the next opens at once. An icon-only button gets an `aria-label` as well as a tooltip.

---

## Toast

Render `Toaster` once around the app, then call `toast` from anywhere.

```tsx
import { toast } from "@/components/primitives/toast";

toast.add({ title: "Saved", type: "success" });
toast.promise(upload(files), {
  loading: { title: "Uploading…" },
  success: { title: "Done" },
  error: { title: "Upload failed" },
});
```

It is Base UI's Toast, not Sonner. Don't install `sonner`; there's no `toast.success()`. One action at most: `actionProps: { children: "Undo", onClick }`.

---

## TabsTrigger inside TabsList

```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
  </TabsList>
  <TabsContent value="account">…</TabsContent>
</Tabs>
```

---

## Avatar needs AvatarFallback

```tsx
<Avatar>
  <AvatarImage src="/me.png" alt="Alex Smith" />
  <AvatarFallback>AS</AvatarFallback>
</Avatar>
```

---

## Use components, not custom markup

| Instead of                        | Use          |
| --------------------------------- | ------------ |
| A styled `div` callout            | `Alert`      |
| A custom empty state              | `Empty`      |
| `<hr>` or a bordered `div`        | `Separator`  |
| A pulsing `div`                   | `Skeleton`   |
| A styled `span` pill              | `Badge`      |
| A hand-made spinner               | `Spinner`    |
| `<kbd>`                           | `Kbd`        |
| A copy-to-clipboard button        | `CopyButton` |
| A scrolling `div` with `overflow` | `ScrollArea` |
