import {
  Attachment01Icon,
  Cancel01Icon,
  File01Icon,
  RepeatIcon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { InputGroupButton } from "@/components/ui/input-group";
import {
  Message,
  MessageActions,
  MessageContent,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ui/prompt-input";
import type { PromptInputStatus } from "@/components/ui/prompt-input";
import { colors, radii, sizes, space, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { width: "100%" },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    maxWidth: "100%",
    width: 512,
  },
  chat: {
    backgroundColor: colors.background,
    borderBlockEndColor: colors.edge,
    borderBlockStartColor: colors.edge,
    borderInlineEndColor: colors.edge,
    borderInlineStartColor: colors.edge,
    borderBlockEndStyle: "solid",
    borderBlockStartStyle: "solid",
    borderInlineEndStyle: "solid",
    borderInlineStartStyle: "solid",
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderStartStartRadius: radii.lg,
    borderStartEndRadius: radii.lg,
    borderEndStartRadius: radii.lg,
    borderEndEndRadius: radii.lg,
    display: "flex",
    flexDirection: "column",
    height: 480,
    maxWidth: "100%",
    overflow: "hidden",
    width: 560,
  },
  scroller: { flex: 1 },
  remove: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderBlockEndWidth: 0,
    borderBlockStartWidth: 0,
    borderInlineEndWidth: 0,
    borderInlineStartWidth: 0,
    color: colors.textMuted,
    cursor: "pointer",
    display: "flex",
    paddingBlockEnd: 0,
    paddingBlockStart: 0,
    paddingInlineEnd: 0,
    paddingInlineStart: 0,
  },
  thread: {
    gap: space.lg,
    paddingBlockEnd: space.md,
    paddingBlockStart: space.md,
    paddingInlineEnd: space.md,
    paddingInlineStart: space.md,
  },
  composer: {
    paddingBlockEnd: space.xs,
    paddingInlineEnd: space.xs,
    paddingInlineStart: space.xs,
  },
});

function Glyph(props: Omit<HugeiconsIconProps, "size" | "strokeWidth">) {
  return (
    <HugeiconsIcon
      aria-hidden
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
      {...props}
    />
  );
}

interface Turn {
  from: "assistant" | "user";
  id: string;
  text: string;
}

const reply =
  "Constella is a component library on Base UI and StyleX. Every value comes from a token, so a theme is one file, and the motion stays quiet: a press that gives, a popover that settles.";

const opening: Turn[] = [
  { from: "user", id: "1", text: "What is Constella?" },
  { from: "assistant", id: "2", text: reply },
];

function Answer({ text }: { text: string }) {
  return (
    <Message from="assistant">
      <MessageContent>{text}</MessageContent>
      <MessageActions>
        <CopyButton value={text} />
        <Button aria-label="Good answer" size="icon-sm" variant="ghost">
          <Glyph icon={ThumbsUpIcon} />
        </Button>
        <Button aria-label="Retry" size="icon-sm" variant="ghost">
          <Glyph icon={RepeatIcon} />
        </Button>
      </MessageActions>
    </Message>
  );
}

function MessageDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Message from="user">
          <MessageContent>What is Constella?</MessageContent>
        </Message>
        <Answer text={reply} />
      </div>
    </DemoRow>
  );
}

function Composer({
  onStop,
  onSubmit,
  status,
}: {
  onStop?: () => void;
  onSubmit?: (text: string) => void;
  status: PromptInputStatus;
}) {
  const [text, setText] = useState("");
  return (
    <PromptInput
      onSubmit={(event) => {
        event.preventDefault();
        if (text.trim() === "" || status !== "ready") {
          return;
        }
        onSubmit?.(text);
        setText("");
      }}
    >
      <PromptInputTextarea
        aria-label="Message"
        onChange={(event) => {
          setText(event.target.value);
        }}
        value={text}
      />
      <PromptInputFooter>
        <PromptInputTools>
          <InputGroupButton aria-label="Attach" size="icon-sm">
            <Glyph icon={Attachment01Icon} />
          </InputGroupButton>
        </PromptInputTools>
        <PromptInputSubmit
          disabled={text.trim() === ""}
          onStop={onStop}
          status={status}
        />
      </PromptInputFooter>
    </PromptInput>
  );
}

function PromptInputDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Composer status="ready" />
      </div>
    </DemoRow>
  );
}

function ChatDemo() {
  const [turns, setTurns] = useState(opening);
  const [status, setStatus] = useState<PromptInputStatus>("ready");
  const timer = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(
    () => () => {
      clearInterval(timer.current ?? undefined);
    },
    []
  );

  function stop() {
    clearInterval(timer.current ?? undefined);
    setStatus("ready");
  }

  function send(text: string) {
    const id = String(Date.now());
    setTurns((all) => [
      ...all,
      { from: "user", id: `${id}u`, text },
      { from: "assistant", id: `${id}a`, text: "" },
    ]);
    setStatus("streaming");
    const words = reply.split(" ");
    let shown = 0;
    timer.current = setInterval(() => {
      shown += 1;
      setTurns((all) =>
        all.map((turn) =>
          turn.id === `${id}a`
            ? { ...turn, text: words.slice(0, shown).join(" ") }
            : turn
        )
      );
      if (shown >= words.length) {
        stop();
      }
    }, 60);
  }

  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.chat)}>
        <MessageScrollerProvider>
          <MessageScroller sx={styles.scroller}>
            <MessageScrollerViewport aria-label="Conversation">
              <MessageScrollerContent sx={styles.thread}>
                {turns.map((turn) => (
                  <MessageScrollerItem
                    key={turn.id}
                    messageId={turn.id}
                    scrollAnchor={turn.from === "user"}
                  >
                    {turn.from === "user" ? (
                      <Message from="user">
                        <MessageContent>{turn.text}</MessageContent>
                      </Message>
                    ) : (
                      <Answer text={turn.text} />
                    )}
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
        <div {...stylex.props(styles.composer)}>
          <Composer onStop={stop} onSubmit={send} status={status} />
        </div>
      </div>
    </DemoRow>
  );
}

function PromptInputHeaderDemo() {
  const [files, setFiles] = useState([
    "q3-report.xlsx",
    "brand-guidelines.pdf",
  ]);
  const [text, setText] = useState("");
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <PromptInput
          onSubmit={(event) => {
            event.preventDefault();
            setText("");
            setFiles([]);
          }}
        >
          {files.length > 0 && (
            <PromptInputHeader>
              {files.map((file) => (
                <Badge key={file} size="lg" variant="outline">
                  <Glyph data-icon="inline-start" icon={File01Icon} />
                  {file}
                  <button
                    aria-label={`Remove ${file}`}
                    onClick={() => {
                      setFiles(files.filter((other) => other !== file));
                    }}
                    type="button"
                    {...stylex.props(styles.remove)}
                  >
                    <Glyph icon={Cancel01Icon} />
                  </button>
                </Badge>
              ))}
            </PromptInputHeader>
          )}
          <PromptInputTextarea
            aria-label="Message"
            onChange={(event) => {
              setText(event.target.value);
            }}
            placeholder="Ask about these files…"
            value={text}
          />
          <PromptInputFooter>
            <PromptInputTools>
              <InputGroupButton
                aria-label="Attach"
                onClick={() => {
                  setFiles([...files, `notes-${files.length + 1}.md`]);
                }}
                size="icon-sm"
              >
                <Glyph icon={Attachment01Icon} />
              </InputGroupButton>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={text.trim() === "" && files.length === 0}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </DemoRow>
  );
}

export { ChatDemo, MessageDemo, PromptInputDemo, PromptInputHeaderDemo };
