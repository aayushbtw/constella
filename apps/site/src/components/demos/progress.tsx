import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Meter, MeterLabel, MeterValue } from "@/components/ui/meter";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { colors, fontSizes, space } from "@/lib/tokens.stylex";
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
  note: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginInlineStart: "auto",
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
        <Meter value={68}>
          <MeterLabel>Messages this month</MeterLabel>
          <MeterValue />
        </Meter>
      </div>
    </DemoRow>
  );
}

function MeterStatusDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Meter status="success" value={100}>
          <MeterLabel>Battery</MeterLabel>
          <MeterValue />
        </Meter>
        <Meter status="warning" value={82}>
          <MeterLabel>Memory</MeterLabel>
          <MeterValue />
        </Meter>
        <Meter status="danger" value={100}>
          <MeterLabel>Storage</MeterLabel>
          <MeterValue />
        </Meter>
      </div>
    </DemoRow>
  );
}

interface Upload {
  name: string;
  size: number;
  speed: number;
}

const uploads: Upload[] = [
  { name: "brand-guidelines.pdf", size: 8.4, speed: 0.9 },
  { name: "q3-report.xlsx", size: 2.1, speed: 0.6 },
  { name: "launch-video.mp4", size: 96, speed: 7 },
];

const megabytes = (value: number) => `${value.toFixed(1)} MB`;

function Uploads() {
  const [sent, setSent] = useState(() => uploads.map(() => 0));
  useEffect(() => {
    const timer = setInterval(() => {
      setSent((all) =>
        all.map((value, index) => {
          const upload = uploads[index];
          return upload === undefined
            ? value
            : Math.min(upload.size, value + upload.speed);
        })
      );
    }, 200);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return uploads.map((upload, index) => {
    const value = sent[index] ?? 0;
    return (
      <Progress key={upload.name} max={upload.size} value={value}>
        <ProgressLabel>{upload.name}</ProgressLabel>
        <ProgressValue>
          {() =>
            value >= upload.size
              ? "Done"
              : `${megabytes(value)} of ${megabytes(upload.size)}`
          }
        </ProgressValue>
      </Progress>
    );
  });
}

function ProgressValueDemo() {
  const [run, setRun] = useState(0);
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Uploads key={run} />
        <Button
          onClick={() => {
            setRun(run + 1);
          }}
          size="sm"
          variant="outline"
        >
          Upload again
        </Button>
      </div>
    </DemoRow>
  );
}

function ProgressIndeterminateDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Progress value={null}>
          <ProgressLabel>Preparing export</ProgressLabel>
          <span {...stylex.props(styles.note)}>Counting files…</span>
        </Progress>
      </div>
    </DemoRow>
  );
}

const gigabytes = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  style: "unit",
  unit: "gigabyte",
});

function MeterValueDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Meter max={5} value={3.2}>
          <MeterLabel>Storage</MeterLabel>
          <MeterValue>
            {(_, value) =>
              `${gigabytes.format(value)} of ${gigabytes.format(5)}`
            }
          </MeterValue>
        </Meter>
        <Meter max={2000} value={1240}>
          <MeterLabel>Messages this month</MeterLabel>
          <MeterValue>
            {(_, value) => `${value.toLocaleString("en-US")} of 2,000`}
          </MeterValue>
        </Meter>
        <Meter max={10} value={10}>
          <MeterLabel>Seats</MeterLabel>
          <MeterValue>{() => "10 of 10 · full"}</MeterValue>
        </Meter>
      </div>
    </DemoRow>
  );
}

export {
  MeterDemo,
  MeterStatusDemo,
  MeterValueDemo,
  ProgressDemo,
  ProgressIndeterminateDemo,
  ProgressLabelDemo,
  ProgressValueDemo,
};
