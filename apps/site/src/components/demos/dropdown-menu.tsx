import {
  CreditCardIcon,
  Delete02Icon,
  Logout01Icon,
  MoreHorizontalIcon,
  PencilEdit01Icon,
  Settings01Icon,
  Share08Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Button } from "@/components/primitives/button";
import {
  createDropdownMenuController,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  dropdownMenuSizes,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import type { DropdownMenuSize } from "@/components/primitives/dropdown-menu";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/primitives/item";
import { sizes, strokes } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  wide: { width: 224 },
  list: { maxWidth: "100%", width: 384 },
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

function Trigger() {
  return (
    <DropdownMenuTrigger render={<Button variant="outline" />}>
      Open
    </DropdownMenuTrigger>
  );
}

function DropdownMenuDemo() {
  return (
    <DemoRow>
      <DropdownMenu>
        <Trigger />
        <DropdownMenuContent sx={styles.wide}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem shortcut="mod+shift+p">Profile</DropdownMenuItem>
            <DropdownMenuItem shortcut="mod+b">Billing</DropdownMenuItem>
            <DropdownMenuItem shortcut="mod+s">Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem shortcut="mod+t">New Team</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem shortcut="mod+shift+q">Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DemoRow>
  );
}

function DropdownMenuSubmenuDemo() {
  return (
    <DemoRow>
      <DropdownMenu>
        <Trigger />
        <DropdownMenuContent>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Email</DropdownMenuItem>
              <DropdownMenuItem>Message</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Calendly</DropdownMenuItem>
                  <DropdownMenuItem>Slack</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Webhook</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Advanced...</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem shortcut="mod+t">New Team</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DemoRow>
  );
}

function DropdownMenuIconsDemo() {
  return (
    <DemoRow>
      <DropdownMenu>
        <Trigger />
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Glyph icon={UserIcon} />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Glyph icon={CreditCardIcon} />
            Billing
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Glyph icon={Settings01Icon} />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Glyph icon={Logout01Icon} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DemoRow>
  );
}

function DropdownMenuCheckboxesDemo() {
  const [statusBar, setStatusBar] = useState(true);
  const [activityBar, setActivityBar] = useState(false);
  const [panel, setPanel] = useState(false);
  return (
    <DemoRow>
      <DropdownMenu>
        <Trigger />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={statusBar}
              onCheckedChange={setStatusBar}
              value="status-bar"
            >
              Status Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activityBar}
              disabled
              onCheckedChange={setActivityBar}
              value="activity-bar"
            >
              Activity Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={panel}
              onCheckedChange={setPanel}
              value="panel"
            >
              Panel
            </DropdownMenuCheckboxItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </DemoRow>
  );
}

function DropdownMenuRadioGroupDemo() {
  const [position, setPosition] = useState("bottom");
  return (
    <DemoRow>
      <DropdownMenu>
        <Trigger />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              onValueChange={setPosition}
              value={position}
            >
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </DemoRow>
  );
}

const sizeLabels = {
  default: "Default",
  lg: "Large",
  sm: "Small",
} satisfies Record<DropdownMenuSize, string>;

function DropdownMenuSizesDemo() {
  return (
    <DemoRow>
      {dropdownMenuSizes.map((size) => (
        <DropdownMenu key={size}>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            {sizeLabels[size]}
          </DropdownMenuTrigger>
          <DropdownMenuContent size={size}>
            <DropdownMenuItem>
              <Glyph icon={UserIcon} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Glyph icon={Settings01Icon} />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Glyph icon={Logout01Icon} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </DemoRow>
  );
}

function DropdownMenuDangerDemo() {
  return (
    <DemoRow>
      <DropdownMenu>
        <Trigger />
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Glyph icon={PencilEdit01Icon} />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Glyph icon={Share08Icon} />
            Share
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive data-agent-confirm="Deletes this file">
            <Glyph icon={Delete02Icon} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DemoRow>
  );
}

interface Doc {
  edited: string;
  name: string;
}

const docs: Doc[] = [
  { edited: "Edited 2 hours ago", name: "Q3 roadmap" },
  { edited: "Edited yesterday", name: "Launch checklist" },
  { edited: "Edited last week", name: "Hiring plan" },
];

const rowMenu = createDropdownMenuController<Doc>();

function DropdownMenuControllerDemo() {
  return (
    <DemoRow>
      <ItemGroup render={<ul />} sx={styles.list}>
        {docs.map((doc) => (
          <Item key={doc.name} render={<li />} variant="outline">
            <ItemContent>
              <ItemTitle>{doc.name}</ItemTitle>
              <ItemDescription>{doc.edited}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <DropdownMenuTrigger
                controller={rowMenu}
                payload={doc}
                render={
                  <Button
                    aria-label={`More for ${doc.name}`}
                    size="icon"
                    variant="ghost"
                  />
                }
              >
                <Glyph icon={MoreHorizontalIcon} />
              </DropdownMenuTrigger>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
      <DropdownMenu controller={rowMenu}>
        <DropdownMenuContent<Doc> align="end">
          {({ payload }) => (
            <>
              <DropdownMenuGroup>
                <DropdownMenuLabel>{payload?.name}</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Glyph icon={PencilEdit01Icon} />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Glyph icon={Share08Icon} />
                  Share
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                destructive
                data-agent-confirm={
                  payload ? `Deletes ${payload.name}` : "Deletes this document"
                }
              >
                <Glyph icon={Delete02Icon} />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </DemoRow>
  );
}

export {
  DropdownMenuCheckboxesDemo,
  DropdownMenuControllerDemo,
  DropdownMenuDangerDemo,
  DropdownMenuDemo,
  DropdownMenuIconsDemo,
  DropdownMenuRadioGroupDemo,
  DropdownMenuSizesDemo,
  DropdownMenuSubmenuDemo,
};
