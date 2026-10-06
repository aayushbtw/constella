import * as stylex from "@stylexjs/stylex";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { space } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  narrow: { maxWidth: 320, width: "100%" },
  stack: { display: "grid", gap: space.xs, width: "100%" },
});

function TextareaDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Textarea aria-label="Message" placeholder="Type your message here." />
    </DemoRow>
  );
}

function TextareaFieldDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field>
        <FieldLabel>Message</FieldLabel>
        <FieldDescription>Enter your message below.</FieldDescription>
        <Textarea placeholder="Type your message here." />
      </Field>
    </DemoRow>
  );
}

function TextareaDisabledDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field disabled>
        <FieldLabel>Message</FieldLabel>
        <Textarea placeholder="Type your message here." />
      </Field>
    </DemoRow>
  );
}

function TextareaInvalidDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <Field invalid>
        <FieldLabel>Message</FieldLabel>
        <Textarea placeholder="Type your message here." />
        <FieldDescription>Please enter a valid message.</FieldDescription>
      </Field>
    </DemoRow>
  );
}

function TextareaButtonDemo() {
  return (
    <DemoRow sx={styles.narrow}>
      <div {...stylex.props(styles.stack)}>
        <Textarea aria-label="Message" placeholder="Type your message here." />
        <Button variant="primary">Send message</Button>
      </div>
    </DemoRow>
  );
}

export {
  TextareaButtonDemo,
  TextareaDemo,
  TextareaDisabledDemo,
  TextareaFieldDemo,
  TextareaInvalidDemo,
};
