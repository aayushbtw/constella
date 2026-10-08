import {
  Add01Icon,
  Cancel01Icon,
  Clock01Icon,
  MinusSignIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  avatarSizes,
  avatarStatuses,
} from "@/components/ui/avatar";
import type { AvatarStatus } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { radii, sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  row: { gap: space.xl },
  round: {
    borderEndEndRadius: radii.full,
    borderEndStartRadius: radii.full,
    borderStartEndRadius: radii.full,
    borderStartStartRadius: radii.full,
  },
});

const me = { fallback: "AY", handle: "aayushbtw" };

const people = [
  { fallback: "CN", handle: "shadcn" },
  { fallback: "ER", handle: "evilrabbit" },
];

function Person({ fallback, handle }: { fallback: string; handle: string }) {
  return (
    <>
      <AvatarImage
        alt={`@${handle}`}
        src={`https://github.com/${handle}.png`}
      />
      <AvatarFallback>{fallback}</AvatarFallback>
    </>
  );
}

const statusIcons = {
  away: Clock01Icon,
  busy: MinusSignIcon,
  offline: Cancel01Icon,
  online: Tick02Icon,
} satisfies Record<AvatarStatus, typeof Add01Icon>;

function Glyph({
  icon = Add01Icon,
  size,
}: {
  icon?: typeof Add01Icon;
  size: string;
}) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      size={size}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

function Group({ count }: { count?: ReactNode }) {
  return (
    <AvatarGroup>
      {people.map((person) => (
        <Avatar key={person.handle}>
          <Person {...person} />
        </Avatar>
      ))}
      {count !== undefined && <AvatarGroupCount>{count}</AvatarGroupCount>}
    </AvatarGroup>
  );
}

function AvatarDemo() {
  return (
    <DemoRow sx={styles.row}>
      <Avatar>
        <Person {...me} />
      </Avatar>
      <Avatar>
        <Person fallback="ER" handle="evilrabbit" />
        <AvatarBadge status="online" />
      </Avatar>
      <Group count="+3" />
    </DemoRow>
  );
}

function AvatarFallbackDemo() {
  return (
    <DemoRow>
      <Avatar>
        <AvatarFallback>{me.fallback}</AvatarFallback>
      </Avatar>
    </DemoRow>
  );
}

function AvatarBadgeDemo() {
  return (
    <DemoRow>
      {avatarStatuses.map((status) => (
        <Avatar key={status}>
          <Person {...me} />
          <AvatarBadge status={status} />
        </Avatar>
      ))}
    </DemoRow>
  );
}

function AvatarBadgeIconDemo() {
  return (
    <DemoRow>
      {avatarStatuses.map((status) => (
        <Avatar key={status}>
          <Person {...me} />
          <AvatarBadge status={status}>
            <Glyph icon={statusIcons[status]} size={sizes.iconXxs} />
          </AvatarBadge>
        </Avatar>
      ))}
      <Avatar>
        <Person {...me} />
        <AvatarBadge>
          <Glyph size={sizes.iconXxs} />
        </AvatarBadge>
      </Avatar>
    </DemoRow>
  );
}

function AvatarGroupIconDemo() {
  return (
    <DemoRow>
      <Group count={<Glyph size={sizes.icon} />} />
    </DemoRow>
  );
}

function AvatarGroupDemo() {
  return (
    <DemoRow>
      <Group />
    </DemoRow>
  );
}

function AvatarGroupCountDemo() {
  return (
    <DemoRow>
      <Group count="+3" />
    </DemoRow>
  );
}

function AvatarSizeDemo() {
  return (
    <DemoRow>
      {avatarSizes.map((size) => (
        <Avatar key={size} size={size}>
          <Person {...me} />
        </Avatar>
      ))}
    </DemoRow>
  );
}

function AvatarDropdownDemo() {
  return (
    <DemoRow>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              aria-label="Account"
              size="icon"
              sx={styles.round}
              variant="ghost"
            />
          }
        >
          <Avatar>
            <Person {...me} />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="danger">Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DemoRow>
  );
}

export {
  AvatarBadgeDemo,
  AvatarBadgeIconDemo,
  AvatarDemo,
  AvatarDropdownDemo,
  AvatarFallbackDemo,
  AvatarGroupIconDemo,
  AvatarGroupCountDemo,
  AvatarGroupDemo,
  AvatarSizeDemo,
};
