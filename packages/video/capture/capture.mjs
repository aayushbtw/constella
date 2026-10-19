// Records a scripted clip of one Constella demo to a 1080px, 60fps MP4.
// Time is stepped: each frame advances JS timers and every running animation by
// 1/60s, then screenshots, so motion is exact and crisp at any machine speed.
// Usage: node capture.mjs <scene> [light|dark]   (BASE=http://localhost:8080)
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { chromium } from "playwright";

const base = process.env.BASE ?? "http://localhost:8080";
const [scene = "switch", theme = "light"] = process.argv.slice(2);
const outDir = join(import.meta.dirname, "..", "public", "clips");
const fps = 60;
const px = 1080;

const scenes = {
  switch: {
    demo: "switch",
    side: 300,
    async run(c) {
      await c.wait(400);
      await c.moveTo("[data-slot=switch]");
      for (let i = 0; i < 2; i++) {
        await c.wait(250);
        await c.press(220);
        await c.wait(700);
      }
      await c.moveTo("main", { ms: 500, at: [0.8, 0.85] });
      await c.wait(300);
    },
  },
  button: {
    demo: "button-variants",
    side: 400,
    async run(c) {
      await c.wait(400);
      await c.moveTo("[data-capture] [data-slot=button]");
      await c.wait(250);
      await c.press(300);
      await c.wait(500);
      await c.press(120);
      await c.wait(500);
    },
  },
  "toast-promise": {
    demo: "toast-promise",
    side: 640,
    async run(c) {
      await c.wait(400);
      await c.moveTo("[data-capture] [data-slot=button]");
      await c.wait(200);
      await c.press();
      await c.wait(2200);
      await c.moveTo("[data-capture] [data-slot=button] >> nth=1", { ms: 450 });
      await c.wait(200);
      await c.press();
      await c.moveTo("main", { ms: 700, at: [0.5, 0.3] });
      // Both toasts resolve, then time out, so the clip ends where it began.
      await c.wait(7200);
    },
  },
  reasoning: {
    demo: "reasoning-controlled",
    side: 480,
    // The demo streams once on mount, so the first run plays untouched.
    async run(c) {
      await c.wait(4600);
      await c.moveTo("[data-capture] [data-slot=button]");
      await c.wait(200);
      await c.press();
      await c.moveTo("main", { ms: 700, at: [0.85, 0.9] });
      await c.wait(3800);
    },
  },
};

scenes.composer = {
  demo: "prompt-input",
  side: 560,
  async run(c) {
    await c.wait(400);
    await c.moveTo("[data-capture] textarea", { at: [0.3, 0.5] });
    await c.press(100);
    await c.type("Draft a launch post for Constella", 45);
    await c.wait(500);
    await c.moveTo("[data-capture] button[type=submit]", { at: [0.5, 0.5] });
    await c.wait(150);
    await c.press(150);
    await c.wait(2200);
  },
};
scenes.trace = {
  demo: "trace",
  side: 560,
  async run(c) {
    await c.wait(5000);
  },
};
scenes.end = {
  demo: "end",
  side: 560,
  async run(c) {
    await c.wait(2600);
  },
};

const spec = scenes[scene];
if (!spec) {
  throw new Error(
    `Unknown scene "${scene}". Scenes: ${Object.keys(scenes).join(", ")}`
  );
}
const { side } = spec;

const cursorScript = `addEventListener("DOMContentLoaded", () => {
  const c = document.createElement("div");
  c.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M3 2l13 7.5-6 1.2-3 5.8z" fill="#111" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  Object.assign(c.style, { position: "fixed", left: 0, top: 0, zIndex: 2147483647, pointerEvents: "none", transformOrigin: "3px 2px", transition: "scale 90ms ease-out", translate: "${side * 0.8 - 3}px ${side * 0.85 - 2}px" });
  document.body.append(c);
  addEventListener("pointermove", (e) => { c.style.translate = (e.clientX - 3) + "px " + (e.clientY - 2) + "px"; }, true);
  addEventListener("pointerdown", () => { c.style.scale = "0.85"; }, true);
  addEventListener("pointerup", () => { c.style.scale = "1"; }, true);
});`;

const browser = await chromium.launch();
const page = await browser.newPage({
  colorScheme: theme,
  deviceScaleFactor: px / side,
  viewport: { height: side, width: side },
});
await page.addInitScript((t) => {
  localStorage.setItem("theme", t);
}, theme);
if (scene !== "end") {
  await page.addInitScript(cursorScript);
}
await page.clock.install();
await page.clock.pauseAt(Date.now() + 1);
await page.goto(`${base}/capture?d=${spec.demo}`, { waitUntil: "networkidle" });
await page.evaluate(async () => document.fonts.ready);

const work = mkdtempSync(join(tmpdir(), "capture-"));
let frame = 0;
// CDP virtual time can't be used: screenshots hang while it's paused.
async function nextFrame() {
  const dt =
    Math.round(((frame + 1) * 1000) / fps) - Math.round((frame * 1000) / fps);
  await page.clock.runFor(dt);
  await page.evaluate((step) => {
    for (const a of document.getAnimations()) {
      if (a.timeline && !(a.timeline instanceof DocumentTimeline)) {
        continue;
      }
      if (!a.captured) {
        a.captured = true;
        a.pause();
        a.currentTime = 0;
        continue;
      }
      const end = a.effect.getComputedTiming().endTime;
      if (a.currentTime + step >= end) {
        a.finish();
      } else {
        a.currentTime += step;
      }
    }
  }, dt);
  await page.screenshot({
    path: join(work, `${String(frame++).padStart(5, "0")}.png`),
  });
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
let at = { x: side * 0.8, y: side * 0.85 };

const c = {
  async wait(ms) {
    for (let i = Math.round((ms * fps) / 1000); i > 0; i--) {
      await nextFrame();
    }
  },
  // `at` is the point inside the target, as fractions; the default keeps the
  // arrow below center so it doesn't hide what it presses.
  async moveTo(target, { ms = 600, at: [fx, fy] = [0.6, 0.75] } = {}) {
    const box = await page.locator(target).first().boundingBox();
    const to = { x: box.x + box.width * fx, y: box.y + box.height * fy };
    const steps = Math.round((ms * fps) / 1000);
    for (let i = 1; i <= steps; i++) {
      const t = ease(i / steps);
      await page.mouse.move(at.x + (to.x - at.x) * t, at.y + (to.y - at.y) * t);
      await nextFrame();
    }
    at = to;
  },
  async type(text, perChar = 40) {
    for (const ch of text) {
      await page.keyboard.type(ch);
      await c.wait(perChar);
    }
  },
  async press(hold = 120) {
    await page.mouse.down();
    await c.wait(hold);
    await page.mouse.up();
  },
};

await spec.run(c);
await browser.close();

mkdirSync(outDir, { recursive: true });
const out = join(outDir, `${scene}-${theme}.mp4`);
execFileSync("ffmpeg", [
  "-y",
  "-loglevel",
  "error",
  "-framerate",
  String(fps),
  "-i",
  join(work, "%05d.png"),
  "-vf",
  `scale=${px}:${px}:flags=lanczos,format=yuv420p`,
  "-c:v",
  "libx264",
  "-crf",
  "16",
  "-preset",
  "slow",
  "-movflags",
  "+faststart",
  out,
]);
rmSync(work, { recursive: true });
console.log(`${frame} frames -> ${out}`);
