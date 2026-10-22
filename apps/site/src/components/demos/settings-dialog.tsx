import {
  Notification01Icon,
  Settings01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import { useState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Card } from "@/components/primitives/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/primitives/field";
import { Input } from "@/components/primitives/input";
import {
  SettingsDialog,
  SettingsDialogNav,
  SettingsDialogPage,
} from "@/components/primitives/settings-dialog";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuLabel,
} from "@/components/primitives/sidebar";
import { Switch } from "@/components/primitives/switch";
import { sizes, strokes } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

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

function SettingRow({
  children,
  defaultChecked,
  description,
}: {
  children: ReactNode;
  defaultChecked?: boolean;
  description: ReactNode;
}) {
  return (
    <Field>
      <FieldLabel>
        <FieldContent>
          <FieldTitle>{children}</FieldTitle>
          <FieldDescription>{description}</FieldDescription>
        </FieldContent>
        <Switch defaultChecked={defaultChecked} />
      </FieldLabel>
    </Field>
  );
}

function General() {
  return (
    <SettingsDialogPage
      description="How Acme shows up for everyone in it."
      title="General"
    >
      <Field>
        <FieldLabel>Workspace name</FieldLabel>
        <Input defaultValue="Acme" name="workspace" />
      </Field>
      <Card size="flush">
        <FieldGroup>
          <SettingRow
            defaultChecked
            description="Show a preview of each link in a message."
          >
            Link previews
          </SettingRow>
          <SettingRow description="Open new chats in a side panel instead of a page.">
            Open chats beside the page
          </SettingRow>
        </FieldGroup>
      </Card>
    </SettingsDialogPage>
  );
}

function Notifications() {
  return (
    <SettingsDialogPage
      description="Choose what reaches you, and where."
      title="Notifications"
    >
      <Card size="flush">
        <FieldGroup>
          <SettingRow defaultChecked description="When someone @mentions you.">
            Mentions
          </SettingRow>
          <SettingRow
            defaultChecked
            description="When someone replies in a thread you started."
          >
            Replies
          </SettingRow>
          <SettingRow description="A summary of the week’s activity, every Monday.">
            Weekly digest
          </SettingRow>
          <SettingRow description="Sent to alex@acme.com as well as in the app.">
            Email
          </SettingRow>
        </FieldGroup>
      </Card>
    </SettingsDialogPage>
  );
}

function Members() {
  return (
    <SettingsDialogPage
      description="Who can join Acme without an invite."
      title="Members"
    >
      <Card size="flush">
        <FieldGroup>
          <SettingRow
            defaultChecked
            description="Anyone with an @acme.com email can join."
          >
            Join by domain
          </SettingRow>
          <SettingRow description="Members can invite people from outside Acme.">
            Guest invites
          </SettingRow>
        </FieldGroup>
      </Card>
    </SettingsDialogPage>
  );
}

const pages = [
  { icon: Settings01Icon, id: "general", label: "General", Page: General },
  {
    icon: Notification01Icon,
    id: "notifications",
    label: "Notifications",
    Page: Notifications,
  },
  { icon: UserGroupIcon, id: "members", label: "Members", Page: Members },
] as const;

type PageId = (typeof pages)[number]["id"];

function SettingsDialogDemo() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<PageId>("general");
  const page = pages.find((entry) => entry.id === current) ?? pages[0];
  return (
    <DemoRow>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        variant="outline"
      >
        Settings
      </Button>
      <SettingsDialog onOpenChange={setOpen} open={open}>
        <SettingsDialogNav label="Settings" title="Acme">
          {pages.map((entry) => (
            <SidebarMenuItem key={entry.id}>
              <SidebarMenuButton
                isActive={entry.id === current}
                onClick={() => {
                  setCurrent(entry.id);
                }}
              >
                <Glyph icon={entry.icon} />
                <SidebarMenuLabel>{entry.label}</SidebarMenuLabel>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SettingsDialogNav>
        <page.Page />
      </SettingsDialog>
    </DemoRow>
  );
}

export { SettingsDialogDemo };
