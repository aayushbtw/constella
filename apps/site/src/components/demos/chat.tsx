import {
  Attachment01Icon,
  Cancel01Icon,
  File01Icon,
  Folder01Icon,
  Plug01Icon,
  RepeatIcon,
  ThumbsUpIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import { createChat } from "@shadcn/helpers/tanstack-ai";
import * as stylex from "@stylexjs/stylex";
import { useChat } from "@tanstack/ai-react";
import type { UIMessage } from "@tanstack/ai-react";
import { useState } from "react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ai/attachment";
import {
  Message,
  MessageActions,
  MessageContent,
} from "@/components/ai/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ai/message-scroller";
import {
  PromptInput,
  PromptInputBar,
  PromptInputBarButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputWell,
} from "@/components/ai/prompt-input";
import type { PromptInputState } from "@/components/ai/prompt-input";
import { Button } from "@/components/primitives/button";
import { CopyButton } from "@/components/primitives/copy-button";
import { InputGroupButton } from "@/components/primitives/input-group";
import {
  colors,
  radii,
  sizes,
  space,
  strokes,
} from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

// Concentric with the composer: its corner plus the inset and border around it.
const frame = `calc(${radii.xl} + ${space.xs} + ${strokes.border})`;

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
    borderBlockEndColor: colors.border,
    borderBlockStartColor: colors.border,
    borderInlineEndColor: colors.border,
    borderInlineStartColor: colors.border,
    borderBlockEndStyle: "solid",
    borderBlockStartStyle: "solid",
    borderInlineEndStyle: "solid",
    borderInlineStartStyle: "solid",
    borderBlockEndWidth: strokes.border,
    borderBlockStartWidth: strokes.border,
    borderInlineEndWidth: strokes.border,
    borderInlineStartWidth: strokes.border,
    borderStartStartRadius: frame,
    borderStartEndRadius: frame,
    borderEndStartRadius: frame,
    borderEndEndRadius: frame,
    display: "flex",
    flexDirection: "column",
    height: 480,
    maxWidth: "100%",
    overflow: "hidden",
    width: 560,
  },
  scroller: { flex: 1 },
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

function Glyph(props: Omit<HugeiconsIconProps, "strokeWidth">) {
  return (
    <HugeiconsIcon
      aria-hidden
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
      {...props}
    />
  );
}

const reply =
  "Constella is a component library on Base UI and StyleX. Every value comes from a token, so a theme is one file, and the motion stays quiet: a press that gives, a popover that settles.";

const script = createChat().user("What is Constella?").assistant(reply);

function textOf(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === "text" ? part.content : ""))
    .join("");
}

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
  status: PromptInputState;
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
          <InputGroupButton aria-label="Attach" corners="pill" size="icon-sm">
            <Glyph icon={Attachment01Icon} />
          </InputGroupButton>
        </PromptInputTools>
        <PromptInputSubmit
          disabled={text.trim() === ""}
          onStop={onStop}
          state={status}
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

function Chat({ sx }: { sx?: stylex.StyleXStyles }) {
  const { messages, sendMessage, status, stop } = useChat({
    connection: script.transport({ delayMs: 60, fallback: reply }),
    initialMessages: script.get(),
  });

  return (
    <div {...stylex.props(styles.chat, sx)}>
      <MessageScrollerProvider>
        <MessageScroller sx={styles.scroller}>
          <MessageScrollerViewport aria-label="Conversation">
            <MessageScrollerContent sx={styles.thread}>
              {messages.map((message) => (
                <MessageScrollerItem
                  key={message.id}
                  messageId={message.id}
                  scrollAnchor={message.role === "user"}
                >
                  {message.role === "user" ? (
                    <Message from="user">
                      <MessageContent>{textOf(message)}</MessageContent>
                    </Message>
                  ) : (
                    <Answer text={textOf(message)} />
                  )}
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <div {...stylex.props(styles.composer)}>
        <Composer
          onStop={stop}
          onSubmit={(text) => {
            void sendMessage(text);
          }}
          status={status === "error" ? "ready" : status}
        />
      </div>
    </div>
  );
}

function ChatDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Chat />
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
              <AttachmentGroup>
                {files.map((file) => (
                  <Attachment key={file} size="sm">
                    <AttachmentMedia>
                      <Glyph icon={File01Icon} />
                    </AttachmentMedia>
                    <AttachmentContent>
                      <AttachmentTitle>{file}</AttachmentTitle>
                    </AttachmentContent>
                    <AttachmentActions>
                      <AttachmentAction
                        aria-label={`Remove ${file}`}
                        onClick={() => {
                          setFiles(files.filter((other) => other !== file));
                        }}
                      >
                        <Glyph icon={Cancel01Icon} />
                      </AttachmentAction>
                    </AttachmentActions>
                  </Attachment>
                ))}
              </AttachmentGroup>
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
                corners="pill"
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

function PromptInputWellDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <PromptInputWell>
          <PromptInputBar>
            <PromptInputBarButton>
              <Glyph
                data-icon="inline-start"
                icon={Folder01Icon}
                size={sizes.iconSm}
              />
              Select a project
            </PromptInputBarButton>
          </PromptInputBar>
          <Composer status="ready" />
        </PromptInputWell>
        <PromptInputWell>
          <Composer status="ready" />
          <PromptInputBar>
            <PromptInputBarButton>
              <Glyph
                data-icon="inline-start"
                icon={Plug01Icon}
                size={sizes.iconSm}
              />
              Connect apps
            </PromptInputBarButton>
          </PromptInputBar>
        </PromptInputWell>
      </div>
    </DemoRow>
  );
}

export {
  Chat,
  ChatDemo,
  MessageDemo,
  PromptInputDemo,
  PromptInputHeaderDemo,
  PromptInputWellDemo,
};
