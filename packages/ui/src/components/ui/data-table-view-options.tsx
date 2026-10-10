"use client";

import { SlidersHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sizes, strokes } from "@/lib/tokens.stylex";

// What the column visibility feature adds to a column and a table.
interface HidingColumn {
  accessorFn?: unknown;
  getCanHide: () => boolean;
  getIsVisible: () => boolean;
  id: string;
  toggleVisibility: (value?: boolean) => void;
}

interface HidingTable {
  getAllLeafColumns: () => HidingColumn[];
}

const noLabels = {};

/** A menu that shows and hides columns (needs `columnVisibilityFeature`); lists the columns with data that can hide. */
function DataTableViewOptions({
  labels = noLabels,
  table,
}: {
  /** Keyed by column id: the name to list it by; the id otherwise. */
  labels?: Readonly<Partial<Record<string, string>>>;
  table: HidingTable;
}) {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.accessorFn !== undefined && column.getCanHide());
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <HugeiconsIcon
          aria-hidden
          icon={SlidersHorizontalIcon}
          size={sizes.icon}
          strokeWidth={Number(strokes.icon)}
        />
        View
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Columns</DropdownMenuLabel>
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              checked={column.getIsVisible()}
              key={column.id}
              onCheckedChange={(checked) => {
                column.toggleVisibility(checked);
              }}
            >
              {labels[column.id] ?? column.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { DataTableViewOptions };
