import {
  ArrowLeft01Icon,
  BookOpen01Icon,
  BotIcon,
  BubbleChatIcon,
  CreditCardIcon,
  Delete02Icon,
  Folder01Icon,
  Key01Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  PencilEdit02Icon,
  Search01Icon,
  Settings01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import {
  Sidebar,
  SidebarContent,
  SidebarExpandedOnly,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarHeaderActions,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuKbd,
  SidebarMenuLabel,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarTriggerMark,
  useSidebar,
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
import { Logo } from "~/components/logo";

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
  // Clips past the edge while the sidebar opens, until it fits.
  brand: {
    alignItems: "center",
    color: colors.textPrimary,
    display: "flex",
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    gap: space.xs,
    minWidth: 0,
    overflow: "hidden",
    paddingInlineStart: space.xs,
    whiteSpace: "nowrap",
  },
  topbar: {
    alignItems: "center",
    borderBlockEndColor: colors.edgeSubtle,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: strokes.border,
    color: colors.textPrimary,
    display: "flex",
    flexShrink: 0,
    fontSize: fontSizes.sm,
    gap: space.xs,
    height: sizes.header,
    paddingInlineEnd: space.sm,
    paddingInlineStart: space.md,
  },
  topbarWithTrigger: { paddingInlineStart: space.xs },
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
  { icon: BubbleChatIcon, label: "Chats" },
  { icon: Folder01Icon, label: "Assets" },
  { icon: BotIcon, label: "Agents" },
];

const docs = ["Introduction", "Get Started", "Changelog"];

const recents = [
  "Quarterly revenue summary for the board",
  "Draft the launch email",
  "Compare vector databases for semantic search",
  "Fix flaky checkout test",
  "Plan the offsite agenda",
];

// In the sidebar only where the page has none: beside the icon rail, and in the mobile sheet to close it.
function HeaderTrigger({
  collapsible,
  mark,
}: {
  collapsible: SidebarCollapsible;
  mark: ReactNode;
}) {
  const { isMobile } = useSidebar();
  if (collapsible !== "icon" && !isMobile) {
    return null;
  }
  return (
    <SidebarHeaderActions>
      <SidebarTrigger kbd={<Kbd>⌘B</Kbd>}>
        <SidebarTriggerMark>{mark}</SidebarTriggerMark>
      </SidebarTrigger>
    </SidebarHeaderActions>
  );
}

function Header({ collapsible }: { collapsible: SidebarCollapsible }) {
  return (
    <SidebarHeader>
      <SidebarExpandedOnly>
        <span {...stylex.props(styles.brand)}>
          <Logo size={sizes.icon} />
          <SidebarMenuLabel>Constella</SidebarMenuLabel>
        </span>
      </SidebarExpandedOnly>
      <HeaderTrigger
        collapsible={collapsible}
        mark={<Logo size={sizes.icon} />}
      />
    </SidebarHeader>
  );
}

function Row({
  current,
  icon,
  label,
  onSelect,
}: {
  current: string;
  icon: HugeiconsIconProps["icon"];
  label: string;
  onSelect: (label: string) => void;
}) {
  return (
    <SidebarMenuButton
      isActive={current === label}
      onClick={() => {
        onSelect(label);
      }}
      tooltip={label}
    >
      <Glyph icon={icon} />
      <SidebarMenuLabel>{label}</SidebarMenuLabel>
    </SidebarMenuButton>
  );
}

function ChatActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<SidebarMenuAction aria-label="More" showOnHover />}
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
  );
}

