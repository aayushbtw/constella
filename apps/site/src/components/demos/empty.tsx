import {
  Folder01Icon,
  Notification01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { colors, radii, sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  panel: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    maxWidth: "100%",
    minHeight: 256,
    width: 384,
  },
  files: {
    color: colors.textPrimary,
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    paddingInlineStart: space.md,
  },
  // A dashed edge marks a place that's waiting for content.
  dashed: {
    borderBlockEndColor: colors.edge,
    borderBlockStartColor: colors.edge,
    borderInlineEndColor: colors.edge,
    borderInlineStartColor: colors.edge,
    borderBlockEndStyle: "dashed",
    borderBlockStartStyle: "dashed",
    borderInlineEndStyle: "dashed",
    borderInlineStartStyle: "dashed",
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
  },
  stage: { width: "100%" },
  actions: { display: "flex", gap: space.xs },
  card: { maxWidth: "100%", width: 448 },
});

function EmptyDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon
              aria-hidden
              icon={Folder01Icon}
              size={sizes.icon}
              strokeWidth={Number(strokes.icon)}
            />
          </EmptyMedia>
          <EmptyTitle>No Projects Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any projects yet. Get started by creating
            your first project.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div {...stylex.props(styles.actions)}>
            <Button variant="primary">Create Project</Button>
            <Button variant="outline">Import Project</Button>
          </div>
        </EmptyContent>
      </Empty>
    </DemoRow>
  );
}

function EmptyAvatarDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Avatar size="lg">
              <AvatarImage alt="" src="https://github.com/shadcn.png" />
              <AvatarFallback>SC</AvatarFallback>
            </Avatar>
          </EmptyMedia>
          <EmptyTitle>User Offline</EmptyTitle>
          <EmptyDescription>
            This user is currently offline. You can leave a message to notify
            them or try again later.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size="sm" variant="outline">
            Leave Message
          </Button>
        </EmptyContent>
      </Empty>
    </DemoRow>
  );
}

function EmptyCardDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Card sx={styles.card}>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <HugeiconsIcon
                aria-hidden
                icon={Notification01Icon}
                size={sizes.icon}
                strokeWidth={Number(strokes.icon)}
              />
            </EmptyMedia>
            <EmptyTitle>No Notifications</EmptyTitle>
            <EmptyDescription>
              You&apos;re all caught up. New notifications will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Card>
    </DemoRow>
  );
}

const files = [
  "brand-guidelines.pdf",
  "q3-report.xlsx",
  "launch-video.mp4",
  "roadmap.key",
];

function EmptyContentDemo() {
  const [query, setQuery] = useState("zzz");
  const matches = files.filter((file) => file.includes(query.toLowerCase()));
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.panel)}>
        <InputGroup>
          <InputGroupAddon>
            <HugeiconsIcon
              aria-hidden
              icon={Search01Icon}
              size={sizes.icon}
              strokeWidth={Number(strokes.icon)}
            />
          </InputGroupAddon>
          <InputGroupInput
            aria-label="Search files"
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="Search files"
            value={query}
          />
        </InputGroup>
        {matches.length > 0 ? (
          <ul {...stylex.props(styles.files)}>
            {matches.map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        ) : (
          <Empty sx={styles.dashed}>
            <EmptyHeader>
              <EmptyTitle>No files match “{query}”</EmptyTitle>
              <EmptyDescription>
                Check the spelling, or search everything.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                onClick={() => {
                  setQuery("");
                }}
                size="sm"
                variant="outline"
              >
                Clear search
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </DemoRow>
  );
}

export { EmptyAvatarDemo, EmptyCardDemo, EmptyContentDemo, EmptyDemo };
