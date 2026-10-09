import {
  Add01Icon,
  Delete02Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  BookOpen01Icon,
  BubbleChatIcon,
  CommandIcon,
  CpuIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { SidebarCollapsible, SidebarSide } from "@/components/ui/sidebar";
import {
  colors,
  fontSizes,
  fontWeights,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  frame: {
    borderBlockEndColor: colors.edge,
    borderBlockStartColor: colors.edge,
    borderInlineEndColor: colors.edge,
    borderInlineStartColor: colors.edge,
    borderBlockEndStyle: "solid",
    borderBlockStartStyle: "solid",
    borderInlineEndStyle: "solid",
    borderInlineStartStyle: "solid",
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    height: 480,
    minHeight: 0,
    overflow: "hidden",
  },
  brand: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    color: colors.onAccent,
    display: "flex",
    flexShrink: 0,
    height: sizes.controlMd,
    justifyContent: "center",
    width: sizes.controlMd,
  },
  stack: { display: "flex", flexDirection: "column", lineHeight: 1.3 },
  strong: { fontWeight: fontWeights.medium },
  muted: { color: colors.textSecondary, fontSize: fontSizes.xs },
  topbar: {
    alignItems: "center",
    borderBlockEndColor: colors.edgeSubtle,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    color: colors.textPrimary,
    display: "flex",
    fontSize: fontSizes.sm,
    gap: space.xs,
    height: sizes.media,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.xs,
  },
  separator: { height: space.md },
  body: {
    display: "grid",
    gap: space.sm,
    gridTemplateColumns: "repeat(3, 1fr)",
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
  tile: {
    aspectRatio: "16 / 10",
    backgroundColor: colors.fillSubtle,
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
  },
});

function Glyph(props: Omit<HugeiconsIconProps, "size" | "strokeWidth">) {
  return (
    <HugeiconsIcon
      aria-hidden
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
      {...props}
    />
  );
}

const nav = [
  { icon: BubbleChatIcon, label: "Chats", badge: "12" },
  { icon: CpuIcon, label: "Models" },
  { icon: BookOpen01Icon, label: "Docs" },
  { icon: Settings01Icon, label: "Settings" },
];

const docs = ["Introduction", "Get Started", "Changelog"];

function AppSidebar({
  collapsible,
  side = "left",
}: {
  collapsible: SidebarCollapsible;
  side?: SidebarSide;
}) {
  const [current, setCurrent] = useState("Chats");
  return (
    <Sidebar collapsible={collapsible} side={side}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <span {...stylex.props(styles.brand)}>
                <Glyph icon={CommandIcon} />
              </span>
              <span {...stylex.props(styles.stack)}>
                <span {...stylex.props(styles.strong)}>Acme Inc</span>
                <span {...stylex.props(styles.muted)}>Enterprise</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupAction aria-label="New chat" title="New chat">
            <Glyph icon={Add01Icon} />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    isActive={current === item.label}
                    onClick={() => {
                      setCurrent(item.label);
                    }}
                    tooltip={item.label}
                    withEnd={item.badge !== undefined}
                  >
                    <Glyph icon={item.icon} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.badge !== undefined && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                  {item.label === "Docs" && (
                    <SidebarMenuSub>
                      {docs.map((doc) => (
                        <SidebarMenuSubItem key={doc}>
                          <SidebarMenuSubButton href="#sidebar">
                            {doc}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar>
                <AvatarImage alt="" src="https://github.com/shadcn.png" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <span {...stylex.props(styles.stack)}>
                <span {...stylex.props(styles.strong)}>shadcn</span>
                <span {...stylex.props(styles.muted)}>m@example.com</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function Page() {
  return (
    <SidebarInset>
      <header {...stylex.props(styles.topbar)}>
        <SidebarTrigger />
        <Separator orientation="vertical" sx={styles.separator} />
        Chats
      </header>
      <div {...stylex.props(styles.body)}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} {...stylex.props(styles.tile)} />
        ))}
      </div>
    </SidebarInset>
  );
}

function SidebarDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <SidebarProvider sx={styles.frame}>
        <AppSidebar collapsible="icon" />
        <Page />
      </SidebarProvider>
    </DemoRow>
  );
}

function SidebarOffcanvasDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <SidebarProvider sx={styles.frame}>
        <AppSidebar collapsible="offcanvas" />
        <Page />
      </SidebarProvider>
    </DemoRow>
  );
}

const recents = [
  "Quarterly revenue summary",
  "Draft the launch email",
  "Compare vector databases",
  "Fix flaky checkout test",
  "Plan the offsite agenda",
];

function RecentChats() {
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(recents[0]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recent</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {loading
            ? recents.map((chat) => (
                <SidebarMenuItem key={chat}>
                  <SidebarMenuSkeleton />
                </SidebarMenuItem>
              ))
            : recents.map((chat) => (
                <SidebarMenuItem key={chat}>
                  <SidebarMenuButton
                    isActive={current === chat}
                    onClick={() => {
                      setCurrent(chat);
                    }}
                    withEnd
                  >
                    <span>{chat}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarMenuAction aria-label="More" showOnHover />
                      }
                    >
                      <Glyph icon={MoreHorizontalIcon} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="right">
                      <DropdownMenuItem>
                        <Glyph icon={PencilEdit01Icon} />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="danger">
                        <Glyph icon={Delete02Icon} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function SidebarActionDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <SidebarProvider sx={styles.frame}>
        <Sidebar collapsible="offcanvas">
          <SidebarContent>
            <RecentChats />
          </SidebarContent>
        </Sidebar>
        <Page />
      </SidebarProvider>
    </DemoRow>
  );
}

function SidebarRightDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <SidebarProvider sx={styles.frame}>
        <Page />
        <AppSidebar collapsible="icon" side="right" />
      </SidebarProvider>
    </DemoRow>
  );
}

export {
  SidebarActionDemo,
  SidebarDemo,
  SidebarOffcanvasDemo,
  SidebarRightDemo,
};
