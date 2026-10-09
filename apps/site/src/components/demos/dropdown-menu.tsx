import {
  CreditCardIcon,
  Delete02Icon,
  Logout01Icon,
  PencilEdit01Icon,
  Settings01Icon,
  Share08Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuEmpty,
  DropdownMenuFilterProvider,
  DropdownMenuGroup,
  DropdownMenuInput,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuList,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  dropdownMenuSizes,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DropdownMenuSize } from "@/components/ui/dropdown-menu";
import { sizes, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  wide: { width: 224 },
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
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
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
            <DropdownMenuItem>
              New Team
              <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
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
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
          </DropdownMenuItem>
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
            >
              Status Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={activityBar}
              disabled
              onCheckedChange={setActivityBar}
            >
              Activity Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={panel}
              onCheckedChange={setPanel}
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

function DropdownMenuFilterDemo() {
  return (
    <DemoRow>
      <DropdownMenuFilterProvider>
        <DropdownMenu>
          <Trigger />
          <DropdownMenuContent sx={styles.wide}>
            <DropdownMenuInput
              aria-label="Filter actions"
              placeholder="Filter..."
            />
            <DropdownMenuEmpty>No actions found.</DropdownMenuEmpty>
            <DropdownMenuList>
              <DropdownMenuGroup>
                <DropdownMenuLabel>File</DropdownMenuLabel>
                <DropdownMenuItem>New file</DropdownMenuItem>
                <DropdownMenuItem>Open file</DropdownMenuItem>
                <DropdownMenuItem>Save</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem>Rename</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuLabel>Share</DropdownMenuLabel>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
                <DropdownMenuItem>Invite people</DropdownMenuItem>
                <DropdownMenuItem>Publish to web</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem variant="danger">Delete</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuList>
          </DropdownMenuContent>
        </DropdownMenu>
      </DropdownMenuFilterProvider>
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
          <DropdownMenuItem variant="danger">
            <Glyph icon={Delete02Icon} />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DemoRow>
  );
}

export {
  DropdownMenuCheckboxesDemo,
  DropdownMenuDangerDemo,
  DropdownMenuDemo,
  DropdownMenuFilterDemo,
  DropdownMenuIconsDemo,
  DropdownMenuRadioGroupDemo,
  DropdownMenuSizesDemo,
  DropdownMenuSubmenuDemo,
};
