import * as stylex from "@stylexjs/stylex";
import { useId, useState } from "react";

import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import { Checkbox } from "@/components/primitives/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/primitives/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import {
  Slider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@/components/primitives/slider";
import { Switch } from "@/components/primitives/switch";
import { Textarea } from "@/components/primitives/textarea";
import { fontWeights, space } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const items = [
  { checked: true, label: "Hard disks" },
  { checked: true, label: "External disks" },
  { checked: false, label: "CDs, DVDs, and iPods" },
  { checked: false, label: "Connected servers" },
];

const styles = stylex.create({
  narrow: { maxWidth: 320, width: "100%" },
  wide: { maxWidth: 384, width: "100%" },
  form: { maxWidth: 448, width: "100%" },
  full: { width: "100%" },
  thirds: {
    display: "grid",
    gap: space.md,
    gridTemplateColumns: "repeat(3, 1fr)",
  },
  regular: { fontWeight: fontWeights.regular },
  noResize: { resize: "none" },
  value: { fontVariantNumeric: "tabular-nums", fontWeight: fontWeights.medium },
});

interface Option {
  label: string;
  value: string;
}

const months: Option[] = Array.from({ length: 12 }, (_, i) => {
  const month = String(i + 1).padStart(2, "0");
  return { label: month, value: month };
});

const years: Option[] = Array.from({ length: 6 }, (_, i) => {
  const year = String(2024 + i);
  return { label: year, value: year };
});

const departments: Option[] = [
  { label: "Engineering", value: "engineering" },
  { label: "Design", value: "design" },
  { label: "Marketing", value: "marketing" },
  { label: "Sales", value: "sales" },
  { label: "Customer Support", value: "support" },
];

const plans = [
  { label: "Monthly ($9.99/month)", value: "monthly" },
  { label: "Yearly ($99.99/year)", value: "yearly" },
  { label: "Lifetime ($299.99)", value: "lifetime" },
];

function Picker({
  label,
  options,
  placeholder,
}: {
  label: string;
  options: Option[];
  placeholder: string;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <Select items={options} placeholder={placeholder}>
        <SelectTrigger sx={styles.full}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

function FieldFormDemo() {
  return (
    <DemoRow sx={styles.form}>
      <form {...stylex.props(styles.full)}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Payment Method</FieldLegend>
            <FieldDescription>
              All transactions are secure and encrypted
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel>Name on Card</FieldLabel>
                <Input placeholder="Jordan Kim" required />
              </Field>
              <Field>
                <FieldLabel>Card Number</FieldLabel>
                <Input
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <FieldDescription>
                  Enter your 16-digit card number
                </FieldDescription>
              </Field>
              <div {...stylex.props(styles.thirds)}>
                <Picker label="Month" options={months} placeholder="MM" />
                <Picker label="Year" options={years} placeholder="YYYY" />
                <Field>
                  <FieldLabel>CVV</FieldLabel>
                  <Input autoComplete="cc-csc" placeholder="123" required />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Billing Address</FieldLegend>
            <FieldDescription>
              The billing address associated with your payment method
            </FieldDescription>
            <Field orientation="horizontal">
              <Checkbox defaultChecked />
              <FieldLabel sx={styles.regular}>
                Same as shipping address
              </FieldLabel>
            </Field>
          </FieldSet>
          <Field>
            <FieldLabel>Comments</FieldLabel>
            <Textarea
              placeholder="Add any additional comments"
              sx={styles.noResize}
            />
          </Field>
          <Field orientation="horizontal">
            <Button type="submit" variant="primary">
              Submit
            </Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DemoRow>
  );
}

function FieldInputDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <FieldGroup>
        <Field>
          <FieldLabel>Username</FieldLabel>
          <Input placeholder="Sam Lee" />
          <FieldDescription>
            Choose a unique username for your account.
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel>Password</FieldLabel>
          <FieldDescription>
            Must be at least 8 characters long.
          </FieldDescription>
          <Input placeholder="••••••••" type="password" />
        </Field>
      </FieldGroup>
    </DemoRow>
  );
}

function FieldTextareaDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>Feedback</FieldLabel>
        <Textarea placeholder="Your feedback helps us improve..." rows={4} />
        <FieldDescription>
          Share your thoughts about our service.
        </FieldDescription>
      </Field>
    </DemoRow>
  );
}

function FieldSelectDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>Department</FieldLabel>
        <Select items={departments} placeholder="Choose department">
          <SelectTrigger sx={styles.full}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {departments.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription>
          Select your department or area of work.
        </FieldDescription>
      </Field>
    </DemoRow>
  );
}

