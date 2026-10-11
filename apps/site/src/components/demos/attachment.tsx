import {
  Alert02Icon,
  Cancel01Icon,
  Clock01Icon,
  CodeIcon,
  File02Icon,
  Pdf01Icon,
  RepeatIcon,
  Csv01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
  attachmentSizes,
} from "@/components/ui/attachment";
import type { AttachmentState } from "@/components/ui/attachment";
import {
  Dialog,
  DialogContent,
  DialogCloseButton,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    maxWidth: "100%",
    width: 384,
  },
  full: { width: "100%" },
  pictures: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.xs,
  },
  group: { maxWidth: "100%", width: 448 },
});

function Glyph({
  size = sizes.icon,
  ...props
}: Omit<HugeiconsIconProps, "strokeWidth">) {
  return (
    <HugeiconsIcon size={size} strokeWidth={Number(strokes.icon)} {...props} />
  );
}

function Remove({ name }: { name: string }) {
  return (
    <AttachmentAction aria-label={`Remove ${name}`}>
      <Glyph icon={Cancel01Icon} />
    </AttachmentAction>
  );
}

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=320&h=320&fit=crop&q=80`;

const photos = [
  {
    meta: "PNG · 820 KB",
    name: "workspace.png",
    src: photo("1497366216548-37526070297c"),
  },
  {
    meta: "JPG · 1.1 MB",
    name: "desk-reference.jpg",
    src: photo("1524758631624-e2822e304c36"),
  },
  {
    meta: "JPG · 940 KB",
    name: "office-reference.jpg",
    src: photo("1497366811353-6870744d04b2"),
  },
];

function AttachmentDemo() {
  return (
    <DemoRow>
      <Attachment>
        <AttachmentMedia>
          <Glyph icon={Pdf01Icon} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>q3-report.pdf</AttachmentTitle>
          <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <Remove name="q3-report.pdf" />
        </AttachmentActions>
      </Attachment>
    </DemoRow>
  );
}

const states: {
  description: string;
  media: ReactNode;
  name: string;
  state: AttachmentState;
}[] = [
  {
    description: "Ready to upload",
    media: <Glyph icon={Clock01Icon} />,
    name: "selected-file.pdf",
    state: "idle",
  },
  {
    description: "Uploading · 64%",
    media: <Spinner />,
    name: "design-system.zip",
    state: "uploading",
  },
  {
    description: "Processing document",
    media: <Glyph icon={File02Icon} />,
    name: "market-research.pdf",
    state: "processing",
  },
  {
    description: "Upload failed. Try again.",
    media: <Glyph icon={Alert02Icon} />,
    name: "financial-model.xlsx",
    state: "error",
  },
  {
    description: "Uploaded · 1.8 MB",
    media: <Glyph icon={Tick02Icon} />,
    name: "uploaded-report.pdf",
    state: "done",
  },
];

function AttachmentStateDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.list)}>
        {states.map(({ description, media, name, state }) => (
          <Attachment key={state} state={state} sx={styles.full}>
            <AttachmentMedia>{media}</AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{name}</AttachmentTitle>
              <AttachmentDescription>{description}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              {state === "error" && (
                <AttachmentAction aria-label={`Retry ${name}`}>
                  <Glyph icon={RepeatIcon} />
                </AttachmentAction>
              )}
              <Remove name={name} />
            </AttachmentActions>
          </Attachment>
        ))}
      </div>
    </DemoRow>
  );
}

function AttachmentSizeDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.list)}>
        {attachmentSizes.toReversed().map((size) => (
          <Attachment key={size} size={size} sx={styles.full}>
            <AttachmentMedia>
              <Glyph
                icon={Pdf01Icon}
                size={size === "xs" ? sizes.iconSm : sizes.icon}
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>quarterly-report.pdf</AttachmentTitle>
              <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Remove name="quarterly-report.pdf" />
            </AttachmentActions>
          </Attachment>
        ))}
      </div>
    </DemoRow>
  );
}

function AttachmentImageDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.list)}>
        <div {...stylex.props(styles.pictures)}>
          {photos.map(({ meta, name, src }) => (
            <Attachment key={name} orientation="vertical">
              <AttachmentMedia variant="image">
                <img alt="" src={src} />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{name}</AttachmentTitle>
                <AttachmentDescription>{meta}</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <Remove name={name} />
              </AttachmentActions>
            </Attachment>
          ))}
        </div>
        <Attachment state="uploading" sx={styles.full}>
          <AttachmentMedia>
            <Spinner />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>sales-dashboard.pdf</AttachmentTitle>
            <AttachmentDescription>Uploading · 64%</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Remove name="sales-dashboard.pdf" />
          </AttachmentActions>
        </Attachment>
        <Attachment sx={styles.full}>
          <AttachmentMedia>
            <Glyph icon={CodeIcon} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>message-renderer.tsx</AttachmentTitle>
            <AttachmentDescription>TypeScript · 12 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Remove name="message-renderer.tsx" />
          </AttachmentActions>
        </Attachment>
      </div>
    </DemoRow>
  );
}

const files = [
  { media: "workspace.png", meta: "PNG · 820 KB", name: "workspace.png" },
  { icon: Csv01Icon, meta: "CSV · 18 KB", name: "customers.csv" },
  { icon: Pdf01Icon, meta: "PDF · 2.4 MB", name: "q3-report.pdf" },
  { icon: CodeIcon, meta: "TSX · 12 KB", name: "message-renderer.tsx" },
  { icon: File02Icon, meta: "MD · 4 KB", name: "launch-notes.md" },
];

function AttachmentGroupDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <AttachmentGroup sx={styles.group}>
        {files.map(({ icon, media, meta, name }) => (
          <Attachment key={name}>
            {media === undefined ? (
              <AttachmentMedia>
                <Glyph icon={icon} />
              </AttachmentMedia>
            ) : (
              <AttachmentMedia variant="image">
                <img alt="" src={photos[0]?.src} />
              </AttachmentMedia>
            )}
            <AttachmentContent>
              <AttachmentTitle>{name}</AttachmentTitle>
              <AttachmentDescription>{meta}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <Remove name={name} />
            </AttachmentActions>
          </Attachment>
        ))}
      </AttachmentGroup>
    </DemoRow>
  );
}

function AttachmentTriggerDemo() {
  return (
    <DemoRow>
      <Dialog>
        <Attachment>
          <AttachmentTrigger
            aria-label="Preview q3-report.pdf"
            render={<DialogTrigger />}
          />
          <AttachmentMedia>
            <Glyph icon={Pdf01Icon} />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>q3-report.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Remove name="q3-report.pdf" />
          </AttachmentActions>
        </Attachment>
        <DialogContent>
          <DialogCloseButton />
          <DialogHeader>
            <DialogTitle>q3-report.pdf</DialogTitle>
            <DialogDescription>
              Uploaded today · 12 pages · 2.4 MB
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </DemoRow>
  );
}

export {
  AttachmentDemo,
  AttachmentGroupDemo,
  AttachmentImageDemo,
  AttachmentSizeDemo,
  AttachmentStateDemo,
  AttachmentTriggerDemo,
};
