import { Composition } from "remotion";

import { Teaser } from "./teaser.tsx";
import { fps, size, totalFrames } from "./theme.ts";

export function Root() {
  return (
    <Composition
      component={Teaser}
      durationInFrames={totalFrames}
      fps={fps}
      height={size}
      id="Teaser"
      width={size}
    />
  );
}
