import { Delete02Icon, UserRemove01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { sizes, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

function AlertDialogDemo() {
  return (
    <DemoRow>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" />}>
          Show Dialog
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DemoRow>
  );
}

function AlertDialogSizeDemo() {
  return (
    <DemoRow>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" />}>
          Show Dialog
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia>
              <HugeiconsIcon
                aria-hidden
                icon={UserRemove01Icon}
                size={sizes.iconLg}
                strokeWidth={Number(strokes.icon)}
              />
            </AlertDialogMedia>
            <AlertDialogTitle>Remove member?</AlertDialogTitle>
            <AlertDialogDescription>
              They&apos;ll lose access to this workspace right away.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DemoRow>
  );
}

function AlertDialogDangerDemo() {
  return (
    <DemoRow>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="danger" />}>
          Delete Chat
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <HugeiconsIcon
                aria-hidden
                icon={Delete02Icon}
                size={sizes.iconLg}
                strokeWidth={Number(strokes.icon)}
              />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the chat and its files.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="danger">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DemoRow>
  );
}

export { AlertDialogDangerDemo, AlertDialogDemo, AlertDialogSizeDemo };
