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
  shadows,
  space,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const toast = ToastPrimitive.createToastManager();

// Centered at the bottom, so it leaves down or to either side.
const swipeDirections: ToastPrimitive.Root.Props["swipeDirection"] = [
  "down",
  "left",
  "right",
];

// Base UI measures the stack and swipe; these turn its variables into motion.
const gap = space.sm;
const peek = space.xs;
const height = "var(--toast-frontmost-height, var(--toast-height))";
const scale = "max(0, 1 - var(--toast-index) * 0.08)";
const offsetY = `calc(var(--toast-offset-y) * -1 - var(--toast-index) * ${gap} + var(--toast-swipe-movement-y))`;
const swipeX = "var(--toast-swipe-movement-x)";
const swipeY = "var(--toast-swipe-movement-y)";

// Concentric: the action's radius plus the inset around it.
const actionHeight = 28;
const inset = space.xs;
const radius = `calc(${actionHeight / 2}px + ${inset})`;

// Inverted surface: the page's background color is the toast's ink.
const ink = colors.background;
const inkMuted = `color-mix(in oklab, ${colors.background} 62%, transparent)`;

const spin = stylex.keyframes({ to: { transform: "rotate(360deg)" } });
const drain = stylex.keyframes({ to: { transform: "scaleX(0)" } });
const swapIn = stylex.keyframes({
  from: { filter: "blur(4px)", opacity: 0, transform: "translateY(4px)" },
});
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
    insetInline: 0,
    marginInline: "auto",
    position: "fixed",
    width: `min(420px, calc(100vw - 2 * ${space.md}))`,
    zIndex: 50,
  },
  toast: {
    backgroundColor: colors.accent,
    borderRadius: radius,
    boxShadow: shadows.popover,
    color: ink,
    cursor: "default",
    filter: {
      default: "blur(0)",
      ":is([data-starting-style])": "blur(8px)",
      ":is([data-ending-style]):not([data-swipe-direction])": "blur(4px)",
    },
    height: {
      default: height,
      ":is([data-expanded])": "var(--toast-height)",
    },
    insetBlockEnd: 0,
    insetInline: 0,
    // Lets `width: fit-content` animate, so the pill morphs as its content changes.
    interpolateSize: "allow-keywords",
    marginInline: "auto",
    maxWidth: "100%",
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
        "translateY(50%) scale(0.6)",
      ":is([data-ending-style]):not([data-swipe-direction])":
        "translateY(12px) scale(0.95)",
      ":is([data-ending-style][data-swipe-direction='down'])": `translateY(calc(${swipeY} + 150%))`,
      ":is([data-ending-style][data-swipe-direction='left'])": `translateX(calc(${swipeX} - 150%)) translateY(${offsetY})`,
      ":is([data-ending-style][data-swipe-direction='right'])": `translateX(calc(${swipeX} + 150%)) translateY(${offsetY})`,
    },
    transformOrigin: "bottom center",
    // `transform` goes last, so dropping it while swiping keeps the lists aligned.
    transitionDuration: {
      default: `${durations.popover}, ${durations.swap}, ${durations.springBounce}, ${durations.springBounce}, ${durations.springBounce}`,
      ":is([data-ending-style])": durations.popover,
    },
    transitionProperty: {
      default: "opacity, filter, width, height, transform",
      // The toast follows the finger with no lag.
      ":is([data-swiping])": "opacity, filter, width, height",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: {
      default: `${easings.out}, ${easings.out}, ${easings.springBounce}, ${easings.springBounce}, ${easings.springBounce}`,
      ":is([data-ending-style])": easings.out,
    },
    userSelect: "none",
    width: "fit-content",
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
    alignItems: "center",
    display: "flex",
    gap: space.xs,
    height: "100%",
    minHeight: `calc(${actionHeight}px + 2 * ${inset})`,
    opacity: {
      default: 1,
      ":is([data-behind]):not([data-expanded])": 0,
    },
    overflow: "hidden",
    paddingBlock: inset,
    paddingInlineEnd: {
      default: space.md,
      ":has(> [data-slot='toast-action'])": inset,
    },
    paddingInlineStart: {
      default: space.md,
      ":has(> [data-slot='toast-icon'])": space.sm,
    },
    position: "relative",
    transitionDuration: durations.swap,
    transitionProperty: "opacity",
    transitionTimingFunction: easings.out,
  },
  icon: {
    flexShrink: 0,
    height: 18,
    position: "relative",
    width: 18,
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
    flexDirection: "column",
    minWidth: 0,
    paddingInlineEnd: space.xxs,
  },
  updated: {
    animationDuration: durations.swap,
    animationName: { default: swapIn, [media.reducedMotion]: fadeIn },
    animationTimingFunction: easings.swap,
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: 500,
    lineHeight: lineHeights.row,
    textWrap: "balance",
  },
  description: {
    color: inkMuted,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.row,
    textWrap: "pretty",
  },
  action: {
    backgroundColor: ink,
    borderRadius: actionHeight / 2,
    color: colors.accent,
    flexShrink: 0,
    fontSize: fontSizes.xs,
    fontWeight: 500,
    height: actionHeight,
    opacity: {
      default: 1,
      [media.hover]: { default: 1, ":hover": 0.88 },
    },
    paddingInline: space.sm,
    position: "relative",
    transform: { default: null, ":active": presses.link },
    transitionDuration: `${durations.press}, ${durations.hover}`,
    transitionProperty: "transform, opacity",
    transitionTimingFunction: `${easings.out}, ease`,
    // Reaches a 40px hit area without growing the pill.
    "::before": {
      content: "''",
      inset: -6,
      position: "absolute",
    },
  },
  close: {
    alignItems: "center",
    borderRadius: actionHeight / 2,
    color: {
      default: inkMuted,
      [media.hover]: { default: inkMuted, ":hover": ink },
    },
    display: "flex",
    flexShrink: 0,
    height: actionHeight,
    justifyContent: "center",
    transform: { default: null, ":active": presses.icon },
    transitionDuration: `${durations.press}, ${durations.hover}`,
    transitionProperty: "transform, color",
    transitionTimingFunction: `${easings.out}, ease`,
    width: actionHeight,
  },
  progress: {
    animationName: drain,
    animationPlayState: {
      default: "running",
      [stylex.when.ancestor(":is([data-expanded])")]: "paused",
    },
    animationTimingFunction: "linear",
    backgroundColor: ink,
    borderRadius: 1,
    height: 2,
    insetBlockEnd: 3,
    insetInline: radius,
    opacity: 0.2,
    position: "absolute",
    transformOrigin: "left",
  },
  duration: (ms: number) => ({ animationDuration: `${ms}ms` }),
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

