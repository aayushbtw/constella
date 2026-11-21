import { fireEvent, render, screen, within } from "@testing-library/react";
import { createAgent } from "@ui-sdk/react/agent";
import type { ComponentProps } from "react";
import { expect, test, vi } from "vite-plus/test";

import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

const agent = createAgent();

function Pages(props: ComponentProps<typeof Pagination>) {
  return (
    <Pagination {...props}>
      <PaginationList>
        {({ items }) => (
          <>
            <PaginationItem>
              <PaginationFirst />
            </PaginationItem>
            <PaginationItem>
              <PaginationPrevious />
            </PaginationItem>
            {items.map((item) => (
              <PaginationItem key={item}>
                {item === "ellipsis-start" || item === "ellipsis-end" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink page={item} />
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext />
            </PaginationItem>
            <PaginationItem>
              <PaginationLast />
            </PaginationItem>
          </>
        )}
      </PaginationList>
    </Pagination>
  );
}

test("it is a named navigation whose every control has a name", () => {
  render(<Pages defaultPage={2} pageCount={10} />);

  const nav = screen.getByRole("navigation", { name: "Pagination" });
  const names = within(nav)
    .getAllByRole("button")
    .map((button) => button.textContent);
  expect(names).toEqual([
    "First",
    "Previous",
    "1",
    "2",
    "3",
    "4",
    "5",
    "10",
    "Next",
    "Last",
  ]);

  const entries = agent
    .snapshot()
    .filter((entry) => entry.offPage !== true && entry.component !== "more");
  for (const entry of entries) {
    expect(
      entry.label,
      `${entry.component} ${entry.ref} has no name`
    ).toBeTruthy();
  }
  expect(entries.map((entry) => entry.label)).toContain("Pagination");
});

test("pressing Next onto the last page keeps focus on Next and marks it disabled", () => {
  render(<Pages defaultPage={9} pageCount={10} />);
  const next = screen.getByRole("button", { name: "Next" });
  next.focus();

  fireEvent.click(next);

  expect(document.activeElement).toBe(next);
  expect(next.getAttribute("aria-disabled")).toBe("true");
  expect(screen.getByRole("button", { name: "10" }).ariaCurrent).toBe("page");
});

test("pressing a page makes it the current one", () => {
  render(<Pages pageCount={10} />);
  const third = screen.getByRole("button", { name: "3" });
  expect(third.ariaCurrent).toBeNull();

  fireEvent.click(third);

  expect(third.ariaCurrent).toBe("page");
  expect(screen.getByRole("button", { name: "1" }).ariaCurrent).toBeNull();
});

test("with getHref, pages and steps are links to their pages", () => {
  render(
    <Pages
      defaultPage={2}
      getHref={(page) => `/posts?page=${page}`}
      pageCount={10}
    />
  );

  expect(screen.getByRole("link", { name: "3" }).getAttribute("href")).toBe(
    "/posts?page=3"
  );
  expect(screen.getByRole("link", { name: "Next" }).getAttribute("href")).toBe(
    "/posts?page=3"
  );
  expect(screen.queryAllByRole("button")).toEqual([]);
});

test("onPageChange gets ui-sdk's page and details, and a cancel keeps the page", () => {
  const onPageChange = vi.fn<
    NonNullable<ComponentProps<typeof Pagination>["onPageChange"]>
  >((_page, details) => {
    details.cancel();
  });
  render(<Pages onPageChange={onPageChange} pageCount={10} />);

  fireEvent.click(screen.getByRole("button", { name: "3" }));

  expect(onPageChange).toHaveBeenCalledOnce();
  expect(onPageChange.mock.calls[0]?.[0]).toBe(3);
  expect(onPageChange.mock.calls[0]?.[1].reason).toBe("item-press");
  expect(screen.getByRole("button", { name: "1" }).ariaCurrent).toBe("page");
});

test("icon sizes keep the step's name for screen readers", () => {
  render(
    <Pagination pageCount={3}>
      <PaginationList>
        <PaginationItem>
          <PaginationPrevious size="icon" />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext size="icon-sm" />
        </PaginationItem>
      </PaginationList>
    </Pagination>
  );

  expect(
    screen.getByRole("button", { name: "Previous" }).dataset
  ).toMatchObject({
    size: "icon",
    slot: "pagination-previous",
    variant: "ghost",
  });
  expect(screen.getByRole("button", { name: "Next" }).dataset).toMatchObject({
    size: "icon-sm",
  });
});
