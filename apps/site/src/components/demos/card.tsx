import * as stylex from "@stylexjs/stylex";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { colors, space } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  card: { maxWidth: "100%", width: 352 },
  wide: { maxWidth: "100%", width: 384 },
  footer: { flexDirection: "column" },
  full: { width: "100%" },
  row: {
    alignItems: "center",
    display: "flex",
    gap: space.xs,
    justifyContent: "space-between",
    paddingBlock: space.sm,
    paddingInline: space.md,
  },
  muted: { color: colors.textSecondary },
});

function CardDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Card sx={styles.card}>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="card-email">Email</FieldLabel>
              <Input id="card-email" placeholder="m@example.com" type="email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="card-password">Password</FieldLabel>
              <Input id="card-password" type="password" />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter sx={styles.footer}>
          <Button sx={styles.full} variant="primary">
            Login
          </Button>
          <Button sx={styles.full} variant="outline">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </DemoRow>
  );
}

function CardSizeDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Card size="sm" sx={styles.card}>
        <CardHeader>
          <CardTitle>Scheduled reports</CardTitle>
          <CardDescription>Weekly snapshots of your usage.</CardDescription>
        </CardHeader>
        <CardContent>
          Reports go out every Monday at 9am to the workspace owners.
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline">
            Manage
          </Button>
        </CardFooter>
      </Card>
    </DemoRow>
  );
}

const models = [
  { name: "Claude Opus", status: "Default" },
  { name: "Claude Sonnet", status: null },
  { name: "Claude Haiku", status: null },
];

function CardWellDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Card sx={styles.wide} variant="well">
        <CardHeader>
          <CardTitle>Models</CardTitle>
          <CardDescription>
            Available to everyone in the workspace.
          </CardDescription>
        </CardHeader>
        <Card size="flush">
          {models.map((model, index) => (
            <div key={model.name}>
              {index > 0 && <Separator />}
              <div {...stylex.props(styles.row)}>
                {model.name}
                {model.status !== null && (
                  <Badge variant="secondary">{model.status}</Badge>
                )}
              </div>
            </div>
          ))}
        </Card>
      </Card>
    </DemoRow>
  );
}

export { CardDemo, CardSizeDemo, CardWellDemo };
