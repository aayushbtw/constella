"use client";

import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { scrollFade } from "@/lib/scroll-fade";
import { space } from "@/lib/tokens.stylex";

type Styled<T> = Omit<T, "className" | "style"> & {
  sx?: stylex.StyleXStyles;
};

const styles = stylex.create({
  list: {
    display: "flex",
    gap: space.xs,
    // Room for the focus ring, which the viewport would clip.
    paddingBlock: space.xxs,
    paddingInline: space.xxs,
    width: "max-content",
  },
});

/** A row that scrolls sideways with no scrollbar; its edges fade while there's more. */
function Suggestions({ sx, ...props }: Styled<ComponentProps<"div">>) {
  return (
    <ScrollArea viewportSx={scrollFade.x}>
      <div
        data-slot="suggestions"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- a fieldset brings its own border and padding into a flex row
        role="group"
        {...props}
        {...stylex.props(styles.list, sx)}
      />
    </ScrollArea>
  );
}

type SuggestionProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  onClick?: (suggestion: string) => void;
  suggestion: string;
};

/** Shows `suggestion` unless given children, and passes it to `onClick`. */
function Suggestion({
  children,
  onClick,
  size = "sm",
  suggestion,
  variant = "outline",
  ...props
}: SuggestionProps) {
  return (
    <Button
      corners="pill"
      onClick={() => {
        onClick?.(suggestion);
      }}
      size={size}
      variant={variant}
      {...props}
    >
      {children ?? suggestion}
    </Button>
  );
}

export { Suggestion, Suggestions };
export type { SuggestionProps };
