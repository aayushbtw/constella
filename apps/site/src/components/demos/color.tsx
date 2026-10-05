import * as stylex from "@stylexjs/stylex";
import { useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  colors,
  fontSizes,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { DemoControls, Stage, Well } from "~/components/demos/frame";
import { fonts } from "~/site/tokens.stylex";

const steps = Array.from({ length: 12 }, (_, index) => index + 1);
const hues = ["gray", "red", "amber", "green", "blue"] as const;

type Kind = "edge" | "fill" | "text";
type Theme = "dark" | "light";

// Each token's Radix step, as tokens.stylex.ts sets it. The panel paints steps, not
// tokens: tokens resolve on <html>, steps resolve under the panel's own theme class.
const neutrals = [
  { kind: "text", name: "textPrimary", step: "gray-12" },
  { kind: "text", name: "textSecondary", step: "gray-11" },
  { kind: "text", name: "textMuted", step: "text-muted" },
  { kind: "fill", name: "fillSubtle", step: "gray-a2" },
  { kind: "fill", name: "fill", step: "gray-a3" },
  { kind: "fill", name: "fillStrong", step: "gray-a4" },
  { kind: "edge", name: "edge", step: "gray-a4" },
  { kind: "edge", name: "edgeStrong", step: "gray-a6" },
  { kind: "fill", name: "accent", step: "gray-12" },
] as const satisfies readonly { kind: Kind; name: string; step: string }[];

const statuses = [
  { hue: "red", name: "danger" },
  { hue: "green", name: "success" },
  { hue: "amber", name: "warning" },
  { hue: "blue", name: "info" },
] as const;

const statusParts = [
  { kind: "fill", step: "a2" },
  { kind: "fill", step: "a3" },
  { kind: "edge", step: "a6" },
  // Last, so it lines up with the neutral text swatches above.
  { kind: "text", step: "11" },
] as const satisfies readonly { kind: Kind; step: string }[];

const styles = stylex.create({
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    maxWidth: 480,
    width: "100%",
  },
  scale: {
    alignItems: "center",
    borderRadius: radii.full,
    gap: space.xxs,
    width: "100%",
  },
  hue: {
    backgroundColor: colors.fill,
    borderRadius: radii.full,
    color: colors.textSecondary,
    flexShrink: 0,
    fontFamily: fonts.mono,
    fontSize: fontSizes.xxs,
    lineHeight: sizes.controlXs,
    textAlign: "center",
    width: 56,
  },
  step: {
    aspectRatio: "1",
    borderRadius: radii.full,
    flexBasis: 0,
    flexGrow: 1,
    maxWidth: sizes.controlSm,
  },
  paint: (color: string) => ({
    backgroundColor: color,
  }),
  panelWell: {
    borderRadius: radii.md,
    flexDirection: "column",
    maxWidth: 400,
    width: "100%",
  },
  panel: {
    backgroundColor: "var(--gray-1)",
    borderRadius: radii.sm,
    display: "flex",
    flexDirection: "column",
    paddingBlock: space.xs,
    paddingInline: space.md,
    width: "100%",
  },
  // A rule between neutrals and status, in the panel's own theme.
  group: {
    borderBlockStartColor: "var(--gray-a4)",
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: strokes.border,
    marginBlockStart: space.xs,
    paddingBlockStart: space.xs,
  },
  row: {
    alignItems: "center",
    display: "flex",
    gap: space.md,
    height: sizes.controlLg,
    justifyContent: "space-between",
  },
  name: {
    color: "var(--gray-12)",
    display: "flex",
    fontFamily: fonts.mono,
    fontSize: fontSizes.xxs,
    gap: space.xs,
  },
  value: {
    color: "var(--text-muted)",
  },
  swatches: {
    alignItems: "center",
    display: "flex",
    gap: space.xxs,
  },
  swatch: {
    alignItems: "center",
    borderRadius: radii.full,
    display: "flex",
    fontSize: fontSizes.sm,
    height: sizes.controlXs,
    justifyContent: "center",
    width: 48,
  },
  dot: {
    width: sizes.controlXs,
  },
  text: (color: string) => ({
    color,
  }),
  edge: (color: string) => ({
    borderColor: color,
    borderStyle: "solid",
    borderWidth: strokes.border,
  }),
  fullWidth: {
    width: "100%",
  },
});

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["class"] });
  return () => {
    observer.disconnect();
  };
}

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

