import {
  BubbleChatIcon,
  Folder01Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { barY, defineChart, group } from "@tanstack/charts";
import { pie, polar, radialArc } from "@tanstack/charts/polar";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";
import { useMemo, useState } from "react";

import {
  Chart,
  ChartLegendContent,
  chartColor,
  chartGroupScale,
  chartTickFormat,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { CopyButton } from "@/components/ui/copy-button";
import {
  Message,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuLabel,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { colors, radii, sizes, space, strokes } from "@/lib/tokens.stylex";
import { peopleFor, text } from "~/components/break/fixtures";
import type { Dataset } from "~/components/break/fixtures";
import { PersonAvatar } from "~/components/break/people";

const styles = stylex.create({
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    maxWidth: "100%",
    width: 512,
  },
  frame: {
    borderBlockColor: colors.edge,
    borderInlineColor: colors.edge,
    borderBlockStyle: "solid",
    borderInlineStyle: "solid",
    borderBlockWidth: strokes.border,
    borderInlineWidth: strokes.border,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    height: 480,
    minHeight: 0,
    overflow: "hidden",
    width: "100%",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    maxWidth: "100%",
    width: 480,
  },
});

const glyph = (icon: typeof BubbleChatIcon) => (
  <HugeiconsIcon
    aria-hidden
    icon={icon}
    size={sizes.icon}
    strokeWidth={Number(strokes.icon)}
  />
);

const turns = {
  demo: [
    { from: "user", text: "What is Constella?" },
    {
      from: "assistant",
      text: "Constella is a component library on Base UI and StyleX. Every value comes from a token, so a theme is one file.",
    },
  ],
  worst: [
    { from: "user", text: text.url },
    { from: "assistant", text: text.description2000 },
    { from: "user", text: "ok" },
    { from: "user", text: `Line one\nLine two\n\n${text.markup}` },
    { from: "assistant", text: `${text.uuid}${text.uuid}${text.uuid}` },
    {
      from: "user",
      text: "نور الهدى عبد الرحمن — هل يمكنك تلخيص هذا المستند؟",
    },
    { from: "assistant", text: "" },
  ],
} as const;

function MessageBreak({ data }: { data: Dataset }) {
  const rows = {
    demo: turns.demo,
    empty: [],
    huge: turns.demo,
    one: turns.demo.slice(0, 1),
    worst: turns.worst,
  }[data];
  return (
    <div {...stylex.props(styles.column)}>
      {rows.map((turn, index) => (
        <Message from={turn.from} key={`${turn.from}${index}`}>
          <MessageContent>{turn.text}</MessageContent>
          {turn.from === "assistant" && (
            <MessageActions>
              <CopyButton value={turn.text} />
            </MessageActions>
          )}
        </Message>
      ))}
    </div>
  );
}

const recents = {
  demo: [
    "Quarterly revenue summary for the board",
    "Draft the launch email",
    "Fix flaky checkout test",
  ],
  worst: [
    text.url,
    text.file,
    text.german,
    "J",
    text.markup,
    "王秀英的季度报告",
    "🦊",
  ],
};

function SidebarBreak({ data }: { data: Dataset }) {
  const people = peopleFor(data);
  const chats = {
    demo: recents.demo,
    empty: [],
    huge: people.map((person) => `Chat with ${person.name}`),
    one: recents.demo.slice(0, 1),
    worst: recents.worst,
  }[data];
  const [me] = people;
  return (
    <SidebarProvider sx={styles.frame}>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarMenu>
            {[
              {
                icon: BubbleChatIcon,
                label: data === "worst" ? text.german : "Chats",
              },
              {
                icon: Folder01Icon,
                label: data === "worst" ? text.french : "Assets",
              },
            ].map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton tooltip={item.label}>
                  {glyph(item.icon)}
                  <SidebarMenuLabel>{item.label}</SidebarMenuLabel>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarGroup>
            <SidebarGroupLabel>
              {data === "worst" ? text.jobTitle : "Recents"}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat}>
                    <SidebarMenuButton tooltip={chat}>
                      <SidebarMenuLabel>{chat}</SidebarMenuLabel>
                    </SidebarMenuButton>
                    <SidebarMenuAction aria-label="More" showOnHover>
                      {glyph(MoreHorizontalIcon)}
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {me !== undefined && (
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={me.name}>
                  <PersonAvatar person={me} size="sm" />
                  <SidebarMenuLabel>{me.name}</SidebarMenuLabel>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        )}
      </Sidebar>
      <SidebarInset />
    </SidebarProvider>
  );
}

const demoConfig = {
  desktop: { label: "Desktop" },
  mobile: { label: "Mobile" },
} satisfies ChartConfig;

const worstConfig = {
  desktop: { label: "Desktop (Windows, macOS & Linux)" },
  mobile: { label: text.german },
  tablet: { label: "Tablet" },
  tv: { label: "Smart TV" },
  watch: { label: "Watch" },
  car: { label: "In-car display" },
  other: { label: "Other" },
  unknown: { label: "Unknown" },
} satisfies ChartConfig;

const demoMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const worstMonths = [
  "January 2025",
  "February 2025",
  "March 2025",
  "April 2025",
  "May 2025",
  "June 2025",
  "July 2025",
  "August 2025",
  "September 2025",
  "October 2025",
  "November 2025",
  "December 2025",
];

function chartFor(data: Dataset) {
  const worst = data === "worst" || data === "huge";
  const config: ChartConfig = worst ? worstConfig : demoConfig;
  const series = Object.keys(config);
  const months = {
    demo: demoMonths,
    empty: demoMonths,
    huge: worstMonths,
    one: demoMonths.slice(0, 1),
    worst: worstMonths,
  }[data];
  const scale = worst ? 104_729 : 37;
  const rows = months.flatMap((month, m) =>
    series.map((key, s) => ({
      key,
      month,
      visitors:
        data === "empty"
          ? 0
          : ((m + 1) * (s + 3) * scale) % (worst ? 12_345_678 : 300),
    }))
  );
  return { config, months, rows, series };
}

function ChartBreak({ data }: { data: Dataset }) {
  const { config, rows, series } = useMemo(() => chartFor(data), [data]);
  const [shown, setShown] = useState<string[]>(series);
  const visible = shown.filter((key) => series.includes(key));
  const keys = visible.length > 0 ? visible : series;
  const max = Math.max(1, ...rows.map((row) => row.visitors));
  const bars = useMemo(
    () =>
      defineChart({
        marks: [
          barY(
            rows.filter((row) => keys.includes(row.key)),
            {
              x: "month",
              y: "visitors",
              z: "key",
              color: "key",
              layout: group({
                scale: chartGroupScale(
                  keys.map((key) => [key, 1] as const),
                  0.1
                ),
              }),
              radius: 4,
              inset: 1,
            }
          ),
        ],
        scales: {
          x: {
            scale: () => scaleBand().padding(0.25),
            axis: { line: false, ticks: { size: 0 } },
          },
          y: {
            grid: true,
            axis: {
              line: false,
              ticks: { size: 0, count: 4, format: chartTickFormat("en-US") },
            },
            scale: scaleLinear().domain([0, max]).nice(4),
          },
        },
        color: chartColor(config),
        focus: "group-x",
        tooltip: {
          use: tooltip,
          anchor: "pointer",
          placement: ["right", "left"],
        },
      }),
    [config, keys, max, rows]
  );
  const slices = useMemo(() => {
    const totals = series.map((key) => ({
      key,
      visitors: rows
        .filter((row) => row.key === key)
        .reduce((sum, row) => sum + row.visitors, 0),
    }));
    return defineChart({
      marks: [
        polar({
          inset: 8,
          marks: [
            radialArc(pie(totals, { value: "visitors", gapAngle: 0.012 }), {
              innerRadius: ({ radius }) => radius * 0.6,
              color: "key",
              key: "key",
            }),
          ],
          scales: { angle: null, radius: null },
        }),
      ],
      scales: { x: null, y: null },
      color: chartColor(config),
    });
  }, [config, rows, series]);
  return (
    <div {...stylex.props(styles.card)}>
      <ChartLegendContent
        aria-label="Series"
        config={config}
        onValueChange={(next) => {
          if (next.length > 0) {
            setShown(next);
          }
        }}
        value={keys}
      />
      <Chart
        ariaLabel="Visitors by device"
        config={config}
        definition={bars}
        height={240}
        initialWidth={432}
      />
      <Chart
        ariaLabel="Visitors by device, share"
        config={config}
        definition={slices}
        height={240}
        initialWidth={432}
      />
    </div>
  );
}

export { ChartBreak, MessageBreak, SidebarBreak };
