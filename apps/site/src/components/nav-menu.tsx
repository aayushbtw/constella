import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { Link, useLoaderData, useRouterState } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  DialogViewport,
} from "@/components/primitives/dialog";
import { scrollFade } from "@/lib/constella/scroll-fade";
import { typeStyles, visuallyHidden } from "@/lib/constella/styles";
import {
  colors,
  durations,
  fontWeights,
  media,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";
import type { SidebarGroup } from "~/components/docs/sidebar";
import { Logo } from "~/components/logo";
import { config } from "~/lib/config";
import { docsGroups } from "~/lib/nav";
import { layout, media as siteMedia } from "~/lib/tokens.stylex";

const styles = stylex.create({
  trigger: {
    display: { default: "flex", [siteMedia.sidebar]: "none" },
  },
  viewport: {
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
  },
  // Covers the page, so the menu reads as the header opened up.
  popup: {
    backgroundColor: colors.background,
    borderEndEndRadius: 0,
    borderEndStartRadius: 0,
    borderStartEndRadius: 0,
    borderStartStartRadius: 0,
    boxShadow: "none",
    gap: 0,
    height: "100%",
    maxHeight: "none",
    overflowY: "hidden",
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    width: "100%",
  },
  bar: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    height: layout.header,
    justifyContent: "space-between",
    paddingInlineEnd: layout.gutter,
    paddingInlineStart: layout.gutter,
  },
  brand: {
    alignItems: "center",
    color: colors.textPrimary,
    display: "flex",
    fontWeight: fontWeights.semibold,
    gap: space.xs,
    textDecoration: "none",
  },
  // The back arrow's glyph lines up with the rows below, not its button's edge.
  back: {
    marginInlineStart: `calc(-1 * ${space.xs})`,
  },
  nav: {
    flexGrow: 1,
    minHeight: 0,
    overflowY: "auto",
    overscrollBehaviorY: "contain",
    paddingBlockEnd: space.lg,
    paddingBlockStart: space.lg,
    paddingInlineEnd: layout.gutter,
    paddingInlineStart: layout.gutter,
  },
  // Named only while the level changes, so other view transitions leave it alone.
  swap: {
    viewTransitionClass: "sidebar-swap",
    viewTransitionName: "match-element",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    listStyle: "none",
  },
  row: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderBlockWidth: 0,
    borderInlineWidth: 0,
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: colors.textMuted,
        ":hover": colors.textPrimary,
      },
      ":is([aria-current='page'])": colors.textPrimary,
    },
    cursor: "pointer",
    display: "flex",
    fontFamily: "inherit",
    fontWeight: fontWeights.semimedium,
    justifyContent: "space-between",
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    textAlign: "start",
    textDecoration: "none",
    transitionDuration: durations.hover,
    transitionProperty: "color",
    width: "100%",
  },
  current: {
    color: colors.textPrimary,
  },
});

const icon = (glyph: typeof Menu01Icon, rtlFlip = false) => (
  <HugeiconsIcon
    data-rtl-flip={rtlFlip || undefined}
    icon={glyph}
    size={sizes.icon}
    strokeWidth={Number(strokes.icon)}
  />
);

// Same check and slide as the Sidebar primitive's section change, which base.css animates.
function supportsSectionChange() {
  return (
    CSS.supports("selector(:active-view-transition-type(a))") &&
    CSS.supports("view-transition-name: match-element")
  );
}

const pathOf = (to: SidebarGroup["to"], slug: string) =>
  to.replace("$slug", slug);

// Below the sidebar breakpoint, the header links and the sidebar move in here.
function NavMenu() {
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [swapping, setSwapping] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const groups = docsGroups(useLoaderData({ from: "__root__" })).filter(
    ({ items }) => items.length > 0
  );
  const group = groups.find(({ label }) => label === openGroup);

  const onOpenChange = (next: boolean) => {
    if (next) {
      setOpenGroup(null);
    }
    setOpen(next);
  };
  const close = () => {
    setOpen(false);
  };
  // The pressed row unmounts, so focus moves to what replaced it.
  const swap = (
    direction: "back" | "forward",
    next: string | null,
    focus: () => void
  ) => {
    const update = () => {
      flushSync(() => {
        setOpenGroup(next);
      });
      navRef.current?.scrollTo({ top: 0 });
      focus();
    };
    if (!supportsSectionChange()) {
      update();
      return;
    }
    flushSync(() => {
      setSwapping(true);
    });
    const transition = document.startViewTransition({
      types: [`sidebar-${direction}`],
      update,
    });
    async function settle() {
      await Promise.allSettled([transition.finished]);
      setSwapping(false);
    }
    void settle();
  };
  const enter = (label: string) => {
    swap("forward", label, () => {
      backRef.current?.focus();
    });
  };
  const back = () => {
    swap("back", null, () => {
      navRef.current
        ?.querySelector<HTMLElement>(`[data-group="${openGroup}"]`)
        ?.focus();
    });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogTrigger
        aria-label="Open navigation"
        render={<Button size="icon" sx={styles.trigger} variant="ghost" />}
      >
        {icon(Menu01Icon)}
      </DialogTrigger>
      <DialogPortal>
        <DialogViewport sx={styles.viewport}>
          <DialogPopup initialFocus={popupRef} ref={popupRef} sx={styles.popup}>
            <DialogTitle sx={visuallyHidden.base}>Navigation</DialogTitle>
            <div {...stylex.props(styles.bar)}>
              {group ? (
                <Button
                  aria-label="Back"
                  onClick={back}
                  ref={backRef}
                  size="icon"
                  sx={[styles.back, swapping && styles.swap]}
                  variant="ghost"
                >
                  {icon(ArrowLeft01Icon, true)}
                </Button>
              ) : (
                <Link
                  onClick={close}
                  to="/"
                  {...stylex.props(
                    [typeStyles.textSm, styles.brand],
                    swapping && styles.swap
                  )}
                >
                  <Logo />
                  {config.name}
                </Link>
              )}
              <DialogClose
                aria-label="Close navigation"
                render={<Button size="icon" variant="ghost" />}
              >
                {icon(Cancel01Icon)}
              </DialogClose>
            </div>
            <nav
              aria-label={group?.label ?? "Main"}
              ref={navRef}
              {...stylex.props(
                scrollFade.y,
                styles.nav,
                swapping && styles.swap
              )}
            >
              <ul {...stylex.props(styles.list)}>
                {group
                  ? group.items.map(({ slug, title }) => (
                      <li key={slug}>
                        <Link
                          onClick={close}
                          params={{ slug }}
                          to={group.to}
                          {...stylex.props([typeStyles.heading4, styles.row])}
                        >
                          {title}
                        </Link>
                      </li>
                    ))
                  : groups.map(({ items, label, to }) => (
                      <li key={label}>
                        <button
                          data-group={label}
                          onClick={() => {
                            enter(label);
                          }}
                          type="button"
                          {...stylex.props(
                            [typeStyles.heading4, styles.row],
                            items.some(
                              ({ slug }) => pathOf(to, slug) === pathname
                            ) && styles.current
                          )}
                        >
                          {label}
                          {icon(ArrowRight01Icon, true)}
                        </button>
                      </li>
                    ))}
              </ul>
            </nav>
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </Dialog>
  );
}

export { NavMenu };
