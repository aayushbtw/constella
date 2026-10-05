import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { DemoRow } from "~/components/demos/frame";

async function wait(fails: boolean) {
  // oxlint-disable-next-line promise/avoid-new -- the demo fakes a slow upload
  return await new Promise((resolve, reject) => {
    setTimeout(fails ? reject : resolve, 1500);
  });
}

async function upload(fails: boolean) {
  try {
    await toast.promise(wait(fails), {
      error: { description: "The connection dropped.", title: "Upload failed" },
      loading: { title: "Uploading…" },
      success: { description: "3 files uploaded.", title: "Done" },
    });
  } catch {
    // The toast already shows the failure.
  }
}

function ToastDemo() {
  return (
    <DemoRow>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({
            description: "Your changes are live.",
            title: "Saved",
            type: "success",
          });
        }}
      >
        Show toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          void upload(false);
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
          toast.add({ title: "Event created" });
        }}
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({ title: "Saved", type: "success" });
        }}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({
            description: "Check your connection and try again.",
            title: "Couldn’t save",
            type: "error",
          });
        }}
      >
        Error
      </Button>
      <Button
        onClick={() => {
          toast.add({
            description: "You’ve used 90% of your storage.",
            title: "Running low on space",
            type: "warning",
          });
        }}
        variant="outline"
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({ title: "A new version is available", type: "info" });
        }}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.add({ title: "Syncing…", type: "loading" });
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
          toast.add({
            actionProps: {
              children: "Undo",
              onClick: () => {
                toast.add({ title: "File restored", type: "success" });
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
          void upload(false);
        }}
      >
        Succeeds
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          void upload(true);
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
          toast.add({
            description: "It stays until you close it or swipe it away.",
            timeout: 0,
            title: "Read this",
          });
        }}
      >
        Show persistent
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.close();
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
