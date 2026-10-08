// Ported from Radix Colors' custom palette generator (MIT, Copyright (c) 2024 WorkOS):
// https://github.com/radix-ui/website/blob/main/components/generate-radix-colors.tsx
// Changed for colorjs.io 0.7, where an undefined hue is `null`, not `NaN`.
import * as RadixColors from "@radix-ui/colors";
import BezierEasing from "bezier-easing";
import Color from "colorjs.io";

type Scale = Color[];

const grayScaleNames = [
  "gray",
  "mauve",
  "slate",
  "sage",
  "olive",
  "sand",
] as const;

const scaleNames = [
  ...grayScaleNames,
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
  "brown",
  "orange",
  "sky",
  "mint",
  "lime",
  "yellow",
  "amber",
] as const;

type ScaleName = (typeof scaleNames)[number];
type Appearance = "dark" | "light";

const radix = new Map<string, Record<string, string>>(
  Object.entries(RadixColors)
);

function load(name: string): Scale {
  return Object.values(radix.get(name) ?? {}).map((value) =>
    new Color(value).to("oklch")
  );
}

function loadAll(names: readonly ScaleName[], suffix: string) {
  return Object.fromEntries(
    names.map((name) => [name, load(`${name}${suffix}`)])
  );
}

const scales = {
  dark: loadAll(scaleNames, "DarkP3"),
  light: loadAll(scaleNames, "P3"),
};
const grayScales = {
  dark: loadAll(grayScaleNames, "DarkP3"),
  light: loadAll(grayScaleNames, "P3"),
};

const darkModeEasing = [1, 0, 1, 0] as const;
const lightModeEasing = [0, 2, 0, 2] as const;

const grays = new Set<string>(grayScaleNames);
const isGray = (name = "") => grays.has(name);

const lightness = (color: Color) => color.coords[0] ?? 0;
const chroma = (color: Color) => color.coords[1] ?? 0;
const hue = (color: Color) => color.coords[2];

function oklch(L: number, C: number, H: number | null) {
  return new Color("oklch", [L, C, H]);
}

function transposeProgressionStart(
  to: number,
  values: number[],
  [x1, y1, x2, y2]: readonly number[]
) {
  const ease = BezierEasing(x1 ?? 0, y1 ?? 0, x2 ?? 0, y2 ?? 0);
  const lastIndex = values.length - 1;
  const diff = (values[0] ?? 0) - to;
  return values.map(
    (value, index) => value - diff * ease(1 - index / lastIndex)
  );
}

interface Nearest {
  color: Color;
  distance: number;
  scale: string;
}

/** The two scales nearest the source; a second gray is skipped, since grays sit too close to say anything about direction. */
function nearestTwo(source: Color, candidates: Record<string, Scale>) {
  const all: Nearest[] = [];
  for (const [scale, colors] of Object.entries(candidates)) {
    for (const color of colors) {
      all.push({ color, distance: source.deltaEOK(color), scale });
    }
  }
  const closest = all
    .toSorted((a, b) => a.distance - b.distance)
    .filter(
      (entry, index, list) =>
        index === list.findIndex((other) => other.scale === entry.scale)
    );

  const allGrays = closest.every((entry) => isGray(entry.scale));
  if (!allGrays && isGray(closest[0]?.scale)) {
    while (isGray(closest[1]?.scale)) {
      closest.splice(1, 1);
    }
  }

  const [first, second] = closest;
  if (first === undefined || second === undefined) {
    throw new Error("No reference scales to match the color against.");
  }
  return [first, second] as const;
}

/** How much of the second scale to mix in: the source's foot on the line between the two, by the triangle they make; 0 when it falls past the first. */
function mixRatio(first: Nearest, second: Nearest) {
  const a = second.distance;
  const b = first.distance;
  const c = first.color.deltaEOK(second.color);
  const cosA = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c);
  const cosB = (a ** 2 + c ** 2 - b ** 2) / (2 * a * c);
  const tanC1 = cosA / Math.sin(Math.acos(cosA));
  const tanC2 = cosB / Math.sin(Math.acos(cosB));
  const ratio = Math.max(0, tanC1 / tanC2) * 0.5;
  // A source sitting on a scale color makes a degenerate triangle: take that scale whole.
  return Number.isFinite(ratio) ? ratio : 0;
}

