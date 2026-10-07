import { MoreHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fontWeights, sizes, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  wide: { maxWidth: 560, width: "100%" },
  invoice: { width: 100 },
  end: { textAlign: "end" },
  strong: { fontWeight: fontWeights.medium },
});

const invoices = [
  {
    amount: "$250.00",
    invoice: "INV001",
    method: "Credit Card",
    status: "Paid",
  },
  { amount: "$150.00", invoice: "INV002", method: "PayPal", status: "Pending" },
  {
    amount: "$350.00",
    invoice: "INV003",
    method: "Bank Transfer",
    status: "Unpaid",
  },
  {
    amount: "$450.00",
    invoice: "INV004",
    method: "Credit Card",
    status: "Paid",
  },
  { amount: "$550.00", invoice: "INV005", method: "PayPal", status: "Paid" },
  {
    amount: "$200.00",
    invoice: "INV006",
    method: "Bank Transfer",
    status: "Pending",
  },
  {
    amount: "$300.00",
    invoice: "INV007",
    method: "Credit Card",
    status: "Unpaid",
  },
];

const products = [
  { name: "Wireless Mouse", price: "$29.99" },
  { name: "Mechanical Keyboard", price: "$129.99" },
  { name: "USB-C Hub", price: "$49.99" },
];

function Invoices({ rows }: { rows: typeof invoices }) {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead sx={styles.invoice}>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead sx={styles.end}>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.invoice}>
            <TableCell sx={styles.strong}>{row.invoice}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.method}</TableCell>
            <TableCell sx={styles.end}>{row.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell sx={styles.end}>$2,500.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function TableDemo() {
  return (
    <DemoRow sx={styles.wide}>
      <Invoices rows={invoices} />
    </DemoRow>
  );
}

function TableFooterDemo() {
  return (
    <DemoRow sx={styles.wide}>
      <Invoices rows={invoices.slice(0, 3)} />
    </DemoRow>
  );
}

function TableActionsDemo() {
  return (
    <DemoRow sx={styles.wide}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Price</TableHead>
            <TableHead sx={styles.end}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.name}>
              <TableCell sx={styles.strong}>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell sx={styles.end}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        aria-label="Open menu"
                        size="icon"
                        variant="ghost"
                      />
                    }
                  >
                    <HugeiconsIcon
                      aria-hidden
                      icon={MoreHorizontalIcon}
                      size={sizes.icon}
                      strokeWidth={Number(strokes.icon)}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="danger">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DemoRow>
  );
}

export { TableActionsDemo, TableDemo, TableFooterDemo };
