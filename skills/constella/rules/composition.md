# Component Composition

## Contents

- Custom triggers take `render`
- A link that looks like a button
- Dialog, Sheet and AlertDialog need a Title
- Choosing an overlay
- Select takes `items`, Command picks with `onSelect`
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

ui-sdk parts render a default element. To use your own, pass `render`. There is no `asChild`.

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

Pass an `<a>` to `Button`'s `render`. It keeps its `href` and link role. A Button that navigates in `onClick` is announced as a button and can't open in a new tab.

**Incorrect:**

```tsx
<Button onClick={() => navigate("/settings")} variant="outline">
  Settings
</Button>
```

**Correct:**

```tsx
<Button render={<a href="/settings" />} variant="outline">
  Settings
</Button>
```

A framework link works the same way: `<Button render={<Link href="/settings" />}>`. For an element that can't be a Button, like a Toggle, spread `buttonStyles` onto it.

---

## Dialog, Sheet and AlertDialog need a Title

ui-sdk names the dialog from its title. Without one the dialog has no accessible name.

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

`DialogContent` already renders the backdrop and popup. Don't add them. Close buttons are `DialogClose render={<Button />}`; `DialogCloseButton` is the corner X.

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

Mark the button that confirms a destructive action, and a destructive menu item, with `data-agent-confirm="<what it does>"`. Give it text the trigger doesn't hold, like "Delete forever" under "Delete chat". See [Agent Marks](https://constella.aayush.cv/docs/agents#agent-marks).

---

## Select takes `items`, Command picks with `onSelect`

Pass `items` to `Select` so the trigger shows the picked item's label.

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
const items = [{ label: "Apple", value: "apple" }];

<Select items={items} placeholder="Select a fruit">
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
  </SelectContent>
</Select>;
```

`placeholder` on `Select` is the text the trigger shows while nothing is picked.

`Command` is ui-sdk's Command, not cmdk. Map your items as children, each with a unique string `value`; typing filters what it renders. Handle a pick with the item's `onSelect`: Enter runs the highlighted item without a click, so `onClick` misses it.

**Incorrect:**

```tsx
<CommandList>
  {entries.map((e) => (
    <CommandItem key={e.value} onClick={() => run(e)}>
      {e.label}
    </CommandItem>
  ))}
</CommandList>
```

**Correct:**

```tsx
<Command>
  <CommandInput aria-label="Search commands" placeholder="Search..." />
  <CommandEmpty>No results found.</CommandEmpty>
  <CommandList>
    {entries.map((entry) => (
      <CommandItem
        key={entry.value}
        onSelect={() => run(entry)}
        value={entry.value}
      >
        {entry.label}
      </CommandItem>
    ))}
  </CommandList>
</Command>
```

---

## Groups

A group is for a label or a section, not a requirement. Items sit directly in `SelectContent` or `DropdownMenuContent`. Add `SelectGroup` + `SelectGroupLabel`, or `DropdownMenuGroup` + `DropdownMenuLabel`, when the list has headed sections, with a `*Separator` between them.

`Command` groups the same way: `CommandGroup` + `CommandGroupLabel`, with a `CommandSeparator` between groups.

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

Button has no `isLoading` or `isPending`. Return a Promise from `onClick` for pending work, or set `aria-busy` yourself when the button should stay pressable.

**Incorrect:**

```tsx
<Button isLoading>Save</Button>
```

**Correct:**

```tsx
<Button onClick={save} pendingAnnouncement="Saving">
  {(state) => (
    <>
      {state.pending && <Spinner aria-hidden data-icon="inline-start" />}
      Save
    </>
  )}
</Button>
```

- Async `onClick`: sets `aria-busy` and `data-pending`, ignores presses until the Promise settles, keeps focus, and announces `pendingAnnouncement`. Pass `aria-hidden` to `Spinner` so "Loading" isn't joined onto the button's name.
- `aria-busy` alone: still pressable, for a button that acts on running work (Generate becomes Stop generating).
- `disabled` alone: unavailable. Don't add your own disabled look.
- `variant="primary"` once per view; `danger` for actions that delete.

---

## Tooltip on a disabled control

A natively disabled button can't take focus, so its tooltip never shows. Add `focusableWhenDisabled` so the button stays in the Tab order, reads as dimmed, ignores presses, and shows its tooltip on hover and focus.

```tsx
<Tooltip>
  <TooltipTrigger
    render={<Button disabled focusableWhenDisabled variant="outline" />}
  >
    Export
  </TooltipTrigger>
  <TooltipContent>Nothing to export yet</TooltipContent>
</Tooltip>
```

Neighbors group on their own, so once one is open the next opens at once. An icon-only button gets an `aria-label` as well as a tooltip.

---

## Toast

Render `<Toaster />` once near the app's root, as a sibling of the content, then call `toast` from anywhere.

```tsx
import { toast } from "@/components/primitives/toast";

toast.success({ title: "Saved" });
toast.promise(upload(files), {
  loading: { title: "Uploading…" },
  success: { title: "Done" },
  error: { title: "Upload failed" },
});
```

It is ui-sdk's Toast, not Sonner. Don't install `sonner`. One action at most: `action: { label: "Undo", onAction }`; pressing it dismisses the toast.

---

## TabsTrigger inside TabsList

```tsx
<Tabs defaultValue="account">
  <TabsList aria-label="Settings">
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
