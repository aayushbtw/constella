import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { expect, onTestFinished, test } from "vite-plus/test";

import { serveSite } from "./bridge-site.ts";

test("the audit server serves its folder and nothing beside it, even a folder that starts with its name", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "bridge-site-"));
  onTestFinished(async () => {
    await rm(root, { force: true, recursive: true });
  });
  const assets = path.join(root, "assets");
  await mkdir(assets);
  await mkdir(`${assets}-private`);
  await writeFile(path.join(assets, "index.html"), "home");
  await writeFile(path.join(`${assets}-private`, "secret.html"), "secret");

  const server = await serveSite(assets);
  onTestFinished(server.close);

  const home = await fetch(`${server.origin}/`);
  expect([home.status, await home.text()]).toEqual([200, "home"]);
  const escaped = await fetch(
    `${server.origin}/..%2Fassets-private/secret.html`
  );
  expect(escaped.status).toBe(404);
});
