import { ContrastIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { Link, useRouterState } from "@tanstack/react-router";

import { Button, buttonStyles } from "@/components/ui/button";
import {
  colors,
  fontSizes,
  fontWeights,
  sizes,
  space,
  strokes,
} from "@/lib/tokens.stylex";
import { Logo } from "~/components/logo";
import { config } from "~/lib/config";
import { entrance } from "~/lib/entrance";
import { toggleTheme } from "~/lib/theme";
import { layers, layout, media } from "~/lib/tokens.stylex";

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
  start: {
    alignItems: "center",
    display: "flex",
    gap: space.md,
  },
  brand: {
    alignItems: "center",
    color: colors.textPrimary,
    display: "flex",
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    gap: space.xs,
    textDecoration: "none",
  },
  logo: {
    display: "flex",
  },
  nav: {
    display: "flex",
  },
  link: {
    color: colors.textSecondary,
  },
  current: {
    color: colors.textPrimary,
  },
});

const sections = [
  { label: "Docs", to: "/docs" },
  { label: "Components", to: "/docs/components" },
  { label: "Blocks", to: "/blocks" },
] as const;

// Components sit under /docs, so the longest matching prefix wins.
function currentSection(pathname: string) {
  return sections.findLast(
    ({ to }) => pathname === to || pathname.startsWith(`${to}/`)
  )?.to;
}

function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = currentSection(pathname);

  return (
    <header {...stylex.props(styles.header)}>
      <div {...stylex.props(styles.inner)}>
        <div {...stylex.props(styles.start)}>
          <Link to="/" {...stylex.props(styles.brand)}>
            <span
              {...stylex.props(styles.logo, pathname === "/" && entrance.spin)}
            >
              <Logo />
            </span>
            {config.name}
          </Link>
          <nav aria-label="Main" {...stylex.props(styles.nav)}>
            {sections.map(({ label, to }) => (
              <Link
                activeOptions={{ exact: true }}
                aria-current={to === current ? "true" : undefined}
                key={to}
                to={to}
                {...stylex.props(
                  buttonStyles({ size: "sm", variant: "ghost" }),
                  styles.link,
                  to === current && styles.current
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <Button
          aria-label="Toggle theme"
          onClick={toggleTheme}
          size="icon"
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
