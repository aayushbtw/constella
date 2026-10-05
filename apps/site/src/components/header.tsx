import { ContrastIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { Link, useRouterState } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { colors, easings, media, sizes, strokes } from "@/lib/tokens.stylex";
import { Logo } from "~/components/logo";
import { config } from "~/site/config";
import { timeline } from "~/site/entrance";
import { toggleTheme } from "~/site/theme";
import { layers, layout, media as siteMedia } from "~/site/tokens.stylex";

const spinIn = stylex.keyframes({
  from: { opacity: 0, transform: "rotate(-180deg) scale(0.85)" },
});
const fade = stylex.keyframes({ from: { opacity: 0 } });

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
      [siteMedia.sidebar]: layout.shell,
    },
    paddingInline: {
      default: layout.gutter,
      [siteMedia.sidebar]: layout.gutterWide,
    },
  },
  name: {
    color: colors.textPrimary,
    display: "flex",
  },
  spin: (duration: number) => ({
    animationDuration: `${duration}ms`,
    animationFillMode: "both",
    animationName: {
      default: spinIn,
      ":is([data-navigated] *)": "none",
      [media.reducedMotion]: {
        default: fade,
        ":is([data-navigated] *)": "none",
      },
    },
    animationTimingFunction: easings.out,
  }),
});

function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const spin = pathname === "/";

  return (
    <header {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.inner)}>
        <Link
          aria-label={`${config.name} home`}
          to="/"
          {...stylex.props(styles.name, spin && styles.spin(timeline.spinFor))}
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
