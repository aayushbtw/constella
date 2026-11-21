import { rename, rm } from "node:fs/promises";

import { agentBuildDir, deployOutputDir } from "./bridge-site.ts";

// The Cloudflare plugin always writes to the deploy folder, so a bridge build leaves it before anything can ship it.
await rm(agentBuildDir, { force: true, recursive: true });
await rename(deployOutputDir, agentBuildDir);
