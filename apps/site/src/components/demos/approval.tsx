import { Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useState } from "react";

import {
  Approval,
  ApprovalAction,
  ApprovalContent,
  ApprovalField,
  ApprovalFieldLabel,
  ApprovalFields,
  ApprovalFieldValue,
  ApprovalFooter,
  ApprovalHeader,
  ApprovalMedia,
  ApprovalTitle,
} from "@/components/ui/approval";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { colors, sizes, space, strokes } from "@/lib/constella/tokens.stylex";
import { DemoRow } from "~/components/demos/frame";

const styles = stylex.create({
  stage: { alignItems: "flex-start", minHeight: 320, width: "100%" },
  column: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    maxWidth: "100%",
    width: 384,
  },
  badges: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.xxs,
  },
  body: {
    color: colors.textSecondary,
    marginBlockEnd: 0,
    marginBlockStart: 0,
    textWrap: "pretty",
  },
});

function MailIcon() {
  return (
    <ApprovalMedia>
      <HugeiconsIcon
        aria-hidden
        icon={Mail01Icon}
        size={sizes.iconXs}
        strokeWidth={Number(strokes.icon)}
      />
    </ApprovalMedia>
  );
}

const recipients = ["alex@acme.com", "sam@acme.com"];

function MailFields() {
  return (
    <ApprovalContent>
      <ApprovalFields>
        <ApprovalField>
          <ApprovalFieldLabel>To</ApprovalFieldLabel>
          <ApprovalFieldValue sx={styles.badges}>
            {recipients.map((recipient) => (
              <Badge key={recipient} variant="secondary">
                {recipient}
              </Badge>
            ))}
          </ApprovalFieldValue>
        </ApprovalField>
        <ApprovalField>
          <ApprovalFieldLabel>Subject</ApprovalFieldLabel>
          <ApprovalFieldValue>Q3 forecast, revised</ApprovalFieldValue>
        </ApprovalField>
      </ApprovalFields>
    </ApprovalContent>
  );
}

function MailBody() {
  return (
    <ApprovalContent>
      <p {...stylex.props(styles.body)}>
        Hi both, the revised forecast is attached. Revenue holds at 4.2M; the
        change is in hiring, pushed to October. Shout if anything looks off
        before Thursday’s review.
      </p>
    </ApprovalContent>
  );
}

type Answer = "pending" | "sending" | "sent" | "cancelled";

const sendFor = 1200;

function ApprovalDemo() {
  const [answer, setAnswer] = useState<Answer>("pending");
  const sending = answer === "sending";

  useEffect(() => {
    const timer = sending
      ? setTimeout(() => {
          setAnswer("sent");
        }, sendFor)
      : undefined;
    return () => {
      clearTimeout(timer);
    };
  }, [sending]);

  const decided = answer === "sent" || answer === "cancelled";

  return (
    <DemoRow
      sx={styles.stage}
      controls={
        <div>
          <Button
            disabled={!decided}
            onClick={() => {
              setAnswer("pending");
            }}
            size="sm"
            variant="outline"
          >
            Ask again
          </Button>
        </div>
      }
    >
      <div {...stylex.props(styles.column)}>
        <Approval>
          <ApprovalHeader>
            <ApprovalTitle>
              <MailIcon />
              Send mail
            </ApprovalTitle>
            {decided ? (
              <ApprovalAction>
                <Badge
                  status={answer === "sent" ? "success" : undefined}
                  variant="secondary"
                >
                  {answer === "sent" ? "Sent" : "Cancelled"}
                </Badge>
              </ApprovalAction>
            ) : null}
          </ApprovalHeader>
          <MailFields />
          <Separator />
          <MailBody />
          {decided ? null : (
            <ApprovalFooter>
              <Button
                disabled={sending}
                onClick={() => {
                  setAnswer("cancelled");
                }}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                aria-busy={sending}
                disabled={sending}
                onClick={() => {
                  setAnswer("sending");
                }}
                size="sm"
                variant="primary"
              >
                {sending ? <Spinner /> : null}
                Send mail
              </Button>
            </ApprovalFooter>
          )}
        </Approval>
      </div>
    </DemoRow>
  );
}

function ApprovalDecidedDemo() {
  return (
    <DemoRow sx={styles.stage}>
      <div {...stylex.props(styles.column)}>
        <Approval>
          <ApprovalHeader>
            <ApprovalTitle>
              <MailIcon />
              Send mail
            </ApprovalTitle>
            <ApprovalAction>
              <Badge status="success" variant="secondary">
                Sent
              </Badge>
            </ApprovalAction>
          </ApprovalHeader>
          <MailFields />
        </Approval>
        <Approval>
          <ApprovalHeader>
            <ApprovalTitle>
              <MailIcon />
              Reply to mail
            </ApprovalTitle>
            <ApprovalAction>
              <Badge variant="secondary">Cancelled</Badge>
            </ApprovalAction>
          </ApprovalHeader>
          <ApprovalContent>
            <ApprovalFields>
              <ApprovalField>
                <ApprovalFieldLabel>To</ApprovalFieldLabel>
                <ApprovalFieldValue>Everyone on the thread</ApprovalFieldValue>
              </ApprovalField>
            </ApprovalFields>
          </ApprovalContent>
        </Approval>
      </div>
    </DemoRow>
  );
}

export { ApprovalDecidedDemo, ApprovalDemo };
