import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Field, FieldLabel } from "@/components/primitives/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/primitives/input-group";
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@/components/primitives/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/tooltip";
import { Text } from "@/components/typography/text";
import { colors, sizes, space, strokes } from "@/lib/constella/tokens.stylex";
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
    backgroundColor: colors.border,
    height: space.xxs,
    width: strokes.border,
  },
  tickMajor: {
    backgroundColor: colors.textMuted,
  },
  scaleLabel: {
    fontVariantNumeric: "tabular-nums",
  },
  // The middle column sizes to its label, so the 1fr columns either side keep it centered.
  references: {
    display: "grid",
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
  gridPassthrough: {
    display: "contents",
  },
  field: {
    gridColumn: "2",
    width: `calc(${space.lg} * 3)`,
  },
  input: {
    fontVariantNumeric: "tabular-nums",
    MozAppearance: "textfield",
    textAlign: "end",
    "::-webkit-inner-spin-button": { appearance: "none" },
    "::-webkit-outer-spin-button": { appearance: "none" },
  },
});

function SliderDemo() {
  return (
    <DemoRow sx={styles.slider}>
      <Field>
        <Slider defaultValue={40}>
          <FieldLabel>Volume</FieldLabel>
          <SliderValue />
          <SliderControl />
        </Slider>
      </Field>
    </DemoRow>
  );
}

function SliderRangeDemo() {
  return (
    <DemoRow sx={styles.slider}>
      <Field>
        <Slider defaultValue={[20, 80]}>
          <FieldLabel>Price</FieldLabel>
          <SliderValue />
          <SliderControl>
            <SliderTrack>
              <SliderIndicator />
              <SliderThumb aria-label="Minimum price" index={0} />
              <SliderThumb aria-label="Maximum price" index={1} />
            </SliderTrack>
          </SliderControl>
        </Slider>
      </Field>
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
            <SliderThumb aria-label="First stop" index={0} />
            <SliderThumb aria-label="Second stop" index={1} />
            <SliderThumb aria-label="Third stop" index={2} />
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
        defaultValue={60}
        orientation="vertical"
        sx={styles.verticalSlider}
      >
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <SliderThumb aria-label="Bass" />
          </SliderTrack>
        </SliderControl>
      </Slider>
      <Slider
        defaultValue={30}
        orientation="vertical"
        sx={styles.verticalSlider}
      >
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <SliderThumb aria-label="Treble" />
          </SliderTrack>
        </SliderControl>
      </Slider>
    </DemoRow>
  );
}

function SliderDisabledDemo() {
  return (
    <DemoRow sx={styles.slider}>
      <Field>
        <Slider defaultValue={40} disabled>
          <FieldLabel>Volume</FieldLabel>
          <SliderValue />
          <SliderControl />
        </Slider>
      </Field>
    </DemoRow>
  );
}

function SliderStepsDemo() {
  return (
    <DemoRow sx={styles.slider}>
      <Field>
        <Slider defaultValue={3} max={12}>
          <FieldLabel>Duration (months)</FieldLabel>
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
                    <Text
                      color="muted"
                      render={<span />}
                      size="sm"
                      sx={styles.scaleLabel}
                    >
                      {month}
                    </Text>
                  )}
                </span>
              );
            })}
          </div>
        </Slider>
      </Field>
    </DemoRow>
  );
}

function SliderReferencesDemo() {
  return (
    <DemoRow sx={styles.slider}>
      <Field>
        <Slider
          defaultValue={20}
          format={{ style: "unit", unit: "gigabyte" }}
          max={35}
          min={5}
        >
          <FieldLabel>Storage</FieldLabel>
          <SliderValue />
          <SliderControl />
          <Text
            aria-hidden
            color="muted"
            render={<div />}
            size="sm"
            sx={styles.references}
          >
            <span>5 GB</span>
            <span>20 GB</span>
            <span {...stylex.props(styles.referenceEnd)}>35 GB</span>
          </Text>
        </Slider>
      </Field>
    </DemoRow>
  );
}

function SliderTooltipDemo() {
  const [hovered, setHovered] = useState(false);

  return (
    <DemoRow sx={styles.slider}>
      <Field>
        <Slider defaultValue={40} format={{ style: "unit", unit: "percent" }}>
          {(state) => (
            <>
              <FieldLabel>Volume</FieldLabel>
              <SliderControl>
                <SliderTrack>
                  <SliderIndicator />
                  <Tooltip
                    closeOnPress={false}
                    delay={0}
                    onOpenChange={setHovered}
                    open={hovered || state.dragging}
                    type="description"
                  >
                    <TooltipTrigger render={<SliderThumb />} />
                    <TooltipContent>
                      <SliderValue sx={styles.bubble} />
                    </TooltipContent>
                  </Tooltip>
                </SliderTrack>
              </SliderControl>
            </>
          )}
        </Slider>
      </Field>
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
        <Field sx={styles.gridPassthrough}>
          <FieldLabel>Opacity</FieldLabel>
          <InputGroup size="sm" sx={styles.field}>
            <InputGroupInput
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
            <InputGroupAddon align="inline-end">
              <InputGroupText>%</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <SliderControl>
          <SliderTrack>
            <SliderIndicator />
            <SliderThumb aria-label="Opacity" />
          </SliderTrack>
        </SliderControl>
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
