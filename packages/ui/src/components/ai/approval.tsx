"use client";

import * as stylex from "@stylexjs/stylex";
import { createContext, use, useId } from "react";
import type { ComponentProps } from "react";

import { Button } from "@/components/primitives/button";
import type { ButtonProps } from "@/components/primitives/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/primitives/card";
import type { Sx } from "@/lib/constella/styles";
import { colors, lineHeights, space } from "@/lib/constella/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: Sx;
};

const TitleId = createContext<string | undefined>(undefined);

const styles = stylex.create({
  title: {
    alignItems: "start",
    display: "flex",
    gap: space.row,
  },
  // As tall as the title's line, so the icon centers on it.
  media: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    height: lineHeights.textSm,
  },
  fields: {
    alignItems: "baseline",
    columnGap: space.lg,
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    marginBlockEnd: 0,
    marginBlockStart: 0,
    rowGap: space.xs,
  },
  // The pair is one grid row, not a box of its own.
  field: {
    display: "contents",
  },
  label: {
    color: colors.textSecondary,
  },
  value: {
    marginInlineStart: 0,
    overflowWrap: "anywhere",
  },
  footer: {
    justifyContent: "flex-end",
  },
  // Apart from the action: a slip lands on the button that does nothing.
  cancel: {
    marginInlineEnd: "auto",
  },
});

/** A card asking to allow a tool call, named by its title. */
function Approval(
  props: Omit<ComponentProps<typeof Card>, "size" | "variant">
) {
  const titleId = useId();
  return (
    <TitleId value={titleId}>
      <Card
        aria-labelledby={titleId}
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Card renders a div; a fieldset would bring its own border and padding
        role="group"
        size="sm"
        {...props}
      />
    </TitleId>
  );
}

const ApprovalHeader = CardHeader;

/** What the tool will do ("Send mail"), after its media. */
function ApprovalTitle({ sx, ...props }: ComponentProps<typeof CardTitle>) {
  const titleId = use(TitleId);
  return <CardTitle {...props} id={titleId} sx={[styles.title, sx]} />;
}

/** The tool's icon, bare, before the title. */
function ApprovalMedia({ sx, ...props }: Styled<ComponentProps<"span">>) {
  return (
    <span
      aria-hidden
      data-slot="approval-media"
      {...props}
      {...stylex.props(styles.media, sx)}
    />
  );
}

const ApprovalAction = CardAction;

const ApprovalContent = CardContent;

/** The call's arguments as label and value rows. */
function ApprovalFields({ sx, ...props }: Styled<ComponentProps<"dl">>) {
  return (
    <dl
      data-slot="approval-fields"
      {...props}
      {...stylex.props(styles.fields, sx)}
    />
  );
}

function ApprovalField({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <div
      data-slot="approval-field"
      {...props}
      {...stylex.props(styles.field, sx)}
    />
  );
}

function ApprovalFieldLabel({ sx, ...props }: Styled<ComponentProps<"dt">>) {
  return (
    <dt
      data-slot="approval-field-label"
      {...props}
      {...stylex.props(styles.label, sx)}
    />
  );
}

function ApprovalFieldValue({ sx, ...props }: Styled<ComponentProps<"dd">>) {
  return (
    <dd
      data-slot="approval-field-value"
      {...props}
      {...stylex.props(styles.value, sx)}
    />
  );
}

/** The card's answer buttons: `ApprovalCancel` at its start, the action at its end. */
function ApprovalFooter({ sx, ...props }: ComponentProps<typeof CardFooter>) {
  return <CardFooter {...props} sx={[styles.footer, sx]} />;
}

/** The outline Cancel button, alone at the footer's start. */
function ApprovalCancel({
  size = "sm",
  sx,
  variant = "outline",
  ...props
}: Omit<ButtonProps, "render">) {
  return (
    <Button
      data-slot="approval-cancel"
      size={size}
      sx={[styles.cancel, sx]}
      variant={variant}
      {...props}
    />
  );
}

export {
  Approval,
  ApprovalAction,
  ApprovalCancel,
  ApprovalContent,
  ApprovalField,
  ApprovalFieldLabel,
  ApprovalFieldValue,
  ApprovalFields,
  ApprovalFooter,
  ApprovalHeader,
  ApprovalMedia,
  ApprovalTitle,
};
