import interLatin from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import * as stylex from "@stylexjs/stylex";
import {
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { config } from "@/lib/config";
import { colors, fonts, fontSizes, lineHeights } from "@/lib/tokens.stylex";

import appCss from "@/styles/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#ffffff" },
      { title: config.name },
      { name: "description", content: config.description },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: config.name },
      { name: "twitter:site", content: config.socials.twitter },
      { name: "twitter:creator", content: config.socials.twitter },
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
    <html lang="en">
      <head>
        <link href={pageUrl} rel="canonical" />
        <meta content={pageUrl} property="og:url" />
        <HeadContent />
        <DevStyleX />
      </head>
      <body {...stylex.props(styles.body)}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// Builds append StyleX to appCss. Dev serves it separately.
function DevStyleX() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      void import("virtual:stylex:runtime");
    }
  }, []);

  return import.meta.env.DEV ? (
    <link href="/virtual:stylex.css" rel="stylesheet" />
  ) : null;
}
