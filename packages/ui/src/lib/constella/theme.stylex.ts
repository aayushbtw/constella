// Your theme: edit these to make Constella yours. Everything else in the system reads them.
//
// - Scales: `--neutral-*` and `--accent-*` point at Radix Colors scales by name. To change
//   one, import its four files and point the steps at it (the theme builder writes this).
// - Roles: what components ask for (`--border`, `--fill`…), each a scale step; change one alone.
//   The ones that differ between light and dark live in base.css.
// - Shape and density: one radius (the rest derive from it), control heights, spacing. In rem
//   (1rem is 16px at the default root), so they grow with the reader's browser font size.
// - Fonts: `--font-sans` for text, `--font-mono` for code and figures. Named, not shipped: load
//   them or put yours first. base.css sets them on the page and reset.css on controls and code; components inherit.
//
// The defaults are Polaris: Radix gray, an ink accent, 8px corners, default sizing, Inter and Geist Mono.
// Literal names, so `base.css` can read them. For more themes to switch between at
// runtime, `stylex.createTheme(theme, { … })` and apply it to <html>.
import * as stylex from "@stylexjs/stylex";

export const theme = stylex.defineVars({
  "--neutral-1": "var(--gray-1)",
  "--neutral-2": "var(--gray-2)",
  "--neutral-3": "var(--gray-3)",
  "--neutral-4": "var(--gray-4)",
  "--neutral-5": "var(--gray-5)",
  "--neutral-6": "var(--gray-6)",
  "--neutral-7": "var(--gray-7)",
  "--neutral-8": "var(--gray-8)",
  "--neutral-9": "var(--gray-9)",
  "--neutral-10": "var(--gray-10)",
  "--neutral-11": "var(--gray-11)",
  "--neutral-12": "var(--gray-12)",
  "--neutral-a1": "var(--gray-a1)",
  "--neutral-a2": "var(--gray-a2)",
  "--neutral-a3": "var(--gray-a3)",
  "--neutral-a4": "var(--gray-a4)",
  "--neutral-a5": "var(--gray-a5)",
  "--neutral-a6": "var(--gray-a6)",
  "--neutral-a7": "var(--gray-a7)",
  "--neutral-a8": "var(--gray-a8)",
  "--neutral-a9": "var(--gray-a9)",
  "--neutral-a10": "var(--gray-a10)",
  "--neutral-a11": "var(--gray-a11)",
  "--neutral-a12": "var(--gray-a12)",
  "--accent-1": "var(--neutral-1)",
  "--accent-2": "var(--neutral-2)",
  "--accent-3": "var(--neutral-3)",
  "--accent-4": "var(--neutral-4)",
  "--accent-5": "var(--neutral-5)",
  "--accent-6": "var(--neutral-6)",
  "--accent-7": "var(--neutral-7)",
  "--accent-8": "var(--neutral-8)",
  "--accent-9": "var(--neutral-9)",
  "--accent-10": "var(--neutral-10)",
  "--accent-11": "var(--neutral-11)",
  "--accent-12": "var(--neutral-12)",
  "--accent-a1": "var(--neutral-a1)",
  "--accent-a2": "var(--neutral-a2)",
  "--accent-a3": "var(--neutral-a3)",
  "--accent-a4": "var(--neutral-a4)",
  "--accent-a5": "var(--neutral-a5)",
  "--accent-a6": "var(--neutral-a6)",
  "--accent-a7": "var(--neutral-a7)",
  "--accent-a8": "var(--neutral-a8)",
  "--accent-a9": "var(--neutral-a9)",
  "--accent-a10": "var(--neutral-a10)",
  "--accent-a11": "var(--neutral-a11)",
  "--accent-a12": "var(--neutral-a12)",
  "--accent-contrast": "var(--neutral-1)",
  // Roles: what components ask for, valued by a scale step.
  "--background": "var(--neutral-1)",
  "--sidebar": "var(--neutral-2)",
  "--text-primary": "var(--neutral-12)",
  "--text-secondary": "var(--neutral-11)",
  // Halfway to secondary: gray-10 is too faint for small labels, gray-11 would merge with secondary.
  "--text-muted": "color-mix(in oklab, var(--neutral-10), var(--neutral-11))",
  "--fill-subtle": "var(--neutral-a2)",
  "--fill": "var(--neutral-a3)",
  "--fill-strong": "var(--neutral-a4)",
  "--fill-opaque": "var(--neutral-3)",
  // Edges are solid steps: a translucent one shows whatever it crosses.
  "--border-subtle": "var(--neutral-4)",
  "--border": "var(--neutral-6)",
  // A control's own edge, like an empty checkbox's: 3:1 on the page, as WCAG asks of controls.
  "--border-strong": "var(--neutral-9)",
  "--inverted-solid": "var(--neutral-12)",
  "--inverted-on-solid": "var(--neutral-1)",
  "--font-mono":
    '"Geist Mono Variable", "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace',
  "--font-sans":
    '"Inter Variable", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  "--overlay": "var(--black-a5)",
  "--accent-solid": "var(--neutral-12)",
  "--accent-on-solid": "var(--neutral-1)",
  "--focus-ring": "var(--neutral-8)",
  "--selection": "var(--neutral-a5)",
  "--radius": "0.5rem",
  "--size-control-xxs": "1.25rem",
  "--size-control-xs": "1.5rem",
  "--size-control-sm": "1.75rem",
  "--size-control-md": "2rem",
  "--size-control-lg": "2.25rem",
  "--space-xs": "0.5rem",
  "--space-sm": "0.75rem",
  "--space-md": "1rem",
  "--space-lg": "1.5rem",
  "--space-xl": "3rem",
});
