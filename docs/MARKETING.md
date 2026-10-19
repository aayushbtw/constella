# Marketing

What we say about Constella, and the proof behind each line. A claim goes in only with a path or command that shows it; when the code changes, fix the claim here first.

## Positioning

In one line, Constella is shadcn-style components on Base UI and StyleX that nobody, person or agent, can restyle from outside.

Two teams arrived at the same rule from different directions:

- **Linear** moved off styled-components because "the endless configurability became a liability". Code restyled components from outside, and every redesign left a long tail of regressions. They picked StyleX to make styling at a distance "deliberately difficult". ([Styling Linear for the future](https://linear.app/now/styling-linear-for-the-future-stylex))
- **Polar** found that LLMs write most of their UI, and prompt rules in `CLAUDE.md` don't stop the drift. They concluded that "a design system has to become a set of decisions that are the only ones expressible." ([Orbit](https://polar.sh/blog/orbit-llm-safe-design-system))

Constella is that rule as a component library you install. Most shadcn registries ship Tailwind, where any class string compiles. Constella's parts have no `className` or `style` prop, so restyling one from outside is a type error, not a review comment. What's left is `sx`, merged last, and the tokens and variants each part exposes.

It's for React apps on the shadcn CLI that want a finished look their agents can't drift from, and not for teams that want Tailwind utilities in their markup.

## Proof

| Claim | Where the idea comes from | Evidence | Held by |
| --- | --- | --- | --- |
| No styling at a distance: parts take `sx`, never `className` or `style` | Linear | Every part's props omit `className` and `style` (`type Styled<T> = Omit<T, "className" \| "style">`), directly or through the part it wraps | Types |
| The caller's `sx` always wins | Linear (merge `sx` after local styles) | `constella/sx-last` | Lint |
| No shorthand/longhand fights in merged styles | Linear | `constella/no-shorthand`, `constella/no-shorthand-mix` | Lint |
| Colors are roles, never raw values | Linear, Polar | `constella/no-raw-colors`; roles in `tokens.stylex.ts` | Lint |
| Type sizes come from the scale, with their line height | Linear | `constella/type-scale` | Lint |
| Hover never sticks on touch | Linear (`highlightMixin`) | `constella/hover-media` | Lint |
| Focus looks the same everywhere | None | `constella/no-focus-style`; one ring in `base.css` | Lint |
| `sx` takes only tokens for color, space, radius, shadow, type size, layer and motion | Polar (typed token props) | `Sx` in `lib/constella/styles.ts`; rejections pinned in `packages/ui/type-tests/sx.ts` | Types |
| Variants are closed lists, not strings | Polar (typed props) | `as const` lists (`buttonVariants`, `textSizes`) the prop types derive from | Types |
| Names say intent, not value | Polar | `colors.textMuted`, `accentSolid`, `space.md` | Convention |
| Dark mode is not a branch | Polar (`light-dark()`) | Tokens valued by Radix steps; the `.dark` class flips them; no component reads the theme | Architecture |
| Themes set tokens, never code paths | Linear | `theme.stylex.ts`; builder on the Theming page | Architecture |
| One escape hatch, each rule explained | Linear (CSS Modules) | `base.css` only; every rule says why StyleX can't reach it | Convention |
| CI checks every push | Polar (rules in CI, not docs) | `.github/workflows/ci.yml` runs check and build on each push to `main` and each PR | CI |
| No rule of ours is switched off in code | Polar (audit `oxlint-disable`) | `rg 'oxlint-disable.*constella/'` returns nothing; the only override is `vite.config.ts`'s, for the `sx` type-test fixtures | Lint |
| Agents read docs, not guesses | Polar (docs alone drift) | `llms.txt`, `/index.md` on every page, `Accept: text/markdown`, `skills/constella`, `<name>-demo` items for shadcn's MCP | Site |
| Accessibility comes from the primitive | None | Base UI under every interactive part | Architecture |

### Numbers

The one place counts live; drafts below leave them as `<n>`. Recount before you post.

| Number | Value | How to count | Counted |
| --- | --- | --- | --- |
| Components | 65 | `rg -c '"type": "registry:ui"' packages/ui/registry.json` | 2026-10-19 |
| Lint rules of our own | 8 | `ls packages/lint/src/rules` | 2026-10-19 |
| `constella/*` disables | 0 | `rg 'oxlint-disable.*constella/'` | 2026-10-19 |
| First commit | 2026-10-05 | `git log --reverse --format=%ad --date=short \| head -1` | 2026-10-19 |

## Where we differ

| From | Them | Us | Why |
| --- | --- | --- | --- |
| Polar | `<Box padding="l">`, raw `<div>` banned | Parts render their own elements; layout is `sx` with `space` tokens | A copy-in registry can't own the app's markup |
| Polar | `light-dark()` per token | `.dark` class flips Radix-valued tokens | Lightning CSS lowers `light-dark()` to fallbacks that ignore the class; shadcn and next-themes already set `.dark` |
| Linear | 100+ colors generated in LCH from 3 inputs | Radix's named scales, picked by name | Hand-tuned in both appearances; no generator to keep |
| Both | An internal system for one app | A registry anyone installs | Open, so the rules have to live in types and docs, not code review |

## Not enforced yet

Say these plainly if asked; don't imply otherwise.

- **Lint is ours, not yet yours.** `@constella/lint` runs in this repo and isn't published. An app gets the types (no `className`, closed variant lists) and the agent skill, not the lint rules.
- **`sx` has gaps.** It rejects a raw value on its own, but math with a token in it (`calc(var(--space-xs) + 13px)`), a motion list after its first token (`150ms, 1ms`), a radius token times any factor, and a raw string equal to a token's value (`"150ms"`) pass. Properties outside its groups (`width`, `inset`, `opacity`, `filter`) take anything. ScrollArea's `viewportSx` takes any StyleX value.
- **A component's own styles aren't typed.** `Sx` checks what comes in through `sx`. Inside a part's `stylex.create`, raw colors and type sizes are linted; raw motion, space, radius and shadow values are held by review (`DESIGN.md`: "A hardcoded value where a token exists").
- **App code can still use a raw `<div>` with `className`.** Only Constella's parts are closed.
- **CI reports after the push.** Commits land on `main` directly; there's no branch protection holding a red one back.
- **No performance numbers of our own.** Linear's 20 to 35% CPU cut is theirs; StyleX gives us the same build-time CSS, but we haven't measured.

## Messaging options

The home page sets one tagline and one line under it (`docs/design/site.md`). Today's is "Components, crafted with care." (`apps/site/src/lib/config.ts`).

|  | Tagline | Line under it | Lead with | Risk |
| --- | --- | --- | --- | --- |
| **A (recommended)** | Components, crafted with care. | shadcn-style components on Base UI and StyleX, with no `className` to restyle them from outside, for you or your agent. | Craft first, guardrails second | Two ideas in one hero |
| B | Components your agent can't restyle. | No `className`, no `style`. Each part exposes its variants and tokens, and `sx` for the rest. | Agent safety | Easy to hear as "can't go off-brand", which `sx` still allows |
| C | shadcn, without `className`. | The same CLI and composition, on Base UI and StyleX, with nothing to restyle from outside. | Familiarity | Reads as a negative; undersells the look |
| D | The decisions, not the values. | Every color, size and curve in a part is a named token. | Design-system thinking | Abstract for a first visit |

A keeps the personality in `DESIGN.md` ("quiet, crisp, and finished") as the headline and lets the guardrail story sell in the subline, the Agents page and tweets. B is the strongest hook for a tweet, too narrow for a hero.

## Tweet knowledge base

### Angles

1. **Linear and Polar both landed here.** Two teams, two reasons (regressions, LLM drift), one rule. Make the wrong choice inexpressible. Constella is that rule as a registry.
2. **Your `CLAUDE.md` is a suggestion; your types are not.** Prose rules drift across generations. A part without `className` can't be restyled from outside, whoever writes the code.
3. **A correction made twice becomes lint.** "A rule earns its place when a correction comes up twice." Count and disables are in Numbers.
4. **Hover that never sticks.** Pointer gets hover, touch gets a press, and `vpr check` fails otherwise. Show the before and after on a phone.
5. **Dark mode without `dark:`.** Components never ask which theme is on; every color is a role that flips.
6. **Agents get Markdown.** Every page is Markdown at `/index.md` or by `Accept: text/markdown`; `llms.txt` lists them all; a skill teaches the rules.
7. **shadcn's shape, StyleX's contract.** Same CLI, same parts, same names; `sx` instead of `className`.

### Drafts

Fill `<n>` from Numbers. A line per `>` paragraph is a line in the tweet.

> Linear moved to StyleX to make styling at a distance hard.
>
> Polar moved to StyleX because LLMs kept drifting off their system.
>
> Both concluded the right choice should be the only one you can type.
>
> Constella is that, as a shadcn registry. No className. Just sx and tokens.

> Your CLAUDE.md says "don't restyle shared components."
>
> Your agent reads it, agrees, and passes `className` anyway.
>
> Constella's parts don't take `className` or `style`. It doesn't compile.

> Rule we follow: if we correct the same thing twice, it becomes a lint rule.
>
> <n> rules so far. Hover outside `@media (hover: hover)` is the newest, and its first run caught one we'd missed.
>
> <n> of them disabled anywhere.

> Dark mode in Constella has no `dark:` and no `isDark`.
>
> Every color is a role (`textMuted`, `accentSolid`) valued by a Radix step. The `.dark` class flips the step. Components never know.

### Don't say

- "Agent-proof" or "impossible to go off-brand". `sx` lets token math and properties outside its groups through, and app code can still write a `<div>` with `className`.
- "Lint included", until `@constella/lint` is published.
- Any speed number of ours. None is measured.
- "Used by Linear/Polar". We follow their reasoning; they don't use Constella.
