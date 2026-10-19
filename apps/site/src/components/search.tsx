import { ArrowRight02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Fragment, useEffect, useState } from "react";
import type { MouseEvent } from "react";

import { Button } from "@/components/primitives/button";
import {
  Command,
  CommandCollection,
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

function Search() {
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(false);
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
        setInstant(true);
        setOpen((was) => !was);
      } else if (
        event.key === "/" &&
        !(event.metaKey || event.ctrlKey || event.altKey) &&
        !isTyping(event.target)
      ) {
        event.preventDefault();
        setInstant(true);
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const show = (event: MouseEvent<HTMLButtonElement>) => {
    // A click from Enter or Space has no click count.
    setInstant(event.detail === 0);
    setOpen(true);
  };

  return (
    <>
      <Button
        aria-label="Search documentation"
        onClick={show}
        size="icon"
        sx={styles.icon}
        variant="ghost"
      >
        {icon(Search01Icon)}
      </Button>
      <Button onClick={show} sx={styles.field}>
        Search documentation...
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog
        description="Search for a page to go to..."
        instant={instant}
        onOpenChange={(next, { reason }) => {
          setInstant(reason === "escape-key");
          setOpen(next);
        }}
        open={open}
        title="Search documentation"
      >
        <Command items={groups}>
          <CommandInput placeholder="Search documentation..." />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandList>
            {(group: Group, index: number) => (
              <Fragment key={group.label}>
                {index > 0 && <CommandSeparator />}
                <CommandGroup items={group.items}>
                  <CommandGroupLabel>{group.label}</CommandGroupLabel>
                  <CommandCollection>
                    {(entry: Entry) => (
                      <CommandItem
                        key={`${entry.to}:${entry.params.slug}`}
                        onClick={() => {
                          setOpen(false);
                          void navigate({ params: entry.params, to: entry.to });
                        }}
                        value={entry}
                      >
                        <span {...stylex.props(styles.arrow)}>
                          {icon(ArrowRight02Icon)}
                        </span>
                        {entry.label}
                      </CommandItem>
                    )}
                  </CommandCollection>
                </CommandGroup>
              </Fragment>
            )}
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
