"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import {
  Alert02Icon,
  AlertCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useLayoutEffect, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  colors,
  durations,
  easings,
  fontSizes,
  fontWeights,
  layers,
  lineHeights,
  media,
  motion,
  presses,
  radii,
  shadows,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const toast = ToastPrimitive.createToastManager();

// Base UI measures the stack and swipe; these turn its variables into motion.
const gap = space.sm;
const peek = space.sm;
const height = "var(--toast-frontmost-height, var(--toast-height))";
const scale = `max(0, 1 - var(--toast-index) * ${motion.stackScale})`;
const offsetY = `calc(var(--toast-offset-y) * -1 - var(--toast-index) * ${gap} + var(--toast-swipe-movement-y))`;
const swipeX = "var(--toast-swipe-movement-x)";
const swipeY = "var(--toast-swipe-movement-y)";

const textIn = stylex.keyframes({
  from: { filter: `blur(${motion.crossfadeTextBlur})`, opacity: 0 },
});
const textOut = stylex.keyframes({
  to: { filter: `blur(${motion.crossfadeTextBlur})`, opacity: 0 },
});

const layoutAnimation = {
  // The Web Animations API takes bare milliseconds; the token carries `ms`.
  duration: Number(durations.layout.slice(0, -"ms".length)),
  easing: easings.layout,
};

const icons = {
  error: AlertCircleIcon,
  info: InformationCircleIcon,
  success: CheckmarkCircle02Icon,
  warning: Alert02Icon,
} satisfies Record<string, IconSvgElement>;

type ToastType = keyof typeof icons | "loading";

function isToastType(type: string | undefined): type is ToastType {
  return (
    type !== undefined && (type === "loading" || Object.hasOwn(icons, type))
  );
}

const styles = stylex.create({
  viewport: {
    bottom: space.md,
    insetInlineEnd: space.md,
    position: "fixed",
    width: {
      default: `calc(100vw - 2 * ${space.md})`,
      [media.sm]: sizes.toast,
    },
    zIndex: layers.toast,
  },
  toast: {
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
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
      ":is([data-ending-style]):not([data-swipe-direction])": `translateY(${motion.exitOffset})`,
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
    // The surface is its own layer, so a content change can grow it without
    // resizing the toast, which Base UI is measuring.
    "::before": {
      backgroundColor: colors.raised,
      borderStartStartRadius: radii.md,
      borderStartEndRadius: radii.md,
      borderEndStartRadius: radii.md,
      borderEndEndRadius: radii.md,
      boxShadow: shadows.popover,
      content: "''",
      insetBlockEnd: 0,
      insetBlockStart: 0,
      insetInlineEnd: 0,
      insetInlineStart: 0,
      position: "absolute",
      zIndex: -1,
    },
    // Bridges the gap between toasts, so moving across it keeps the stack expanded.
    "::after": {
      content: "''",
      height: `calc(${gap} + 1px)`,
      insetBlockStart: "100%",
      insetInlineEnd: 0,
      insetInlineStart: 0,
      position: "absolute",
    },
  },
  content: {
    alignItems: "flex-start",
    display: "flex",
    gap: space.sm,
    opacity: {
      default: 1,
      ":is([data-behind]):not([data-expanded])": 0,
    },
    paddingBlock: space.sm,
    paddingInlineEnd: space.sm,
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
    height: sizes.icon,
    // Centers the icon on the title's first line.
    marginBlockStart: `calc((${lineHeights.row} - ${sizes.icon}) / 2)`,
    position: "relative",
    width: sizes.icon,
  },
  // Every icon stays mounted, so a type change cross-fades instead of swapping.
  layer: {
    // Flex, so the SVG doesn't sit on a text baseline a pixel low.
    display: "flex",
    filter: `blur(${motion.crossfadeBlur})`,
    insetBlockEnd: 0,
    insetBlockStart: 0,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    opacity: 0,
    position: "absolute",
    transform: `scale(${motion.crossfadeScale})`,
    transitionDuration: durations.crossfade,
    transitionProperty: {
      default: "opacity, transform, filter",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: easings.crossfade,
  },
  shown: {
    filter: "blur(0)",
    opacity: 1,
    transform: "scale(1)",
  },
  error: { color: colors.danger },
  info: { color: colors.info },
  success: { color: colors.success },
  warning: { color: colors.warning },
  body: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: space.xxxs,
    minWidth: 0,
    position: "relative",
  },
  // Blur bridges the two texts, so they read as one changing instead of two overlapping.
  entering: {
    animationDuration: durations.crossfade,
    animationName: textIn,
    animationTimingFunction: easings.out,
  },
  leaving: {
    animationDuration: durations.popover,
    animationFillMode: "forwards",
    animationName: textOut,
    animationTimingFunction: easings.out,
    insetBlockStart: 0,
    insetInlineEnd: 0,
    insetInlineStart: 0,
    pointerEvents: "none",
    position: "absolute",
  },
  title: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.row,
    textWrap: "balance",
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    lineHeight: lineHeights.row,
    textWrap: "pretty",
  },
  action: {
    alignSelf: "center",
  },
  close: {
    alignItems: "center",
    // Pulled past the content padding into the corner, `space.xxs` from both edges.
    marginBlockStart: `calc(${space.xxs} - ${space.sm})`,
    marginInlineEnd: `calc(${space.xxs} - ${space.sm})`,
    backgroundColor: {
      default: "transparent",
      [media.hover]: { default: "transparent", ":hover": colors.fillSubtle },
      ":active": colors.fillSubtle,
    },
    borderStartStartRadius: radii.sm,
    borderStartEndRadius: radii.sm,
    borderEndStartRadius: radii.sm,
    borderEndEndRadius: radii.sm,
    borderBlockStyle: "none",
    borderInlineStyle: "none",
    color: {
      default: colors.textMuted,
      [media.hover]: {
        default: colors.textMuted,
        ":hover": colors.textPrimary,
      },
      ":active": colors.textPrimary,
    },
    cursor: "pointer",
    display: "flex",
    flexShrink: 0,
    height: sizes.controlXxs,
    justifyContent: "center",
    paddingBlock: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
    position: "relative",
    touchAction: "manipulation",
    transform: { default: null, ":active": presses.icon },
    transitionDuration: `${durations.press}, ${durations.hover}, ${durations.hover}`,
    transitionProperty: "transform, background-color, color",
    transitionTimingFunction: `${easings.out}, ease, ease`,
    WebkitTapHighlightColor: "transparent",
    width: sizes.controlXxs,
    "::before": {
      content: "''",
      insetBlockEnd: `calc((${sizes.controlXxs} - ${sizes.hitArea}) / 2)`,
      insetBlockStart: `calc((${sizes.controlXxs} - ${sizes.hitArea}) / 2)`,
      insetInlineEnd: `calc((${sizes.controlXxs} - ${sizes.hitArea}) / 2)`,
      insetInlineStart: `calc((${sizes.controlXxs} - ${sizes.hitArea}) / 2)`,
      position: "absolute",
    },
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

const statuses = ["error", "info", "success", "warning"] as const;

// Hue only on the icon: the shape and title still say it without color.
const tones = {
  error: styles.error,
  info: styles.info,
  success: styles.success,
  warning: styles.warning,
} satisfies Record<(typeof statuses)[number], stylex.StyleXStyles>;

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
      <span {...stylex.props(styles.layer, type === "loading" && styles.shown)}>
        <Spinner />
      </span>
      {statuses.map((name) => (
        <span
          key={name}
          {...stylex.props(
            styles.layer,
            tones[name],
            name === type && styles.shown
          )}
        >
          <HugeiconsIcon
            icon={icons[name]}
            size={sizes.icon}
            strokeWidth={Number(strokes.icon)}
          />
        </span>
      ))}
    </span>
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

// The styles ride on the Button: it applies its own last, over anything Base UI merges in.
function ToastAction({ sx, ...props }: Styled<ToastPrimitive.Action.Props>) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={<Button size="xs" sx={[styles.action, sx]} variant="primary" />}
      {...props}
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
          size={sizes.iconSm}
          strokeWidth={Number(strokes.icon)}
        />
      )}
    </ToastPrimitive.Close>
  );
}

