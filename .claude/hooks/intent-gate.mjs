#!/usr/bin/env node
// PreToolUse(Edit|Write): blocks editing a file that imports a @tanstack package with Intent
// skills until this session has loaded one of that package's skills (AGENTS.md, Skill Loading).
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const input = JSON.parse(readFileSync(0, "utf8"));
const { file_path: file, new_string: edit = "", content = "" } = input.tool_input ?? {};
if (!file || !/\.(tsx?|jsx?|mjs)$/.test(file)) process.exit(0);

const source = (existsSync(file) ? readFileSync(file, "utf8") : "") + edit + content;
const packages = new Set([...source.matchAll(/from\s+["']@tanstack\/([a-z0-9-]+)/g)].map((m) => m[1]));

// Intent ships skills inside the package; resolve it from the edited file's nearest node_modules.
const hasSkills = (pkg) => {
  for (let dir = dirname(file); dir !== dirname(dir); dir = dirname(dir)) {
    if (existsSync(join(dir, "node_modules/@tanstack", pkg, "skills"))) return true;
  }
  return false;
};

const transcript = input.transcript_path && existsSync(input.transcript_path)
  ? readFileSync(input.transcript_path, "utf8")
  : "";
const missing = [...packages].filter(
  (pkg) => hasSkills(pkg) && !transcript.includes(`intent@latest load @tanstack/${pkg}#`)
);
if (missing.length === 0) process.exit(0);

process.stderr.write(
  `Load the TanStack Intent skill before editing code that uses ${missing.map((p) => `@tanstack/${p}`).join(", ")}: ` +
    "run `vp dlx @tanstack/intent@latest list` from the workspace root, then " +
    `\`vp dlx @tanstack/intent@latest load @tanstack/${missing[0]}#<skill>\` for the matching skill.\n`
);
process.exit(2);
