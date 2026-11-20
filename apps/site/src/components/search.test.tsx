import { render } from "@testing-library/react";
import { expect, test, vi } from "vite-plus/test";

Object.assign(document, {
  modelContext: {
    registerTool: async () => {
      await Promise.resolve();
    },
  },
});

vi.mock("@tanstack/react-router", () => ({
  useLoaderData: () => ({ blocks: [], components: [], docs: [] }),
  useNavigate: () => async () => {
    await Promise.resolve();
  },
}));

const { agent } = await import("~/lib/agent");
const { Search } = await import("./search");

test("the agent sees the closed search dialog by name", () => {
  render(<Search />);
  const dialogs = agent
    .snapshot()
    .filter((entry) => entry.component === "dialog");
  expect(dialogs.map((entry) => entry.label)).toEqual(["Search documentation"]);
});
