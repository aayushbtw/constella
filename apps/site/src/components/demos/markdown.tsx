import { PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";

import { Markdown } from "@/components/ai/markdown";
import { Message, MessageContent } from "@/components/ai/message";
import { Button } from "@/components/primitives/button";
import { sizes, strokes } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";
import { highlightCode } from "~/lib/highlight";

const styles = stylex.create({
  stage: { alignItems: "flex-start", minHeight: 320, width: "100%" },
  width: { maxWidth: "100%", width: 560 },
});

const answer = `## Monthly active users

Active users grew **12%** in March, led by the new \`/teams\` page.

| Month    |  Users | Change |
| :------- | -----: | -----: |
| January  | 18,240 |      — |
| February | 19,880 |  +9.0% |
| March    | 22,270 | +12.0% |

To pull the same numbers yourself:

\`\`\`ts
const users = await acme.metrics.activeUsers({
  from: "2026-01-01",
  to: "2026-03-31",
  interval: "month",
});
\`\`\`

> Figures leave out test accounts on \`acme.com\`.
`;

function Answer({ streaming, text }: { streaming?: boolean; text: string }) {
  return (
    <Message from="assistant" sx={styles.width}>
      <MessageContent>
        <Markdown
          codeLineNumbers={false}
          highlighter={highlightCode}
          streaming={streaming}
        >
          {text}
        </Markdown>
      </MessageContent>
    </Message>
  );
}

function MarkdownDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Answer text={answer} />
    </DemoRow>
  );
}

const chunk = 6;
const chunkEvery = 30;

function MarkdownStreamingDemo() {
  const [shown, setShown] = useState(0);
  const streaming = shown < answer.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setShown((value) => Math.min(value + chunk, answer.length));
    }, chunkEvery);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <DemoRow
      sx={styles.stage}
      controls={
        <div>
          <Button
            disabled={streaming}
            onClick={() => {
              setShown(0);
            }}
            size="sm"
            variant="outline"
          >
            <HugeiconsIcon
              aria-hidden
              icon={PlayIcon}
              size={sizes.icon}
              strokeWidth={Number(strokes.icon)}
            />
            Stream again
          </Button>
        </div>
      }
    >
      <Answer streaming={streaming} text={answer.slice(0, shown)} />
    </DemoRow>
  );
}

export { MarkdownDemo, MarkdownStreamingDemo };
