import { DemoButton, DemoRow } from "@/components/demos/trigger";
import { toast } from "@/components/ui/toast";

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
      <DemoButton
        onClick={() => {
          toast.add({
            description: "Your changes are live.",
            title: "Saved",
            type: "success",
          });
        }}
      >
        Show toast
      </DemoButton>
      <DemoButton
        onClick={() => {
          void upload(false);
        }}
      >
        Promise
      </DemoButton>
    </DemoRow>
  );
}

function ToastTypesDemo() {
  return (
    <DemoRow>
      <DemoButton
        onClick={() => {
          toast.add({ title: "Event created" });
        }}
      >
        Default
      </DemoButton>
      <DemoButton
        onClick={() => {
          toast.add({ title: "Saved", type: "success" });
        }}
      >
        Success
      </DemoButton>
      <DemoButton
        onClick={() => {
          toast.add({
            description: "Check your connection and try again.",
            title: "Couldn’t save",
            type: "error",
          });
        }}
      >
        Error
      </DemoButton>
      <DemoButton
        onClick={() => {
          toast.add({ title: "A new version is available", type: "info" });
        }}
      >
        Info
      </DemoButton>
      <DemoButton
        onClick={() => {
          toast.add({ title: "Syncing…", type: "loading" });
        }}
      >
        Loading
      </DemoButton>
    </DemoRow>
  );
}

function ToastActionDemo() {
  return (
    <DemoRow>
      <DemoButton
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
      </DemoButton>
    </DemoRow>
  );
}

function ToastPromiseDemo() {
  return (
    <DemoRow>
      <DemoButton
        onClick={() => {
          void upload(false);
        }}
      >
        Succeeds
      </DemoButton>
      <DemoButton
        onClick={() => {
          void upload(true);
        }}
      >
        Fails
      </DemoButton>
    </DemoRow>
  );
}

function ToastDismissDemo() {
  return (
    <DemoRow>
      <DemoButton
        onClick={() => {
          toast.add({
            description: "It stays until you close it or swipe it away.",
            timeout: 0,
            title: "Read this",
          });
        }}
      >
        Show persistent
      </DemoButton>
      <DemoButton
        onClick={() => {
          toast.close();
        }}
      >
        Dismiss all
      </DemoButton>
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
