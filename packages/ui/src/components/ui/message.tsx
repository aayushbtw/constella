import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import {
  colors,
  fontSizes,
  lineHeights,
  radii,
  space,
} from "@/lib/tokens.stylex";

const messageRoles = ["user", "assistant"] as const;

type MessageRole = (typeof messageRoles)[number];

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const fromUser = ":is([data-slot='message'][data-from='user'] > *)";

const styles = stylex.create({
  message: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    width: "100%",
  },
  user: {
    alignItems: "flex-end",
  },
  // The user's words sit in a resting `fillOpaque` bubble; the answer reads as the page.
  content: {
    backgroundColor: { default: "transparent", [fromUser]: colors.fillOpaque },
    borderStartStartRadius: { default: 0, [fromUser]: radii.lg },
    borderStartEndRadius: { default: 0, [fromUser]: radii.lg },
    borderEndStartRadius: { default: 0, [fromUser]: radii.lg },
    borderEndEndRadius: { default: 0, [fromUser]: radii.lg },
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    lineHeight: lineHeights.prose,
    maxWidth: { default: "100%", [fromUser]: "80%" },
    overflowWrap: "break-word",
    paddingBlockEnd: { default: 0, [fromUser]: space.xs },
    paddingBlockStart: { default: 0, [fromUser]: space.xs },
    paddingInlineEnd: { default: 0, [fromUser]: space.md },
    paddingInlineStart: { default: 0, [fromUser]: space.md },
    width: "fit-content",
  },
  actions: {
    alignItems: "center",
    color: colors.textSecondary,
    display: "flex",
    gap: space.xxxs,
  },
});

/** One turn of a conversation, from the user or the assistant. */
function Message({
  from,
  sx,
  ...props
}: Styled<ComponentProps<"div">> & { from: MessageRole }) {
  return (
    <div
      data-from={from}
      data-slot="message"
      {...props}
      {...stylex.props(styles.message, from === "user" && styles.user, sx)}
    />
  );
}

function MessageContent({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="message-content"
      {...props}
      {...stylex.props(styles.content, sx)}
    />
  );
}

/** A row of actions under a message: copy, retry, rate. */
function MessageActions({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="message-actions"
      {...props}
      {...stylex.props(styles.actions, sx)}
    />
  );
}

export { Message, MessageActions, MessageContent, messageRoles };
export type { MessageRole };