/** Moves the scale's lightness so its first step lands on the background. */
function fitLightness(scale: Scale, background: Color): Scale {
  const backgroundL = Math.max(0, Math.min(1, lightness(background)));
  const step1L = lightness(scale[0] ?? background);

  let next: number[];
  if (step1L > 0.5) {
    // White as a first step, dropped after.
    next = transposeProgressionStart(
      backgroundL,
      [1, ...scale.map(lightness)],
      lightModeEasing
    ).slice(1);
  } else {
    // A background lighter than step 1 eases the curve toward linear.
    const ratioL = backgroundL / step1L;
    const maxRatio = 1.5;
    const metaRatio = (ratioL - 1) * (maxRatio / (maxRatio - 1));
    const ease = darkModeEasing.map((value) => {
      if (ratioL <= 1) {
        return value;
      }
      return ratioL > maxRatio ? 0 : Math.max(0, value * (1 - metaRatio));
    });
    next = transposeProgressionStart(
      lightness(background),
      scale.map(lightness),
      ease
    );
  }

  return scale.map((color, index) =>
    oklch(next[index] ?? lightness(color), chroma(color), hue(color))
  );
}

function getScaleFromColor(
  source: Color,
  candidates: Record<string, Scale>,
  background: Color
): Scale {
  const [first, second] = nearestTwo(source, candidates);
  const ratio = mixRatio(first, second);
  const scaleA = candidates[first.scale] ?? [];
  const scaleB = candidates[second.scale] ?? [];
  const mixed = scaleA.map((color, index) =>
    Color.mix(color, scaleB[index] ?? color, ratio).to("oklch")
  );

  // Take the source's hue, and its chroma relative to the nearest step.
  const base =
    mixed.toSorted((x, y) => source.deltaEOK(x) - source.deltaEOK(y))[0] ??
    source;
  // Older colorjs.io read NaN as 0; a pure gray base has no chroma to scale from.
  const ratioC = chroma(base) === 0 ? 0 : chroma(source) / chroma(base);
  const tinted = mixed.map((color) =>
    oklch(
      lightness(color),
      Math.min(chroma(source) * 1.5, chroma(color) * ratioC),
      hue(source)
    )
  );

  return fitLightness(tinted, background);
}

function getTextColor(background: Color) {
  const white = new Color("oklch", [1, 0, 0]);
  if (Math.abs(white.contrastAPCA(background)) < 40) {
    return oklch(
      0.25,
      Math.max(0.08 * chroma(background), 0.04),
      hue(background)
    );
  }
  return white;
}

function getStep9Colors(scale: Scale, base: Color): [Color, Color] {
  const step1 = scale[0] ?? base;
  const step9 = scale[8] ?? base;
  // A base this close to the page (white on white) gets the scale's own step 9.
  if (base.deltaEOK(step1) * 100 < 25) {
    return [step9, getTextColor(step9)];
  }
  return [base, getTextColor(base)];
}

function getButtonHoverColor(source: Color, scale: Scale) {
  const [L = 0, C = 0, H] = source.coords.map((value) => value ?? undefined);
  const nextL = L > 0.4 ? L - 0.03 / (L + 0.1) : L + 0.03 / (L + 0.1);
  const nextC = L > 0.4 && H !== undefined ? C * 0.93 : C;
  const hover = oklch(nextL, nextC, H ?? null);

  // The nearest scale color donates chroma and hue, so a pure black or white base still
  // takes a tinted gray's tint.
  let nearest = hover;
  let minDistance = Number.POSITIVE_INFINITY;
  for (const color of scale) {
    const distance = hover.deltaEOK(color);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = color;
    }
  }
  return oklch(nextL, chroma(nearest), hue(nearest));
}

// Browsers blend each channel rounded, not the result as a whole.
function blendAlpha(foreground: number, alpha: number, background: number) {
  return Math.round(background * (1 - alpha)) + Math.round(foreground * alpha);
}

// target = background * (1 - alpha) + foreground * alpha, solved for the least alpha.
function getAlphaColor(
  targetRgb: number[],
  backgroundRgb: number[],
  rgbPrecision: number,
  alphaPrecision: number,
  targetAlpha?: number
) {
  const [tr = 0, tg = 0, tb = 0] = targetRgb.map((value) =>
    Math.round(value * rgbPrecision)
  );
  const [br = 0, bg = 0, bb = 0] = backgroundRgb.map((value) =>
    Math.round(value * rgbPrecision)
  );

  // Lighten the page if any channel of the target is lighter, else darken it.
  const desired = tr > br || tg > bg || tb > bb ? rgbPrecision : 0;

  const alphaR = (tr - br) / (desired - br);
  const alphaG = (tg - bg) / (desired - bg);
  const alphaB = (tb - bb) / (desired - bb);

  if (targetAlpha === undefined && alphaR === alphaG && alphaG === alphaB) {
    const value = desired / rgbPrecision;
    return [value, value, value, alphaR] as const;
  }

  const clampRgb = (n: number) =>
    Number.isNaN(n) ? 0 : Math.min(rgbPrecision, Math.max(0, n));
  const clampA = (n: number) =>
    Number.isNaN(n) ? 0 : Math.min(alphaPrecision, Math.max(0, n));
  const maxAlpha = targetAlpha ?? Math.max(alphaR, alphaG, alphaB);

  const A = clampA(Math.ceil(maxAlpha * alphaPrecision)) / alphaPrecision;
  const solve = (t: number, bgc: number) => {
    let value = Math.ceil(clampRgb(((bgc * (1 - A) - t) / A) * -1));
    const blended = blendAlpha(value, A, bgc);
    // Correct rounding, toward the target, on the side being blended toward.
    const off = desired === 0 ? t <= bgc : t >= bgc;
    if (off && t !== blended) {
      value = t > blended ? value + 1 : value - 1;
    }
    return value / rgbPrecision;
  };

  return [solve(tr, br), solve(tg, bg), solve(tb, bb), A] as const;
}

