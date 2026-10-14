import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { Link } from "@tanstack/react-router";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { colors, media, sizes, space, strokes } from "@/lib/tokens.stylex";

const frameworks = [
  {
    logo: "/logos/tanstack.svg",
    slug: "tanstack-start",
    title: "TanStack Start",
  },
  { logo: "/logos/nextjs.svg", slug: "next", title: "Next.js" },
];

const styles = stylex.create({
  grid: {
    display: "grid",
    gap: space.sm,
    gridTemplateColumns: { default: "1fr", [media.sm]: "1fr 1fr" },
  },
  logo: (url: string) => ({
    backgroundColor: colors.textPrimary,
    height: sizes.iconLg,
    maskImage: `url(${url})`,
    maskPosition: "center",
    maskRepeat: "no-repeat",
    maskSize: "contain",
    width: sizes.iconLg,
  }),
});

function Frameworks() {
  return (
    <div {...stylex.props(styles.grid)}>
      {frameworks.map(({ logo, slug, title }) => (
        <Item
          key={slug}
          // oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- the item renders its children into the link
          render={<Link params={{ slug }} to="/docs/installation/$slug" />}
          variant="outline"
        >
          <ItemMedia>
            <span {...stylex.props(styles.logo(logo))} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
          </ItemContent>
          <ItemActions>
            <HugeiconsIcon
              aria-hidden
              data-rtl-flip
              icon={ArrowRight01Icon}
              size={sizes.icon}
              strokeWidth={Number(strokes.icon)}
            />
          </ItemActions>
        </Item>
      ))}
    </div>
  );
}

export { Frameworks };
