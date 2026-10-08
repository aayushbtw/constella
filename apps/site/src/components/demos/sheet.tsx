import * as stylex from "@stylexjs/stylex";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  sheetSides,
} from "@/components/ui/sheet";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  capitalize: { textTransform: "capitalize" },
});

function SheetDemo() {
  return (
    <DemoRow>
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </SheetDescription>
          </SheetHeader>
          <SheetBody>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="sheet-name">Name</FieldLabel>
                <Input defaultValue="Pedro Duarte" id="sheet-name" />
              </Field>
              <Field>
                <FieldLabel htmlFor="sheet-username">Username</FieldLabel>
                <Input defaultValue="@peduarte" id="sheet-username" />
              </Field>
            </FieldGroup>
          </SheetBody>
          <SheetFooter>
            <Button variant="primary">Save changes</Button>
            <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </DemoRow>
  );
}

function SheetSideDemo() {
  return (
    <DemoRow>
      {sheetSides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger
            render={<Button sx={styles.capitalize} variant="outline" />}
          >
            {side}
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose render={<Button variant="outline" />}>
                Close
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </DemoRow>
  );
}

export { SheetDemo, SheetSideDemo };
