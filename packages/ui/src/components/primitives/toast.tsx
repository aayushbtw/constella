"use client";

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
import { renderElement } from "@ui-sdk/react/primitive";
import {
  ToastAction as ToastActionPrimitive,
  ToastClose as ToastClosePrimitive,
  ToastDescription as ToastDescriptionPrimitive,
  Toast as ToastPrimitive,
  ToastRegion as ToastRegionPrimitive,
  ToastTitle as ToastTitlePrimitive,
} from "@ui-sdk/react/toast";
import type {
  ToastData,
  ToastRegionProps,
  ToastType as ToastTypePrimitive,
} from "@ui-sdk/react/toast";
import { useState } from "react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/primitives/button";
import { Spinner } from "@/components/primitives/spinner";
import type { Sx } from "@/lib/constella/styles";
import { typeStyles, withStyles } from "@/lib/constella/styles";
import {
  colors,
  durations,
  easings,
  fontWeights,
  lineHeights,
  media,
  motion,
  presses,
  radii,
  shadows,
  sizes,
  space,
  strokes,
  toastVars,
} from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

const edge = `calc(${space.md} + max(env(safe-area-inset-left, 0px), env(safe-area-inset-right, 0px)))`;
const gap = space.sm;
const peek = space.sm;
const scale = `max(0, 1 - var(--toast-index) * ${motion.stackScale})`;
const swipeX = "var(--toast-swipe-x, 0px)";
const swipeY = "var(--toast-swipe-y, 0px)";
const offsetY = `calc(var(--toast-offset) * -1 - var(--toast-index) * ${gap} + ${swipeY})`;

const textIn = stylex.keyframes({
  from: { filter: `blur(${motion.crossfadeTextBlur})`, opacity: 0 },
});
const textOut = stylex.keyframes({
  to: { filter: `blur(${motion.crossfadeTextBlur})`, opacity: 0 },
});

const statuses = ["error", "info", "success", "warning"] as const;
const toastTypes = [
  "default",
  ...statuses,
  "loading",
] as const satisfies readonly ToastTypePrimitive[];

type ToastType = (typeof toastTypes)[number];

const icons = {
  error: AlertCircleIcon,
  info: InformationCircleIcon,
  success: CheckmarkCircle02Icon,
  warning: Alert02Icon,
} satisfies Record<(typeof statuses)[number], IconSvgElement>;

