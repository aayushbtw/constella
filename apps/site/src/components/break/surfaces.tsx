import type { Tick02Icon } from "@hugeicons/core-free-icons";
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  InformationCircleIcon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge, BadgeDot } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  colors,
  fontSizes,
  fontWeights,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { text } from "~/components/break/fixtures";
import type { Dataset } from "~/components/break/fixtures";

const styles = stylex.create({
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    maxWidth: "100%",
    width: 448,
  },
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.xs,
  },
  // A narrow table cell, where a status badge usually lives.
  cell: { display: "flex", gap: space.xs, width: 120 },
  card: { maxWidth: "100%", width: 352 },
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
  footer: { flexDirection: "column" },
  full: { width: "100%" },
});

function Glyph({ icon }: { icon: typeof Tick02Icon }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

const badgeLabels = {
  demo: ["Paid", "Syncing", "Pending", "Failed"],
  empty: [],
  huge: ["1,284", "12,345,678", "+1,284.5%", "99+"],
  one: ["1"],
  worst: [text.status, text.german, text.tag, "1,284,000", "Paid"],
} satisfies Record<Dataset, string[]>;

const statuses = ["success", "info", "warning", "danger"] as const;

function BadgeBreak({ data }: { data: Dataset }) {
  const labels = badgeLabels[data];
  return (
    <div {...stylex.props(styles.column)}>
      <div {...stylex.props(styles.row)}>
        {labels.map((label, index) => (
          <Badge key={label} status={statuses[index % 4]} variant="secondary">
            {label}
          </Badge>
        ))}
      </div>
      <div {...stylex.props(styles.row)}>
        {labels.map((label, index) => (
          <Badge
            key={label}
            size="lg"
            status={statuses[index % 4]}
            variant="outline"
          >
            <BadgeDot />
            {label}
          </Badge>
        ))}
      </div>
      {labels.map((label) => (
        <div key={label} {...stylex.props(styles.cell)}>
          <Badge variant="outline">{label}</Badge>
        </div>
      ))}
    </div>
  );
}

const stats = {
  demo: [
    { change: "+12.5%", label: "Messages", up: true, value: "48,210" },
    { change: "-3.1%", label: "Active users", up: false, value: "1,284" },
    { change: "+8.0%", label: "Spend", up: true, value: "$3,912" },
  ],
  worst: [
    {
      change: "+1,284.5%",
      label: "Monthly recurring revenue (net of refunds)",
      up: true,
      value: "$12,345,678.90",
    },
    { change: "-100.0%", label: text.german, up: false, value: "-$42.50" },
    { change: "0.0%", label: "Spend", up: true, value: "0" },
  ],
};

function CardBreak({ data }: { data: Dataset }) {
  const worst = data === "worst";
  const rows = {
    demo: stats.demo,
    empty: [],
    huge: stats.demo,
    one: stats.demo.slice(0, 1),
    worst: stats.worst,
  }[data];
  return (
    <div {...stylex.props(styles.column)}>
      <Card sx={styles.card}>
        <CardHeader>
          <CardTitle>{worst ? text.file : "Weekly digest"}</CardTitle>
          <CardDescription>
            {worst ? text.url : "Sent every Monday to 12 people."}
          </CardDescription>
          <CardAction>
            <Button aria-label="More" size="icon-sm" variant="ghost">
              <Glyph icon={MoreHorizontalIcon} />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {worst
            ? text.description2000
            : "Includes new chats, the week's most used models and spend against your budget."}
        </CardContent>
        <CardFooter sx={styles.footer}>
          <Button sx={styles.full} variant="primary">
            {worst ? text.french : "Save"}
          </Button>
        </CardFooter>
      </Card>
      <div {...stylex.props(styles.grid)}>
        {rows.map((stat) => (
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
    </div>
  );
}

const alerts = {
  demo: [
    {
      action: "Enable",
      description: "Enable it under your profile settings to get started.",
      title: "Dark mode is now available",
    },
  ],
  worst: [
    { action: text.french, description: text.url, title: text.german },
    { action: "Retry", description: text.description2000, title: text.markup },
    { action: null, description: text.uuid, title: "" },
  ],
};

function AlertBreak({ data }: { data: Dataset }) {
  const rows = {
    demo: alerts.demo,
    empty: [],
    huge: alerts.demo,
    one: alerts.demo,
    worst: alerts.worst,
  }[data];
  return (
    <div {...stylex.props(styles.column)}>
      {rows.map((alert) => (
        <Alert key={alert.description} status="warning">
          <Glyph icon={InformationCircleIcon} />
          {alert.title !== "" && <AlertTitle>{alert.title}</AlertTitle>}
          <AlertDescription>{alert.description}</AlertDescription>
          {alert.action !== null && (
            <AlertAction>
              <Button size="sm" variant="outline">
                {alert.action}
              </Button>
            </AlertAction>
          )}
        </Alert>
      ))}
    </div>
  );
}

const tabSets = {
  demo: ["Overview", "Activity", "Settings"],
  empty: [],
  huge: Array.from({ length: 24 }, (_, index) => `Project ${index + 1}`),
  one: ["Overview"],
  worst: [text.french, text.german, "Members (1,284)", "API"],
} satisfies Record<Dataset, string[]>;

function TabsBreak({ data }: { data: Dataset }) {
  const tabs = tabSets[data];
  return (
    <div {...stylex.props(styles.column)}>
      {(["default", "line"] as const).map((variant) => (
        <Tabs defaultValue={tabs[0]} key={variant}>
          <TabsList variant={variant}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ))}
      <Tabs defaultValue={tabs[0]} orientation="vertical">
        <TabsList variant="line">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab} value={tab}>
            {data === "worst"
              ? text.description2000.slice(0, 300)
              : `${tab} panel.`}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

const fields = {
  demo: {
    card: "Share across devices",
    cardDescription:
      "Focus is shared across devices, and turns off when you leave the app.",
    description: "Enter your 16-digit card number",
    error: "Enter a valid card number.",
    label: "Card Number",
    legend: "Payment Method",
    toggle: "Multi-factor authentication",
    value: "1234 5678 9012 3456",
  },
  worst: {
    card: text.url,
    cardDescription: text.description2000,
    description: text.description2000.slice(0, 400),
    error: `${text.german}: ${text.url}`,
    label: text.jobTitle,
    legend: text.french,
    toggle: text.german,
    value: text.uuid,
  },
};

function FieldBreak({ data }: { data: Dataset }) {
  const copy = data === "worst" ? fields.worst : fields.demo;
  return (
    <div {...stylex.props(styles.column)}>
      <FieldSet>
        <FieldLegend>{copy.legend}</FieldLegend>
        <FieldGroup>
          <Field invalid>
            <FieldLabel>{copy.label}</FieldLabel>
            <Input defaultValue={copy.value} />
            <FieldDescription>{copy.description}</FieldDescription>
            <FieldError match>{copy.error}</FieldError>
          </Field>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel>{copy.toggle}</FieldLabel>
            </FieldContent>
            <Switch />
          </Field>
          <Field orientation="horizontal">
            <Switch />
            <FieldLabel>{copy.toggle}</FieldLabel>
          </Field>
          <Field>
            <FieldLabel>
              <Checkbox defaultChecked />
              <FieldContent>
                <FieldTitle>{copy.card}</FieldTitle>
                <FieldDescription>{copy.cardDescription}</FieldDescription>
              </FieldContent>
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}

export { AlertBreak, BadgeBreak, CardBreak, FieldBreak, TabsBreak };
