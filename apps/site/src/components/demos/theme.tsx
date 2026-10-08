import * as RadixColors from "@radix-ui/colors";
import * as stylex from "@stylexjs/stylex";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider,
  SliderControl,
  SliderLabel,
  SliderValue,
} from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { colors, fontSizes, radii, sizes, space } from "@/lib/tokens.stylex";
import { DemoControls, Stage } from "~/components/demos/frame";
import { CopyButton } from "~/components/docs/copy-button";
import {
  accents,
  defaultTheme,
  generateThemeFile,
  previewCss,
  scaleFiles,
  themes,
  themeScales,
} from "~/lib/theme-css";
import type {
  Accent,
  RadiusPreset,
  ScalingPreset,
  ThemeName,
} from "~/lib/theme-css";
import { fonts, lineHeights, shadows } from "~/lib/tokens.stylex";

const radiusLabels = {
  large: "Large",
  medium: "Medium",
  none: "None",
  small: "Small",
} satisfies Record<RadiusPreset, string>;

const scalingLabels = {
  compact: "Compact",
  default: "Default",
  spacious: "Spacious",
} satisfies Record<ScalingPreset, string>;

const styles = stylex.create({
  preview: {
    display: "grid",
    gap: space.lg,
    maxWidth: 360,
    width: "100%",
  },
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.sm,
  },
  presets: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.xxs,
    gridColumn: "1 / -1",
  },
  swatch: (color: string) => ({
    backgroundColor: color,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
    boxShadow: shadows.inset,
    flexShrink: 0,
    height: sizes.iconSm,
    width: sizes.iconSm,
  }),
  output: {
    backgroundColor: colors.fillSubtle,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    boxShadow: shadows.inset,
    position: "relative",
  },
  pre: {
    color: colors.textSecondary,
    fontFamily: fonts.mono,
    fontSize: fontSizes.xs,
    fontVariantLigatures: "none",
    lineHeight: lineHeights.code,
    marginBlock: 0,
    marginInline: 0,
    maxHeight: 240,
    overflow: "auto",
    paddingBlock: space.sm,
    paddingInlineEnd: `calc(${space.xs} * 2 + ${sizes.controlXs})`,
    paddingInlineStart: space.md,
    scrollbarWidth: "thin",
  },
  copy: {
    insetBlockStart: space.xs,
    insetInlineEnd: space.xs,
    position: "absolute",
  },
});

const radix = new Map<string, Record<string, string>>(
  Object.entries(RadixColors)
);

// Step 9, for a swatch before the scale's CSS has loaded.
function swatch(accent: Accent) {
  return accent === "ink"
    ? RadixColors.gray.gray12
    : (radix.get(accent)?.[`${accent}9`] ?? RadixColors.gray.gray9);
}

const accentItems = Object.fromEntries(
  ["ink", ...accents].map((accent) => [
    accent,
    accent.charAt(0).toUpperCase() + accent.slice(1),
  ])
);

const radixFiles = import.meta.glob<string>(
  "/node_modules/@radix-ui/colors/*.css",
  { import: "default", query: "?inline" }
);

async function loadRadixFile(file: string) {
  const load = radixFiles[`/node_modules/@radix-ui/colors/${file}.css`];
  return load === undefined ? "" : await load();
}

// A theme's `@import`s can't resolve in a runtime <style>, so the preview loads the files.
function useScalesCss(scales: string[]) {
  const key = scales.join(" ");
  const [css, setCss] = useState("");
  useEffect(() => {
    let current = true;
    const files = key === "" ? [] : key.split(" ").flatMap(scaleFiles);
    async function load() {
      const parts = await Promise.all(files.map(loadRadixFile));
      if (current) {
        setCss(parts.join("\n"));
      }
    }
    void load();
    return () => {
      current = false;
    };
  }, [key]);
  return css;
}

const themeNames = Object.keys(themes).filter((name): name is ThemeName =>
  Object.hasOwn(themes, name)
);

function ThemeBuilderDemo() {
  const [theme, setTheme] = useState<ThemeName>(defaultTheme);
  const [accent, setAccent] = useState<Accent>(themes[defaultTheme].accent);
  const [radius, setRadius] = useState<RadiusPreset>("medium");
  const [scaling, setScaling] = useState<ScalingPreset>("default");

  const options = useDeferredValue({ accent, radius, scaling, theme });
  const file = useMemo(() => generateThemeFile(options), [options]);
  const scalesCss = useScalesCss(themeScales(options));
  const preview = `${scalesCss}\n${previewCss(options)}`;

  return (
    <>
      <style>{preview}</style>
      <Stage>
        <div {...stylex.props(styles.preview)}>
          <div {...stylex.props(styles.row)}>
            <Button variant="primary">Save changes</Button>
            <Button variant="outline">Cancel</Button>
            <Badge variant="primary">New</Badge>
          </div>
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
          </Tabs>
          <div {...stylex.props(styles.row)}>
            <Label>
              <Switch defaultChecked />
              Notifications
            </Label>
            <Label>
              <Checkbox defaultChecked />
              Remember me
            </Label>
          </div>
          <Slider defaultValue={60}>
            <SliderLabel>Volume</SliderLabel>
            <SliderValue />
            <SliderControl />
          </Slider>
          <Input placeholder="Email" />
        </div>
      </Stage>
      <DemoControls>
        <div {...stylex.props(styles.presets)}>
          {themeNames.map((name) => (
            <Button
              key={name}
              onClick={() => {
                setTheme(name);
                setAccent(themes[name].accent);
              }}
              size="sm"
              title={themes[name].description}
              variant={theme === name ? "secondary" : "ghost"}
            >
              <span
                data-icon="inline-start"
                {...stylex.props(styles.swatch(swatch(themes[name].accent)))}
              />
              {themes[name].label}
            </Button>
          ))}
        </div>
        <Field>
          <FieldLabel>Accent</FieldLabel>
          <Select
            items={accentItems}
            onValueChange={(value) => {
              if (value !== null) {
                setAccent(value);
              }
            }}
            value={accent}
          >
            <SelectTrigger>
              <span {...stylex.props(styles.swatch(swatch(accent)))} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(["ink", ...accents] as const).map((value) => (
                <SelectItem key={value} value={value}>
                  <span {...stylex.props(styles.swatch(swatch(value)))} />
                  {accentItems[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Radius</FieldLabel>
          <Select
            items={radiusLabels}
            onValueChange={(value) => {
              if (value !== null) {
                setRadius(value);
              }
            }}
            value={radius}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(radiusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Sizing</FieldLabel>
          <Select
            items={scalingLabels}
            onValueChange={(value) => {
              if (value !== null) {
                setScaling(value);
              }
            }}
            value={scaling}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(scalingLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </DemoControls>
      <div {...stylex.props(styles.output)}>
        <pre {...stylex.props(styles.pre)}>
          <code>{file}</code>
        </pre>
        <CopyButton
          label="Copy theme.stylex.ts"
          sx={styles.copy}
          text={() => file}
        />
      </div>
    </>
  );
}

export { ThemeBuilderDemo };
