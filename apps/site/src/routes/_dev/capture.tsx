import * as stylex from "@stylexjs/stylex";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

import { Toaster } from "@/components/primitives/toast";
import { Heading } from "@/components/typography/heading";
import { Text } from "@/components/typography/text";
import { space } from "@/lib/constella/tokens.stylex";
import { demos, isDemo } from "~/components/demos";
import { Logo } from "~/components/logo";
import { config } from "~/lib/config";
import { entrance } from "~/lib/entrance";

const search = z.object({ d: z.string().optional() });

export const Route = createFileRoute("/_dev/capture")({
  // Ahead of beforeLoad, so its `search` param is typed.
  validateSearch: (raw) => search.safeParse(raw).data ?? {},
  beforeLoad: ({ search: { d } }) => {
    if (d !== "end" && (d === undefined || !isDemo(d))) {
      throw notFound();
    }
  },
  component: CapturePage,
});

const styles = stylex.create({
  main: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    minHeight: "100vh",
    paddingInline: space.md,
  },
  // Demos expect a column's width; a shrink-to-fit item collapses them.
  frame: { width: "100%" },
  end: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: space.md,
  },
});

function CapturePage() {
  const { d } = Route.useSearch();

  if (d === "end") {
    return (
      <main {...stylex.props(styles.main)}>
        <div {...stylex.props(styles.end)}>
          <span {...stylex.props(entrance.spin)}>
            <Logo size="96px" />
          </span>
          <Heading size={2}>
            {config.name.split(" ").map((word, index) => (
              <span key={word} {...stylex.props(entrance.word(index))}>
                {word}
              </span>
            ))}
          </Heading>
          <span {...stylex.props(entrance.item(1, 2))}>
            <Text color="muted">constella.aayush.cv</Text>
          </span>
        </div>
      </main>
    );
  }

  if (d === undefined || !isDemo(d)) {
    throw notFound();
  }
  const Component = demos[d];

  return (
    <Toaster>
      <main {...stylex.props(styles.main)}>
        {/* The capture script in ~/.local/share/pw scopes its selectors to this. */}
        <div data-capture {...stylex.props(styles.frame)}>
          <Component />
        </div>
      </main>
    </Toaster>
  );
}
