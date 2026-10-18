import * as stylex from "@stylexjs/stylex";

import { Citation, CitationCard } from "@/components/ai/citation";
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
    name: "Acme Business Journal",
    title: "Acme Beats Forecasts as Revenue Grows 12% on New Plans",
    url: "https://acme.com",
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
      <Text color="primary" size="lg" sx={styles.answer}>
        Acme’s revenue grew 12% last quarter, ahead of forecasts{" "}
        <Citation source={sources.acme} />. Its new dashboard is built on open
        components <Citation source={sources.shadcn} />.
      </Text>
      <CitationCard />
    </DemoRow>
  );
}

export { CitationDemo };
