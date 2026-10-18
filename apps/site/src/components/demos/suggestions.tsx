import * as stylex from "@stylexjs/stylex";

import { Suggestion, Suggestions } from "@/components/ai/suggestions";
import { toast } from "@/components/primitives/toast";
import { Stage } from "~/components/demos/frame";

const styles = stylex.create({
  // Narrower than the row, so it scrolls.
  box: { maxWidth: 480, minWidth: 0, width: "100%" },
});

const suggestions = [
  "Summarize this week's sales",
  "What changed since last month?",
  "Where are we behind plan?",
  "Draft a reply to Alex",
  "Find invoices due this week",
];

function SuggestionsDemo() {
  return (
    <Stage>
      <div {...stylex.props(styles.box)}>
        <Suggestions aria-label="Suggestions">
          {suggestions.map((suggestion) => (
            <Suggestion
              key={suggestion}
              onClick={(text) => {
                toast.add({ title: text });
              }}
              suggestion={suggestion}
            />
          ))}
        </Suggestions>
      </div>
    </Stage>
  );
}

export { SuggestionsDemo };
