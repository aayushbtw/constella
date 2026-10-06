import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import * as stylex from "@stylexjs/stylex";
import { createThemeCss } from "@tanstack/highlight/theme";
import { githubDarkTheme } from "@tanstack/highlight/themes/github-dark";
import { githubLightTheme } from "@tanstack/highlight/themes/github-light";
import {
  createRootRoute,
  HeadContent,
  ScriptOnce,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { Toaster } from "@/components/ui/toast";
import { colors } from "@/lib/tokens.stylex";
import { Header } from "~/components/header";
import { config } from "~/site/config";
import { seo, siteMeta } from "~/site/seo";
import { themeScript } from "~/site/theme";
import { fonts, fontSizes, lineHeights } from "~/site/tokens.stylex";

import appCss from "~/styles/styles.css?url";

// Prose replaces the highlighter's `pre` class but keeps `data-lang`.
const highlightCss = createThemeCss({
  dark: githubDarkTheme,
  darkSelector: ".dark",
  light: githubLightTheme,
  lineNumbersSelector: "pre[data-lang]",
});

export const Route = createRootRoute({
  head: () => ({
    styles: [{ children: highlightCss }],
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "theme-color",
        media: "(prefers-color-scheme: light)",
        content: "#fcfcfc",
      },
      {
        name: "theme-color",
        media: "(prefers-color-scheme: dark)",
        content: "#111111",
      },
      ...siteMeta,
      ...seo({}),
    ],
    links: [
      // Without it, the font is found only after the CSS is parsed.
      {
        rel: "preload",
        href: interLatin,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootDocument,
});

const styles = stylex.create({
  body: {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    fontFamily: fonts.sans,
    fontFeatureSettings: '"cv01", "ss03"',
    fontSize: fontSizes.base,
    lineHeight: lineHeights.prose,
  },
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pageUrl = `${config.siteUrl}${pathname}`;

  return (
    // The theme script sets the class before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <ScriptOnce>{themeScript}</ScriptOnce>
        <link href={pageUrl} rel="canonical" />
        <meta content={pageUrl} property="og:url" />
        <HeadContent />
        <DevStyleX />
      </head>
      <body {...stylex.props(styles.body)}>
        <Toaster>
          <Header />
          {children}
        </Toaster>
        <Scripts />
      </body>
    </html>
  );
}

// Outside the component: React Compiler can't lower `import()`.
function loadStyleXRuntime() {
  if (import.meta.env.DEV) {
    void import("virtual:stylex:runtime");
  }
}

// Builds append StyleX to appCss. Dev serves it separately.
function DevStyleX() {
  useEffect(loadStyleXRuntime, []);

  return import.meta.env.DEV ? (
    <link href="/virtual:stylex.css" rel="stylesheet" />
  ) : null;
}