function FieldSliderDemo() {
  const [range, setRange] = useState([200, 800]);
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>Price Range</FieldLabel>
        <FieldDescription>
          Set your budget range ($
          <span {...stylex.props(styles.value)}>{range[0]}</span> -{" "}
          <span {...stylex.props(styles.value)}>{range[1]}</span>).
        </FieldDescription>
        <Slider
          max={1000}
          min={0}
          onValueChange={setRange}
          step={10}
          value={range}
        >
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

function FieldRadioDemo() {
  const legend = useId();
  const description = useId();
  return (
    <DemoRow sx={styles.narrow}>
      <FieldSet>
        <FieldLegend id={legend} variant="label">
          Subscription Plan
        </FieldLegend>
        <FieldDescription id={description}>
          Yearly and lifetime plans offer significant savings.
        </FieldDescription>
        <RadioGroup
          aria-describedby={description}
          aria-labelledby={legend}
          defaultValue="monthly"
        >
          {plans.map((plan) => (
            <Field key={plan.value} orientation="horizontal">
              <RadioGroupItem value={plan.value} />
              <FieldLabel sx={styles.regular}>{plan.label}</FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      </FieldSet>
    </DemoRow>
  );
}

function FieldSwitchDemo() {
  return (
    <DemoRow>
      <Field orientation="horizontal">
        <FieldLabel>Multi-factor authentication</FieldLabel>
        <Switch />
      </Field>
    </DemoRow>
  );
}

function FieldGroupDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">Responses</FieldLegend>
          <FieldDescription>
            Get notified when ChatGPT responds to requests that take time.
          </FieldDescription>
          <Field orientation="horizontal">
            <Checkbox defaultChecked disabled />
            <FieldLabel sx={styles.regular}>Push notifications</FieldLabel>
          </Field>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend variant="label">Tasks</FieldLegend>
          <FieldDescription>
            Get notified when tasks you&apos;ve created have updates.
          </FieldDescription>
          <Field orientation="horizontal">
            <Checkbox />
            <FieldLabel sx={styles.regular}>Push notifications</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox />
            <FieldLabel sx={styles.regular}>Email notifications</FieldLabel>
          </Field>
        </FieldSet>
      </FieldGroup>
    </DemoRow>
  );
}

function FieldDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field orientation="horizontal">
        <Checkbox defaultChecked />
        <FieldContent>
          <FieldLabel>Accept terms and conditions</FieldLabel>
          <FieldDescription>
            By clicking this checkbox, you agree to the terms.
          </FieldDescription>
        </FieldContent>
      </Field>
    </DemoRow>
  );
}

function FieldSetDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <FieldSet>
        <FieldLegend variant="label">
          Show these items on the desktop
        </FieldLegend>
        <FieldDescription>
          Select the items you want to show on the desktop.
        </FieldDescription>
        <FieldGroup>
          {items.map((item) => (
            <Field key={item.label} orientation="horizontal">
              <Checkbox defaultChecked={item.checked} />
              <FieldLabel>{item.label}</FieldLabel>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
    </DemoRow>
  );
}

function FieldCardDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>
          <Checkbox defaultChecked />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>
              You can enable or disable notifications at any time.
            </FieldDescription>
          </FieldContent>
        </FieldLabel>
      </Field>
    </DemoRow>
  );
}

function FieldCardListDemo() {
  return (
    <DemoRow sx={styles.wide}>
      <Card size="flush">
        <FieldGroup>
          <Field>
            <FieldLabel>
              <FieldContent>
                <FieldTitle>Mentions</FieldTitle>
                <FieldDescription>When someone @mentions you.</FieldDescription>
              </FieldContent>
              <Switch defaultChecked />
            </FieldLabel>
          </Field>
          <Field>
            <FieldLabel>
              <FieldContent>
                <FieldTitle>Weekly digest</FieldTitle>
                <FieldDescription>
                  A summary of the week’s activity, every Monday.
                </FieldDescription>
              </FieldContent>
              <Switch />
            </FieldLabel>
          </Field>
        </FieldGroup>
      </Card>
    </DemoRow>
  );
}

function FieldDisabledDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field disabled orientation="horizontal">
        <Checkbox />
        <FieldLabel>Enable notifications</FieldLabel>
      </Field>
    </DemoRow>
  );
}

function FieldErrorDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field invalid orientation="horizontal">
        <Checkbox />
        <FieldContent>
          <FieldLabel>Accept terms and conditions</FieldLabel>
          <FieldError match>You must accept the terms to continue.</FieldError>
        </FieldContent>
      </Field>
    </DemoRow>
  );
}

export {
  FieldFormDemo,
  FieldGroupDemo,
  FieldInputDemo,
  FieldRadioDemo,
  FieldSelectDemo,
  FieldSliderDemo,
  FieldSwitchDemo,
  FieldTextareaDemo,
  FieldCardDemo,
  FieldCardListDemo,
  FieldDemo,
  FieldDisabledDemo,
  FieldErrorDemo,
  FieldSetDemo,
};