function Toast({
  swipeDirection = swipeDirections,
  sx,
  ...props
}: Styled<ToastPrimitive.Root.Props>) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      swipeDirection={swipeDirection}
      {...props}
      {...stylex.props(stylex.defaultMarker(), styles.toast, sx)}
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
            size={18}
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
          size={16}
          strokeWidth={1.75}
        />
      )}
    </ToastPrimitive.Close>
  );
}

// Drains over the toast's timeout and pauses with it while the stack is hovered.
function ToastProgress({
  sx,
  timeout,
  ...props
}: Styled<ComponentProps<"span">> & { timeout: number }) {
  return (
    <span
      aria-hidden
      data-slot="toast-progress"
      {...props}
      {...stylex.props(styles.progress, styles.duration(timeout), sx)}
    />
  );
}

function ToastList({ timeout }: { timeout: number }) {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((item) => {
    const duration = item.timeout ?? timeout;

    return (
      <Toast key={item.id} toast={item}>
        <ToastContent>
          {isToastType(item.type) && <ToastIcon type={item.type} />}
          {/* Remounts on update, so new text arrives instead of snapping in. */}
          <ToastBody
            key={item.updateKey ?? 0}
            updated={(item.updateKey ?? 0) > 0}
          >
            <ToastTitle />
            <ToastDescription />
          </ToastBody>
          <ToastAction />
          {duration > 0 && (
            <ToastProgress
              key={`progress-${item.updateKey ?? 0}`}
              timeout={duration}
            />
          )}
        </ToastContent>
      </Toast>
    );
  });
}

function Toaster({
  children,
  timeout = 5000,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider timeout={timeout} toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList timeout={timeout} />
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
  ToastProgress,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  useToastManager,
};
