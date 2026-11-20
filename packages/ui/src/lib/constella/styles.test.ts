import { afterEach, expect, test, vi } from "vite-plus/test";

import { withStyles } from "./styles";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

test("an outer className beside the part's own throws in development", () => {
  vi.stubEnv("NODE_ENV", "development");

  expect(() =>
    withStyles(
      { className: "outer", "data-slot": "dev" },
      { className: "inner" }
    )
  ).toThrow('Two parts style one element [data-slot="dev"]');
});

test("in production the part's own className wins, and the clash logs once", () => {
  vi.stubEnv("NODE_ENV", "production");
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  const props = { className: "outer", "data-slot": "prod" };

  expect(withStyles(props, { className: "inner" }).className).toBe("inner");
  expect(withStyles(props, { className: "inner" }).className).toBe("inner");
  expect(error).toHaveBeenCalledOnce();
});

test("a part with no className of its own keeps the outer one", () => {
  expect(
    withStyles({ className: "outer" }, { className: undefined }).className
  ).toBe("outer");
});
