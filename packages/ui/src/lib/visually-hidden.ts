import * as stylex from "@stylexjs/stylex";

const visuallyHidden = stylex.create({
  base: {
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    whiteSpace: "nowrap",
    width: 1,
  },
});

export { visuallyHidden };
