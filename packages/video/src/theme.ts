// 60fps, so the recorded clips (60fps) play frame for frame.
export const fps = 60;
export const size = 1080;

export const seconds = (s: number) => Math.round(s * fps);

export const totalFrames = seconds(5);
