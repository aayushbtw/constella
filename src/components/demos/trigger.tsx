import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { space } from "@/lib/tokens.stylex";

const styles = stylex.create({
  row: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.xs,
    justifyContent: "center",
  },
});

function DemoRow(props: Omit<ComponentProps<"div">, "className" | "style">) {
  return <div {...props} {...stylex.props(styles.row)} />;
}

export { DemoRow };