function channels(color: string, space: "p3" | "srgb") {
  return new Color(color).to(space).coords.map((value) => value ?? 0);
}

function longHex(hex: string) {
  if (hex.length === 4 || hex.length === 5) {
    return `#${Array.from(hex.slice(1), (char) => char + char).join("")}`;
  }
  return hex;
}

function toHex(color: Color) {
  return longHex(color.to("srgb").toString({ format: "hex" }));
}

function getAlphaColorSrgb(
  target: string,
  background: string,
  targetAlpha?: number
) {
  const [r, g, b, a] = getAlphaColor(
    channels(target, "srgb"),
    channels(background, "srgb"),
    255,
    255,
    targetAlpha
  );
  return longHex(new Color("srgb", [r, g, b], a).toString({ format: "hex" }));
}

function getAlphaColorP3(target: string, background: string) {
  const [r, g, b, a] = getAlphaColor(
    channels(target, "p3"),
    channels(background, "p3"),
    255,
    1000
  );
  return new Color("p3", [r, g, b], a)
    .toString({ precision: 4 })
    .replace("color(p3 ", "color(display-p3 ");
}

// Lightness as a percentage: https://github.com/radix-ui/themes/issues/420
function toOklchString(color: Color) {
  const L = Number((lightness(color) * 100).toFixed(1));
  return color
    .to("oklch")
    .toString({ precision: 4 })
    .replace(/(?<head>\S+)(?<rest>.+)/u, `oklch(${L}%$<rest>`);
}

interface Palette {
  accent: string[];
  accentAlpha: string[];
  accentAlphaP3: string[];
  accentContrast: string;
  accentP3: string[];
  gray: string[];
  grayAlpha: string[];
  grayAlphaP3: string[];
  grayP3: string[];
}

/** Twelve-step accent and gray scales, solid and alpha, sRGB and P3, for one appearance. */
function generatePalette({
  accent,
  appearance,
  background,
  gray,
}: {
  accent: string;
  appearance: Appearance;
  background: string;
  gray: string;
}): Palette {
  const backgroundColor = new Color(background).to("oklch");
  const backgroundHex = toHex(backgroundColor);
  const grayScale = getScaleFromColor(
    new Color(gray).to("oklch"),
    grayScales[appearance],
    backgroundColor
  );

  const accentBase = new Color(accent).to("oklch");
  const accentBaseHex = toHex(accentBase);
  // Pure black or white takes the gray's tint.
  const matched =
    accentBaseHex === "#000000" || accentBaseHex === "#ffffff"
      ? grayScale
      : getScaleFromColor(accentBase, scales[appearance], backgroundColor);

  const [step9, contrast] = getStep9Colors(matched, accentBase);
  const withStep9 = matched.map((color, index) =>
    index === 8 ? step9 : color
  );
  const hover = getButtonHoverColor(step9, withStep9);
  // Text steps get no more chroma than the solid ones.
  const cap = Math.max(chroma(step9), chroma(withStep9[7] ?? step9));
  const accentScale = withStep9.map((color, index) => {
    if (index === 9) {
      return hover;
    }
    if (index >= 10) {
      return oklch(lightness(color), Math.min(cap, chroma(color)), hue(color));
    }
    return color;
  });

  const accentHex = accentScale.map(toHex);
  const grayHex = grayScale.map(toHex);

  return {
    accent: accentHex,
    accentAlpha: accentHex.map((hex) => getAlphaColorSrgb(hex, backgroundHex)),
    accentAlphaP3: accentHex.map((hex) => getAlphaColorP3(hex, backgroundHex)),
    accentContrast: toHex(contrast),
    accentP3: accentScale.map(toOklchString),
    gray: grayHex,
    grayAlpha: grayHex.map((hex) => getAlphaColorSrgb(hex, backgroundHex)),
    grayAlphaP3: grayHex.map((hex) => getAlphaColorP3(hex, backgroundHex)),
    grayP3: grayScale.map(toOklchString),
  };
}

export { generatePalette, grayScaleNames };
export type { Appearance, Palette };
