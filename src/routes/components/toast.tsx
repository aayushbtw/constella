import * as stylex from "@stylexjs/stylex";
import { createFileRoute } from "@tanstack/react-router";

import {
  DocsCode,
  DocsPage,
  DocsPreview,
  DocsSection,
} from "@/components/docs/page";
import { toast } from "@/components/ui/toast";
import { config } from "@/lib/config";
import {
  colors,
  durations,
  easings,
  fontSizes,
  media,
  presses,
  radii,
  shadows,
  space,
} from "@/lib/tokens.stylex";

export const Route = createFileRoute("/components/toast")({
  component: ToastPage,
  head: () => ({ meta: [{ title: `Toast · ${config.name}` }] }),
});

const styles = stylex.create({
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
    height: 32,
    paddingInline: space.sm,
    transform: { default: null, ":active": presses.link },
    transitionDuration: `${durations.press}, ${durations.hover}`,
    transitionProperty: "transform, background-color",
    transitionTimingFunction: `${easings.out}, ease`,
  },
});

let count = 0;

function showDefault() {
  count += 1;
  toast.add({
    description: "Your changes are live.",
    title: `Saved (${count})`,
  });
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

function showPromise() {
  void toast.promise(
    // oxlint-disable-next-line promise/avoid-new -- the demo fakes a slow upload
    new Promise((resolve) => {
      setTimeout(resolve, 1500);
    }),
    {
      error: { title: "Upload failed" },
      loading: { title: "Uploading…" },
      success: { description: "3 files uploaded.", title: "Done" },
    }
  );
}

function ToastPage() {
  return (
    <DocsPage
      description="Stacked notifications that expand on hover and swipe to dismiss."
      title="Toast"
    >
      <DocsPreview>
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
      </DocsPreview>

      <DocsSection title="Installation">
        <DocsCode>{`npx shadcn@latest add ${config.siteUrl}/r/toast.json`}</DocsCode>
      </DocsSection>

      <DocsSection title="Usage">
        <DocsCode>{`
import { Toaster, toast } from "@/components/ui/toast";

<Toaster>
  <App />
</Toaster>

toast.add({ title: "Saved", description: "Your changes are live." });
`}</DocsCode>
      </DocsSection>

      <DocsSection title="Composition">
        <DocsCode>{`
Toaster
└── Toast
    └── ToastContent
        ├── ToastBody
        │   ├── ToastTitle
        │   └── ToastDescription
        ├── ToastAction
        └── ToastClose
`}</DocsCode>
      </DocsSection>

      <DocsSection title="API">
        <DocsCode>{`
toast.add(options)       // returns the toast id
toast.update(id, options)
toast.close(id)
toast.promise(promise, { loading, success, error })

Every part takes sx to override its styles.
The rest is Base UI: https://base-ui.com/react/components/toast
`}</DocsCode>
      </DocsSection>
    </DocsPage>
  );
}
