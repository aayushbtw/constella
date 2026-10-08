// Themes are Radix Colors scales by name, so a theme only maps them onto our roles.
// Radix's dark files switch on `.dark`, so one block covers both appearances.

const grays = ["gray", "mauve", "slate", "sage", "olive", "sand"] as const;

const accents = [
  "tomato",
  "red",
  "ruby",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "bronze",
  "gold",
  "brown",
  "orange",
  "amber",
  "yellow",
  "lime",
  "mint",
  "sky",
] as const;

type Gray = (typeof grays)[number];
// `ink` is the monochrome accent: the gray scale's step 12.
type Accent = (typeof accents)[number] | "ink";

// Step 9 of these is light in both appearances, so text on it is dark (Radix Themes' values).
const darkText: Partial<Record<Accent, string>> = {
  amber: "#21201c",
  lime: "#1d211c",
  mint: "#1a211e",
  sky: "#1c2024",
  yellow: "#21201c",
};

// Named after stars, each hinting at its color. A theme is colors only: its grays and a
// default accent; radius and sizing are chosen on top. Polaris, the fixed point the rest are
// read from, is the default that base.css ships, so it emits only what changes.
const themes = {
  polaris: {
    accent: "ink",
    description: "Neutral gray, ink accent. The default.",
    gray: "gray",
    label: "Polaris",
  },
  vega: {
    accent: "indigo",
    description: "Cool slate grays, indigo accent. A blue-white star.",
    gray: "slate",
    label: "Vega",
  },
  antares: {
    accent: "orange",
    description: "Warm sand grays, orange accent. A red supergiant.",
    gray: "sand",
    label: "Antares",
  },
} as const satisfies Record<
  string,
  { accent: Accent; description: string; gray: Gray; label: string }
>;

const defaultTheme = "polaris";

// The control radius; base.css derives the rest from it.
const radiusPresets = {
  none: 0,
  small: 6,
  medium: 8,
  large: 12,
} as const;

// Control heights step by 2px so every size keeps an even height and its icon a whole pixel.
const scalingPresets = {
  compact: {
    controls: { lg: 34, md: 30, sm: 26, xs: 22, xxs: 18 },
    space: { lg: 20, md: 14, sm: 10, xl: 40, xs: 6 },
  },
  default: {
    controls: { lg: 36, md: 32, sm: 28, xs: 24, xxs: 20 },
    space: { lg: 24, md: 16, sm: 12, xl: 48, xs: 8 },
  },
  spacious: {
    controls: { lg: 38, md: 34, sm: 30, xs: 26, xxs: 22 },
    space: { lg: 28, md: 18, sm: 14, xl: 56, xs: 10 },
  },
} as const;

type ThemeName = keyof typeof themes;
type RadiusPreset = keyof typeof radiusPresets;
type ScalingPreset = keyof typeof scalingPresets;

interface ThemeOptions {
  accent: Accent;
  radius: RadiusPreset;
  scaling: ScalingPreset;
  /** Its grays, and the `data-theme` value on `<html>`. */
  theme: ThemeName;
}

const twelve = Array.from({ length: 12 }, (_, index) => index + 1);

function mapScale(role: string, scale: string) {
  return [
    ...twelve.map((step) => `  --${role}-${step}: var(--${scale}-${step});`),
    ...twelve.map((step) => `  --${role}-a${step}: var(--${scale}-a${step});`),
  ];
}

/** The four Radix files a scale needs: light, dark, and their alphas. */
function scaleFiles(scale: string) {
  return [scale, `${scale}-dark`, `${scale}-alpha`, `${scale}-dark-alpha`];
}

function accentLines(accent: Exclude<Accent, "ink">) {
  return [
    ...mapScale("accent", accent),
    `  --accent-contrast: ${darkText[accent] ?? "white"};`,
    "  --accent-solid: var(--accent-9);",
    "  --on-accent: var(--accent-contrast);",
    "  --focus-ring: var(--accent-a8);",
    "  --selection: var(--accent-a5);",
  ];
}

// Only what differs from base.css, so a theme's CSS says what makes it itself.
function layoutLines(radius: RadiusPreset, scaling: ScalingPreset) {
  const { controls, space } = scalingPresets[scaling];
  return [
    ...(radius === "medium" ? [] : [`  --radius: ${radiusPresets[radius]}px;`]),
    ...(scaling === "default"
      ? []
      : [
          ...Object.entries(controls).map(
            ([size, value]) => `  --size-control-${size}: ${value}px;`
          ),
          ...Object.entries(space).map(
            ([size, value]) => `  --space-${size}: ${value}px;`
          ),
        ]),
  ];
}

/** The Radix scales a theme reads, beyond the gray base.css already imports. */
function themeScales({
  accent,
  theme,
}: Pick<ThemeOptions, "accent" | "theme">) {
  const { gray } = themes[theme];
  return [
    ...(gray === "gray" ? [] : [gray]),
    ...(accent === "ink" ? [] : [accent]),
  ];
}

/** A theme's CSS: put it in your global CSS and set `data-theme` on `<html>`. */
function generateThemeCss({ accent, radius, scaling, theme }: ThemeOptions) {
  const { gray } = themes[theme];
  const lines = [
    ...(gray === "gray" ? [] : mapScale("gray", gray)),
    ...(accent === "ink" ? [] : accentLines(accent)),
    ...layoutLines(radius, scaling),
  ];

  if (lines.length === 0) {
    return `/* Constella theme "${theme}" is the default: no CSS needed. */\n`;
  }

  return [
    ...themeScales({ accent, theme }).flatMap((scale) =>
      scaleFiles(scale).map((file) => `@import "@radix-ui/colors/${file}.css";`)
    ),
    "",
    `/* Constella theme "${theme}": ${gray} grays, ${accent} accent, ${radius} radius, ${scaling} sizing */`,
    `:root[data-theme="${theme}"] {`,
    ...lines,
    "}",
    "",
  ].join("\n");
}

export {
  accents,
  defaultTheme,
  generateThemeCss,
  radiusPresets,
  scaleFiles,
  scalingPresets,
  themeScales,
  themes,
};
export type { Accent, RadiusPreset, ScalingPreset, ThemeName, ThemeOptions };
