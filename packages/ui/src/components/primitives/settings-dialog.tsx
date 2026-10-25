"use client";

import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/primitives/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarProvider,
} from "@/components/primitives/sidebar";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles } from "@/lib/constella/styles";
import { media, sizes, space } from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

const styles = stylex.create({
  // Narrow, the nav stacks above the page.
  popup: {
    flexDirection: { default: "column", [media.sm]: "row" },
    gap: 0,
    height: sizes.settingsDialogHeight,
    overflowX: "hidden",
    overflowY: "hidden",
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    width: `min(100%, ${sizes.settingsDialog})`,
  },
  // The provider fills the window beside an app; here it only holds the nav.
  provider: {
    flexShrink: 0,
    minHeight: 0,
    width: "auto",
  },
  // Stacked, the nav runs under the close button, so its rows end before it.
  nav: {
    height: { default: "auto", [media.sm]: "100%" },
    paddingBlockStart: space.md,
    paddingInlineEnd: {
      default: `calc(${sizes.controlSm} + ${space.xs})`,
      [media.sm]: 0,
    },
    width: { default: "100%", [media.sm]: sizes.sidebar },
  },
  // The one pane that scrolls on its own: the page behind a dialog can't.
  page: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: space.md,
    minHeight: 0,
    minWidth: 0,
    overflowY: "auto",
    paddingBlockEnd: space.lg,
    paddingBlockStart: space.lg,
    paddingInlineEnd: space.lg,
    paddingInlineStart: space.lg,
  },
  // Beside the nav, the close button drops to the page's padding, onto its title line.
  close: {
    insetBlockStart: { default: space.xs, [media.sm]: space.lg },
    insetInlineEnd: { default: space.xs, [media.sm]: space.lg },
  },
  // Ends its controls clear of the close button on the same line.
  header: {
    paddingInlineEnd: {
      default: `calc(${sizes.controlSm} + ${space.xs} * 2 - ${space.lg})`,
      [media.sm]: `calc(${sizes.controlSm} + ${space.lg})`,
    },
  },
  titleLine: {
    alignItems: "center",
    display: "flex",
    gap: space.sm,
    minHeight: sizes.controlSm,
  },
  title: {
    flexGrow: 1,
    minWidth: 0,
  },
});

/** A dialog laid out as a nav beside a page, with a close button in its corner. */
function SettingsDialog({
  children,
  sx,
  ...props
}: Omit<ComponentProps<typeof Dialog>, "children"> & {
  children?: ReactNode;
  sx?: Sx;
}) {
  return (
    <Dialog {...props}>
      <DialogContent data-slot="settings-dialog" sx={[styles.popup, sx]}>
        {children}
        <DialogCloseButton sx={styles.close} />
      </DialogContent>
    </Dialog>
  );
}

/** Holds a `SidebarMenuItem` per page, under an optional group `title`. */
function SettingsDialogNav({
  children,
  label,
  sx,
  title,
  ...props
}: Styled<Omit<ComponentProps<"div">, "ref" | "title">> & {
  label: string;
  title?: ReactNode;
}) {
  return (
    <SidebarProvider sx={styles.provider}>
      <Sidebar collapsible="none" {...props} sx={[styles.nav, sx]}>
        <SidebarContent>
          <SidebarGroup>
            {title === undefined ? null : (
              <SidebarGroupLabel>{title}</SidebarGroupLabel>
            )}
            <nav aria-label={label}>
              <SidebarMenu>{children}</SidebarMenu>
            </nav>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

function SettingsDialogPage({
  action,
  children,
  description,
  leading,
  sx,
  title,
  ...props
}: Styled<Omit<ComponentProps<"div">, "title">> & {
  action?: ReactNode;
  description?: ReactNode;
  leading?: ReactNode;
  title: ReactNode;
}) {
  return (
    <div
      data-slot="settings-dialog-page"
      {...props}
      {...stylex.props(styles.page, sx)}
    >
      <DialogHeader sx={styles.header}>
        <div {...stylex.props(styles.titleLine)}>
          {leading}
          <DialogTitle sx={[typeStyles.textLg, styles.title]}>
            {title}
          </DialogTitle>
          {action}
        </div>
        {description === undefined ? null : (
          <DialogDescription>{description}</DialogDescription>
        )}
      </DialogHeader>
      {children}
    </div>
  );
}

export { SettingsDialog, SettingsDialogNav, SettingsDialogPage };
