import { ContrastIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { colors, sizes, strokes } from "@/lib/tokens.stylex";
import { Logo } from "~/components/logo";
import { config } from "~/site/config";
import { toggleTheme } from "~/site/theme";
import { layers, layout, media } from "~/site/tokens.stylex";

const styles = stylex.create({
  header: {
    backgroundColor: colors.background,
    height: layout.header,
    insetBlockStart: 0,
    insetInline: 0,
    position: "fixed",
    zIndex: layers.header,
  },
  inner: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "space-between",
    marginInline: "auto",
    maxWidth: {
      default: `calc(${layout.content} + 2 * ${layout.gutter})`,
      [media.sidebar]: layout.shell,
    },
    paddingInline: {
      default: layout.gutter,
      [media.sidebar]: layout.gutterWide,
    },
  },
  name: {
    color: colors.textPrimary,
    display: "flex",
  },
});

function Header() {
  return (
    <header {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.inner)}>
        <Link
          aria-label={`${config.name} home`}
          to="/"
          {...stylex.props(styles.name)}
        >
          <Logo />
        </Link>
        <Button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          size="icon-md"
          variant="ghost"
        >
          <HugeiconsIcon
            icon={ContrastIcon}
            size={sizes.icon}
            strokeWidth={Number(strokes.icon)}
          />
        </Button>
      </div>
    </header>
  );
}

export { Header };