function Recents({
  current,
  onSelect,
}: {
  current: string;
  onSelect: (label: string) => void;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recents</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {recents.map((chat) => (
            <SidebarMenuItem key={chat}>
              <SidebarMenuButton
                isActive={current === chat}
                onClick={() => {
                  onSelect(chat);
                }}
                tooltip={chat}
              >
                <SidebarMenuLabel>{chat}</SidebarMenuLabel>
              </SidebarMenuButton>
              <ChatActions />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function User() {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="shadcn">
            <Avatar size="sm">
              <AvatarImage alt="" src="https://github.com/shadcn.png" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
            <SidebarMenuLabel>shadcn</SidebarMenuLabel>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

const settings = [
  { icon: Settings01Icon, label: "General" },
  { icon: UserGroupIcon, label: "Members" },
  { icon: CreditCardIcon, label: "Billing" },
  { icon: Key01Icon, label: "API keys" },
];

function SettingsHeader({
  collapsible,
  onBack,
}: {
  collapsible: SidebarCollapsible;
  onBack: () => void;
}) {
  return (
    <SidebarHeader>
      <SidebarExpandedOnly>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={onBack}>
              <Glyph icon={ArrowLeft01Icon} data-rtl-flip />
              <SidebarMenuLabel>Back</SidebarMenuLabel>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarExpandedOnly>
      <HeaderTrigger
        collapsible={collapsible}
        mark={<Logo size={sizes.icon} />}
      />
    </SidebarHeader>
  );
}

function AppSidebar({
  collapsible,
  current,
  onSelect,
  side,
}: {
  collapsible: SidebarCollapsible;
  current: string;
  onSelect: (label: string) => void;
  side: SidebarSide;
}) {
  const { changeSection } = useSidebar();
  const [inSettings, setInSettings] = useState(false);
  if (inSettings) {
    return (
      <Sidebar collapsible={collapsible} side={side}>
        <SettingsHeader
          collapsible={collapsible}
          onBack={() => {
            changeSection("back", () => {
              setInSettings(false);
              onSelect("Chats");
            });
          }}
        />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarMenu>
              {settings.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Row
                    current={current}
                    icon={item.icon}
                    label={item.label}
                    onSelect={onSelect}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <User />
        <SidebarRail />
      </Sidebar>
    );
  }
  return (
    <Sidebar collapsible={collapsible} side={side}>
      <Header collapsible={collapsible} />
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={
                <>
                  New chat
                  <Kbd>⌘O</Kbd>
                </>
              }
            >
              <Glyph icon={PencilEdit02Icon} />
              <SidebarMenuLabel>New chat</SidebarMenuLabel>
              <SidebarMenuKbd>
                <Kbd>⌘O</Kbd>
              </SidebarMenuKbd>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Search">
              <Glyph icon={Search01Icon} />
              <SidebarMenuLabel>Search</SidebarMenuLabel>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {nav.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Row
                current={current}
                icon={item.icon}
                label={item.label}
                onSelect={onSelect}
              />
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <Row
              current={current}
              icon={BookOpen01Icon}
              label="Docs"
              onSelect={onSelect}
            />
            <SidebarMenuSub>
              {docs.map((doc) => (
                <SidebarMenuSubItem key={doc}>
                  <SidebarMenuSubButton href="#sidebar">
                    {doc}
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                changeSection("forward", () => {
                  setInSettings(true);
                  onSelect("General");
                });
              }}
              tooltip="Settings"
            >
              <Glyph icon={Settings01Icon} />
              <SidebarMenuLabel>Settings</SidebarMenuLabel>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarExpandedOnly>
          <Recents current={current} onSelect={onSelect} />
        </SidebarExpandedOnly>
      </SidebarContent>
      <User />
      <SidebarRail />
    </Sidebar>
  );
}

// The sidebar holds its own trigger; the page shows one only where the sidebar can't.
function Page({
  title,
  trigger = false,
}: {
  title: string;
  trigger?: boolean;
}) {
  const { isMobile } = useSidebar();
  const showTrigger = trigger || isMobile;
  return (
    <SidebarInset>
      <header
        {...stylex.props(
          styles.topbar,
          showTrigger && styles.topbarWithTrigger
        )}
      >
        {showTrigger && <SidebarTrigger />}
        {title}
      </header>
      <div {...stylex.props(styles.body)}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} {...stylex.props(styles.tile)} />
        ))}
      </div>
    </SidebarInset>
  );
}

function App({
  collapsible,
  side = "left",
  trigger = false,
}: {
  collapsible: SidebarCollapsible;
  side?: SidebarSide;
  trigger?: boolean;
}) {
  const [current, setCurrent] = useState("Chats");
  const sidebar = (
    <AppSidebar
      collapsible={collapsible}
      current={current}
      onSelect={setCurrent}
      side={side}
    />
  );
  const page = <Page title={current} trigger={trigger} />;
  return (
    <DemoRow sx={styles.stage}>
      <SidebarProvider sx={styles.frame}>
        {side === "left" ? sidebar : page}
        {side === "left" ? page : sidebar}
      </SidebarProvider>
    </DemoRow>
  );
}

function SidebarDemo() {
  return <App collapsible="icon" />;
}

function SidebarOffcanvasDemo() {
  return <App collapsible="offcanvas" trigger />;
}

function SidebarRightDemo() {
  return <App collapsible="icon" side="right" />;
}

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
  if (!loading) {
    return <Recents current={current} onSelect={setCurrent} />;
  }
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recents</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {recents.map((chat) => (
            <SidebarMenuItem key={chat}>
              <SidebarMenuSkeleton />
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
        <Page title="Chats" trigger />
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
