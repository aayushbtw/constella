import * as stylex from "@stylexjs/stylex";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect } from "react";

import { toast, Toaster } from "@/components/primitives/toast";
import { colors, sizes } from "@/lib/constella/tokens.stylex";

export const Route = createFileRoute("/clip")({
  // Dev only, like /break. A promise toast on a guide-lined canvas, for scripted video clips.
  beforeLoad: () => {
    if (!import.meta.env.DEV) {
      throw notFound();
    }
  },
  component: ClipPage,
});

const frameWidth = `calc(${sizes.toast} + 96px)`;
const frameHeight = "176px";

const styles = stylex.create({
  main: {
    backgroundColor: colors.background,
    height: "100vh",
    overflow: "hidden",
    position: "relative",
    width: "100vw",
  },
  line: { position: "absolute" },
  horizontal: {
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: "dashed",
    borderBlockStartWidth: 1,
    left: 0,
    right: 0,
  },
  vertical: {
    borderInlineStartColor: colors.border,
    borderInlineStartStyle: "dashed",
    borderInlineStartWidth: 1,
    bottom: 0,
    top: 0,
  },
  top: { top: `calc(50% - ${frameHeight} / 2)` },
  bottom: { top: `calc(50% + ${frameHeight} / 2)` },
  left: { left: `calc(50% - ${frameWidth} / 2)` },
  right: { left: `calc(50% + ${frameWidth} / 2)` },
  // The viewport anchors toasts by their bottom edge; this centres the settled toast in the frame.
  viewport: {
    bottom: "calc(50% - 34px)",
    insetInlineEnd: `calc(50% - ${sizes.toast} / 2)`,
  },
});

async function play() {
  // oxlint-disable-next-line promise/avoid-new -- the clip fakes a slow upload
  const upload = new Promise((resolve) => {
    setTimeout(resolve, 1800);
  });
  await toast.promise(upload, {
    error: { title: "Upload failed" },
    loading: { title: "Uploading…" },
    success: { description: "3 files uploaded.", timeout: 1500, title: "Done" },
  });
}

function ClipPage() {
  useEffect(() => {
    // The capture script in ~/.local/share/pw calls this on its own clock.
    Object.assign(window, { play });
  }, []);

  return (
    <Toaster sx={styles.viewport}>
      <main {...stylex.props(styles.main)}>
        <div {...stylex.props(styles.line, styles.horizontal, styles.top)} />
        <div {...stylex.props(styles.line, styles.horizontal, styles.bottom)} />
        <div {...stylex.props(styles.line, styles.vertical, styles.left)} />
        <div {...stylex.props(styles.line, styles.vertical, styles.right)} />
      </main>
    </Toaster>
  );
}
