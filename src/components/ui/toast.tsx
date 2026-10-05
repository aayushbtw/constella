"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { XIcon } from "@phosphor-icons/react/X";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
  durations,
  easings,
  fontSizes,
  lineHeights,
  media,
  presses,
  radii,
  shadows,
  space,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const toast = ToastPrimitive.createToastManager();

// Base UI measures the stack and swipe; these turn its variables into motion.
const gap = space.sm;
const peek = space.sm;
const height = "var(--toast-frontmost-height, var(--toast-height))";
const scale = "max(0, 1 - var(--toast-index) * 0.1)";
const offsetY = `calc(var(--toast-offset-y) * -1 - var(--toast-index) * ${gap} + var(--toast-swipe-movement-y))`;
const swipeX = "var(--toast-swipe-movement-x)";
const swipeY = "var(--toast-swipe-movement-y)";

const styles = stylex.create({
  viewport: {
    insetBlockEnd: space.md,
    insetInlineEnd: space.md,
    position: "fixed",
    width: { default: `calc(100vw - 2 * ${space.md})`, [media.sm]: 360 },
    zIndex: 50,
  },
  toast: {
    backgroundColor: colors.background,
    borderRadius: radii.md,
    boxShadow: shadows.popover,
    color: colors.textPrimary,
    cursor: "default",
    height: {
      default: height,
      ":is([data-expanded])": "var(--toast-height)",
    },
    insetBlockEnd: 0,
    insetInlineEnd: 0,
    opacity: {
      default: 1,
      ":is([data-limited], [data-starting-style], [data-ending-style])": 0,
    },
    position: "absolute",
    transform: {
      default: `translateX(${swipeX}) translateY(calc(${swipeY} - var(--toast-index) * ${peek} - (1 - ${scale}) * ${height})) scale(${scale})`,
      ":is([data-expanded])": `translateX(${swipeX}) translateY(${offsetY})`,
      // Two attributes, so these outrank the expanded position above.
      ":is([data-starting-style], [data-ending-style]):not([data-swipe-direction])":
        "translateY(150%)",
      ":is([data-ending-style][data-swipe-direction='up'])": `translateY(calc(${swipeY} - 150%))`,
      ":is([data-ending-style][data-swipe-direction='down'])": `translateY(calc(${swipeY} + 150%))`,
      ":is([data-ending-style][data-swipe-direction='left'])": `translateX(calc(${swipeX} - 150%)) translateY(${offsetY})`,
      ":is([data-ending-style][data-swipe-direction='right'])": `translateX(calc(${swipeX} + 150%)) translateY(${offsetY})`,
    },
    transformOrigin: "bottom center",
    transitionDuration: {
      default: `${durations.move}, ${durations.move}, ${durations.hover}`,
      ":is([data-ending-style])": `${durations.popover}, ${durations.popover}, ${durations.hover}`,
    },
    // While swiping, the toast follows the finger with no lag.
    transitionProperty: {
      default: "transform, opacity, height",
      ":is([data-swiping])": "opacity, height",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.out,
    userSelect: "none",
    width: "100%",
    zIndex: "calc(1000 - var(--toast-index))",
    // Bridges the gap between toasts, so moving across it keeps the stack expanded.
    "::after": {
      content: "''",
      height: `calc(${gap} + 1px)`,
      insetBlockStart: "100%",
      insetInlineStart: 0,
      position: "absolute",
      width: "100%",
    },
  },
  content: {
    alignItems: "center",
    display: "flex",
    gap: space.sm,
    height: "100%",
    opacity: {
      default: 1,
      ":is([data-behind]):not([data-expanded])": 0,
    },
    overflow: "hidden",
    padding: space.md,
    transitionDuration: durations.move,
    transitionProperty: "opacity",
    transitionTimingFunction: easings.out,
  },
  body: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: space.xxs,
    minWidth: 0,
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: 500,
    lineHeight: lineHeights.row,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: lineHeights.row,
  },
  action: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    color: colors.background,
    flexShrink: 0,
    fontSize: fontSizes.xs,
    fontWeight: 500,
    height: 28,
    opacity: {
      default: 1,
      [media.hover]: { default: 1, ":hover": 0.88 },
    },
    paddingInline: space.sm,
    transform: { default: null, ":active": presses.link },
    transitionDuration: `${durations.press}, ${durations.hover}`,
    transitionProperty: "transform, opacity",
    transitionTimingFunction: `${easings.out}, ease`,
  },
  close: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      [media.hover]: { default: "transparent", ":hover": colors.fill },
    },
    borderRadius: radii.xs,
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: colors.textMuted,
        ":hover": colors.textPrimary,
      },
    },
    display: "flex",
    flexShrink: 0,
    height: 24,
    justifyContent: "center",
    transform: { default: null, ":active": presses.icon },
    transitionDuration: `${durations.press}, ${durations.hover}, ${durations.hover}`,
    transitionProperty: "transform, background-color, color",
    transitionTimingFunction: `${easings.out}, ease, ease`,
    width: 24,
  },
});

function ToastProvider(props: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />;
}

function ToastPortal(props: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({
  sx,
  ...props
}: Styled<ToastPrimitive.Viewport.Props>) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      {...props}
      {...stylex.props(styles.viewport, sx)}
    />
  );
}

function Toast({ sx, ...props }: Styled<ToastPrimitive.Root.Props>) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      {...props}
      {...stylex.props(styles.toast, sx)}
    />
  );
}

function ToastContent({ sx, ...props }: Styled<ToastPrimitive.Content.Props>) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  );
}

function ToastBody({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div data-slot="toast-body" {...props} {...stylex.props(styles.body, sx)} />
  );
}

function ToastTitle({ sx, ...props }: Styled<ToastPrimitive.Title.Props>) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      {...props}
      {...stylex.props(styles.title, sx)}
    />
  );
}

function ToastDescription({
  sx,
  ...props
}: Styled<ToastPrimitive.Description.Props>) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      {...props}
      {...stylex.props(styles.description, sx)}
    />
  );
}

function ToastAction({ sx, ...props }: Styled<ToastPrimitive.Action.Props>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      {...props}
      {...stylex.props(styles.action, sx)}
    />
  );
}

function ToastClose({
  children,
  sx,
  ...props
}: Styled<ToastPrimitive.Close.Props>) {
  return (
    <ToastPrimitive.Close
      aria-label="Close"
      data-slot="toast-close"
      {...props}
      {...stylex.props(styles.close, sx)}
    >
      {children ?? <XIcon aria-hidden size={14} />}
    </ToastPrimitive.Close>
  );
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((item) => (
    <Toast key={item.id} toast={item}>
      <ToastContent>
        <ToastBody>
          <ToastTitle />
          <ToastDescription />
        </ToastBody>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ));
}

function Toaster({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  );
}

const { useToastManager } = ToastPrimitive;

export {
  Toast,
  ToastAction,
  ToastBody,
  ToastClose,
  ToastContent,
  ToastDescription,
  Toaster,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  useToastManager,
};
