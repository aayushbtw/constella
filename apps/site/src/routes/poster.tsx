import * as stylex from "@stylexjs/stylex";
import { createFileRoute, notFound } from "@tanstack/react-router";

import { colors, space } from "@/lib/constella/tokens.stylex";
import { demos } from "~/components/demos";
import { CompactStage } from "~/components/demos/frame";

export const Route = createFileRoute("/poster")({
  // Dev only, like /break. A tilted mosaic of real demos for social posts.
  beforeLoad: () => {
    if (!import.meta.env.DEV) {
      throw notFound();
    }
  },
  component: PosterPage,
});

const columns: (keyof typeof demos)[][] = [
  [
    "badge-status",
    "chart-pie",
    "card-stats",
    "toast-types",
    "markdown",
    "alert-status",
    "badge-variants",
  ],
  [
    "chat",
    "button-variants",
    "field-form",
    "meter-status",
    "item-avatar",
    "badge-icon",
    "marker-status",
  ],
  [
    "command",
    "code-block-diff",
    "collapsible-tree",
    "checkbox-table",
    "code-block-line-numbers",
    "badge-avatar",
  ],
  [
    "trace",
    "data-table-pagination",
    "trace-group",
    "attachment-group",
    "field-radio",
    "badge-status",
    "kbd-group",
  ],
  [
    "questionnaire-card",
    "chart-area",
    "prompt-input-header",
    "item-group",
    "slider-range",
    "badge-size",
    "avatar-badge",
  ],
  [
    "markdown-streaming",
    "approval",
    "chart-line",
    "radio-group-card",
    "tabs",
    "marker-variants",
    "badge-link",
    "meter-value",
  ],
  [
    "code-block-highlighted",
    "table",
    "switch-card",
    "citation",
    "progress-label",
    "badge-variants",
    "avatar-group-count",
    "badge-icon",
  ],
  [
    "message",
    "field-card",
    "trace-reasoning",
    "input-group-textarea",
    "empty-card",
    "badge-status",
  ],
];

const styles = stylex.create({
  main: {
    backgroundColor: colors.background,
    height: "100vh",
    overflow: "hidden",
    position: "relative",
    width: "100vw",
  },
  mosaic: {
    alignItems: "center",
    display: "flex",
    gap: space.lg,
    left: "50%",
    position: "absolute",
    top: "50%",
    transform: "translate(-50%, -50%) rotate(-12deg) scale(0.7)",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
    width: 440,
  },
  // Stagger so the columns don't line up into rows.
  shift1: { marginBlockStart: 120 },
  shift3: { marginBlockStart: 60 },
});

const shifts = [null, styles.shift1, styles.shift3];

// Off-screen padding: neighbours' tiles above and below, and wrapped columns at the sides,
// so the tilted grid overruns the frame at any window size.
const padded = [...columns.slice(-2), ...columns, ...columns.slice(0, 2)].map(
  (names, i, all) => [
    ...new Set([
      ...all[(i + 3) % all.length],
      ...names,
      ...all[(i + 5) % all.length],
    ]),
  ]
);

function PosterPage() {
  return (
    <CompactStage value>
      <main {...stylex.props(styles.main)}>
        <div {...stylex.props(styles.mosaic)}>
          {padded.map((names, i) => (
            // oxlint-disable-next-line no-array-index-key -- columns repeat, so names aren't unique
            <div key={i} {...stylex.props(styles.column, shifts[i % 3])}>
              {names.map((name) => {
                const Demo = demos[name];
                return <Demo key={name} />;
              })}
            </div>
          ))}
        </div>
      </main>
    </CompactStage>
  );
}
