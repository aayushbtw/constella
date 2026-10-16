import {
  AiBrain01Icon,
  Alert02Icon,
  ArrowUpRight01Icon,
  CheckmarkCircle02Icon,
  DatabaseIcon,
  FileEditIcon,
  Globe02Icon,
  PlayIcon,
  RepeatIcon,
  Search01Icon,
  TerminalIcon,
  WrenchIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockLine,
} from "@/components/ui/code-block";
import {
  Dialog,
  DialogBody,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { SwapIcon, SwapIconItem } from "@/components/ui/swap-icon";
import {
  Trace,
  traceActionStyles,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace";
import { sizes, strokes } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { alignItems: "flex-start", minHeight: 240, width: "100%" },
  width: { maxWidth: "100%", width: 384 },
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

const thought =
  "CI installs with a frozen lockfile, so the install stops when package.json and the lockfile disagree. I should check what the last commit changed, then reproduce the install.";

const failure =
  'ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json';

const sources = [
  {
    title: "Install with a frozen lockfile",
    url: "https://acme.com/docs/install",
  },
  { title: "Continuous integration", url: "https://acme.com/docs/ci" },
];

function TraceDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <Trace sx={styles.width}>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <Icon icon={AiBrain01Icon} />
              </TraceIcon>
              <TraceTitle>Thought for 5s</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>{thought}</TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine>
          <TraceIcon>
            <Icon icon={CheckmarkCircle02Icon} />
          </TraceIcon>
          <TraceTitle>Ran pnpm --version</TraceTitle>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <Icon icon={Alert02Icon} />
              </TraceIcon>
              <TraceTitle>
                Failed to run pnpm install --frozen-lockfile
              </TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock size="sm" variant="danger">
              <CodeBlockContent wrap>{failure}</CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <Icon icon={Globe02Icon} />
              </TraceIcon>
              <TraceTitle>Used {sources.length} sources</TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {sources.map((source) => (
                <a
                  href={source.url}
                  key={source.url}
                  rel="noreferrer"
                  target="_blank"
                  {...stylex.props(traceActionStyles())}
                >
                  <TraceLine>
                    <TraceIcon>
                      <Icon icon={Globe02Icon} />
                    </TraceIcon>
                    <TraceTitle>{source.title}</TraceTitle>
                    <TraceIcon>
                      <Icon icon={ArrowUpRight01Icon} />
                    </TraceIcon>
                  </TraceLine>
                </a>
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </DemoRow>
  );
}

function TraceLineDemo() {
  return (
    <DemoRow>
      <TraceLine>
        <TraceIcon>
          <Icon icon={Globe02Icon} />
        </TraceIcon>
        <TraceTitle>Searched the web</TraceTitle>
      </TraceLine>
    </DemoRow>
  );
}

function TraceStatusDemo() {
  return (
    <DemoRow>
      <Trace sx={styles.width}>
        <TraceLine>
          <TraceIcon>
            <Icon icon={CheckmarkCircle02Icon} />
          </TraceIcon>
          <TraceTitle>Ran pnpm install</TraceTitle>
        </TraceLine>
        <TraceLine status="running">
          <TraceIcon>
            <Spinner aria-hidden />
          </TraceIcon>
          <TraceTitle>Running pnpm build</TraceTitle>
        </TraceLine>
        <TraceLine status="error">
          <TraceIcon>
            <Icon icon={Alert02Icon} />
          </TraceIcon>
          <TraceTitle>Failed to run pnpm lint</TraceTitle>
        </TraceLine>
        <TraceLine status="pending">
          <TraceIcon>
            <Icon icon={TerminalIcon} />
          </TraceIcon>
          <TraceTitle>Run pnpm test</TraceTitle>
        </TraceLine>
      </Trace>
    </DemoRow>
  );
}

function TraceDescriptionDemo() {
  return (
    <DemoRow>
      <TraceLine>
        <TraceIcon>
          <Icon icon={FileEditIcon} />
        </TraceIcon>
        <TraceTitle>Edited trace.tsx</TraceTitle>
        <TraceDescription>+42 −8</TraceDescription>
      </TraceLine>
    </DemoRow>
  );
}

function TraceCollapsibleDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <TraceCollapsible defaultOpen sx={styles.width}>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <Icon icon={AiBrain01Icon} />
            </TraceIcon>
            <TraceTitle>Thought for 5s</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>{thought}</TraceCollapsibleContent>
      </TraceCollapsible>
    </DemoRow>
  );
}

const words = thought.split(" ");
const wordEvery = 60;

function TraceReasoningDemo() {
  const [shown, setShown] = useState(0);
  const [open, setOpen] = useState<boolean>();
  const running = shown < words.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setShown((value) => Math.min(value + 1, words.length));
    }, wordEvery);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const seconds = Math.ceil((words.length * wordEvery) / 1000);

  return (
    <DemoRow
      sx={styles.stage}
      controls={
        <div>
          <Button
            disabled={running}
            onClick={() => {
              setShown(0);
              setOpen(undefined);
            }}
            size="sm"
            variant="outline"
          >
            <Icon icon={PlayIcon} />
            Think again
          </Button>
        </div>
      }
    >
      <TraceCollapsible
        onOpenChange={setOpen}
        open={open ?? running}
        sx={styles.width}
      >
        <TraceCollapsibleTrigger>
          <TraceLine status={running ? "running" : undefined}>
            <TraceIcon>
              <Icon icon={AiBrain01Icon} />
            </TraceIcon>
            <TraceTitle>
              {running ? "Thinking" : `Thought for ${seconds}s`}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          {words.slice(0, shown).join(" ")}
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </DemoRow>
  );
}

