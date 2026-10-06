import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { colors, sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  narrow: { maxWidth: 320, width: "100%" },
  stack: { display: "flex", flexDirection: "column", gap: space.sm },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr" },
  required: { color: colors.danger },
});

function InputDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>API Key</FieldLabel>
        <Input placeholder="sk-..." type="password" />
        <FieldDescription>
          Your API key is encrypted and stored securely.
        </FieldDescription>
      </Field>
    </DemoRow>
  );
}

function InputSizeDemo() {
  return (
    <DemoRow sx={[styles.narrow, styles.stack]}>
      <Input aria-label="Small" placeholder="Small" size="sm" />
      <Input aria-label="Default" placeholder="Default" />
      <Input aria-label="Large" placeholder="Large" size="lg" />
    </DemoRow>
  );
}

function InputFieldDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>Username</FieldLabel>
        <Input placeholder="Enter your username" />
        <FieldDescription>
          Choose a unique username for your account.
        </FieldDescription>
      </Field>
    </DemoRow>
  );
}

function InputFieldGroupDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input placeholder="Jordan Lee" />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input placeholder="name@example.com" type="email" />
          <FieldDescription>
            We’ll send updates to this address.
          </FieldDescription>
        </Field>
        <Field orientation="horizontal">
          <Button type="reset" variant="outline">
            Reset
          </Button>
          <Button type="submit" variant="primary">
            Submit
          </Button>
        </Field>
      </FieldGroup>
    </DemoRow>
  );
}

function InputDisabledDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field disabled>
        <FieldLabel>Email</FieldLabel>
        <Input placeholder="Email" type="email" />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </DemoRow>
  );
}

function InputInvalidDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field invalid>
        <FieldLabel>Invalid Input</FieldLabel>
        <Input placeholder="Error" />
        <FieldDescription>
          This field contains validation errors.
        </FieldDescription>
      </Field>
    </DemoRow>
  );
}

function InputFileDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>Picture</FieldLabel>
        <Input type="file" />
        <FieldDescription>Select a picture to upload.</FieldDescription>
      </Field>
    </DemoRow>
  );
}

function InputInlineDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field orientation="horizontal">
        <Input aria-label="Search" placeholder="Search..." type="search" />
        <Button variant="primary">Search</Button>
      </Field>
    </DemoRow>
  );
}

function InputInputGroupDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>Website URL</FieldLabel>
        <InputGroup>
          <InputGroupInput placeholder="example.com" />
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <HugeiconsIcon
              aria-hidden
              icon={InformationCircleIcon}
              size={sizes.icon}
              strokeWidth={Number(strokes.icon)}
            />
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </DemoRow>
  );
}

function InputGridDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <FieldGroup sx={styles.grid}>
        <Field>
          <FieldLabel>First Name</FieldLabel>
          <Input placeholder="Jordan" />
        </Field>
        <Field>
          <FieldLabel>Last Name</FieldLabel>
          <Input placeholder="Lee" />
        </Field>
      </FieldGroup>
    </DemoRow>
  );
}

function InputRequiredDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>
          <span>
            Required Field <span {...stylex.props(styles.required)}>*</span>
          </span>
        </FieldLabel>
        <Input placeholder="This field is required" required />
        <FieldDescription>This field must be filled out.</FieldDescription>
      </Field>
    </DemoRow>
  );
}

export {
  InputDemo,
  InputDisabledDemo,
  InputFieldDemo,
  InputFieldGroupDemo,
  InputFileDemo,
  InputGridDemo,
  InputInlineDemo,
  InputInputGroupDemo,
  InputInvalidDemo,
  InputRequiredDemo,
  InputSizeDemo,
};
