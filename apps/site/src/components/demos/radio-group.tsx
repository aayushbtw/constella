import * as stylex from "@stylexjs/stylex";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldSetDescription,
  FieldTitle,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
  radioGroupItemSizes,
} from "@/components/ui/radio-group";
import { fontWeights } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  fit: { width: "fit-content" },
  narrow: { maxWidth: 320, width: "100%" },
  regular: { fontWeight: fontWeights.regular },
});

const densities = [
  {
    description: "Standard spacing for most use cases.",
    label: "Default",
    value: "default",
  },
  {
    description: "More space between elements.",
    label: "Comfortable",
    value: "comfortable",
  },
  {
    description: "Minimal spacing for dense layouts.",
    label: "Compact",
    value: "compact",
  },
];

const plans = [
  {
    description: "For individuals and small teams.",
    label: "Plus",
    value: "plus",
  },
  { description: "For growing businesses.", label: "Pro", value: "pro" },
  {
    description: "For large teams and enterprises.",
    label: "Enterprise",
    value: "enterprise",
  },
];

const billing = [
  { label: "Monthly ($9.99/month)", value: "monthly" },
  { label: "Yearly ($99.99/year)", value: "yearly" },
  { label: "Lifetime ($299.99)", value: "lifetime" },
];

const channels = [
  { label: "Email only", value: "email" },
  { label: "SMS only", value: "sms" },
  { label: "Both Email & SMS", value: "both" },
];

function RadioGroupDemo() {
  return (
    <DemoRow>
      <RadioGroup defaultValue="comfortable" sx={styles.fit}>
        {densities.map((item) => (
          <Label key={item.value}>
            <RadioGroupItem value={item.value} />
            {item.label}
          </Label>
        ))}
      </RadioGroup>
    </DemoRow>
  );
}

const sizeLabels = {
  default: "Default",
  lg: "Large",
  sm: "Small",
} as const;

function RadioGroupSizeDemo() {
  return (
    <DemoRow>
      <RadioGroup defaultValue="default" sx={styles.fit}>
        {radioGroupItemSizes.map((size) => (
          <Label key={size}>
            <RadioGroupItem size={size} value={size} />
            {sizeLabels[size]}
          </Label>
        ))}
      </RadioGroup>
    </DemoRow>
  );
}

function RadioGroupDescriptionDemo() {
  return (
    <DemoRow>
      <RadioGroup defaultValue="comfortable" sx={styles.fit}>
        {densities.map((item) => (
          <Field key={item.value} orientation="horizontal">
            <RadioGroupItem value={item.value} />
            <FieldContent>
              <FieldLabel>{item.label}</FieldLabel>
              <FieldDescription>{item.description}</FieldDescription>
            </FieldContent>
          </Field>
        ))}
      </RadioGroup>
    </DemoRow>
  );
}

function RadioGroupCardDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <RadioGroup defaultValue="plus">
        {plans.map((item) => (
          <Field key={item.value}>
            <FieldLabel>
              <FieldContent>
                <FieldTitle>{item.label}</FieldTitle>
                <FieldDescription>{item.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={item.value} />
            </FieldLabel>
          </Field>
        ))}
      </RadioGroup>
    </DemoRow>
  );
}

function RadioGroupFieldsetDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <FieldSet>
        <FieldLegend variant="label">Subscription Plan</FieldLegend>
        <FieldSetDescription>
          Yearly and lifetime plans offer significant savings.
        </FieldSetDescription>
        <RadioGroup defaultValue="monthly">
          {billing.map((item) => (
            <Field key={item.value} orientation="horizontal">
              <RadioGroupItem value={item.value} />
              <FieldLabel sx={styles.regular}>{item.label}</FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      </FieldSet>
    </DemoRow>
  );
}

function RadioGroupDisabledDemo() {
  return (
    <DemoRow>
      <RadioGroup defaultValue="option2" sx={styles.fit}>
        <Field disabled orientation="horizontal">
          <RadioGroupItem value="option1" />
          <FieldLabel sx={styles.regular}>Disabled</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="option2" />
          <FieldLabel sx={styles.regular}>Option 2</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="option3" />
          <FieldLabel sx={styles.regular}>Option 3</FieldLabel>
        </Field>
      </RadioGroup>
    </DemoRow>
  );
}

function RadioGroupInvalidDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <FieldSet>
        <FieldLegend variant="label">Notification Preferences</FieldLegend>
        <FieldSetDescription>
          Choose how you want to receive notifications.
        </FieldSetDescription>
        <RadioGroup defaultValue="email">
          {channels.map((item) => (
            <Field invalid key={item.value} orientation="horizontal">
              <RadioGroupItem aria-invalid value={item.value} />
              <FieldLabel sx={styles.regular}>{item.label}</FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      </FieldSet>
    </DemoRow>
  );
}

export {
  RadioGroupCardDemo,
  RadioGroupDemo,
  RadioGroupDescriptionDemo,
  RadioGroupDisabledDemo,
  RadioGroupFieldsetDemo,
  RadioGroupInvalidDemo,
  RadioGroupSizeDemo,
};
