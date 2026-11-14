import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/primitives/button";
import { LoadingBar } from "@/components/primitives/loading-bar";
import { DemoRow } from "~/components/demos/frame";

const loadFor = 1500;

const styles = stylex.create({
  // Pinned to the demo's frame, under the site's header, instead of the window's top.
  bar: {
    position: "absolute",
    zIndex: 0,
  },
});

function LoadingBarDemo() {
  const [loading, setLoading] = useState(false);
  const load = useRef<ReturnType<typeof setTimeout>>(null);
  useEffect(
    () => () => {
      clearTimeout(load.current ?? undefined);
    },
    []
  );
  return (
    <DemoRow>
      <LoadingBar aria-label="Loading page" loading={loading} sx={styles.bar} />
      <Button
        onClick={() => {
          clearTimeout(load.current ?? undefined);
          setLoading(true);
          load.current = setTimeout(() => {
            setLoading(false);
          }, loadFor);
        }}
        variant="outline"
      >
        Load page
      </Button>
    </DemoRow>
  );
}

export { LoadingBarDemo };
