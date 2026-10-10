import * as stylex from "@stylexjs/stylex";
import type { AnyRouter } from "@tanstack/react-router";

import { easings, media, motion, space } from "@/lib/tokens.stylex";

// One gesture: the tagline and the page stagger in inside the logo's spin, and the
// last item lands as it settles. In ms.
const spinFor = 1000;
const wordsAt = 60;
const wordStep = 60;
const itemsAt = 300;
const itemFor = 450;
// A tile's content comes into focus this long after its surface starts rising.
const contentLag = 80;

const spinIn = stylex.keyframes({
  from: { opacity: 0, transform: "rotate(-180deg) scale(0.85)" },
});
const focusIn = stylex.keyframes({
  from: { filter: "blur(8px)", opacity: 0, transform: "translateY(0.3em)" },
});
const rise = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${space.xs})` },
});
const develop = stylex.keyframes({
  from: { filter: `blur(${motion.crossfadeBlur})`, opacity: 0 },
});
const fade = stylex.keyframes({ from: { opacity: 0 } });

// Reduced motion keeps only the fade; after a client navigation nothing replays.
const play = (name: string, duration: number) => ({
  animationDuration: `${duration}ms`,
  animationFillMode: "both",
  animationName: {
    default: name,
    ":is([data-navigated] *)": "none",
    [media.reducedMotion]: { default: fade, ":is([data-navigated] *)": "none" },
  },
  animationTimingFunction: easings.out,
});

const styles = stylex.create({
  spin: play(spinIn, spinFor),
  word: { ...play(focusIn, 500), display: "inline-block" },
  item: play(rise, itemFor),
  content: play(develop, itemFor - contentLag),
  delay: (ms: number) => ({ animationDelay: `${ms}ms` }),
});

// Spaced so the last item, and a tile's content with it, lands as the logo settles.
const itemAt = (order: number, count: number) =>
  itemsAt + (order * (spinFor - itemsAt - itemFor)) / (count - 1);

const entrance = {
  spin: styles.spin,
  word: (index: number) => [
    styles.word,
    styles.delay(wordsAt + index * wordStep),
  ],
  /** Item `order` of `count`: rises into place. */
  item: (order: number, count: number) => [
    styles.item,
    styles.delay(itemAt(order, count)),
  ],
  /** The content of tile `order`: comes into focus once its surface is moving. */
  content: (order: number, count: number) => [
    styles.content,
    styles.delay(itemAt(order, count) + contentLag),
  ],
};

/** Marks `<html>` with `data-navigated` once the reader moves to another page. */
function markNavigations(router: AnyRouter) {
  router.subscribe("onBeforeNavigate", ({ fromLocation, pathChanged }) => {
    if (fromLocation && pathChanged) {
      document.documentElement.dataset.navigated = "";
    }
  });
}

export { entrance, markNavigations };
