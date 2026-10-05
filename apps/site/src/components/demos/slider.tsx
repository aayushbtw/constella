import * as stylex from "@stylexjs/stylex";

import {
  Slider,
  SliderControl,
  SliderLabel,
  SliderValue,
} from "@/components/ui/slider";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  slider: {
    maxWidth: 280,
  },
});

function SliderDemo() {
  return (
    <DemoRow sx={styles.slider}>
      <Slider defaultValue={40}>
        <SliderLabel>Volume</SliderLabel>
        <SliderValue />
        <SliderControl />
      </Slider>
    </DemoRow>
  );
}

export { SliderDemo };
