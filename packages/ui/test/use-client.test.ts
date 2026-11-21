import { existsSync, globSync, readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "vite-plus/test";

const src = path.join(import.meta.dirname, "../src");

const isClient = (source: string) => /^\s*["']use client["']/u.test(source);

const read = (file: string) => readFileSync(path.join(src, file), "utf-8");

const resolve = (specifier: string) =>
  ["tsx", "ts"]
    .map((extension) => `${specifier.replace("@/", "")}.${extension}`)
    .find((file) => existsSync(path.join(src, file)));

const hook = /\buse(?:[A-Z]\w*)?\s*[<(]|\bcreateContext\b/u;
const namedImport =
  /import\s+(?<typeOnly>type\s+)?\{(?<names>[^}]*)\}\s*from\s*["'](?<specifier>@\/components\/[^"']+)["']/gu;

const reasons = (file: string) => {
  const source = read(file);
  const found: string[] = [];
  const call = hook.exec(source);
  if (call) {
    found.push(`calls ${call[0]}`);
  }
  for (const { groups } of source.matchAll(namedImport)) {
    const target = resolve(groups?.specifier ?? "");
    if (
      groups?.typeOnly === undefined &&
      target !== undefined &&
      isClient(read(target))
    ) {
      const values = (groups?.names ?? "")
        .split(",")
        .map((name) => name.trim().split(/\s+as\s+/u)[0])
        .filter((name) => !name.startsWith("type ") && /^[a-z_$]/u.test(name));
      for (const value of values) {
        found.push(`imports ${value} from "use client" ${target}`);
      }
    }
  }
  return found.map((reason) => `${file} ${reason}`);
};

test('a component file without "use client" calls no hook or createContext and reads no value from a "use client" file', () => {
  const files = globSync("components/**/*.tsx", { cwd: src }).filter(
    (file) =>
      !file.endsWith(".test.tsx") && !file.startsWith("components/tanstack/")
  );
  const offenders = files
    .filter((file) => !isClient(read(file)))
    .flatMap(reasons);
  expect(offenders).toEqual([]);
});
