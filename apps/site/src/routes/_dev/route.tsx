import { createFileRoute } from "@tanstack/react-router";

import { devOnly } from "~/lib/dev-only";

export const Route = createFileRoute("/_dev")({
  beforeLoad: devOnly,
});
