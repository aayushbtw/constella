import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderLabel,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { colors, fontSizes, sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const months = Array.from({ length: 13 }, (_, month) => month);

const styles = stylex.create({
  slider: {
    maxWidth: 280,
    width: "100%",
  },
  vertical: {
    gap: space.lg,
  },
  verticalSlider: {
    height: 160,
  },
  // Inset by half a thumb, like the track, so a mark's percentage lands under the thumb.
  scale: {
    gridColumn: "1 / -1",
    height: space.lg,
    marginInline: `calc(${sizes.thumb} / 2)`,
    position: "relative",
  },
  mark: (position: string) => ({
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    insetBlockStart: 0,
    insetInlineStart: position,
    position: "absolute",
    translate: "-50% 0",
  }),
  tick: {
    backgroundColor: colors.edgeStrong,
    height: space.xxs,
    width: strokes.border,
  },
  tickMajor: {
    backgroundColor: colors.textMuted,
  },
  scaleLabel: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    fontVariantNumeric: "tabular-nums",
  },
  // The middle column sizes to its label, so the 1fr columns either side keep it centered.
  references: {
    color: colors.textMuted,
    display: "grid",
    fontSize: fontSizes.xs,
    fontVariantNumeric: "tabular-nums",
    gridColumn: "1 / -1",
    gridTemplateColumns: "1fr auto 1fr",
  },
  referenceEnd: {
    justifySelf: "end",
  },
  // The value takes the tooltip's text, not its own muted label style.
  bubble: {
    color: "inherit",
    fontSize: "inherit",
  },
  field: {
    alignItems: "center",
    color: colors.textMuted,
    display: "flex",
    fontSize: fontSizes.sm,
    gap: space.xxs,
    gridColumn: 2,
  },
  input: {
    fontSize: fontSizes.sm,
    fontVariantNumeric: "tabular-nums",
    height: sizes.controlXs,
    MozAppearance: "textfield",
    paddingInline: space.xs,
    textAlign: "end",
    width: `calc(${space.lg} * 2)`,
    "::-webkit-inner-spin-button": { appearance: "none" },
    "::-webkit-outer-spin-button": { appearance: "none" },
  },
});

function SliderDemo() {
  return (
    <DemoRow sx={styles.slider}>
      <Slider defaultValue={40}>
        <SliderLabel>Volume</SliderLabel>
        <SliderValue />
        <SliderControl />
      </Slider>
    </DemoRow>
  );
}

function SliderRangeDemo() {
  return (
    <DemoRow sx={styles.slider}>
      <Slider defaultValue={[20, 80]}>
        <SliderLabel>Price</SliderLabel>
        <SliderValue />
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <SliderThumb index={0} />
            <SliderThumb index={1} />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </DemoRow>
  );
}

function SliderMultipleDemo() {
  return (
    <DemoRow sx={styles.slider}>
      <Slider aria-label="Stops" defaultValue={[10, 40, 70]} step={10}>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <SliderThumb index={0} />
            <SliderThumb index={1} />
            <SliderThumb index={2} />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </DemoRow>
  );
}

function SliderVerticalDemo() {
  return (
    <DemoRow sx={styles.vertical}>
      <Slider
        aria-label="Bass"
        defaultValue={60}
        orientation="vertical"
        sx={styles.verticalSlider}
      >
        <SliderControl />
      </Slider>
      <Slider
        aria-label="Treble"
        defaultValue={30}
        orientation="vertical"
        sx={styles.verticalSlider}
      >
        <SliderControl />
      </Slider>
    </DemoRow>
  );
}

function SliderDisabledDemo() {
  return (
    <DemoRow sx={styles.slider}>
      <Slider defaultValue={40} disabled>
        <SliderLabel>Volume</SliderLabel>
        <SliderValue />
        <SliderControl />
      </Slider>
    </DemoRow>
  );
}

function SliderStepsDemo() {
  return (
    <DemoRow sx={styles.slider}>
      <Slider defaultValue={3} max={12}>
        <SliderLabel>Duration (months)</SliderLabel>
        <SliderValue />
        <SliderControl />
        <div aria-hidden {...stylex.props(styles.scale)}>
          {months.map((month) => {
            const major = month % 2 === 0;
            return (
              <span
                key={month}
                {...stylex.props(styles.mark(`${(month / 12) * 100}%`))}
              >
                <span
                  {...stylex.props(styles.tick, major && styles.tickMajor)}
                />
                {major && (
                  <span {...stylex.props(styles.scaleLabel)}>{month}</span>
                )}
              </span>
            );
          })}
        </div>
      </Slider>
    </DemoRow>
  );
}

function SliderReferencesDemo() {
  return (
    <DemoRow sx={styles.slider}>
      <Slider defaultValue={20} max={35} min={5}>
        <SliderLabel>Storage</SliderLabel>
        <SliderValue>{(formatted) => `${formatted[0] ?? ""} GB`}</SliderValue>
        <SliderControl />
        <div aria-hidden {...stylex.props(styles.references)}>
          <span>5 GB</span>
          <span>20 GB</span>
          <span {...stylex.props(styles.referenceEnd)}>35 GB</span>
        </div>
      </Slider>
    </DemoRow>
  );
}

function SliderTooltipDemo() {
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);

  return (
    <DemoRow sx={styles.slider}>
      <Slider
        defaultValue={40}
        onValueChange={(_, details) => {
          if (details.reason === "drag" || details.reason === "track-press") {
            setDragging(true);
          }
        }}
        onValueCommitted={() => {
          setDragging(false);
        }}
      >
        <SliderLabel>Volume</SliderLabel>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <Tooltip onOpenChange={setHovered} open={hovered || dragging}>
              <TooltipTrigger delay={0} render={<SliderThumb />} />
              <TooltipContent>
                <SliderValue sx={styles.bubble}>
                  {(formatted) => `${formatted[0] ?? ""}%`}
                </SliderValue>
              </TooltipContent>
            </Tooltip>
          </SliderTrack>
        </SliderControl>
      </Slider>
    </DemoRow>
  );
}

function SliderInputDemo() {
  const [value, setValue] = useState(100);
  const [draft, setDraft] = useState("100");

  return (
    <DemoRow sx={styles.slider}>
      <Slider
        onValueChange={(next) => {
          setValue(next);
          setDraft(String(next));
        }}
        value={value}
      >
        <SliderLabel>Opacity</SliderLabel>
        <label {...stylex.props(styles.field)}>
          <Input
            aria-label="Opacity"
            inputMode="numeric"
            max={100}
            min={0}
            onBlur={() => {
              setDraft(String(value));
            }}
            onChange={(event) => {
              setDraft(event.target.value);
              const next = event.target.valueAsNumber;
              if (Number.isFinite(next)) {
                setValue(Math.min(100, Math.max(0, Math.round(next))));
              }
            }}
            type="number"
            value={draft}
            sx={styles.input}
          />
          %
        </label>
        <SliderControl />
      </Slider>
    </DemoRow>
  );
}

export {
  SliderDemo,
  SliderDisabledDemo,
  SliderInputDemo,
  SliderMultipleDemo,
  SliderRangeDemo,
  SliderReferencesDemo,
  SliderStepsDemo,
  SliderTooltipDemo,
  SliderVerticalDemo,
};
