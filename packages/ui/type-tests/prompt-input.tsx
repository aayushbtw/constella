import type { ReactElement } from "react";

import { PromptInputCommandTextarea } from "@/components/ai/prompt-input";

const accepts = (element: ReactElement) => element;
declare const setText: (value: string) => void;

accepts(<PromptInputCommandTextarea />);
accepts(<PromptInputCommandTextarea onValueChange={setText} />);
accepts(<PromptInputCommandTextarea onValueChange={setText} value="" />);

// @ts-expect-error -- a controlled draft without onValueChange loses the typed trigger
accepts(<PromptInputCommandTextarea value="" />);
