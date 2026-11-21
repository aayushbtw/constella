import * as stylex from "@stylexjs/stylex";

import {
  Citation,
  CitationGroup,
  CitationGroupMore,
  Citations,
  CitationSource,
} from "@/components/ai/citation";
import type { Source } from "@/components/ai/citation";
import { Text } from "@/components/typography/text";
import { sizes, space } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  answer: {
    maxWidth: 448,
  },
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
  },
  flushList: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    marginInline: `calc(-1 * ${space.row})`,
  },
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    width: sizes.popover,
  },
});

const sources = {
  acme: {
    date: "October 9, 2026",
    description:
      "Revenue rose 12% in the third quarter, beating analysts' forecasts as customers moved to the new plans.",
    name: "Acme Business Journal",
    title: "Acme Beats Forecasts as Revenue Grows 12% on New Plans",
    url: "https://acme.com",
  },
  newsroom: {
    date: "October 10, 2026",
    name: "Acme Newsroom",
    title: "Third-Quarter Results: Revenue Up 12%",
    url: "https://news.acme.com",
  },
  shadcn: {
    date: "September 24, 2026",
    icon: "/avatars/shadcn.png",
    name: "shadcn",
    title: "Components You Copy, Own and Build On",
    url: "https://ui.shadcn.com",
  },
} satisfies Record<string, Source>;

function CitationDemo() {
  return (
    <DemoRow>
      <Citations aria-label="Sources for this answer">
        <div {...stylex.props(styles.answer, styles.stack)}>
          <Text color="primary" size="lg">
            Acme’s revenue grew 12% last quarter, ahead of forecasts{" "}
            <Citation sources={[sources.acme, sources.newsroom]} />. Its new
            dashboard is built on open components{" "}
            <Citation sources={[sources.shadcn]} />.
          </Text>
          <div {...stylex.props(styles.flushList)}>
            {Object.values(sources).map((source) => (
              <CitationSource key={source.url} source={source} />
            ))}
          </div>
        </div>
      </Citations>
    </DemoRow>
  );
}

const found = [
  sources.acme,
  sources.newsroom,
  sources.shadcn,
  {
    date: "October 2, 2026",
    name: "Acme Docs",
    title: "Plans and Pricing",
    url: "https://docs.acme.com",
  },
] satisfies Source[];

function CitationGroupDemo() {
  const last = found.at(-1);
  return (
    <DemoRow>
      <Citations aria-label="Sources found">
        <CitationGroup sx={styles.answer}>
          {found.slice(0, -1).map((source) => (
            <Citation key={source.url} sources={[source]} />
          ))}
          {last === undefined ? null : (
            <CitationGroupMore count={42}>
              <Citation sources={[last]} />
            </CitationGroupMore>
          )}
        </CitationGroup>
      </Citations>
    </DemoRow>
  );
}

function CitationSourceDemo() {
  return (
    <DemoRow>
      <div {...stylex.props(styles.panel)}>
        {found.map((source) => (
          <CitationSource
            aria-current={source === sources.newsroom ? "true" : undefined}
            key={source.url}
            source={source}
          />
        ))}
      </div>
    </DemoRow>
  );
}

export { CitationDemo, CitationGroupDemo, CitationSourceDemo };
