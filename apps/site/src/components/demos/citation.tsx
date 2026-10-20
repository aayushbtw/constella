import * as stylex from "@stylexjs/stylex";

import { Citation, Citations } from "@/components/ai/citation";
import type { Source } from "@/components/ai/citation";
import { Text } from "@/components/typography/text";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  answer: {
    maxWidth: 448,
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
      <Citations>
        <Text color="primary" size="lg" sx={styles.answer}>
          Acme’s revenue grew 12% last quarter, ahead of forecasts{" "}
          <Citation sources={[sources.acme, sources.newsroom]} />. Its new
          dashboard is built on open components{" "}
          <Citation sources={[sources.shadcn]} />.
        </Text>
      </Citations>
    </DemoRow>
  );
}

export { CitationDemo };
