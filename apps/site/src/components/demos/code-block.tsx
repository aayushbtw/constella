import {
  Alert02Icon,
  SourceCodeIcon,
  TerminalIcon,
  TextWrapIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/components/ui/code-block";
import type { CodeBlockLineVariant } from "@/components/ui/code-block";
import { CopyButton } from "@/components/ui/copy-button";
import { Toggle } from "@/components/ui/toggle";
import { sizes, strokes } from "@/lib/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";
import { CodeTokens } from "~/components/docs/code-tokens";
import { codeLines } from "~/lib/highlight";

const styles = stylex.create({
  width: { maxWidth: "100%", width: 448 },
  column: { alignItems: "stretch", flexDirection: "column" },
});

function Icon({ icon }: { icon: IconSvgElement }) {
  return (
    <HugeiconsIcon
      aria-hidden
      icon={icon}
      size={sizes.icon}
      strokeWidth={Number(strokes.icon)}
    />
  );
}

function Lines({
  code,
  lang,
  variantOf,
}: {
  code: string;
  lang: string;
  variantOf?: (index: number) => CodeBlockLineVariant;
}) {
  return codeLines(code, lang).map((tokens, index) => (
    // oxlint-disable-next-line react/no-array-index-key -- a line's place is its identity
    <CodeBlockLine key={index} variant={variantOf?.(index)}>
      {tokens.length > 0 ? <CodeTokens tokens={tokens} /> : undefined}
    </CodeBlockLine>
  ));
}

const route = `import { streamText } from "ai";

export async function POST(request: Request) {
  const { messages } = await request.json();
  const result = streamText({ model: "anthropic/claude-sonnet-5.5", messages });
  return result.toUIMessageStreamResponse();
}`;

function CodeBlockDemo() {
  return (
    <DemoRow>
      <CodeBlock sx={styles.width}>
        <CodeBlockHeader>
          <Icon icon={SourceCodeIcon} />
          <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
          <CodeBlockActions>
            <CopyButton aria-label="Copy code" value={route} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          <Lines code={route} lang="ts" />
        </CodeBlockContent>
      </CodeBlock>
    </DemoRow>
  );
}

const install = "pnpm add ai @ai-sdk/react zod";

function CodeBlockActionsDemo() {
  return (
    <DemoRow>
      <CodeBlock sx={styles.width}>
        <CodeBlockContent>{install}</CodeBlockContent>
        <CodeBlockActions>
          <CopyButton aria-label="Copy command" value={install} />
        </CodeBlockActions>
      </CodeBlock>
    </DemoRow>
  );
}

const lint = `$ pnpm lint
apps/web/components/message-list.tsx
  18:22  error    'messages' is possibly 'undefined'. Add a guard before calling map  no-unsafe-call
  42:7   warning  React Hook useEffect has a missing dependency: 'scrollToEnd'  react-hooks/exhaustive-deps

✖ 2 problems (1 error, 1 warning)`;

function CodeBlockWrapDemo() {
  const [wrap, setWrap] = useState(true);
  return (
    <DemoRow>
      <CodeBlock sx={styles.width}>
        <CodeBlockHeader>
          <Icon icon={TerminalIcon} />
          <CodeBlockTitle>Terminal</CodeBlockTitle>
          <CodeBlockActions>
            <Toggle
              aria-label="Wrap lines"
              onPressedChange={setWrap}
              pressed={wrap}
              size="icon-sm"
            >
              <Icon icon={TextWrapIcon} />
            </Toggle>
            <CopyButton aria-label="Copy output" value={lint} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent wrap={wrap}>{lint}</CodeBlockContent>
      </CodeBlock>
    </DemoRow>
  );
}

const handler = `export async function GET() {
  const user = await getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  return Response.json(user);
}`;

function CodeBlockLineNumbersDemo() {
  return (
    <DemoRow>
      <CodeBlock sx={styles.width}>
        <CodeBlockContent lineNumbers startLine={18}>
          <Lines code={handler} lang="ts" />
        </CodeBlockContent>
      </CodeBlock>
    </DemoRow>
  );
}

function CodeBlockHighlightedDemo() {
  return (
    <DemoRow>
      <CodeBlock sx={styles.width}>
        <CodeBlockContent lineNumbers>
          <Lines
            code={handler}
            lang="ts"
            variantOf={(index) =>
              index >= 2 && index <= 4 ? "highlighted" : "default"
            }
          />
        </CodeBlockContent>
      </CodeBlock>
    </DemoRow>
  );
}

const patch = ` export function Greeting({ name }: { name: string }) {
-  return <p>Hello, {name}</p>;
+  return (
+    <p className="greeting">Hello, {name}!</p>
+  );
 }`;

const patchLines = patch.split("\n");
function diffVariant(line: string): CodeBlockLineVariant {
  if (line.startsWith("+")) {
    return "added";
  }
  if (line.startsWith("-")) {
    return "removed";
  }
  return "default";
}

function CodeBlockDiffDemo() {
  return (
    <DemoRow>
      <CodeBlock sx={styles.width}>
        <CodeBlockHeader>
          <Icon icon={SourceCodeIcon} />
          <CodeBlockTitle>components/greeting.tsx</CodeBlockTitle>
        </CodeBlockHeader>
        <CodeBlockContent>
          {patchLines.map((line, index) => (
            <CodeBlockLine
              // oxlint-disable-next-line react/no-array-index-key -- a line's place is its identity
              key={index}
              variant={diffVariant(line)}
            >
              <CodeTokens tokens={codeLines(line.slice(1), "tsx")[0] ?? []} />
            </CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
    </DemoRow>
  );
}

function CodeBlockSizeDemo() {
  return (
    <DemoRow sx={styles.column}>
      <CodeBlock size="sm" sx={styles.width}>
        <CodeBlockContent>{install}</CodeBlockContent>
        <CodeBlockActions>
          <CopyButton
            aria-label="Copy command"
            size="icon-xs"
            value={install}
          />
        </CodeBlockActions>
      </CodeBlock>
      <CodeBlock sx={styles.width}>
        <CodeBlockContent>{install}</CodeBlockContent>
        <CodeBlockActions>
          <CopyButton aria-label="Copy command" value={install} />
        </CodeBlockActions>
      </CodeBlock>
    </DemoRow>
  );
}

const failure = `Error: Cannot find module '@/lib/ai'
    at resolve (node:internal/modules/esm/resolve:873:18)
    at app/api/chat/route.ts:1:24`;

function CodeBlockDangerDemo() {
  return (
    <DemoRow>
      <CodeBlock sx={styles.width} variant="danger">
        <CodeBlockHeader>
          <Icon icon={Alert02Icon} />
          <CodeBlockTitle>Build failed</CodeBlockTitle>
          <CodeBlockActions>
            <CopyButton aria-label="Copy error" value={failure} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent>{failure}</CodeBlockContent>
        <CodeBlockFooter>Exited with code 1 after 2.4s</CodeBlockFooter>
      </CodeBlock>
    </DemoRow>
  );
}

export {
  CodeBlockActionsDemo,
  CodeBlockDangerDemo,
  CodeBlockDemo,
  CodeBlockDiffDemo,
  CodeBlockHighlightedDemo,
  CodeBlockLineNumbersDemo,
  CodeBlockSizeDemo,
  CodeBlockWrapDemo,
};
