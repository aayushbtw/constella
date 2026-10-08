import * as RadixColors from "@radix-ui/colors";
import Color from "colorjs.io";

import { generatePalette } from "~/lib/palette";
import type { Palette } from "~/lib/palette";

const grayFlavors = {
  gray: RadixColors.gray.gray9,
  mauve: RadixColors.mauve.mauve9,
  olive: RadixColors.olive.olive9,
  sage: RadixColors.sage.sage9,
  sand: RadixColors.sand.sand9,
  slate: RadixColors.slate.slate9,
} as const;

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

type GrayFlavor = keyof typeof grayFlavors;
type RadiusPreset = keyof typeof radiusPresets;
type ScalingPreset = keyof typeof scalingPresets;

interface ThemeOptions {
  /** Any CSS color. Near-gray reads as monochrome: the accent becomes the gray ink. */
  accent: string;
  gray: GrayFlavor;
  /** The `data-theme` value on `<html>`. */
  name: string;
  radius: RadiusPreset;
  scaling: ScalingPreset;
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

function colorLines(palette: Palette, wide: boolean) {
  return [
    ...steps("gray", wide ? palette.grayP3 : palette.gray),
    ...steps("gray-a", wide ? palette.grayAlphaP3 : palette.grayAlpha),
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

function roleLines(mono: boolean) {
  return mono
    ? [
        "  --accent-solid: var(--gray-12);",
        "  --on-accent: var(--gray-1);",
        "  --focus-ring: var(--gray-a8);",
        "  --selection: var(--gray-a5);",
      ]
    : [
        "  --accent-solid: var(--accent-9);",
        "  --on-accent: var(--accent-contrast);",
        "  --focus-ring: var(--accent-a8);",
        "  --selection: var(--accent-a5);",
      ];
}

function layoutLines(radius: RadiusPreset, scaling: ScalingPreset) {
  const { controls, space } = scalingPresets[scaling];
  return [
    `  --radius: ${radiusPresets[radius]}px;`,
    ...Object.entries(controls).map(
      ([size, value]) => `  --size-control-${size}: ${value}px;`
    ),
    ...Object.entries(space).map(
      ([size, value]) => `  --space-${size}: ${value}px;`
    ),
  ];
}

/** A theme's CSS: put it in your global CSS and set `data-theme` on `<html>`. */
function generateThemeCss({
  accent,
  gray,
  name,
  radius,
  scaling,
}: ThemeOptions) {
  const light = generatePalette({
    accent,
    appearance: "light",
    background: backgrounds.light,
    gray: grayFlavors[gray],
  });
  const dark = generatePalette({
    accent,
    appearance: "dark",
    background: backgrounds.dark,
    gray: grayFlavors[gray],
  });

  const lightSelector = `:root[data-theme="${name}"]`;
  const darkSelector = `:root.dark[data-theme="${name}"]`;

  return [
    `/* Constella theme "${name}": ${accent}, ${gray}, ${radius} radius, ${scaling} */`,
    block(lightSelector, [
      ...roleLines(isMonochrome(accent)),
      ...layoutLines(radius, scaling),
      ...colorLines(light, false),
    ]),
    block(darkSelector, colorLines(dark, false)),
    "@supports (color: color(display-p3 1 1 1)) {",
    "  @media (color-gamut: p3) {",
    block(lightSelector, colorLines(light, true), "    "),
    block(darkSelector, colorLines(dark, true), "    "),
    "  }",
    "}",
    "",
  ].join("\n");
}

export { generateThemeCss, grayFlavors, radiusPresets, scalingPresets };
export type { GrayFlavor, RadiusPreset, ScalingPreset, ThemeOptions };