// The server can't know the visitor's theme; light until hydrated.
function readServerTheme(): Theme {
  return "light";
}

/** The theme a visitor picked in the demo, else the site's own. */
function useDemoTheme() {
  const site = useSyncExternalStore(
    subscribeToTheme,
    readTheme,
    readServerTheme
  );
  const [picked, setPicked] = useState<Theme | null>(null);

  return [picked ?? site, setPicked] as const;
}

function Swatch({
  color,
  kind,
  sx,
}: {
  color: string;
  kind: Kind;
  sx?: stylex.StyleXStyles;
}) {
  if (kind === "text") {
    return (
      <span {...stylex.props(styles.swatch, styles.text(color), sx)}>Aa</span>
    );
  }

  return (
    <span
      {...stylex.props(
        styles.swatch,
        kind === "edge" ? styles.edge(color) : styles.paint(color),
        sx
      )}
    />
  );
}

interface Row {
  label: string;
  swatches: ReactNode;
  value: string;
}

function ThemedTokens({ groups }: { groups: Row[][] }) {
  const [theme, setTheme] = useDemoTheme();

  return (
    <>
      <Stage>
        <Well sx={styles.panelWell}>
          {/* The class swaps the Radix scale under this panel. */}
          <div className={theme}>
            <div {...stylex.props(styles.panel)}>
              {groups.map((rows, index) => (
                <div
                  key={rows[0]?.label}
                  {...stylex.props(index > 0 && styles.group)}
                >
                  {rows.map(({ label, swatches, value }) => (
                    <div key={label} {...stylex.props(styles.row)}>
                      <span {...stylex.props(styles.name)}>
                        {label}
                        <span {...stylex.props(styles.value)}>{value}</span>
                      </span>
                      <span {...stylex.props(styles.swatches)}>{swatches}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Well>
      </Stage>
      <DemoControls>
        <Tabs
          onValueChange={(value: Theme) => {
            setTheme(value);
          }}
          value={theme}
        >
          <TabsList sx={styles.fullWidth}>
            <TabsTrigger value="light">Light</TabsTrigger>
            <TabsTrigger value="dark">Dark</TabsTrigger>
          </TabsList>
        </Tabs>
      </DemoControls>
    </>
  );
}

function ColorScalesDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.column)}>
        {hues.map((hue) => (
          <Well key={hue} sx={styles.scale}>
            <span {...stylex.props(styles.hue)}>{hue}</span>
            {steps.map((step) => (
              <span
                key={step}
                title={`${hue}-${step}`}
                {...stylex.props(
                  styles.step,
                  styles.paint(`var(--${hue}-${step})`)
                )}
              />
            ))}
          </Well>
        ))}
      </div>
    </Stage>
  );
}

function ColorRolesDemo() {
  return (
    <ThemedTokens
      groups={[
        neutrals.map(({ kind, name, step }) => ({
          label: name,
          swatches: <Swatch color={`var(--${step})`} kind={kind} />,
          value: step === "text-muted" ? "gray-10, dark 10–11" : step,
        })),
        statuses.map(({ hue, name }) => ({
          label: name,
          swatches: statusParts.map(({ kind, step }) => (
            <Swatch
              color={`var(--${hue}-${step})`}
              key={step}
              kind={kind}
              sx={kind === "text" ? null : styles.dot}
            />
          )),
          value: hue,
        })),
      ]}
    />
  );
}

export { ColorRolesDemo, ColorScalesDemo };
