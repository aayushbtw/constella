import {
  ArrowUpRight01Icon,
  DatabaseIcon,
  File02Icon,
  FileEditIcon,
  Globe02Icon,
  RepeatIcon,
  TerminalIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";

import {
  Attachment,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ai/attachment";
import {
  Citation,
  CitationGroup,
  CitationGroupMore,
  Citations,
} from "@/components/ai/citation";
import type { Source } from "@/components/ai/citation";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from "@/components/ai/code-block";
import {
  Trace,
  traceActionStyles,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceMarker,
  TraceReasoning,
  TraceStep,
  TraceStepContent,
  TraceSubject,
  TraceSubstep,
  TraceSubsteps,
  TraceTitle,
} from "@/components/ai/trace";
import type { TraceState } from "@/components/ai/trace";
import { Button } from "@/components/primitives/button";
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/primitives/dialog";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/primitives/sheet";
import { SwapText } from "@/components/primitives/swap-text";
import { sizes, strokes } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { alignItems: "flex-start", minHeight: 240, width: "100%" },
  tall: { minHeight: 440 },
  width: { maxWidth: "100%", width: 420 },
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

const favicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

const sources = [
  {
    icon: favicon("scb.se"),
    name: "Statistics Sweden",
    title: "E-commerce by region, 2026",
    url: "https://scb.se",
  },
  {
    icon: favicon("postnord.se"),
    name: "PostNord",
    title: "E-commerce in the Nordics",
    url: "https://postnord.se",
  },
  {
    icon: favicon("shopify.com"),
    name: "Shopify",
    title: "Selling in Sweden",
    url: "https://shopify.com",
  },
  {
    icon: favicon("statista.com"),
    name: "Statista",
    title: "Online shoppers in Sweden",
    url: "https://statista.com",
  },
] satisfies Source[];

const lastSource = sources.at(-1);

const reasoning =
  "The goal is a launch plan for Sweden. Start with what the warehouse already knows: who orders from Sweden today, what they buy and how often they come back. Then look outward. Check how local brands price and position themselves, what Swedish shoppers expect on delivery and returns, and how Sweden compares with Norway. Orders first: they set the baseline for everything else.";

const words = reasoning.split(" ");

/** A clock for the scripted demos: tenths of a second since `run` last changed, to `end`. */
function useClock(end: number) {
  const [run, setRun] = useState(0);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((value) => Math.min(value + 1, end * 10));
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, [end]);
  return {
    t: tick / 10,
    replay: () => {
      setTick(0);
      setRun((value) => value + 1);
    },
    run,
  };
}

function Replay({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div>
      <Button disabled={disabled} onClick={onClick} size="sm" variant="outline">
        <Icon icon={RepeatIcon} />
        Run again
      </Button>
    </div>
  );
}

const stateAt = (
  t: number,
  [start, end]: readonly [number, number]
): TraceState | "done" | null => {
  if (t < start) {
    return null;
  }
  return t < end ? "running" : "done";
};

const live = (state: TraceState | "done") =>
  state === "done" ? undefined : state;

const shownWords = (t: number, [start, end]: readonly [number, number]) =>
  Math.ceil((words.length * (Math.min(t, end) - start)) / (end - start));

function ReadOrders({
  t,
  span,
  tasks,
}: {
  t: number;
  span: readonly [number, number];
  tasks: readonly [number, number];
}) {
  const state = stateAt(t, span);
  if (state === null) {
    return null;
  }
  return (
    <TraceStep state={live(state)}>
      <TraceLine>
        <TraceMarker />
        <TraceTitle>
          <SwapText>{state === "running" ? "Reading" : "Read"}</SwapText>
        </TraceTitle>
        <TraceIcon>
          <Icon icon={DatabaseIcon} />
        </TraceIcon>
        <TraceSubject>Swedish orders</TraceSubject>
      </TraceLine>
      <TraceStepContent open={state === "running"}>
        <TraceSubsteps>
          {(
            [
              ["Pulling", "Pulled", "Swedish order history", tasks[0]],
              ["Spotting", "Spotted", "top sellers in Sweden", tasks[1]],
            ] as const
          ).map(([running, done, what, at]) => (
            <TraceSubstep key={what} state={t < at ? "running" : undefined}>
              <TraceMarker />
              <TraceTitle>
                <SwapText>{`${t < at ? running : done} ${what}`}</SwapText>
              </TraceTitle>
            </TraceSubstep>
          ))}
        </TraceSubsteps>
      </TraceStepContent>
    </TraceStep>
  );
}

// Once the search is done, the count of sources left out rides with the last chip.
function LastSource({ done, source }: { done: boolean; source: Source }) {
  const chip = <Citation sources={[source]} />;
  return done ? <CitationGroupMore count={42}>{chip}</CitationGroupMore> : chip;
}

function SearchSources({
  t,
  span,
  found,
}: {
  t: number;
  span: readonly [number, number];
  found: readonly number[];
}) {
  const state = stateAt(t, span);
  if (state === null) {
    return null;
  }
  const shown = found.filter((at) => t >= at).length;
  return (
    <TraceStep state={live(state)}>
      <TraceLine>
        <TraceMarker />
        <TraceTitle>
          <SwapText>{state === "running" ? "Searching" : "Searched"}</SwapText>
        </TraceTitle>
        {shown === 0 ? null : (
          <TraceDescription>
            <SwapText>{`${state === "running" ? shown * 6 : 46} sources`}</SwapText>
          </TraceDescription>
        )}
      </TraceLine>
      <TraceStepContent open={shown > 0}>
        <CitationGroup>
          {sources
            .slice(0, Math.min(shown, sources.length - 1))
            .map((source) => (
              <Citation key={source.url} sources={[source]} />
            ))}
          {lastSource === undefined || shown < sources.length ? null : (
            <LastSource done={state === "done"} source={lastSource} />
          )}
        </CitationGroup>
      </TraceStepContent>
    </TraceStep>
  );
}

const run = {
  thinking: [0, 3.2],
  reading: [3.6, 6.2],
  readTasks: [4.6, 5.8],
  searching: [6.6, 8.8],
  found: [7, 7.4, 7.8, 8.2],
  delegating: [9.2, 12],
  delegateTasks: [10.4, 11.6],
  reporting: [12.4, 13.8],
  end: 14.2,
} as const;

function TraceDemo() {
  const { t, replay, run: take } = useClock(run.end);
  const [open, setOpen] = useState<boolean>();
  const thinking = stateAt(t, run.thinking);
  const delegating = stateAt(t, run.delegating);
  const reporting = stateAt(t, run.reporting);
  const finished = t >= run.end;
  const seconds = Math.floor(Math.min(t, run.end));
  return (
    <DemoRow
      controls={<Replay disabled={!finished} onClick={replay} />}
      sx={[styles.stage, styles.tall]}
    >
      <Citations>
        <TraceCollapsible
          key={take}
          onOpenChange={setOpen}
          open={open ?? true}
          sx={styles.width}
        >
          <TraceCollapsibleTrigger>
            <TraceTitle>
              <SwapText>{finished ? "Worked" : "Working"}</SwapText>
            </TraceTitle>
            <TraceDescription>
              <SwapText>
                {finished ? `for ${seconds}` : String(seconds)}
              </SwapText>
              s
            </TraceDescription>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {thinking === null ? null : (
                <TraceStep state={live(thinking)}>
                  <TraceLine>
                    <TraceMarker />
                    <TraceTitle>
                      <SwapText>
                        {thinking === "running" ? "Thinking" : "Done thinking"}
                      </SwapText>
                    </TraceTitle>
                  </TraceLine>
                  <TraceStepContent open={thinking === "running"}>
                    <TraceReasoning>
                      {words.slice(0, shownWords(t, run.thinking)).join(" ")}
                    </TraceReasoning>
                  </TraceStepContent>
                </TraceStep>
              )}
              <ReadOrders span={run.reading} t={t} tasks={run.readTasks} />
              <SearchSources found={run.found} span={run.searching} t={t} />
              {delegating === null ? null : (
                <TraceStep state={live(delegating)}>
                  <TraceLine>
                    <TraceMarker />
                    <TraceTitle>
                      <SwapText>
                        {delegating === "running"
                          ? "Delegating to"
                          : "Delegated to"}
                      </SwapText>
                    </TraceTitle>
                    <TraceIcon>
                      <Icon icon={UserGroupIcon} />
                    </TraceIcon>
                    <TraceSubject>Brand researcher</TraceSubject>
                  </TraceLine>
                  <TraceStepContent open={delegating === "running"}>
                    <TraceSubsteps>
                      {(
                        [
                          ["Scanning", "Scanned", "Swedish competitor brands"],
                          ["Mapping", "Mapped", "local pricing trends"],
                        ] as const
                      ).map(([running, done, what], index) => {
                        const over = t >= (run.delegateTasks[index] ?? 0);
                        return (
                          <TraceSubstep
                            key={what}
                            state={over ? undefined : "running"}
                          >
                            <TraceMarker />
                            <TraceTitle>
                              <SwapText>{`${over ? done : running} ${what}`}</SwapText>
                            </TraceTitle>
                          </TraceSubstep>
                        );
                      })}
                    </TraceSubsteps>
                  </TraceStepContent>
                </TraceStep>
              )}
              {reporting === null ? null : (
                <TraceStep state={live(reporting)}>
                  <TraceLine>
                    <TraceMarker />
                    <TraceTitle>
                      <SwapText>
                        {reporting === "running"
                          ? "Preparing the report"
                          : "Report is ready"}
                      </SwapText>
                    </TraceTitle>
                  </TraceLine>
                  <TraceStepContent>
                    <Attachment size="xs">
                      <AttachmentMedia>
                        <Icon icon={File02Icon} />
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle>sweden-launch</AttachmentTitle>
                      </AttachmentContent>
                    </Attachment>
                  </TraceStepContent>
                </TraceStep>
              )}
              {finished ? (
                <TraceStep>
                  <TraceLine>
                    <TraceMarker variant="check" />
                    <TraceTitle>Finished working</TraceTitle>
                  </TraceLine>
                </TraceStep>
              ) : null}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Citations>
    </DemoRow>
  );
}

function TraceStepDemo() {
  return (
    <DemoRow>
      <Trace sx={styles.width}>
        <TraceStep>
          <TraceLine>
            <TraceMarker />
            <TraceTitle>Read</TraceTitle>
            <TraceIcon>
              <Icon icon={DatabaseIcon} />
            </TraceIcon>
            <TraceSubject>Swedish orders</TraceSubject>
          </TraceLine>
        </TraceStep>
      </Trace>
    </DemoRow>
  );
}

function TraceStateDemo() {
  return (
    <DemoRow>
      <Trace sx={styles.width}>
        <TraceStep>
          <TraceLine>
            <TraceMarker />
            <TraceTitle>Ran pnpm install</TraceTitle>
          </TraceLine>
        </TraceStep>
        <TraceStep state="running">
          <TraceLine>
            <TraceMarker />
            <TraceTitle>Running pnpm build</TraceTitle>
          </TraceLine>
        </TraceStep>
        <TraceStep state="error">
          <TraceLine>
            <TraceMarker />
            <TraceTitle>Failed to run pnpm lint</TraceTitle>
          </TraceLine>
          <TraceStepContent>
            <TraceDescription>Exit code 1 · 3 errors</TraceDescription>
          </TraceStepContent>
        </TraceStep>
        <TraceStep state="pending">
          <TraceLine>
            <TraceMarker />
            <TraceTitle>Run pnpm test</TraceTitle>
          </TraceLine>
        </TraceStep>
      </Trace>
    </DemoRow>
  );
}

function TraceMarkerDemo() {
  return (
    <DemoRow>
      <Trace sx={styles.width}>
        <TraceStep>
          <TraceLine>
            <TraceMarker />
            <TraceTitle>Searched</TraceTitle>
            <TraceDescription>46 sources</TraceDescription>
          </TraceLine>
        </TraceStep>
        <TraceStep>
          <TraceLine>
            <TraceMarker variant="check" />
            <TraceTitle>Finished working</TraceTitle>
          </TraceLine>
        </TraceStep>
      </Trace>
    </DemoRow>
  );
}

const thinkFor = 3.2;

function TraceReasoningDemo() {
  const { t, replay } = useClock(thinkFor);
  const running = t < thinkFor;
  return (
    <DemoRow
      controls={<Replay disabled={running} onClick={replay} />}
      sx={styles.stage}
    >
      <Trace sx={styles.width}>
        <TraceStep state={running ? "running" : undefined}>
          <TraceLine>
            <TraceMarker />
            <TraceTitle>
              <SwapText>{running ? "Thinking" : "Thought for 3s"}</SwapText>
            </TraceTitle>
          </TraceLine>
          <TraceStepContent open={running}>
            <TraceReasoning>
              {words.slice(0, shownWords(t, [0, thinkFor])).join(" ")}
            </TraceReasoning>
          </TraceStepContent>
        </TraceStep>
      </Trace>
    </DemoRow>
  );
}

const tool = { span: [0, 2.6], tasks: [1.2, 2.4] } as const;

function TraceToolDemo() {
  const { t, replay } = useClock(tool.span[1]);
  return (
    <DemoRow
      controls={<Replay disabled={t < tool.span[1]} onClick={replay} />}
      sx={styles.stage}
    >
      <Trace sx={styles.width}>
        <ReadOrders span={tool.span} t={t} tasks={tool.tasks} />
      </Trace>
    </DemoRow>
  );
}

const search = { span: [0, 2], found: [0.3, 0.7, 1.1, 1.5] } as const;

function TraceSourcesDemo() {
  const { t, replay } = useClock(search.span[1]);
  return (
    <DemoRow
      controls={<Replay disabled={t < search.span[1]} onClick={replay} />}
      sx={styles.stage}
    >
      <Citations>
        <Trace sx={styles.width}>
          <SearchSources found={search.found} span={search.span} t={t} />
        </Trace>
      </Citations>
    </DemoRow>
  );
}

function TraceFileDemo() {
  return (
    <DemoRow>
      <Trace sx={styles.width}>
        <TraceStep>
          <TraceLine>
            <TraceMarker />
            <TraceTitle>Report is ready</TraceTitle>
          </TraceLine>
          <TraceStepContent>
            <Attachment size="xs">
              <AttachmentMedia>
                <Icon icon={File02Icon} />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>sweden-launch</AttachmentTitle>
              </AttachmentContent>
            </Attachment>
          </TraceStepContent>
        </TraceStep>
      </Trace>
    </DemoRow>
  );
}

function TraceLinkDemo() {
  return (
    <DemoRow>
      <Trace sx={styles.width}>
        <TraceStep>
          <a
            href="https://acme.com/docs/ci"
            rel="noreferrer"
            target="_blank"
            {...stylex.props(traceActionStyles())}
          >
            <TraceLine>
              <TraceMarker />
              <TraceTitle>Read</TraceTitle>
              <TraceIcon>
                <Icon icon={Globe02Icon} />
              </TraceIcon>
              <TraceSubject>Continuous integration</TraceSubject>
              <TraceIcon>
                <Icon icon={ArrowUpRight01Icon} />
              </TraceIcon>
            </TraceLine>
          </a>
        </TraceStep>
      </Trace>
    </DemoRow>
  );
}

function TraceDialogDemo() {
  return (
    <DemoRow>
      <Trace sx={styles.width}>
        <TraceStep>
          <Dialog>
            <DialogTrigger
              render={
                <button type="button" {...stylex.props(traceActionStyles())} />
              }
            >
              <TraceLine>
                <TraceMarker />
                <TraceTitle>Ran</TraceTitle>
                <TraceIcon>
                  <Icon icon={TerminalIcon} />
                </TraceIcon>
                <TraceSubject>git diff --stat</TraceSubject>
              </TraceLine>
            </DialogTrigger>
            <DialogContent>
              <DialogCloseButton />
              <DialogHeader>
                <DialogTitle>git diff --stat</DialogTitle>
                <DialogDescription>Exited with code 0.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <CodeBlock size="sm">
                  <CodeBlockContent>
                    {
                      " package.json | 2 +-\n 1 file changed, 1 insertion(+), 1 deletion(-)"
                    }
                  </CodeBlockContent>
                </CodeBlock>
              </DialogBody>
            </DialogContent>
          </Dialog>
        </TraceStep>
      </Trace>
    </DemoRow>
  );
}

function TraceSheetDemo() {
  return (
    <DemoRow>
      <Trace sx={styles.width}>
        <TraceStep>
          <Sheet>
            <SheetTrigger
              render={
                <button type="button" {...stylex.props(traceActionStyles())} />
              }
            >
              <TraceLine>
                <TraceMarker />
                <TraceTitle>Edited</TraceTitle>
                <TraceIcon>
                  <Icon icon={FileEditIcon} />
                </TraceIcon>
                <TraceSubject>package.json</TraceSubject>
                <TraceDescription>+1 −1</TraceDescription>
              </TraceLine>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>package.json</SheetTitle>
                <SheetDescription>1 addition, 1 deletion</SheetDescription>
              </SheetHeader>
              <SheetBody>
                <CodeBlock size="sm">
                  <CodeBlockContent>
                    <CodeBlockLine>{'  "dependencies": {'}</CodeBlockLine>
                    <CodeBlockLine variant="removed">
                      {'    "zod": "^3.24.0"'}
                    </CodeBlockLine>
                    <CodeBlockLine variant="added">
                      {'    "zod": "^4.1.0"'}
                    </CodeBlockLine>
                    <CodeBlockLine>{"  }"}</CodeBlockLine>
                  </CodeBlockContent>
                </CodeBlock>
              </SheetBody>
            </SheetContent>
          </Sheet>
        </TraceStep>
      </Trace>
    </DemoRow>
  );
}

export {
  TraceDemo,
  TraceDialogDemo,
  TraceFileDemo,
  TraceLinkDemo,
  TraceMarkerDemo,
  TraceReasoningDemo,
  TraceSheetDemo,
  TraceSourcesDemo,
  TraceStateDemo,
  TraceStepDemo,
  TraceToolDemo,
};