const run = [
  {
    description: "flights to Lisbon in March",
    icon: Search01Icon,
    title: {
      done: "Searched the web",
      error: "Failed to search the web",
      running: "Searching the web",
    },
  },
  {
    description: "acme.com/flights",
    icon: Globe02Icon,
    title: {
      done: "Read the page",
      error: "Failed to read the page",
      running: "Reading the page",
    },
  },
  {
    description: "March 2027",
    icon: DatabaseIcon,
    title: {
      done: "Checked the calendar",
      error: "Failed to check the calendar",
      running: "Checking the calendar",
    },
  },
] as const;

const tick = 1200;

function statusAt(index: number, elapsed: number) {
  if (elapsed < index) {
    return null;
  }
  if (elapsed === index) {
    return "running";
  }
  return index === run.length - 1 ? "error" : "done";
}

function TraceToolDemo() {
  const [elapsed, setElapsed] = useState(0);
  const running = elapsed < run.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setElapsed(Math.min(elapsed + 1, run.length));
    }, tick);
    return () => {
      clearTimeout(timer);
    };
  }, [elapsed]);

  return (
    <DemoRow
      sx={styles.stage}
      controls={
        <div>
          <Button
            disabled={running}
            onClick={() => {
              setElapsed(0);
            }}
            size="sm"
            variant="outline"
          >
            <Icon icon={RepeatIcon} />
            Run again
          </Button>
        </div>
      }
    >
      <TraceCollapsible defaultOpen sx={styles.width}>
        <TraceCollapsibleTrigger>
          <TraceLine status={running ? "running" : undefined}>
            <TraceIcon>
              <SwapIcon value={running ? "running" : "done"}>
                <SwapIconItem value="running">
                  <Spinner aria-hidden />
                </SwapIconItem>
                <SwapIconItem value="done">
                  <Icon icon={WrenchIcon} />
                </SwapIconItem>
              </SwapIcon>
            </TraceIcon>
            <TraceTitle>
              {running ? "Using 3 tools" : "Used 3 tools"}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {run.map((step, index) => {
              const status = statusAt(index, elapsed);
              return status === null ? null : (
                <TraceLine
                  key={step.description}
                  status={status === "done" ? undefined : status}
                >
                  <TraceIcon>
                    <SwapIcon value={status}>
                      <SwapIconItem value="running">
                        <Spinner aria-hidden />
                      </SwapIconItem>
                      <SwapIconItem value="done">
                        <Icon icon={step.icon} />
                      </SwapIconItem>
                      <SwapIconItem value="error">
                        <Icon icon={Alert02Icon} />
                      </SwapIconItem>
                    </SwapIcon>
                  </TraceIcon>
                  <TraceTitle>{step.title[status]}</TraceTitle>
                  <TraceDescription>{step.description}</TraceDescription>
                </TraceLine>
              );
            })}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </DemoRow>
  );
}

function TraceLinkDemo() {
  return (
    <DemoRow>
      <a
        href="https://acme.com/docs/ci"
        rel="noreferrer"
        target="_blank"
        {...stylex.props(traceActionStyles())}
      >
        <TraceLine>
          <TraceIcon>
            <Icon icon={Globe02Icon} />
          </TraceIcon>
          <TraceTitle>Continuous integration</TraceTitle>
          <TraceIcon>
            <Icon icon={ArrowUpRight01Icon} />
          </TraceIcon>
        </TraceLine>
      </a>
    </DemoRow>
  );
}

function TraceDialogDemo() {
  return (
    <DemoRow>
      <Dialog>
        <DialogTrigger
          render={
            <button type="button" {...stylex.props(traceActionStyles())} />
          }
        >
          <TraceLine>
            <TraceIcon>
              <Icon icon={TerminalIcon} />
            </TraceIcon>
            <TraceTitle>Ran git diff --stat</TraceTitle>
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
    </DemoRow>
  );
}

function TraceSheetDemo() {
  return (
    <DemoRow>
      <Sheet>
        <SheetTrigger
          render={
            <button type="button" {...stylex.props(traceActionStyles())} />
          }
        >
          <TraceLine>
            <TraceIcon>
              <Icon icon={FileEditIcon} />
            </TraceIcon>
            <TraceTitle>Edited package.json</TraceTitle>
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
    </DemoRow>
  );
}

function TraceGroupDemo() {
  return (
    <DemoRow>
      <Trace sx={styles.width}>
        <TraceLine>
          <TraceIcon>
            <Icon icon={Globe02Icon} />
          </TraceIcon>
          <TraceTitle>Searched the web</TraceTitle>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <Icon icon={FileEditIcon} />
          </TraceIcon>
          <TraceTitle>Edited ci.yml</TraceTitle>
          <TraceDescription>+3 −1</TraceDescription>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <Icon icon={TerminalIcon} />
          </TraceIcon>
          <TraceTitle>Ran pnpm install</TraceTitle>
        </TraceLine>
      </Trace>
    </DemoRow>
  );
}

export {
  TraceCollapsibleDemo,
  TraceReasoningDemo,
  TraceDemo,
  TraceDescriptionDemo,
  TraceDialogDemo,
  TraceGroupDemo,
  TraceLineDemo,
  TraceLinkDemo,
  TraceSheetDemo,
  TraceStatusDemo,
  TraceToolDemo,
};
