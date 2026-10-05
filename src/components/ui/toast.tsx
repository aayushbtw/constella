"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
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
const scale = "max(0, 1 - var(--toast-index) * 0.05)";
const offsetY = `calc(var(--toast-offset-y) * -1 - var(--toast-index) * ${gap} + var(--toast-swipe-movement-y))`;
const swipeX = "var(--toast-swipe-movement-x)";
const swipeY = "var(--toast-swipe-movement-y)";

const spin = stylex.keyframes({ to: { transform: "rotate(360deg)" } });
const fadeIn = stylex.keyframes({ from: { opacity: 0 } });

const types = {
  error: Alert02Icon,
  info: InformationCircleIcon,
  loading: Loading03Icon,
  success: CheckmarkCircle02Icon,
} satisfies Record<string, IconSvgElement>;

type ToastType = keyof typeof types;

function isToastType(type: string | undefined): type is ToastType {
  return type !== undefined && Object.hasOwn(types, type);
}

const styles = stylex.create({
  viewport: {
    bottom: space.md,
    insetInlineEnd: space.md,
    position: "fixed",
    width: { default: `calc(100vw - 2 * ${space.md})`, [media.sm]: 356 },
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
      ":is([data-starting-style]):not([data-swipe-direction])":
        "translateY(100%)",
      ":is([data-ending-style]):not([data-swipe-direction])": "translateY(8px)",
      ":is([data-ending-style][data-swipe-direction='down'])": `translateY(calc(${swipeY} + 150%))`,
      ":is([data-ending-style][data-swipe-direction='right'])": `translateX(calc(${swipeX} + 150%)) translateY(${offsetY})`,
    },
    transformOrigin: "bottom center",
    transitionDuration: {
      default: durations.move,
      ":is([data-ending-style])": durations.popover,
    },
    transitionProperty: {
      default: "opacity, height, transform",
      // The toast follows the finger with no lag.
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
      insetInline: 0,
      position: "absolute",
    },
  },
  content: {
    alignItems: "flex-start",
    display: "flex",
    gap: space.sm,
    height: "100%",
    opacity: {
      default: 1,
      ":is([data-behind]):not([data-expanded])": 0,
    },
    overflow: "hidden",
    padding: space.sm,
    paddingInlineStart: {
      default: space.md,
      ":has(> [data-slot='toast-icon'])": space.sm,
    },
    transitionDuration: durations.move,
    transitionProperty: "opacity",
    transitionTimingFunction: easings.out,
  },
  icon: {
    color: colors.textSecondary,
    flexShrink: 0,
    height: 16,
    // Centers the icon on the title's first line.
    marginBlockStart: 1,
    position: "relative",
    width: 16,
  },
  // Every icon stays mounted, so a type change cross-fades instead of swapping.
  layer: {
    filter: "blur(4px)",
    inset: 0,
    opacity: 0,
    position: "absolute",
    transform: "scale(0.25)",
    transitionDuration: durations.swap,
    transitionProperty: {
      default: "opacity, transform, filter",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.swap,
  },
  shown: {
    filter: "blur(0)",
    opacity: 1,
    transform: "scale(1)",
  },
  spinner: {
    animationDuration: "800ms",
    animationIterationCount: "infinite",
    animationName: spin,
    animationTimingFunction: "linear",
  },
  body: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: 2,
    minWidth: 0,
  },
  updated: {
    animationDuration: durations.swap,
    animationName: fadeIn,
    animationTimingFunction: easings.out,
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: 500,
    lineHeight: lineHeights.row,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.row,
    textWrap: "pretty",
  },
  action: {
    alignSelf: "center",
    backgroundColor: colors.accent,
    borderRadius: radii.xs,
    color: colors.background,
    flexShrink: 0,
    fontSize: fontSizes.xs,
    fontWeight: 500,
    height: 24,
    opacity: {
      default: 1,
      [media.hover]: { default: 1, ":hover": 0.88 },
    },
    paddingInline: space.xs,
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
    height: 20,
    justifyContent: "center",
    transform: { default: null, ":active": presses.icon },
    transitionDuration: `${durations.press}, ${durations.hover}, ${durations.hover}`,
    transitionProperty: "transform, background-color, color",
    transitionTimingFunction: `${easings.out}, ease, ease`,
    width: 20,
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

function ToastIcon({
  sx,
  type,
  ...props
}: Styled<ComponentProps<"span">> & { type: ToastType }) {
  return (
    <span
      aria-hidden
      data-slot="toast-icon"
      {...props}
      {...stylex.props(styles.icon, sx)}
    >
      {Object.entries(types).map(([name, icon]) => (
        <span
          key={name}
          {...stylex.props(styles.layer, name === type && styles.shown)}
        >
          <HugeiconsIcon
            icon={icon}
            size={16}
            strokeWidth={1.75}
            {...stylex.props(name === "loading" && styles.spinner)}
          />
        </span>
      ))}
    </span>
  );
}

function ToastBody({
  sx,
  updated = false,
  ...props
}: Styled<ComponentProps<"div">> & { updated?: boolean }) {
  return (
    <div
      data-slot="toast-body"
      {...props}
      {...stylex.props(styles.body, updated && styles.updated, sx)}
    />
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
      {children ?? (
        <HugeiconsIcon
          aria-hidden
          icon={Cancel01Icon}
          size={14}
          strokeWidth={1.75}
        />
      )}
    </ToastPrimitive.Close>
  );
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((item) => (
    <Toast key={item.id} toast={item}>
      <ToastContent>
        {isToastType(item.type) && <ToastIcon type={item.type} />}
        {/* Remounts on update, so new text fades in instead of snapping. */}
        <ToastBody
          key={item.updateKey ?? 0}
          updated={(item.updateKey ?? 0) > 0}
        >
          <ToastTitle />
          <ToastDescription />
        </ToastBody>
        <ToastAction />
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
  ToastIcon,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  useToastManager,
};
