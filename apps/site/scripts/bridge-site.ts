import { once } from "node:events";
import { readdir, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";

import { chromium, errors } from "playwright";
import type { Browser, Page } from "playwright";
import { z } from "zod";

const siteDir = path.join(import.meta.dirname, "..");
const builtAssetsDir = path.join(
  siteDir,
  ".cloudflare/output/v0/workers/default/assets"
);

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
]);

const componentsDir = path.join(siteDir, "content/components");
const gatedSections = new Set(["AI", "TanStack"]);

async function gatedSlugs() {
  const files = await readdir(componentsDir);
  const gated = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        const text = await readFile(path.join(componentsDir, file), "utf-8");
        const section = /^section:\s*(?<section>.+?)\s*$/mu.exec(text)?.groups
          ?.section;
        const draft = /^draft:\s*true\s*$/mu.test(text);
        return !draft && section !== undefined && gatedSections.has(section)
          ? [path.basename(file, ".md")]
          : [];
      })
  );
  return gated.flat().toSorted();
}

async function serve(
  assetsDir: string,
  req: IncomingMessage,
  res: ServerResponse
) {
  try {
    const target = path.join(
      assetsDir,
      decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname)
    );
    const file =
      path.extname(target) === "" ? path.join(target, "index.html") : target;
    const type = contentTypes.get(path.extname(file));
    if (type === undefined || !file.startsWith(assetsDir)) {
      throw new Error("not served");
    }
    const body = await readFile(file);
    res.writeHead(200, { "content-type": type }).end(body);
  } catch {
    res.writeHead(404).end();
  }
}

async function serveSite(assetsDir: string) {
  const server = createServer((req, res) => {
    void serve(assetsDir, req, res);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = z.object({ port: z.number() }).parse(server.address());
  return {
    origin: `http://127.0.0.1:${port}`,
    close: () => {
      server.close();
    },
  };
}

const launch = async (): Promise<Browser> =>
  await chromium.launch({ headless: true });

interface Settling {
  key: string;
  reads: number;
  stable: number;
}

const pollMs = 100;
const longerThanASecondTickMs = 1500;
const pastTheTraceRunMs = 20_000;

const unsettled: Settling = { key: "", reads: 0, stable: 0 };

async function settle(page: Page, state = unsettled): Promise<void> {
  if (
    state.stable * pollMs >= longerThanASecondTickMs ||
    state.reads * pollMs >= pastTheTraceRunMs
  ) {
    return;
  }
  await page.waitForTimeout(pollMs);
  const key = await page.evaluate(() =>
    JSON.stringify(
      (globalThis.agentBridge?.agent.snapshot() ?? []).map((entry) => [
        entry.label,
        entry.component,
        entry.actions,
        entry.disabled,
      ])
    )
  );
  await settle(page, {
    key,
    reads: state.reads + 1,
    stable: key === state.key ? state.stable + 1 : 0,
  });
}

class NoBridgeError extends Error {
  override name = "NoBridgeError";
}

async function openBridgePage(page: Page, url: string) {
  await page.goto(url, { waitUntil: "load" });
  try {
    await page.waitForFunction(
      () => globalThis.agentBridge !== undefined,
      null,
      { timeout: 10_000 }
    );
  } catch (error) {
    throw error instanceof errors.TimeoutError
      ? new NoBridgeError(`No agent bridge on ${url}`, { cause: error })
      : error;
  }
  await settle(page);
}

export {
  builtAssetsDir,
  componentsDir,
  gatedSlugs,
  launch,
  NoBridgeError,
  openBridgePage,
  serveSite,
  settle,
  siteDir,
};