interface Snapshot {
  description: ReactNode;
  key: number;
  title: ReactNode;
}

function snapshot(item: ToastPrimitive.Root.ToastObject): Snapshot {
  return {
    description: item.description,
    key: item.updateKey ?? 0,
    title: item.title,
  };
}

// Base UI re-measures the toast whenever its content resizes, reading any
// height animation mid-flight. So the toast takes its new height at once, and
// only the surface and content, which it never measures, travel from the old one.
function useHeightMorph(natural: number | undefined) {
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const measured = useRef(natural);

  useLayoutEffect(() => {
    const from = measured.current;
    measured.current = natural;

    if (
      !root.current ||
      !content.current ||
      from === undefined ||
      natural === undefined ||
      from === natural ||
      // Collapsed toasts behind take the front one's height; only one showing its own animates.
      root.current.offsetHeight !== natural ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // Bottom-anchored, so the old top edge sits `grown` px lower.
    const grown = natural - from;

    root.current.animate([{ top: `${grown}px` }, { top: "0px" }], {
      ...layoutAnimation,
      pseudoElement: "::before",
    });
    content.current.animate(
      [
        {
          clipPath: `inset(0 0 ${Math.max(grown, 0)}px 0)`,
          transform: `translateY(${grown}px)`,
        },
        { clipPath: "inset(0 0 0 0)", transform: "none" },
      ],
      layoutAnimation
    );
  }, [natural]);

  return [root, content] as const;
}

function ToastItem({ item }: { item: ToastPrimitive.Root.ToastObject }) {
  const [rootRef, contentRef] = useHeightMorph(item.height);

  // The old text stays on screen, fading out, under the new text fading in.
  const [seen, setSeen] = useState(() => snapshot(item));
  const [previous, setPrevious] = useState<Snapshot | null>(null);

  if ((item.updateKey ?? 0) !== seen.key) {
    setPrevious(seen);
    setSeen(snapshot(item));
  }

  return (
    <Toast ref={rootRef} toast={item}>
      <ToastContent ref={contentRef}>
        {isToastType(item.type) && <ToastIcon type={item.type} />}
        <ToastBody>
          {previous && (
            <span
              aria-hidden
              key={previous.key}
              onAnimationEnd={() => {
                setPrevious(null);
              }}
              {...stylex.props(styles.body, styles.leaving)}
            >
              <span {...stylex.props(styles.title)}>{previous.title}</span>
              {previous.description === undefined ? null : (
                <span {...stylex.props(styles.description)}>
                  {previous.description}
                </span>
              )}
            </span>
          )}
          <ToastTitle key={seen.key} sx={previous && styles.entering} />
          <ToastDescription
            key={`d${seen.key}`}
            sx={previous && styles.entering}
          />
        </ToastBody>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  );
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((item) => <ToastItem item={item} key={item.id} />);
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
