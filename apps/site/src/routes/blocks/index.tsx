import * as stylex from "@stylexjs/stylex";
import { createFileRoute, redirect } from "@tanstack/react-router";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { layout } from "~/lib/tokens.stylex";
import { getBlocks } from "~/server/blocks";

const styles = stylex.create({
  page: { paddingTop: layout.pageTop },
});

// Until blocks have an index page, it opens the first block.
export const Route = createFileRoute("/blocks/")({
  beforeLoad: async () => {
    const [first] = await getBlocks();

    if (first !== undefined) {
      throw redirect({
        params: { slug: first.slug },
        replace: true,
        to: "/blocks/$slug",
      });
    }
  },
  component: NoBlocks,
});

function NoBlocks() {
  return (
    <main {...stylex.props(styles.page)}>
      <Empty>
        <EmptyHeader>
          <EmptyTitle>No blocks yet</EmptyTitle>
          <EmptyDescription>
            Blocks are whole sections built from the components. They’re coming
            soon.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </main>
  );
}