const styles = stylex.create({
  // ui-sdk's runtime layer puts the region in the top layer, fixed, and resets the popover box.
  // These replace its insets, so they keep the keyboard and the safe areas it adds.
  region: {
    bottom: `calc(${space.md} + var(--keyboard-inset, 0px) + env(safe-area-inset-bottom, 0px))`,
    insetInlineEnd: edge,
    width: {
      default: `calc(100vw - 2 * ${edge})`,
      [media.sm]: sizes.toast,
    },
  },
  toast: {
    [toastVars.contentOpacity]: {
      default: "1",
      ":not([data-front], [data-expanded])": "0",
    },
    borderStartStartRadius: radii.md,
    borderStartEndRadius: radii.md,
    borderEndStartRadius: radii.md,
    borderEndEndRadius: radii.md,
    color: colors.textPrimary,
    cursor: "default",
    height: {
      default: "var(--toast-height)",
      ":not([data-front], [data-expanded])": "var(--toast-front-height)",
    },
    insetBlockEnd: 0,
    insetInlineEnd: 0,
    opacity: {
      default: 1,
      ":is([data-starting-style], [data-ending-style])": 0,
    },
    position: "absolute",
    transform: {
      default: `translateX(${swipeX}) translateY(calc(${swipeY} - var(--toast-index) * ${peek} - (1 - ${scale}) * var(--toast-front-height))) scale(${scale})`,
      ":is([data-expanded])": `translateX(${swipeX}) translateY(${offsetY})`,
      ":is([data-front]):is([data-starting-style], [data-ending-style]):not([data-swipe-direction])":
        "translateY(100%)",
      // ui-sdk keeps the swipe variables while the toast leaves, so it carries on from the release.
      ":is([data-ending-style][data-swipe-direction='down'])": `translateY(calc(${swipeY} + 150%))`,
      ":is([data-ending-style][data-swipe-direction='right'])": `translateX(calc(${swipeX} + 150%)) translateY(${offsetY})`,
      ":is([data-ending-style][data-swipe-direction='left'])": `translateX(calc(${swipeX} - 150%)) translateY(${offsetY})`,
    },
    transformOrigin: "bottom center",
    transitionDuration: {
      default: `${durations.move}, ${durations.layout}, ${durations.move}`,
      ":is([data-ending-style])": durations.popoverExit,
    },
    transitionProperty: {
      default: "opacity, height, transform",
      // ui-sdk mounts a toast before it sets the stack variables, so one entering behind the
      // front would travel in from the front's place.
      ":is([data-starting-style])": "none",
      // The toast follows the finger with no lag.
      ":is([data-swiping])": "opacity, height",
      [media.reducedMotion]: "opacity",
    },
    transitionTimingFunction: {
      default: `${easings.out}, ${easings.layout}, ${easings.out}`,
      ":is([data-ending-style])": easings.out,
    },
    userSelect: "none",
    width: "100%",
    zIndex: "calc(1000 - var(--toast-index))",
    "::before": {
      backgroundColor: colors.raised,
      borderStartStartRadius: radii.md,
      borderStartEndRadius: radii.md,
      borderEndStartRadius: radii.md,
      borderEndEndRadius: radii.md,
      boxShadow: shadows.lg,
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
    maxHeight: "100%",
    opacity: toastVars.contentOpacity,
    overflow: "clip",
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
    marginBlockStart: `calc((${lineHeights.textSm} - ${sizes.icon}) / 2)`,
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
  error: { color: colors.dangerText },
  info: { color: colors.infoText },
  success: { color: colors.successText },
  warning: { color: colors.warningText },
  // The text and its action share a row while both fit, and the action drops under the text
  // when its label is too long, so it never pushes the close button out.
  main: {
    alignItems: "center",
    columnGap: space.sm,
    display: "flex",
    flex: 1,
    flexWrap: "wrap",
    minWidth: 0,
    rowGap: space.xs,
  },
  body: {
    display: "flex",
    flexBasis: sizes.menu,
    flexDirection: "column",
    flexGrow: 1,
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
    fontWeight: fontWeights.medium,
    overflowWrap: "anywhere",
    textWrap: "balance",
  },
  description: {
    color: colors.textSecondary,
    overflowWrap: "anywhere",
    textWrap: "pretty",
  },
  action: {
    maxWidth: "100%",
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

function ToastRegion({
  sx,
  ...props
}: Styled<Omit<ToastRegionProps, "align" | "side">>) {
  return (
    <ToastRegionPrimitive
      {...withStyles(props, stylex.props(styles.region, sx))}
    />
  );
}

function Toast({
  render,
  sx,
  ...props
}: Styled<ComponentProps<typeof ToastPrimitive>>) {
  return (
    <ToastPrimitive
      {...withStyles(props, stylex.props(styles.toast, sx))}
      // ui-sdk leaves the toasts hidden behind a collapsed stack focusable.
      render={(rendered, state) =>
        renderElement(
          "li",
          {
            ...rendered,
            inert:
              state.leaving ||
              (!state.expanded && state.index > 0) ||
              undefined,
          },
          render,
          state
        )
      }
    />
  );
}

function ToastContent({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="toast-content"
      {...withStyles(props, stylex.props(styles.content, sx))}
    />
  );
}

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
      data-type={type}
      {...withStyles(props, stylex.props(styles.icon, sx))}
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
    <div
      data-slot="toast-body"
      {...withStyles(props, stylex.props(styles.body, sx))}
    />
  );
}

function ToastTitle({
  sx,
  ...props
}: Styled<ComponentProps<typeof ToastTitlePrimitive>>) {
  return (
    <ToastTitlePrimitive
      {...withStyles(
        props,
        stylex.props([typeStyles.textSm, styles.title], sx)
      )}
    />
  );
}

function ToastDescription({
  sx,
  ...props
}: Styled<ComponentProps<typeof ToastDescriptionPrimitive>>) {
  return (
    <ToastDescriptionPrimitive
      {...withStyles(
        props,
        stylex.props([typeStyles.textSm, styles.description], sx)
      )}
    />
  );
}

function ToastAction({
  sx,
  ...props
}: Omit<Styled<ComponentProps<typeof ToastActionPrimitive>>, "render">) {
  return (
    <ToastActionPrimitive
      {...props}
      render={(rendered) => (
        <Button
          {...rendered}
          // oxlint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- ui-sdk's props carry the href, and the button renders the label into the link
          render={"href" in rendered ? <a /> : undefined}
          size="xs"
          sx={[styles.action, sx]}
          variant="primary"
        />
      )}
    />
  );
}

function ToastClose({
  children,
  sx,
  ...props
}: Styled<ComponentProps<typeof ToastClosePrimitive>>) {
  return (
    <ToastClosePrimitive
      aria-label="Close"
      {...withStyles(props, stylex.props(styles.close, sx))}
    >
      {children ?? (
        <HugeiconsIcon
          aria-hidden
          icon={Cancel01Icon}
          size={sizes.iconSm}
          strokeWidth={Number(strokes.icon)}
        />
      )}
    </ToastClosePrimitive>
  );
}

interface Snapshot {
  description: ReactNode;
  key: number;
  title: ReactNode;
}

function snapshot(data: ToastData<ReactNode>): Snapshot {
  return {
    description: data.description,
    key: data.version,
    title: data.title,
  };
}

function ToastItem({ data }: { data: ToastData<ReactNode> }) {
  // The old text stays on screen, fading out, under the new text fading in.
  const [seen, setSeen] = useState(() => snapshot(data));
  const [previous, setPrevious] = useState<Snapshot | null>(null);

  if (data.version !== seen.key) {
    setPrevious(seen);
    setSeen(snapshot(data));
  }

  return (
    <Toast>
      <ToastContent>
        {data.type !== "default" && <ToastIcon type={data.type} />}
        <div {...stylex.props(styles.main)}>
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
                <span {...stylex.props([typeStyles.textSm, styles.title])}>
                  {previous.title}
                </span>
                {previous.description === undefined ? null : (
                  <span
                    {...stylex.props([typeStyles.textSm, styles.description])}
                  >
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
        </div>
        {/* ui-sdk's Close press ignores `dismissible`, so a toast that can't be dismissed shows none. */}
        {data.dismissible !== false && <ToastClose />}
      </ToastContent>
    </Toast>
  );
}

function Toaster(props: Omit<ComponentProps<typeof ToastRegion>, "children">) {
  return (
    <ToastRegion {...props}>{(data) => <ToastItem data={data} />}</ToastRegion>
  );
}

export {
  Toast,
  ToastAction,
  ToastBody,
  ToastClose,
  ToastContent,
  ToastDescription,
  Toaster,
  ToastIcon,
  ToastRegion,
  ToastTitle,
  toastTypes,
};
export { toast } from "@ui-sdk/react/toast";
export type { ToastType };
