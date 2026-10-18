# Styling

A style is a value from `stylex.create`, built from tokens, passed to a part as `sx`.

## Contents

- `sx`, never `className` or `style`
- No utility classes
- Tokens, not raw values
- Longhands only
- Hover behind `media.hover`
- Text uses Text, Heading and Caption
- Don't restyle a part from outside
- Dark mode
- Stacking

---

## `sx`, never `className` or `style`

Parts omit `className` and `style`. They take `sx`, applied last, so the caller wins.

**Incorrect:**

```tsx
<Card className="w-96" style={{ marginTop: 16 }} />
```

**Correct:**

```tsx
import * as stylex from "@stylexjs/stylex";

import { Card } from "@/components/primitives/card";
import { space, sizes } from "@/lib/constella/tokens.stylex";

const styles = stylex.create({
  card: { marginBlockStart: space.md, width: sizes.dialog },
});

<Card sx={styles.card} />;
```

Conditional styles go in an array: `sx={[styles.card, wide && styles.wide]}`. Order matters; the last wins.

A wrapper you write passes `sx` through, never drops it, and applies it last in `stylex.props(...)`.

---

## No utility classes

There is no Tailwind in the project, so `flex`, `gap-4`, `bg-muted`, `text-sm` do nothing. Lay out with a `stylex.create` style.

**Incorrect:**

```tsx
<div className="flex flex-col gap-4">
```

**Correct:**

```tsx
const styles = stylex.create({
  stack: { display: "flex", flexDirection: "column", gap: space.md },
});

<div {...stylex.props(styles.stack)}>
```

---

## Tokens, not raw values

Import from `@/lib/constella/tokens.stylex` and use them inside `stylex.create`. If a value has no token, say so rather than inlining it; only `0`, `1`, `100%` and keywords stay inline.

| Family | Use for | Example |
| --- | --- | --- |
| `colors` | Every color | `colors.textSecondary`, `colors.fill`, `colors.border`, `colors.dangerText` |
| `space` | Gaps, padding, margin | `space.xxs` … `space.xl` |
| `radii` | Corners | `radii.sm`, `radii.md`, `radii.full` |
| `sizes` | Control heights, icon sizes, widths | `sizes.controlMd`, `sizes.icon`, `sizes.dialog` |
| `fontWeights`, `fonts` | Weight, family | `fontWeights.medium`, `fonts.mono` |
| `durations`, `easings` | Motion | `durations.hover`, `easings.out` |
| `layers` | z-index | `layers.popover` |
| `media` | Conditions | `media.hover`, `media.coarse`, `media.reducedMotion` |
| `shadows` | Elevation | `shadows.lg` |

**Incorrect:**

```tsx
const styles = stylex.create({
  row: {
    color: "#666",
    paddingBlock: 8,
    borderRadius: 6,
    transition: "all 200ms",
  },
});
```

**Correct:**

```tsx
const styles = stylex.create({
  row: {
    color: colors.textSecondary,
    paddingBlock: space.sm,
    borderStartStartRadius: radii.sm,
    transitionDuration: durations.hover,
    transitionProperty: "background-color",
  },
});
```

Colors are roles, not hues. Never reach for a Radix step (`--gray-9`) or a hex; if no role fits, it's a missing token.

**Status colors carry the caller's meaning.** `colors.dangerText` for a short label or icon, `dangerSubtle` for a tint, `dangerSolid` for a dot. Never put status color on body copy, or a saturated status fill behind text.

---

## Longhands only

StyleX resolves a shorthand against its longhands by property priority, not by order. A shorthand in your style silently loses to a longhand merged in later through `sx`.

**Incorrect:**

```tsx
stylex.create({
  box: {
    padding: space.md,
    margin: 0,
    border: "1px solid red",
    borderRadius: radii.md,
  },
});
```

**Correct:**

```tsx
stylex.create({
  box: {
    paddingBlock: space.md,
    paddingInline: space.md,
    marginBlock: 0,
    marginInline: 0,
    borderBlockWidth: strokes.border,
    borderStartStartRadius: radii.md,
  },
});
```

Four-side shorthands (`padding`, `margin`, `inset`, `border`, `borderRadius`, `borderWidth`) are out. Prefer logical properties (`marginInlineStart`) so RTL works.

---

## Hover behind `media.hover`

Hover without `media.hover` sticks on touch. Pair it with an ungated `:active`.

**Incorrect:**

```tsx
row: { backgroundColor: { default: null, ":hover": colors.fillSubtle } }
```

**Correct:**

```tsx
row: {
  backgroundColor: {
    default: null,
    ":active": colors.fillSubtle,
    [media.hover]: { default: null, ":hover": colors.fillSubtle },
  },
}
```

Don't style focus. The ring comes from the component; any `outline*` in your styles is wrong.

---

## Text uses Text, Heading and Caption

App code uses the typography parts, which sit on the type scale.

**Incorrect:**

```tsx
<p style={{ fontSize: 14, color: "#666" }}>Billing</p>
<h2 className="text-xl font-bold">Settings</h2>
```

**Correct:**

```tsx
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";

<Text color="secondary">Billing</Text>
<Heading level={2}>Settings</Heading>
```

- `Text`: `size` (`sm`, `base`, `lg`), `weight`, `color` (`primary`, `secondary`, `muted`, `danger`, `success`, `warning`, `info`).
- `Heading`: `level` sets the tag, `size` (1–6) the look.
- `Caption`: small supporting text.
- No weight above `semibold` (600). Numbers that change in place take `fontVariantNumeric: "tabular-nums"`.

---

## Don't restyle a part from outside

A component owns its look. Reach in with `sx` on the part itself, or use a variant. Don't wrap it, and don't write a selector that styles a component's children from a parent.

**Incorrect:**

```tsx
function PrimaryButton(props) {
  return <Button {...props} sx={{ backgroundColor: "red" }} />;
}
```

**Correct:**

```tsx
<Button variant="danger">Delete</Button>
```

A deliberate one-off is fine: `<Button sx={styles.wide} />`.

---

## Dark mode

A `dark` class on `<html>`. Every color token flips by itself, so never branch on the theme.

**Incorrect:**

```tsx
color: isDark ? "#fff" : "#000";
```

**Correct:**

```tsx
color: colors.textPrimary;
```

---

## Stacking

Popups, dialogs and toasts set their own layer. Don't add a `zIndex` to one. If your own element must sit among them, use `layers`.
