import * as stylex from "@stylexjs/stylex";

import { toast } from "@/components/ui/toast";
import {
  colors,
  durations,
  easings,
  fontSizes,
  media,
  presses,
  radii,
  shadows,
  sizes,
  space,
} from "@/lib/tokens.stylex";

const styles = stylex.create({
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.xs,
    justifyContent: "center",
  },
  trigger: {
    backgroundColor: {
      default: colors.background,
      [media.hover]: {
        default: colors.background,
        ":hover": colors.fillSubtle,
      },
    },
    borderRadius: radii.sm,
    boxShadow: shadows.ring,
    fontSize: fontSizes.sm,
    height: sizes.controlMd,
    paddingInline: space.sm,
    transform: { default: null, ":active": presses.link },
    transitionDuration: `${durations.press}, ${durations.hover}`,
    transitionProperty: "transform, background-color",
    transitionTimingFunction: `${easings.out}, ease`,
  },
});

let uploads = 0;

function showDefault() {
  toast.add({ title: "Saved", type: "success" });
}

function showAction() {
  toast.add({
    actionProps: {
      children: "Undo",
      onClick: () => {
        toast.add({ title: "Restored" });
      },
    },
    description: "The file was moved to trash.",
    title: "File deleted",
  });
}

// Every other upload fails, so both endings are on show.
async function upload() {
  uploads += 1;
  const fails = uploads % 2 === 0;

  try {
    await toast.promise(
      // oxlint-disable-next-line promise/avoid-new -- the demo fakes a slow upload
      new Promise((resolve, reject) => {
        setTimeout(fails ? reject : resolve, 1500);
      }),
      {
        error: {
          description: "The connection dropped.",
          title: "Upload failed",
        },
        loading: { title: "Uploading…" },
        success: { description: "3 files uploaded.", title: "Done" },
      }
    );
  } catch {
    // The toast already shows the failure.
  }
}

function showPromise() {
  void upload();
}

function ToastDemo() {
  return (
    <div {...stylex.props(styles.row)}>
      <button
        onClick={showDefault}
        type="button"
        {...stylex.props(styles.trigger)}
      >
        Show toast
      </button>
      <button
        onClick={showAction}
        type="button"
        {...stylex.props(styles.trigger)}
      >
        With action
      </button>
      <button
        onClick={showPromise}
        type="button"
        {...stylex.props(styles.trigger)}
      >
        Promise
      </button>
    </div>
  );
}

export { ToastDemo };
