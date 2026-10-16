import * as stylex from "@stylexjs/stylex";

import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
} from "@/components/ui/code-block";
import { CopyButton } from "@/components/ui/copy-button";
import { colors } from "@/lib/constella/tokens.stylex";
import { CodeTokens } from "~/components/docs/code-tokens";
import { config } from "~/lib/config";
import { shellTokens } from "~/lib/highlight";

const styles = stylex.create({
  prompt: {
    color: colors.textMuted,
    userSelect: "none",
  },
});

function Install({ name }: { name?: string }) {
  const command = `npx shadcn@latest add ${config.registry}/${name}`;

  return (
    <CodeBlock>
      <CodeBlockContent translate="no">
        <span {...stylex.props(styles.prompt)}>$ </span>
        <CodeTokens tokens={shellTokens(command)} />
      </CodeBlockContent>
      <CodeBlockActions>
        <CopyButton aria-label="Copy command" value={command} />
      </CodeBlockActions>
    </CodeBlock>
  );
}

export { Install };
