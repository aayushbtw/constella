import * as stylex from "@stylexjs/stylex";

import {
  Tabs,
  TabsContent,
  TabsList,
  tabsListSizes,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  colors,
  fontSizes,
  lineHeights,
  sizes,
  space,
} from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  column: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: space.md,
  },
  panel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.text,
    // Level with the first tab's label: half the tab's height around one line.
    paddingBlock: `calc((${sizes.controlSm} - ${lineHeights.text}) / 2)`,
  },
});

function TabsDemo() {
  return (
    <DemoRow>
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="docs">Docs</TabsTrigger>
        </TabsList>
      </Tabs>
    </DemoRow>
  );
}

function TabsLineDemo() {
  return (
    <DemoRow>
      <Tabs defaultValue="overview">
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </Tabs>
    </DemoRow>
  );
}

function TabsSizeDemo() {
  return (
    <DemoRow>
      <div {...stylex.props(styles.column)}>
        {tabsListSizes.map((size) => (
          <Tabs defaultValue="day" key={size}>
            <TabsList size={size}>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
        ))}
      </div>
    </DemoRow>
  );
}

function TabsVerticalDemo() {
  return (
    <DemoRow>
      <Tabs defaultValue="general" orientation="vertical">
        <TabsList variant="line">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent sx={styles.panel} value="general">
          Name, avatar and language.
        </TabsContent>
        <TabsContent sx={styles.panel} value="models">
          The default model and its settings.
        </TabsContent>
        <TabsContent sx={styles.panel} value="billing">
          Plan, usage and invoices.
        </TabsContent>
      </Tabs>
    </DemoRow>
  );
}

function TabsDisabledDemo() {
  return (
    <DemoRow>
      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger disabled value="agents">
            Agents
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </DemoRow>
  );
}

export {
  TabsDemo,
  TabsDisabledDemo,
  TabsLineDemo,
  TabsSizeDemo,
  TabsVerticalDemo,
};
