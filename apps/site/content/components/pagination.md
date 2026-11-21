---
title: Pagination
description: Page links with Previous and Next, for a list split into pages.
---

<!-- ::demo name="pagination" -->

```tsx
<Pagination defaultPage={2} pageCount={10}>
  <PaginationList>
    {({ items }) => (
      <>
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
      </>
    )}
  </PaginationList>
</Pagination>
```

## Installation

<!-- ::install name="pagination" -->

## Usage

```tsx
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/components/primitives/pagination";
```

```tsx
<Pagination pageCount={10}>
  <PaginationList>
    {({ items }) => (
      <>
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
      </>
    )}
  </PaginationList>
</Pagination>
```

`items` holds the page numbers to show and an ellipsis for each gap. Key each entry by the item itself, so a page link keeps its element as the range moves.

## Composition

```
Pagination
└── PaginationList
    ├── PaginationItem
    │   └── PaginationFirst
    ├── PaginationItem
    │   └── PaginationPrevious
    ├── PaginationItem
    │   └── PaginationLink
    ├── PaginationItem
    │   └── PaginationEllipsis
    ├── PaginationItem
    │   └── PaginationNext
    └── PaginationItem
        └── PaginationLast
```

## Simple

With only a few pages the range has no gaps, so write the links out and leave the steps off.

<!-- ::demo name="pagination-simple" -->

```tsx
<Pagination defaultPage={2} pageCount={5}>
  <PaginationList>
    {[1, 2, 3, 4, 5].map((page) => (
      <PaginationItem key={page}>
        <PaginationLink page={page} />
      </PaginationItem>
    ))}
  </PaginationList>
</Pagination>
```

## Icon Only

Use an `icon` size on a step to show its arrow alone. Its text stays for screen readers.

<!-- ::demo name="pagination-icon-only" -->

```tsx
const [pageSize, setPageSize] = useState("25");

<Field orientation="horizontal">
  <FieldLabel>Rows per page</FieldLabel>
  <Select items={pageSizes} onValueChange={setPageSize} value={pageSize}>
    …
  </Select>
</Field>
<Pagination pageSize={Number(pageSize)} total={240}>
  <PaginationList>
    <PaginationItem>
      <PaginationPrevious size="icon" />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext size="icon" />
    </PaginationItem>
  </PaginationList>
</Pagination>;
```

`PaginationFirst` and `PaginationLast` are `icon` by default. With your own children, give an icon-only step an `aria-label`.

## Total and Page Size

Pass `total` and `pageSize` instead of `pageCount`, and the page count follows them. Reset to page 1 when the page size changes.

```tsx
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(25);

<Pagination page={page} pageSize={pageSize} total={240} onPageChange={setPage}>
  …
</Pagination>;
```

## Links

Pass `getHref` to map each page to a URL. Page links and steps then render as anchors that work before JavaScript loads.

```tsx
<Pagination getHref={(page) => `/posts?page=${page}`} pageCount={10}>
  …
</Pagination>
```

### Router Link

Use the `render` prop to pass a router's link. It receives the `href` from `getHref`. Read the page from the URL, so the route controls it.

```tsx
<Pagination getHref={(page) => `?page=${page}`} page={page} pageCount={10}>
  <PaginationList>
    {({ items }) =>
      items.map((item) => (
        <PaginationItem key={item}>
          {item === "ellipsis-start" || item === "ellipsis-end" ? (
            <PaginationEllipsis />
          ) : (
            <PaginationLink page={item} render={<Link />} />
          )}
        </PaginationItem>
      ))
    }
  </PaginationList>
</Pagination>
```

Put `sx` on `PaginationLink`, the part that draws, not on the router's link.

## API Reference

| Part | Adds |
| --- | --- |
| `Pagination` | `aria-label="Pagination"`, which a passed `aria-label` replaces |
| `PaginationLink` | `size`: Button's sizes, `"icon"` by default. The current page draws as outline |
| `PaginationPrevious`, `PaginationNext` | `variant`: Button's variants, `"ghost"` by default; `size`: Button's sizes, `"default"` by default; an arrow and text as default children |
| `PaginationFirst`, `PaginationLast` | `variant` and `size` as above, with `size` `"icon"` by default; a double arrow and text as default children |
| `PaginationEllipsis` | A dots icon as default children |

Every part takes `sx`, applied last. For the rest, see [UI SDK Pagination](https://ui-sdk.dev/docs/react/components/pagination).
