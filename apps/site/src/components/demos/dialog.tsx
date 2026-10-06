import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  short: { maxHeight: 400 },
  paragraph: { margin: 0, marginBlockEnd: "1em" },
});

const terms = [
  "These terms cover your use of the workspace, the files you upload to it and the pages you publish from it. By creating an account you agree to them, and to any changes we post here with at least thirty days’ notice.",
  "You own what you make. We store it, back it up and show it to the people you share it with, and we don’t use it for anything else. If you delete a file, it leaves our servers within thirty days, including backups.",
  "Don’t use the workspace to send spam, host malware or break the law where you or your readers live. We may suspend a page that does, and we’ll tell you why unless the law says we can’t.",
  "Paid plans renew each month or year until you cancel. Cancelling stops the next charge; it doesn’t refund the current period. If we raise prices, the new price starts at your next renewal, never mid-term.",
  "We aim for the service to be up all the time but can’t promise it. If an outage on our side lasts more than a day, ask support for a credit on that month’s bill.",
  "Either of us can end this agreement at any time. When you leave, you can export everything for ninety days. After that, we delete your account and its contents for good.",
];

function DialogDemo() {
  return (
    <DemoRow>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Edit profile
        </DialogTrigger>
        <DialogContent>
          <DialogCloseButton />
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Save when you’re done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input defaultValue="Pedro Duarte" name="name" />
            </Field>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input defaultValue="@peduarte" name="username" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <DialogClose render={<Button variant="primary" />}>
              Save changes
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DemoRow>
  );
}

function DialogControlledDemo() {
  const [open, setOpen] = useState(false);

  return (
    <DemoRow>
      <Button
        variant="outline"
        onClick={() => {
          setOpen(true);
        }}
      >
        Delete project
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this project?</DialogTitle>
            <DialogDescription>
              Its pages and history go with it. This can’t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              variant="danger"
              onClick={() => {
                setOpen(false);
                toast.add({ title: "Project deleted" });
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DemoRow>
  );
}

function DialogScrollableDemo() {
  return (
    <DemoRow>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Review terms
        </DialogTrigger>
        <DialogContent sx={styles.short}>
          <DialogCloseButton />
          <DialogHeader>
            <DialogTitle>Terms of service</DialogTitle>
            <DialogDescription>
              Read these before you accept. They took effect on June 1.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            {terms.map((text) => (
              <p key={text} {...stylex.props(styles.paragraph)}>
                {text}
              </p>
            ))}
          </DialogBody>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Decline
            </DialogClose>
            <DialogClose render={<Button variant="primary" />}>
              Accept
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DemoRow>
  );
}

export { DialogControlledDemo, DialogDemo, DialogScrollableDemo };
