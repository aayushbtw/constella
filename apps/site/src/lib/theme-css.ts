import * as RadixColors from "@radix-ui/colors";
import Color from "colorjs.io";

import { generatePalette } from "~/lib/palette";
import type { Palette } from "~/lib/palette";

// Named after stars, each hinting at its color. A theme is colors only: its grays and a
// default accent; radius and sizing are chosen on top. Polaris, the fixed point the rest are
// read from, is the default that base.css ships, so it emits only what changes.
const themes = {
  polaris: {
    accent: "#111111",
    description: "Neutral gray, ink accent. The default.",
    gray: RadixColors.gray.gray9,
    label: "Polaris",
  },
  vega: {
    accent: "#3e63dd",
    description: "Cool slate grays, indigo accent. A blue-white star.",
    gray: RadixColors.slate.slate9,
    label: "Vega",
  },
  antares: {
    accent: "#f76b15",
    description: "Warm sand grays, orange accent. A red supergiant.",
    gray: RadixColors.sand.sand9,
    label: "Antares",
  },
} as const;

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
  /** Any CSS color. Near-gray reads as monochrome: the accent becomes the gray ink. */
  accent: string;
  radius: RadiusPreset;
  scaling: ScalingPreset;
  /** Its colors, and the `data-theme` value on `<html>`. */
  theme: ThemeName;
}

const backgrounds = { dark: "#111111", light: "#ffffff" } as const;

// Below this OKLCH chroma a color reads as gray, so it takes the ink accent.
const monoChroma = 0.03;

function isMonochrome(accent: string) {
  return (new Color(accent).to("oklch").coords[1] ?? 0) < monoChroma;
}

function steps(prefix: string, values: string[]) {
  return values.map((value, index) => `  --${prefix}-${index + 1}: ${value};`);
}

function grayLines(palette: Palette, wide: boolean) {
  return [
    ...steps("gray", wide ? palette.grayP3 : palette.gray),
    ...steps("gray-a", wide ? palette.grayAlphaP3 : palette.grayAlpha),
  ];
}

function accentLines(palette: Palette, wide: boolean) {
  return [
    ...steps("accent", wide ? palette.accentP3 : palette.accent),
    ...steps("accent-a", wide ? palette.accentAlphaP3 : palette.accentAlpha),
    ...(wide ? [] : [`  --accent-contrast: ${palette.accentContrast};`]),
  ];
}

function block(selector: string, lines: string[], indent = "") {
  return [
    `${indent}${selector} {`,
    ...lines.map((line) => `${indent}${line}`),
    `${indent}}`,
  ].join("\n");
}

// The accent takes over the roles that carry it; a monochrome one leaves base.css's ink.
const accentRoles = [
  "  --accent-solid: var(--accent-9);",
  "  --on-accent: var(--accent-contrast);",
  "  --focus-ring: var(--accent-a8);",
  "  --selection: var(--accent-a5);",
];

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

/** A theme's CSS: put it in your global CSS and set `data-theme` on `<html>`. */
function generateThemeCss({ accent, radius, scaling, theme }: ThemeOptions) {
  const { gray } = themes[theme];
  const ownGrays = theme !== defaultTheme;
  const mono = isMonochrome(accent);

  const light = generatePalette({
    accent,
    appearance: "light",
    background: backgrounds.light,
    gray,
  });
  const dark = generatePalette({
    accent,
    appearance: "dark",
    background: backgrounds.dark,
    gray,
  });

  const colors = (palette: Palette, wide: boolean) => [
    ...(ownGrays ? grayLines(palette, wide) : []),
    ...(mono ? [] : accentLines(palette, wide)),
  ];
  const lightLines = [
    ...(mono ? [] : accentRoles),
    ...layoutLines(radius, scaling),
    ...colors(light, false),
  ];

  const header = `/* Constella theme "${theme}": ${accent}, ${radius} radius, ${scaling} sizing */`;
  if (lightLines.length === 0) {
    return `/* Constella theme "${theme}" is the default: no CSS needed. */\n`;
  }

  const lightSelector = `:root[data-theme="${theme}"]`;
  const darkSelector = `:root.dark[data-theme="${theme}"]`;
  const hasColors = colors(light, false).length > 0;

  return [
    header,
    block(lightSelector, lightLines),
    ...(hasColors
      ? [
          block(darkSelector, colors(dark, false)),
          "@supports (color: color(display-p3 1 1 1)) {",
          "  @media (color-gamut: p3) {",
          block(lightSelector, colors(light, true), "    "),
          block(darkSelector, colors(dark, true), "    "),
          "  }",
          "}",
        ]
      : []),
    "",
  ].join("\n");
}

export {
  defaultTheme,
  generateThemeCss,
  radiusPresets,
  scalingPresets,
  themes,
};
export type { RadiusPreset, ScalingPreset, ThemeName, ThemeOptions };
