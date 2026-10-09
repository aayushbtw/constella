import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  colors,
  fontSizes,
  fontWeights,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
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
  grid: {
    display: "grid",
    gap: space.sm,
    gridTemplateColumns: "repeat(auto-fit, minmax(176px, 1fr))",
    maxWidth: "100%",
    width: 576,
  },
  stat: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontVariantNumeric: "tabular-nums",
    fontWeight: fontWeights.semibold,
  },
  trend: {
    alignItems: "center",
    color: colors.textSecondary,
    display: "flex",
    fontSize: fontSizes.xs,
    gap: space.xxs,
  },
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

function Glyph({ icon }: { icon: typeof MoreHorizontalIcon }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

function CardActionDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Card sx={styles.card}>
        <CardHeader>
          <CardTitle>Weekly digest</CardTitle>
          <CardDescription>Sent every Monday to 12 people.</CardDescription>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button aria-label="More" size="icon-sm" variant="ghost" />
                }
              >
                <Glyph icon={MoreHorizontalIcon} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit recipients</DropdownMenuItem>
                <DropdownMenuItem>Send now</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="danger">Turn off</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent>
          Includes new chats, the week&apos;s most used models and spend against
          your budget.
        </CardContent>
      </Card>
    </DemoRow>
  );
}

const stats = [
  { change: "+12.5%", label: "Messages", up: true, value: "48,210" },
  { change: "-3.1%", label: "Active users", up: false, value: "1,284" },
  { change: "+8.0%", label: "Spend", up: true, value: "$3,912" },
];

function CardStatsDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.grid)}>
        {stats.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardAction>
                <Badge
                  status={stat.up ? "success" : "danger"}
                  variant="secondary"
                >
                  {stat.change}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div {...stylex.props(styles.stat)}>{stat.value}</div>
              <div {...stylex.props(styles.trend)}>
                <Glyph icon={stat.up ? ArrowUp01Icon : ArrowDown01Icon} />
                vs. last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DemoRow>
  );
}

export { CardActionDemo, CardStatsDemo, CardDemo, CardSizeDemo, CardWellDemo };
