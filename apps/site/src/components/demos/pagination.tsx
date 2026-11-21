import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Field, FieldLabel } from "@/components/primitives/field";
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/components/primitives/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { space } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  bar: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: space.md,
  },
  fit: {
    width: "auto",
  },
  end: {
    marginInline: 0,
    width: "auto",
  },
});

const pageSizes = ["10", "25", "50", "100"].map((value) => ({
  label: value,
  value,
}));

function PaginationDemo() {
  return (
    <DemoRow>
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
    </DemoRow>
  );
}

function PaginationSimpleDemo() {
  return (
    <DemoRow>
      <Pagination defaultPage={2} pageCount={5}>
        <PaginationList>
          {[1, 2, 3, 4, 5].map((page) => (
            <PaginationItem key={page}>
              <PaginationLink page={page} />
            </PaginationItem>
          ))}
        </PaginationList>
      </Pagination>
    </DemoRow>
  );
}

function PaginationIconOnlyDemo() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState("25");
  return (
    <DemoRow>
      <div {...stylex.props(styles.bar)}>
        <Field orientation="horizontal" sx={styles.fit}>
          <FieldLabel>Rows per page</FieldLabel>
          <Select
            items={pageSizes}
            onValueChange={(value) => {
              if (value !== null) {
                setPageSize(value);
                setPage(1);
              }
            }}
            value={pageSize}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Pagination
          onPageChange={setPage}
          page={page}
          pageSize={Number(pageSize)}
          sx={styles.end}
          total={240}
        >
          <PaginationList>
            <PaginationItem>
              <PaginationPrevious size="icon" />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext size="icon" />
            </PaginationItem>
          </PaginationList>
        </Pagination>
      </div>
    </DemoRow>
  );
}

export { PaginationDemo, PaginationIconOnlyDemo, PaginationSimpleDemo };
