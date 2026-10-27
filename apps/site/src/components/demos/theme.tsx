import * as RadixColors from "@radix-ui/colors";
import * as stylex from "@stylexjs/stylex";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
} from "@/components/ai/code-block";
import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";
import { Checkbox } from "@/components/primitives/checkbox";
import { CopyButton } from "@/components/primitives/copy-button";
import { Field, FieldLabel } from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import { Label } from "@/components/primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import {
  Slider,
  SliderControl,
  SliderLabel,
  SliderValue,
} from "@/components/primitives/slider";
import { Switch } from "@/components/primitives/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/primitives/tabs";
import { radii, sizes, space } from "@/lib/constella/tokens.stylex";
import { Stage } from "~/components/demos/frame";
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
  DepthPreset,
  RadiusPreset,
  ScalingPreset,
  ThemeName,
} from "~/lib/theme-css";
import { shadows } from "~/lib/tokens.stylex";

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

const depthLabels = {
  raised: "Raised",
  flat: "Flat",
} satisfies Record<DepthPreset, string>;

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
    maxHeight: 240,
    overflowY: "auto",
    scrollbarWidth: "none",
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
  const [depth, setDepth] = useState<DepthPreset>("raised");

  const options = useDeferredValue({ accent, depth, radius, scaling, theme });
  const file = useMemo(() => generateThemeFile(options), [options]);
  const scalesCss = useScalesCss(themeScales(options));
  const preview = `${scalesCss}\n${previewCss(options)}`;

  return (
    <>
      <style>{preview}</style>
      <Stage
        controls={
          <>
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
                    {...stylex.props(
                      styles.swatch(swatch(themes[name].accent))
                    )}
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
            <Field>
              <FieldLabel>Depth</FieldLabel>
              <Select
                items={depthLabels}
                onValueChange={(value) => {
                  if (value !== null) {
                    setDepth(value);
                  }
                }}
                value={depth}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(depthLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </>
        }
      >
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
      <CodeBlock>
        <CodeBlockContent sx={styles.output}>{file}</CodeBlockContent>
        <CodeBlockActions>
          <CopyButton aria-label="Copy theme.stylex.ts" value={file} />
        </CodeBlockActions>
      </CodeBlock>
    </>
  );
}

export { ThemeBuilderDemo };
