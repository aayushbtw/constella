# Icons

Constella uses one icon set: Hugeicons. Don't mix in Lucide, Tabler or inline SVG.

## Contents

- Hugeicons, at the token size
- Icons in buttons use `data-icon`
- Accessible names
- RTL

---

## Hugeicons, at the token size

Render an icon with `HugeiconsIcon`, sized by `sizes` and stroked by `strokes`. Never a number.

**Incorrect:**

```tsx
import { Search } from "lucide-react";

<Search className="size-4" />;
```

**Correct:**

```tsx
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { sizes, strokes } from "@/lib/constella/tokens.stylex";

<HugeiconsIcon
  aria-hidden
  icon={Search01Icon}
  size={sizes.icon}
  strokeWidth={Number(strokes.icon)}
/>;
```

| Token          | Use              |
| -------------- | ---------------- |
| `sizes.icon`   | Default controls |
| `sizes.iconSm` | `sm` controls    |
| `sizes.iconXs` | `xs` controls    |
| `sizes.iconLg` | `lg` controls    |

`strokes.icon` is tuned for medium text, so the stroke follows the text weight. Pass the icon object (`icon={Search01Icon}`), never a string name. Inside an `InputGroupAddon` or a menu item, the parent sizes the icon, so you can omit `size`.

---

## Icons in buttons use `data-icon`

`data-icon` sets the icon's spacing against the label. Use `sizes.iconXs` at `xs`, `sizes.iconSm` at `sm`, `sizes.icon` otherwise.

**Incorrect:**

```tsx
<Button>
  <HugeiconsIcon icon={Add01Icon} style={{ marginRight: 8 }} />
  New project
</Button>
```

**Correct:**

```tsx
<Button>
  <HugeiconsIcon
    aria-hidden
    data-icon="inline-start"
    icon={Add01Icon}
    size={sizes.icon}
  />
  New project
</Button>
```

`data-icon="inline-end"` puts it after the label. `Spinner` takes the same attribute.

---

## Accessible names

- **An icon next to text is decorative:** `aria-hidden`.
- **An icon-only button needs a name:** `<Button size="icon" aria-label="Search">`, with an `icon-*` size.
- **Don't say it only with an icon.** Status needs text too.

---

## RTL

An icon that points along the line of text (an arrow, a chevron) gets `data-rtl-flip`, so it turns when the app is `dir="rtl"`. Symbols that don't point don't.

```tsx
<HugeiconsIcon data-rtl-flip icon={ArrowRight01Icon} />
```
