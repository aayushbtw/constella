interface Choice {
  description?: string;
  label: string;
  value: string;
}

export interface Question {
  choices: readonly Choice[];
  description?: string;
  input?: { label: string; placeholder: string };
  multiple?: boolean;
  name: string;
  required?: boolean;
  title: string;
}

export const plan = [
  {
    choices: [
      {
        description: "Show what the agent ran and what came back.",
        label: "Tool call timeline",
        value: "tool-calls",
      },
      {
        description: "Ask before sensitive or destructive actions.",
        label: "Approval checkpoints",
        value: "approvals",
      },
      {
        description: "Make delegated work and results easier to follow.",
        label: "Sub-agent handoffs",
        value: "handoffs",
      },
    ],
    description: "Choose a direction or describe another task.",
    input: {
      label: "Another agent feature",
      placeholder: "Describe another feature…",
    },
    name: "direction",
    required: true,
    title: "What should the agent build next?",
  },
  {
    choices: [
      { label: "Progress", value: "progress" },
      { label: "Decisions", value: "decisions" },
      { label: "Risks", value: "risks" },
      { label: "Next step", value: "next-step" },
    ],
    description: "Select all that apply, or skip this question.",
    multiple: true,
    name: "signals",
    title: "What should every progress update include?",
  },
  {
    choices: [
      { label: "Start now", value: "now" },
      { label: "Next development cycle", value: "next-cycle" },
      { label: "Add it to the backlog", value: "backlog" },
    ],
    description: "Choose when the agent should begin the work.",
    name: "timing",
    required: true,
    title: "When should work begin?",
  },
] as const satisfies readonly Question[];

export const context = {
  choices: [
    { label: "Relevant source files", value: "source" },
    { label: "Existing tests", value: "tests" },
    { label: "Architecture documentation", value: "docs" },
    { label: "Recent commit history", value: "history" },
  ],
  description: "Select every source that may affect the implementation.",
  multiple: true,
  name: "context",
  required: true,
  title: "What context should the agent inspect?",
} as const satisfies Question;

export const approach = {
  choices: [
    { label: "Make the smallest safe change", value: "incremental" },
    { label: "Refactor one module at a time", value: "module" },
    { label: "Replace the implementation completely", value: "rewrite" },
  ],
  description: "Choose a strategy or write a more specific instruction.",
  input: {
    label: "Another refactoring approach",
    placeholder: "Describe another approach…",
  },
  name: "approach",
  required: true,
  title: "How should the agent approach this refactor?",
} as const satisfies Question;

export const brief = [
  {
    choices: [
      { label: "New feature", value: "feature" },
      { label: "Bug fix", value: "fix" },
      { label: "Refactor", value: "refactor" },
    ],
    description: "Choose the category that best describes the work.",
    name: "task",
    required: true,
    title: "What kind of change is this?",
  },
  {
    choices: [
      { label: "Do not add dependencies", value: "no-dependencies" },
      { label: "Do not change the database", value: "no-migrations" },
      { label: "Preserve the public API", value: "preserve-api" },
    ],
    description: "Answer if needed, or intentionally skip this question.",
    input: {
      label: "Another implementation constraint",
      placeholder: "Describe another constraint…",
    },
    name: "constraints",
    title: "Are there any implementation constraints?",
  },
  {
    choices: [
      { label: "Run the test suite", value: "tests" },
      { label: "Review the final diff", value: "diff" },
      { label: "Tests and diff review", value: "both" },
    ],
    description: "Choose the checks the agent should complete before handoff.",
    name: "review",
    required: true,
    title: "How should the work be reviewed?",
  },
] as const satisfies readonly Question[];

export const action = {
  choices: [
    { label: "Inspect the implementation", value: "inspect" },
    { label: "Run the relevant tests", value: "tests" },
    { label: "Prepare the patch", value: "patch" },
  ],
  description: "Press the key shown on an answer, or move with the arrow keys.",
  name: "action",
  required: true,
  title: "What should the agent do next?",
} as const satisfies Question;

