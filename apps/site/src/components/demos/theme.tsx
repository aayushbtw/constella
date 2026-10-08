import * as stylex from "@stylexjs/stylex";
import Color from "colorjs.io";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { defaultTheme, generateThemeCss, themes } from "~/lib/theme-css";
import type { RadiusPreset, ScalingPreset, ThemeName } from "~/lib/theme-css";
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

function parseColor(value: string) {
  try {
    return new Color(value)
      .to("srgb")
      .toString({ collapse: false, format: "hex" });
  } catch {
    return null;
  }
}

// Set on <html> while the builder is open, so popups and the site around the demo wear
// the theme too; the CSS itself renders with the builder.
function useLiveTheme(name: string) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = name;
    return () => {
      delete root.dataset.theme;
    };
  }, [name]);
}

const themeNames = Object.keys(themes).filter((name): name is ThemeName =>
  Object.hasOwn(themes, name)
);

function ThemeBuilderDemo() {
  const [theme, setTheme] = useState<ThemeName>(defaultTheme);
  const [accentInput, setAccentInput] = useState<string>(
    themes[defaultTheme].accent
  );
  const [radius, setRadius] = useState<RadiusPreset>("medium");
  const [scaling, setScaling] = useState<ScalingPreset>("default");

  const parsed = parseColor(accentInput);
  const [accent, setAccent] = useState(parsed ?? themes[defaultTheme].accent);
  if (parsed !== null && parsed !== accent) {
    setAccent(parsed);
  }

  const options = useDeferredValue({ accent, radius, scaling, theme });
  const css = useMemo(() => generateThemeCss(options), [options]);
  useLiveTheme(options.theme);

  return (
    <>
      <style>{css}</style>
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
                setAccentInput(themes[name].accent);
              }}
              size="sm"
              title={themes[name].description}
              variant={theme === name ? "secondary" : "ghost"}
            >
              <span
                data-icon="inline-start"
                {...stylex.props(styles.swatch(themes[name].accent))}
              />
              {themes[name].label}
            </Button>
          ))}
        </div>
        <Field>
          <FieldLabel>Accent</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <span {...stylex.props(styles.swatch(accent))} />
            </InputGroupAddon>
            <InputGroupInput
              aria-invalid={parsed === null}
              onChange={(event) => {
                setAccentInput(event.target.value);
              }}
              spellCheck={false}
              value={accentInput}
            />
          </InputGroup>
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
          <code>{css}</code>
        </pre>
        <CopyButton label="Copy theme" sx={styles.copy} text={() => css} />
      </div>
    </>
  );
}

export { ThemeBuilderDemo };
