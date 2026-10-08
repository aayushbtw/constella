import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";

import { Meter, MeterLabel, MeterValue } from "@/components/ui/meter";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { space } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
    maxWidth: "100%",
    width: 320,
  },
});

function ProgressDemo() {
  const [value, setValue] = useState(13);
  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(66);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Progress aria-label="Upload" value={value} />
      </div>
    </DemoRow>
  );
}

function ProgressLabelDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Progress value={56}>
          <ProgressLabel>Upload progress</ProgressLabel>
          <ProgressValue />
        </Progress>
      </div>
    </DemoRow>
  );
}

function MeterDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Meter value={24}>
          <MeterLabel>Storage</MeterLabel>
          <MeterValue />
        </Meter>
        <Meter value={100}>
          <MeterLabel>Messages this month</MeterLabel>
          <MeterValue />
        </Meter>
      </div>
    </DemoRow>
  );
}

export { MeterDemo, ProgressDemo, ProgressLabelDemo };
