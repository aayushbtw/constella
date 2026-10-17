import * as stylex from "@stylexjs/stylex";
import { Fragment, useState } from "react";

import {
  CommandCollection,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Meter, MeterLabel } from "@/components/ui/meter";
import type { modelPickerDetailsSides } from "@/components/ui/model-picker";
import {
  ModelPicker,
  ModelPickerCommand,
  ModelPickerContent,
  ModelPickerDescription,
  ModelPickerDetails,
  ModelPickerItem,
  ModelPickerLogo,
  ModelPickerTitle,
  ModelPickerTrigger,
} from "@/components/ui/model-picker";
import {
  colors,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

// prompt-input.tsx's `inset`; keep in step so the sketch matches the composer.
const inset = `max(${space.xxs}, calc(${radii.xl} - ${sizes.controlSm} / 2))`;

const styles = stylex.create({
  ratings: { display: "flex", flexDirection: "column", gap: space.sm },
  rating: { gap: space.xxs },
  dashed: {
    borderBlockEndColor: colors.border,
    borderBlockStartColor: colors.border,
    borderInlineEndColor: colors.border,
    borderInlineStartColor: colors.border,
    borderBlockEndStyle: "dashed",
    borderBlockStartStyle: "dashed",
    borderInlineEndStyle: "dashed",
    borderInlineStartStyle: "dashed",
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
  },
  composer: {
    borderStartStartRadius: radii.xl,
    borderStartEndRadius: radii.xl,
    borderEndStartRadius: radii.xl,
    borderEndEndRadius: radii.xl,
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    maxWidth: "100%",
    paddingBlockEnd: inset,
    paddingBlockStart: inset,
    paddingInline: inset,
    width: 512,
  },
  lines: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    paddingBlockStart: space.xxs,
    paddingInline: space.xxs,
  },
  // Not Skeleton: its pulse reads as loading and pulls the eye off the picker.
  block: {
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderEndEndRadius: radii.full,
  },
  line: { height: 8 },
  long: { width: "72%" },
  short: { width: "44%" },
  footer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
  },
  tools: { alignItems: "center", display: "flex", gap: space.xxs },
  slot: {
    height: sizes.controlSm,
    width: sizes.controlSm,
  },
});

interface Model {
  consumption: number;
  description: string;
  intelligence: number;
  label: string;
  logo: string;
  speed: number;
  value: string;
}

interface Group {
  items: Model[];
  value: string;
}

const groups: Group[] = [
  {
    items: [
      {
        consumption: 4,
        description: "The strongest at reasoning, code and long documents.",
        intelligence: 5,
        label: "Claude Opus",
        logo: "/logos/anthropic.svg",
        speed: 2,
        value: "claude-opus",
      },
      {
        consumption: 3,
        description: "A strong all-rounder for writing and analysis.",
        intelligence: 4,
        label: "GPT-5",
        logo: "/logos/openai.svg",
        speed: 3,
        value: "gpt-5",
      },
    ],
    value: "Best models",
  },
  {
    items: [
      {
        consumption: 2,
        description: "Fast answers over very long context.",
        intelligence: 4,
        label: "Gemini Pro",
        logo: "/logos/google.svg",
        speed: 4,
        value: "gemini-pro",
      },
      {
        consumption: 1,
        description: "Low cost reasoning, good at math and code.",
        intelligence: 3,
        label: "DeepSeek",
        logo: "/logos/deepseek.svg",
        speed: 3,
        value: "deepseek",
      },
      {
        consumption: 1,
        description: "Quick, light answers for everyday questions.",
        intelligence: 2,
        label: "Mistral Small",
        logo: "/logos/mistral.svg",
        speed: 5,
        value: "mistral-small",
      },
      {
        consumption: 3,
        description: "Current events and a looser tone.",
        intelligence: 4,
        label: "Grok",
        logo: "/logos/xai.svg",
        speed: 4,
        value: "grok",
      },
    ],
    value: "All models",
  },
];

const models = groups.flatMap((group) => group.items);

function Rating({ label, value }: { label: string; value: number }) {
  return (
    <Meter
      sx={styles.rating}
      getAriaValueText={() => `${value} of 5`}
      max={5}
      value={value}
    >
      <MeterLabel>{label}</MeterLabel>
    </Meter>
  );
}

function Picker({
  align,
  detailsSide,
}: {
  align?: "start" | "end";
  detailsSide?: (typeof modelPickerDetailsSides)[number];
}) {
  const [value, setValue] = useState("gpt-5");
  const [highlighted, setHighlighted] = useState<Model>();
  const picked = models.find((model) => model.value === value);
  return (
    <ModelPicker>
      <ModelPickerTrigger corners="pill">
        {picked && <ModelPickerLogo src={picked.logo} />}
        {picked?.label}
      </ModelPickerTrigger>
      <ModelPickerContent align={align} detailsSide={detailsSide}>
        <ModelPickerCommand
          items={groups}
          onItemHighlighted={(item) => {
            setHighlighted(models.find((model) => model === item));
          }}
        >
          <CommandInput placeholder="Search models..." />
          <CommandEmpty>No models found.</CommandEmpty>
          <CommandList>
            {(group: Group, index: number) => (
              <Fragment key={group.value}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup items={group.items}>
                  <CommandGroupLabel>{group.value}</CommandGroupLabel>
                  <CommandCollection>
                    {(model: Model) => (
                      <ModelPickerItem
                        key={model.value}
                        onClick={() => {
                          setValue(model.value);
                        }}
                        selected={model.value === value}
                        value={model}
                      >
                        <ModelPickerLogo src={model.logo} />
                        {model.label}
                      </ModelPickerItem>
                    )}
                  </CommandCollection>
                </CommandGroup>
              </Fragment>
            )}
          </CommandList>
        </ModelPickerCommand>
        {highlighted && (
          <ModelPickerDetails>
            <ModelPickerTitle>
              <ModelPickerLogo src={highlighted.logo} />
              {highlighted.label}
            </ModelPickerTitle>
            <ModelPickerDescription>
              {highlighted.description}
            </ModelPickerDescription>
            <div {...stylex.props(styles.ratings)}>
              <Rating label="Speed" value={highlighted.speed} />
              <Rating label="Intelligence" value={highlighted.intelligence} />
              <Rating label="Consumption" value={highlighted.consumption} />
            </div>
          </ModelPickerDetails>
        )}
      </ModelPickerContent>
    </ModelPicker>
  );
}

function ModelPickerDemo() {
  return (
    <DemoRow>
      <div {...stylex.props(styles.dashed, styles.composer)}>
        <div {...stylex.props(styles.lines)}>
          <span {...stylex.props(styles.block, styles.line, styles.long)} />
          <span {...stylex.props(styles.block, styles.line, styles.short)} />
        </div>
        <div {...stylex.props(styles.footer)}>
          <span {...stylex.props(styles.block, styles.slot)} />
          <span {...stylex.props(styles.tools)}>
            <Picker align="end" detailsSide="inline-start" />
            <span {...stylex.props(styles.block, styles.slot)} />
          </span>
        </div>
      </div>
    </DemoRow>
  );
}

function ModelPickerSideDemo() {
  return (
    <DemoRow>
      <Picker />
    </DemoRow>
  );
}

export { ModelPickerDemo, ModelPickerSideDemo };
