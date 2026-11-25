import type { ChangeEventHandler, ReactElement } from "react";

import { PromptInputCommandTextarea } from "@/components/ai/prompt-input";

const accepts = (element: ReactElement) => element;
declare const setText: (value: string) => void;
declare const onChange: ChangeEventHandler<HTMLTextAreaElement>;

accepts(<PromptInputCommandTextarea />);
accepts(<PromptInputCommandTextarea onValueChange={setText} />);
accepts(<PromptInputCommandTextarea onValueChange={setText} value="" />);
accepts(<PromptInputCommandTextarea onChange={onChange} value="" />);
