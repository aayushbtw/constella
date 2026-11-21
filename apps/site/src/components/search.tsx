import { ArrowRight02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { createDialogController } from "@ui-sdk/react/dialog";
import { useShortcut, useShortcutHint } from "@ui-sdk/react/shortcuts";
import { Fragment, useState } from "react";

import { Button } from "@/components/primitives/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/primitives/command";
import { DialogTrigger } from "@/components/primitives/dialog";
import { Kbd, KbdGroup } from "@/components/primitives/kbd";
import {
  colors,
  sizes,
  space,
  strokes,
  media,
} from "@/lib/constella/tokens.stylex";
import type { SidebarGroup } from "~/components/docs/sidebar";
import { blocksGroups, docsGroups } from "~/lib/nav";
import { layout, media as siteMedia } from "~/lib/tokens.stylex";

// styles.ts's `interactive`; keep in step.
const popupOpen =
  ":where([aria-haspopup], [data-slot='hover-card-trigger'], [data-slot='combobox-trigger'])[data-open]";
const hoverIdle = ":hover:not(:disabled, [data-disabled], [data-pending])";
const activeIdle = ":active:not(:disabled, [data-disabled], [data-pending])";
const interactive = <const R, const A>(rest: R, active: A) => ({
  default: rest,
  [popupOpen]: active,
  [media.hover]: {
    default: rest,
    [popupOpen]: active,
    [hoverIdle]: active,
  },
  [activeIdle]: active,
});

// One trigger for both looks: a dialog with two has no name for the agent while closed.
const styles = stylex.create({
  trigger: {
    backgroundColor: {
      ...interactive("transparent", colors.fillSubtle),
      [siteMedia.sidebar]: interactive(colors.fillSubtle, colors.fill),
    },
    color: {
      default: colors.textPrimary,
      [siteMedia.sidebar]: colors.textMuted,
    },
    marginInlineEnd: { default: null, [siteMedia.sidebar]: space.xs },
    paddingInlineEnd: { default: 0, [siteMedia.sidebar]: space.popup },
    paddingInlineStart: { default: 0, [siteMedia.sidebar]: space.popup },
    width: { default: sizes.controlMd, [siteMedia.sidebar]: layout.search },
  },
  icon: {
    display: { default: "flex", [siteMedia.sidebar]: "none" },
  },
  field: {
    alignItems: "center",
    display: { default: "none", [siteMedia.sidebar]: "flex" },
    flexGrow: 1,
    gap: space.row,
    justifyContent: "space-between",
  },
  arrow: {
    color: colors.textMuted,
    display: "flex",
  },
  hint: {
    alignItems: "center",
    display: "flex",
    gap: space.xs,
  },
});

interface Entry {
  label: string;
  params: { slug: string };
  to: SidebarGroup["to"];
  value: string;
}

interface Group {
  items: Entry[];
  label: string;
}

const icon = (glyph: typeof Search01Icon) => (
  <HugeiconsIcon
    aria-hidden
    icon={glyph}
    size={sizes.icon}
    strokeWidth={Number(strokes.icon)}
  />
);

function Search() {
  // oxlint-disable-next-line react/hook-use-state -- created once and never set, as ui-sdk's controller docs do
  const [search] = useState(() => createDialogController());
  const navigate = useNavigate();
  const { blocks, components, docs } = useLoaderData({ from: "__root__" });
  const groups: Group[] = [
    ...docsGroups({ components, docs }),
    ...blocksGroups(blocks),
  ]
    .map(({ items, label, to }) => ({
      items: items.map(({ slug, title }) => ({
        label: title,
        params: { slug },
        to,
        value: `${to}:${slug}`,
      })),
      label,
    }))
    .filter(({ items }) => items.length > 0);

  useShortcut(
    "/",
    (event) => {
      search.setOpen(true, { event, reason: "shortcut" });
    },
    { description: "Search documentation" }
  );
  const hint = useShortcutHint("mod+k");

  return (
    <>
      <DialogTrigger
        controller={search}
        shortcut="mod+k"
        render={
          <Button
            aria-label="Search documentation"
            size="icon"
            sx={styles.trigger}
            variant="ghost"
          />
        }
      >
        <span {...stylex.props(styles.icon)}>{icon(Search01Icon)}</span>
        <span {...stylex.props(styles.field)}>
          Search documentation...
          <Kbd>{hint.text}</Kbd>
        </span>
      </DialogTrigger>
      <CommandDialog
        controller={search}
        description="Search for a page to go to..."
        title="Search documentation"
      >
        <Command>
          <CommandInput
            aria-label="Search pages"
            placeholder="Search documentation..."
          />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandList>
            {groups.map((group, index) => (
              <Fragment key={group.label}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup>
                  <CommandGroupLabel>{group.label}</CommandGroupLabel>
                  {group.items.map((entry) => (
                    <CommandItem
                      key={entry.value}
                      onSelect={() => {
                        search.close();
                        void navigate({ params: entry.params, to: entry.to });
                      }}
                      value={entry.value}
                    >
                      <span {...stylex.props(styles.arrow)}>
                        {icon(ArrowRight02Icon)}
                      </span>
                      {entry.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Fragment>
            ))}
          </CommandList>
          <CommandFooter>
            <span {...stylex.props(styles.hint)}>
              <KbdGroup>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
              </KbdGroup>
              Navigate
            </span>
            <span {...stylex.props(styles.hint)}>
              <Kbd>↵</Kbd>
              Select
            </span>
            <span {...stylex.props(styles.hint)}>
              <Kbd>esc</Kbd>
              Close
            </span>
          </CommandFooter>
        </Command>
      </CommandDialog>
    </>
  );
}

export { Search };
