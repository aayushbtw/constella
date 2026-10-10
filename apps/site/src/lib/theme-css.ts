// A theme is Radix Colors scales by name mapped onto theme.stylex.ts, plus shape and density.
// Radix's dark files switch on `.dark`, so one value covers both appearances.

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
// read from, is the theme.stylex.ts Constella installs.
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
  /** Its grays and default accent. */
  theme: ThemeName;
}

const twelve = Array.from({ length: 12 }, (_, index) => index + 1);

type Entry = readonly [name: string, value: string];

// The same in every theme: they read the scales, which the theme maps.
const roles: Entry[] = [
  ["--background", "var(--neutral-1)"],
  ["--sidebar", "var(--neutral-2)"],
  ["--text-primary", "var(--neutral-12)"],
  ["--text-secondary", "var(--neutral-11)"],
  ["--fill-subtle", "var(--neutral-a2)"],
  ["--fill", "var(--neutral-a3)"],
  ["--fill-strong", "var(--neutral-a4)"],
  ["--fill-opaque", "var(--neutral-3)"],
  ["--edge-subtle", "var(--neutral-a4)"],
  ["--edge", "var(--neutral-a6)"],
  ["--inverted", "var(--neutral-12)"],
  ["--on-inverted", "var(--neutral-1)"],
  [
    "--font-mono",
    '"Geist Mono Variable", "Geist Mono", ui-monospace, "SF Mono", Menlo, monospace',
  ],
  [
    "--font-sans",
    '"Inter Variable", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
  ],
  ["--overlay", "var(--black-a5)"],
];

// A font stack quotes its family names, so its value takes the other quote.
const literal = (value: string) =>
  value.includes('"') ? `'${value}'` : `"${value}"`;

function scaleEntries(role: string, scale: string): Entry[] {
  return [
    ...twelve.map((step): Entry => [
      `--${role}-${step}`,
      `var(--${scale}-${step})`,
    ]),
    ...twelve.map((step): Entry => [
      `--${role}-a${step}`,
      `var(--${scale}-a${step})`,
    ]),
  ];
}

/** The four Radix files a scale needs: light, dark, and their alphas. */
function scaleFiles(scale: string) {
  return [scale, `${scale}-dark`, `${scale}-alpha`, `${scale}-dark-alpha`];
}

/** Every variable in theme.stylex.ts, in its order, for these choices. */
function themeEntries({ accent, radius, scaling, theme }: ThemeOptions) {
  const { gray } = themes[theme];
  const ink = accent === "ink";
  const { controls, space } = scalingPresets[scaling];
  return [
    ...scaleEntries("neutral", gray),
    ...scaleEntries("accent", ink ? "neutral" : accent),
    [
      "--accent-contrast",
      ink ? "var(--neutral-1)" : (darkText[accent] ?? "white"),
    ],
    ...roles,
    ["--accent-solid", ink ? "var(--neutral-12)" : "var(--accent-9)"],
    ["--on-accent", ink ? "var(--neutral-1)" : "var(--accent-contrast)"],
    ["--focus-ring", ink ? "var(--neutral-a8)" : "var(--accent-a8)"],
    ["--selection", ink ? "var(--neutral-a5)" : "var(--accent-a5)"],
    ["--radius", `${radiusPresets[radius]}px`],
    ...(["xxs", "xs", "sm", "md", "lg"] as const).map((size): Entry => [
      `--size-control-${size}`,
      `${controls[size]}px`,
    ]),
    ...(["xs", "sm", "md", "lg", "xl"] as const).map((size): Entry => [
      `--space-${size}`,
      `${space[size]}px`,
    ]),
  ] satisfies Entry[];
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

/** A complete theme.stylex.ts for these choices, to replace the one Constella installs. */
function generateThemeFile(options: ThemeOptions) {
  const { accent, radius, scaling, theme } = options;
  return [
    `// ${themes[theme].label}: ${themes[theme].gray} grays, ${accent} accent, ${radius} radius, ${scaling} sizing.`,
    ...themeScales(options).flatMap((scale) =>
      scaleFiles(scale).map((file) => `import "@radix-ui/colors/${file}.css";`)
    ),
    'import * as stylex from "@stylexjs/stylex";',
    "",
    "export const theme = stylex.defineVars({",
    ...themeEntries(options).map(
      ([name, value]) => `  "${name}": ${literal(value)},`
    ),
    "});",
    "",
  ].join("\n");
}

/** The same values as CSS, for the builder's live preview over the installed defaults. */
function previewCss(options: ThemeOptions) {
  return [
    ":root:root {",
    ...themeEntries(options).map(([name, value]) => `  ${name}: ${value};`),
    "}",
  ].join("\n");
}

export {
  accents,
  defaultTheme,
  generateThemeFile,
  previewCss,
  radiusPresets,
  scaleFiles,
  scalingPresets,
  themeScales,
  themes,
};
export type { Accent, RadiusPreset, ScalingPreset, ThemeName, ThemeOptions };
