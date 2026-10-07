import * as stylex from "@stylexjs/stylex";

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  avatarSizes,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { colors, radii, space } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  row: { gap: space.xl },
  online: { backgroundColor: colors.success },
  round: { borderRadius: radii.full },
});

const people = [
  { fallback: "CN", handle: "shadcn" },
  { fallback: "LR", handle: "maxleiter" },
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

function Group() {
  return (
    <AvatarGroup>
      {people.map((person) => (
        <Avatar key={person.handle}>
          <Person {...person} />
        </Avatar>
      ))}
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  );
}

function AvatarDemo() {
  return (
    <DemoRow sx={styles.row}>
      <Avatar>
        <Person fallback="CN" handle="shadcn" />
      </Avatar>
      <Avatar>
        <Person fallback="ER" handle="evilrabbit" />
        <AvatarBadge sx={styles.online} />
      </Avatar>
      <Group />
    </DemoRow>
  );
}

function AvatarFallbackDemo() {
  return (
    <DemoRow>
      <Avatar>
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </DemoRow>
  );
}

function AvatarBadgeDemo() {
  return (
    <DemoRow>
      <Avatar>
        <Person fallback="CN" handle="shadcn" />
        <AvatarBadge sx={styles.online} />
      </Avatar>
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

function AvatarSizeDemo() {
  return (
    <DemoRow>
      {avatarSizes.map((size) => (
        <Avatar key={size} size={size}>
          <Person fallback="CN" handle="shadcn" />
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
            <Person fallback="CN" handle="shadcn" />
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
  AvatarDemo,
  AvatarDropdownDemo,
  AvatarFallbackDemo,
  AvatarGroupDemo,
  AvatarSizeDemo,
};
