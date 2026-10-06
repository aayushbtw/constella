import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/toast";
import { DemoRow } from "~/components/demos/frame";

function DialogDemo() {
  return (
    <DemoRow>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Publish
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish changes?</DialogTitle>
            <DialogDescription>
              Everyone with the link will see the new version right away.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <DialogClose render={<Button variant="primary" />}>
              Publish
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

function DialogNestedDemo() {
  return (
    <DemoRow>
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Share
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
            <DialogDescription>
              Anyone with the link can view this page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Dialog>
              <DialogTrigger render={<Button variant="danger" />}>
                Reset link
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset the link?</DialogTitle>
                  <DialogDescription>
                    The old link stops working for everyone it was sent to.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose render={<Button variant="outline" />}>
                    Cancel
                  </DialogClose>
                  <DialogClose render={<Button variant="danger" />}>
                    Reset
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <DialogClose render={<Button variant="primary" />}>
              Done
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DemoRow>
  );
}

export { DialogControlledDemo, DialogDemo, DialogNestedDemo };
