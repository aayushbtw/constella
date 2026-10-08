"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { dialogStyles } from "@/components/ui/dialog";
import { colors, radii, sizes, space } from "@/lib/tokens.stylex";

const alertDialogSizes = ["sm", "default"] as const;

type AlertDialogSize = (typeof alertDialogSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

type AlertDialogContentProps = Styled<AlertDialogPrimitive.Popup.Props> & {
  size?: AlertDialogSize;
};

const inSmall = ":is([data-slot='alert-dialog-content'][data-size='sm'] *)";

const styles = stylex.create({
  // A small confirm centers its text over two equal buttons.
  header: {
    alignItems: { default: "flex-start", [inSmall]: "center" },
    textAlign: { default: "start", [inSmall]: "center" },
  },
  footer: {
    display: { default: "flex", [inSmall]: "grid" },
    gridTemplateColumns: { default: null, [inSmall]: "1fr 1fr" },
  },
  media: {
    alignItems: "center",
    backgroundColor: colors.fill,
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    display: "inline-flex",
    flexShrink: 0,
    height: sizes.media,
    justifyContent: "center",
    marginBlockEnd: space.xs,
    width: sizes.media,
  },
});

function AlertDialog(props: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root {...props} />;
}

function AlertDialogTrigger(props: AlertDialogPrimitive.Trigger.Props) {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

function AlertDialogPortal(props: AlertDialogPrimitive.Portal.Props) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
  );
}

function AlertDialogBackdrop({
  sx,
  ...props
}: Styled<AlertDialogPrimitive.Backdrop.Props>) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-backdrop"
      {...props}
      {...stylex.props(dialogStyles.backdrop, sx)}
    />
  );
}

/** Renders the portal, backdrop, viewport and popup: a dialog's surface. */
function AlertDialogContent({
  size = "default",
  sx,
  ...props
}: AlertDialogContentProps) {
  return (
    <AlertDialogPortal>
      <AlertDialogBackdrop />
      <AlertDialogPrimitive.Viewport
        data-slot="alert-dialog-viewport"
        {...stylex.props(dialogStyles.viewport)}
      >
        <AlertDialogPrimitive.Popup
          data-size={size}
          data-slot="alert-dialog-content"
          {...props}
          {...stylex.props(
            dialogStyles.popup,
            size === "sm" && dialogStyles.sm,
            sx
          )}
        />
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="alert-dialog-header"
      {...props}
      {...stylex.props(dialogStyles.header, styles.header, sx)}
    />
  );
}

function AlertDialogMedia({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="alert-dialog-media"
      {...props}
      {...stylex.props(styles.media, sx)}
    />
  );
}

function AlertDialogFooter({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="alert-dialog-footer"
      {...props}
      {...stylex.props(dialogStyles.footer, styles.footer, sx)}
    />
  );
}

function AlertDialogTitle({
  sx,
  ...props
}: Styled<AlertDialogPrimitive.Title.Props>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      {...props}
      {...stylex.props(dialogStyles.title, sx)}
    />
  );
}

function AlertDialogDescription({
  sx,
  ...props
}: Styled<AlertDialogPrimitive.Description.Props>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      {...props}
      {...stylex.props(dialogStyles.description, sx)}
    />
  );
}

/** The confirming button. It doesn't close the dialog: close it once the action is done. */
function AlertDialogAction({ variant = "primary", ...props }: ButtonProps) {
  return (
    <Button data-slot="alert-dialog-action" variant={variant} {...props} />
  );
}

function AlertDialogCancel({
  size = "default",
  sx,
  variant = "outline",
  ...props
}: Omit<AlertDialogPrimitive.Close.Props, "className" | "style"> &
  Pick<ButtonProps, "size" | "sx" | "variant">) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      render={<Button size={size} sx={sx} variant={variant} />}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBackdrop,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogPortal,
  alertDialogSizes,
  AlertDialogTitle,
  AlertDialogTrigger,
};
export type { AlertDialogContentProps, AlertDialogSize };
