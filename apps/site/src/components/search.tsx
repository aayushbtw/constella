import { ArrowRight02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { createDialogController } from "@ui-sdk/react/dialog";
import { Fragment, useEffect } from "react";

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
import { colors, sizes, space, strokes } from "@/lib/constella/tokens.stylex";
import type { SidebarGroup } from "~/components/docs/sidebar";
import { blocksGroups, docsGroups } from "~/lib/nav";
import { layout, media } from "~/lib/tokens.stylex";

const styles = stylex.create({
  icon: {
    display: { default: "flex", [media.sidebar]: "none" },
  },
  field: {
    color: colors.textMuted,
    display: { default: "none", [media.sidebar]: "flex" },
    justifyContent: "space-between",
    marginInlineEnd: space.xs,
    width: layout.search,
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

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName))
  );
}

const search = createDialogController();

function Search() {
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

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.repeat) {
        return;
      }
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        search.toggle({ event, reason: "shortcut" });
      } else if (
        event.key === "/" &&
        !(event.metaKey || event.ctrlKey || event.altKey) &&
        !isTyping(event.target)
      ) {
        event.preventDefault();
        search.setOpen(true, { event, reason: "shortcut" });
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <>
      <DialogTrigger
        controller={search}
        render={
          <Button
            aria-label="Search documentation"
            size="icon"
            sx={styles.icon}
            variant="ghost"
          />
        }
      >
        {icon(Search01Icon)}
      </DialogTrigger>
      <DialogTrigger controller={search} render={<Button sx={styles.field} />}>
        Search documentation...
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
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