export const workflow = [
  {
    choices: [
      { label: "Only the target component", value: "component" },
      { label: "Component and related tests", value: "tests" },
      { label: "The complete feature area", value: "feature" },
    ],
    description: "The page holds the active question; the controls move it.",
    name: "scope",
    required: true,
    title: "What may the agent change?",
  },
  {
    choices: [
      { label: "Targeted tests", value: "targeted" },
      { label: "Package tests and typecheck", value: "package" },
      { label: "Full workspace verification", value: "full" },
    ],
    name: "checks",
    required: true,
    title: "Which verification level should it use?",
  },
  {
    choices: [
      { label: "Concise summary", value: "summary" },
      { label: "Summary with changed files", value: "diff" },
      { label: "Detailed implementation handoff", value: "handoff" },
    ],
    name: "output",
    required: true,
    title: "What should the agent return when finished?",
  },
] as const satisfies readonly Question[];

export const environment = {
  choices: [
    { label: "Preview", value: "preview" },
    { label: "Staging", value: "staging" },
    { label: "Isolated sandbox", value: "isolated" },
  ],
  name: "environment",
  required: true,
  title: "Which cloud environment should it use?",
} as const satisfies Question;

export const approval = {
  choices: [
    { label: "Before writing files", value: "writes" },
    { label: "Before running commands", value: "commands" },
    { label: "Only for sensitive actions", value: "sensitive" },
  ],
  name: "approval",
  required: true,
  title: "When should the agent ask for approval?",
} as const satisfies Question;

export const permissions = [
  {
    choices: [
      { label: "Project files", value: "files" },
      { label: "Project files and tests", value: "tests" },
      { label: "Files, tests and configuration", value: "config" },
    ],
    description: "Next stays disabled until an answer is chosen.",
    name: "permission",
    required: true,
    title: "What may the agent modify?",
  },
  {
    choices: [
      { label: "Tests", value: "tests" },
      { label: "Tests and types", value: "types" },
      { label: "Tests, types and visual QA", value: "all" },
    ],
    name: "verification",
    required: true,
    title: "What must pass before completion?",
  },
] as const satisfies readonly Question[];

export const pullRequest = [
  {
    choices: [
      { label: "Small patch", value: "small" },
      { label: "Feature-sized change", value: "medium" },
      { label: "Cross-package change", value: "large" },
    ],
    name: "scope",
    required: true,
    title: "How large is the change?",
  },
  {
    choices: [
      { label: "Single commit", value: "single" },
      { label: "Logical commits", value: "logical" },
      { label: "Squash before review", value: "squash" },
    ],
    name: "strategy",
    required: true,
    title: "How should commits be organized?",
  },
  {
    choices: [
      { label: "Targeted tests", value: "targeted" },
      { label: "Package suite", value: "package" },
      { label: "Full workspace", value: "workspace" },
    ],
    name: "tests",
    required: true,
    title: "Which tests should run?",
  },
  {
    choices: [
      { label: "Patch only", value: "patch" },
      { label: "Committed locally", value: "commit" },
      { label: "Push a review branch", value: "branch" },
    ],
    name: "delivery",
    required: true,
    title: "How should the work be delivered?",
  },
] as const satisfies readonly Question[];

export const handoff = [
  {
    choices: [
      { label: "Fix the failing tests", value: "fix" },
      { label: "Refactor the data layer", value: "refactor" },
      { label: "Update the integration guide", value: "docs" },
    ],
    description: "Choose the task that should be handled next.",
    name: "task",
    required: true,
    title: "What should the agent work on?",
  },
  {
    choices: [
      { label: "Summary only", value: "summary" },
      { label: "Summary and changed files", value: "files" },
      { label: "Full review handoff", value: "review" },
    ],
    description: "Pick the level of detail needed for review.",
    name: "output",
    required: true,
    title: "What should the final handoff include?",
  },
] as const satisfies readonly Question[];

export const clarification = [
  {
    choices: [
      { label: "Component only", value: "component" },
      { label: "Complete feature directory", value: "feature" },
      { label: "Any related workspace file", value: "workspace" },
    ],
    description: "Choose how broadly the agent can update the workspace.",
    name: "scope",
    required: true,
    title: "Which files are in scope?",
  },
  {
    choices: [
      { label: "Targeted tests", value: "targeted" },
      { label: "Package tests", value: "package" },
      { label: "Full workspace verification", value: "full" },
    ],
    description: "Choose the checks the agent should run before handoff.",
    name: "tests",
    required: true,
    title: "How much verification is needed?",
  },
] as const satisfies readonly Question[];

export const contextItems = [context];

export const approachItems = [approach];

export const actionItems = [action];

export const planNames = plan.map((question) => question.name);
