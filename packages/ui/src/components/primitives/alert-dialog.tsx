"use client";

import * as stylex from "@stylexjs/stylex";
import {
  AlertDialogBackdrop as AlertDialogBackdropPrimitive,
  AlertDialogClose as AlertDialogClosePrimitive,
  AlertDialogContent as AlertDialogContentPrimitive,
  AlertDialogDescription as AlertDialogDescriptionPrimitive,
  AlertDialog as AlertDialogPrimitive,
  AlertDialogTitle as AlertDialogTitlePrimitive,
  AlertDialogTrigger as AlertDialogTriggerPrimitive,
} from "@ui-sdk/react/alert-dialog";
import type { AlertDialogProps } from "@ui-sdk/react/alert-dialog";
import { createContext, use } from "react";
import type { ComponentProps } from "react";

import { Button } from "@/components/primitives/button";
import type { ButtonProps } from "@/components/primitives/button";
import { dialogStyles } from "@/components/primitives/dialog";
import type { Sx } from "@/lib/constella/styles";
import {
  colors,
  opacities,
  radii,
  sizes,
  space,
} from "@/lib/constella/tokens.stylex";

const alertDialogSizes = ["sm", "default"] as const;

type AlertDialogSize = (typeof alertDialogSizes)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

type AlertDialogContentProps<Payload = unknown> = Styled<
  ComponentProps<typeof AlertDialogContentPrimitive<Payload>>
> & {
  size?: AlertDialogSize;
};

type AlertDialogButtonProps = Omit<
  ComponentProps<typeof AlertDialogClosePrimitive>,
  "className" | "render" | "style"
> &
  Pick<ButtonProps, "color" | "size" | "sx" | "variant">;

const inSmall = ":is([data-slot='alert-dialog-content'][data-size='sm'] *)";
const refused = ":is([aria-disabled='true']):not([data-pending])";

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
  refused: {
    cursor: { default: null, [refused]: "not-allowed" },
    opacity: { default: null, [refused]: opacities.disabled },
  },
});

const sizeStyles = {
  default: null,
  sm: dialogStyles.sm,
} satisfies Record<AlertDialogSize, stylex.StyleXStyles | null>;

// ui-sdk refuses the other Close parts while one's action runs, but marks only the running one; drop once it marks the refused ones.
const Pending = createContext(false);

function AlertDialog(props: AlertDialogProps) {
  return <AlertDialogPrimitive {...props} />;
}

function AlertDialogTrigger({
  sx,
  ...props
}: Styled<ComponentProps<typeof AlertDialogTriggerPrimitive>>) {
  return <AlertDialogTriggerPrimitive {...props} {...stylex.props(sx)} />;
}

function AlertDialogContent<Payload = unknown>({
  children,
  size = "default",
  sx,
  ...props
}: AlertDialogContentProps<Payload>) {
  return (
    <>
      <AlertDialogBackdropPrimitive {...stylex.props(dialogStyles.backdrop)} />
      <AlertDialogContentPrimitive<Payload>
        data-size={size}
        {...props}
        {...stylex.props(dialogStyles.popup, sizeStyles[size], sx)}
      >
        {(state) => (
          <Pending value={state.pending}>
            {/* oxlint-disable-next-line anti-slop/no-runtime-typeof -- ui-sdk documents `children` as a node or a function of the state */}
            {typeof children === "function" ? children(state) : children}
          </Pending>
        )}
      </AlertDialogContentPrimitive>
    </>
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
}: Styled<ComponentProps<typeof AlertDialogTitlePrimitive>>) {
  return (
    <AlertDialogTitlePrimitive
      {...props}
      {...stylex.props(dialogStyles.title, sx)}
    />
  );
}

function AlertDialogDescription({
  sx,
  ...props
}: Styled<ComponentProps<typeof AlertDialogDescriptionPrimitive>>) {
  return (
    <AlertDialogDescriptionPrimitive
      {...props}
      {...stylex.props(dialogStyles.description, sx)}
    />
  );
}

function AlertDialogCancel({
  color,
  size,
  sx,
  variant = "outline",
  ...props
}: AlertDialogButtonProps) {
  const pending = use(Pending);
  return (
    <AlertDialogClosePrimitive
      aria-disabled={pending || undefined}
      render={
        <Button
          color={color}
          size={size}
          sx={[styles.refused, sx]}
          variant={variant}
        />
      }
      {...props}
    />
  );
}

function AlertDialogAction({
  color,
  size,
  sx,
  value = "confirm",
  variant = "primary",
  ...props
}: AlertDialogButtonProps) {
  const pending = use(Pending);
  return (
    <AlertDialogClosePrimitive
      aria-disabled={pending || undefined}
      render={
        <Button
          color={color}
          size={size}
          sx={[styles.refused, sx]}
          variant={variant}
        />
      }
      value={value}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  alertDialogSizes,
  AlertDialogTitle,
  AlertDialogTrigger,
};
export type {
  AlertDialogButtonProps,
  AlertDialogContentProps,
  AlertDialogSize,
};
