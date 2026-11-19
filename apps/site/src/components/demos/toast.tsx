import { Button } from "@/components/primitives/button";
import { toast } from "@/components/primitives/toast";
import { DemoRow } from "~/components/demos/frame";

function upload(fails: boolean) {
  // oxlint-disable-next-line promise/avoid-new -- the demo fakes a slow upload
  const done = new Promise((resolve, reject) => {
    setTimeout(fails ? reject : resolve, 1500);
  });
  toast.promise(done, {
    error: { description: "The connection dropped.", title: "Upload failed" },
    loading: { title: "Uploading…" },
    success: { description: "3 files uploaded.", title: "Done" },
  });
}

function ToastDemo() {
  return (
    <DemoRow>
      <Button
        variant="outline"
        onClick={() => {
          toast.success({
            description: "Your changes are live.",
            title: "Saved",
          });
        }}
      >
        Show toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          upload(false);
        }}
      >
        Promise
      </Button>
    </DemoRow>
  );
}

function ToastTypesDemo() {
  return (
    <DemoRow>
      <Button
        variant="outline"
        onClick={() => {
          toast({ title: "Event created" });
        }}
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.success({ title: "Saved" });
        }}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.error({
            description: "Check your connection and try again.",
            title: "Couldn’t save",
          });
        }}
      >
        Error
      </Button>
      <Button
        onClick={() => {
          toast.warning({
            description: "You’ve used 90% of your storage.",
            title: "Running low on space",
          });
        }}
        variant="outline"
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.info({ title: "A new version is available" });
        }}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.loading({ duration: 5000, title: "Syncing…" });
        }}
      >
        Loading
      </Button>
    </DemoRow>
  );
}

function ToastActionDemo() {
  return (
    <DemoRow>
      <Button
        variant="outline"
        onClick={() => {
          toast({
            action: {
              label: "Undo",
              onAction: () => {
                toast.success({ title: "File restored" });
              },
            },
            description: "It’s in the trash for 30 days.",
            title: "File deleted",
          });
        }}
      >
        Delete file
      </Button>
    </DemoRow>
  );
}

function ToastPromiseDemo() {
  return (
    <DemoRow>
      <Button
        variant="outline"
        onClick={() => {
          upload(false);
        }}
      >
        Succeeds
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          upload(true);
        }}
      >
        Fails
      </Button>
    </DemoRow>
  );
}

function ToastDismissDemo() {
  return (
    <DemoRow>
      <Button
        variant="outline"
        onClick={() => {
          toast({
            description: "It stays until you close it or swipe it away.",
            duration: Infinity,
            title: "Read this",
          });
        }}
      >
        Show persistent
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.dismiss();
        }}
      >
        Dismiss all
      </Button>
    </DemoRow>
  );
}

export {
  ToastActionDemo,
  ToastDemo,
  ToastDismissDemo,
  ToastPromiseDemo,
  ToastTypesDemo,
};
