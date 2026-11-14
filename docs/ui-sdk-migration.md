# ui-sdk migration

The tracker for moving `packages/ui` from Base UI to ui-sdk. Read it first in any session that touches the port; update it in the same PR as the work. Why we're moving and what's known about ui-sdk live in [ARCHITECTURE.md, UI SDK watch](ARCHITECTURE.md#ui-sdk-watch).

## Branches and PRs

| What | Rule |
| --- | --- |
| Integration branch | `ui-sdk`, long-lived. Lands on `main` once, when [Done](#done) holds. Draft PR `ui-sdk` → `main` shows the whole diff |
| Unit branch | `port/<unit>` off `ui-sdk`, one row of the tracker (or one phase-0 task) per branch |
| Unit PR | Base `ui-sdk`, label `ui-sdk`, title `feat(<component>): port to ui-sdk`. Squash-merged once its checklist passes |
| Tracker | The unit PR sets its row's status and PR link. No other place tracks status |
| Syncing `main` | Merge `main` into `ui-sdk` (never rebase; unit branches sit on it) at least weekly and before each phase starts. A `main` change to a ported component gets ported in the same merge. Record the merge below |

## Unit checklist

A unit PR merges when all hold:

1. No `@base-ui/react` import left in the unit's files.
2. Slots follow ui-sdk's names; every style and `:has()` selector that read the old name is updated (`rg` the old name across `packages/ui` and `apps/site`).
3. The docs page's demos render and behave as before, screenshotted light and dark, with popups open.
4. A test with `@ui-sdk/core/testing`: our wiring, plus an agent-bridge `snapshot` that names every control.
5. Motion skills from `AGENTS.md` run on it.
6. `vpr check` and `vpr build` pass.
7. Port notes or gaps found go in [Findings](#findings), and decisions in ARCHITECTURE.md.
8. Slop check: `/orbit:deslop` and `/orbit:no-comments` ran over the diff, with fixes applied.
9. Reuse check: the `ui-sdk-reuse-reviewer` agent (`.claude/agents/ui-sdk-reuse-reviewer.md`) returned `CLEAN`, or every finding was fixed and a fresh run returned `CLEAN`. The PR body links its verdict.
10. An independent `orbit:verifier` returned `PASS` or `PASS+NOTES` on the head SHA.

### Checks

`apps/site/scripts/diff-prerender.ts` diffs the prerendered docs pages of two builds, tag by tag. It ignores scripts, `/assets/` links, attribute order and class order.

1. On the base branch, run `vpr build`, then `cp -R apps/site/.cloudflare/output/v0/workers/default/assets <before>`. Keep `<before>` outside the repo.
2. On the unit branch, run `vpr build`, then copy the same folder to `<after>`.
3. Run `node apps/site/scripts/diff-prerender.ts <before> <after>`. It exits 0 when every page is identical and 1 with a per-page diff otherwise.

Zero diff is the gate only for units that must keep markup unchanged, such as the render helper swap. For every other unit, the output shows which markup changed, and only the expected changes may appear.

**Tests.** `vpr test` runs `packages/ui` tests in jsdom, with StyleX compiled and strict mode on (`packages/ui/vite.config.ts`, `packages/ui/test/setup.ts`). Put a unit's test beside its component as `<name>.test.tsx`, importing from `vite-plus/test`. `packages/ui/test/agent.test.tsx` is the agent test template.

## Pre-existing problems

A bug or inconsistency the port uncovers that `main` already has is never fixed, worked around or carried inside a port PR.

1. File it: `gh issue create --label found-in-port`, with the file, the symptom and how to see it on `main`.
2. Fix it on `main` in its own change, through the normal bug flow.
3. Merge `main` into `ui-sdk`, then continue the port on the fixed code.
4. Add the issue to [Findings](#findings).

A port PR blocked on such a fix sets its row to `blocked` with the issue link.

## Phases

Each phase starts after the one before it merges, except where a row says otherwise. Bottom-up, per `AGENTS.md`'s Dependencies first.

| Phase | Goal | Exit |
| --- | --- | --- |
| 0. Foundation | Layer order, render helpers, test setup | Site builds with `ui-sdk` layer first; one test runs |
| 1. Spike | Popover end to end | Go or no-go written in [Log](#log). No-go stops the port |
| 2. Controls | Simple stateful parts | Rows merged |
| 3. Overlays | Popups and toasts | Rows merged |
| 4. Lists | Select, menus, groups | Rows merged |
| 5. Composites | AI and composite parts on top | Rows merged |
| 6. Agent | Bridge for parts ui-sdk doesn't ship | Each AI and TanStack part shows in `snapshot()` |
| 7. Land | Remove Base UI, rewrite docs | [Done](#done) holds |

## Tracker

Status: `todo`, `doing`, `pr`, `merged`, `blocked`.

### Phase 0

| Task | Status | PR | Notes |
| --- | --- | --- | --- |
| The global stylesheet declares `@layer ui-sdk;` first, below every app layer; install docs tell consumers to | merged | [#13](https://github.com/aayushbtw/constella/pull/13) |  |
| `useRender`/`mergeProps` to `renderElement`/`mergeProps` from `@ui-sdk/react/primitive` | merged | [#16](https://github.com/aayushbtw/constella/pull/16) | 21 files; textarea stays with its row |
| Vitest, jsdom stubs and `__UI_SDK_STRICT__` per the skill's `testing.md` | merged | [#18](https://github.com/aayushbtw/constella/pull/18) |  |

### Phases 1 to 5

| Unit | Phase | Base UI parts | ui-sdk | Status | PR | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Popover | 1 | popover | Popover | merged | [#25](https://github.com/aayushbtw/constella/pull/25) | The spike. Ports Model Picker's popover parts too, since it built on ours |
| Button | 2 | button | Button | todo |  |  |
| Separator | 2 | separator | Separator | merged | [#26](https://github.com/aayushbtw/constella/pull/26) | Button Group, Item and Sidebar separators now carry `separator` |
| Toggle | 2 | toggle | Toggle | pr |  | Toggle Group and Segmented Control keep Base UI's toggle until phase 4 |
| Checkbox | 2 | checkbox | Checkbox | todo |  |  |
| Switch | 2 | switch | Switch | todo |  | Swap `packages/ui/test/agent.test.tsx`'s raw ui-sdk Switch for ours |
| Radio Group | 2 | radio-group, radio | Radio | todo |  |  |
| Progress | 2 | progress | Progress | todo |  |  |
| Loading Bar | 2 | progress | Progress | todo |  | Added on main 2026-11-14; port after Progress |
| Meter | 2 | meter | Meter | todo |  |  |
| Slider | 2 | slider | Slider | todo |  | Needs Tooltip for its demo; port after Tooltip or keep the demo on hold |
| Avatar | 2 | avatar | Avatar | todo |  | Citation uses it too |
| Field | 2 | field, fieldset | Field | todo |  | No Fieldset documented; check |
| Input Group | 2 | input | Input | todo |  |  |
| Textarea | 2 | field | Textarea | todo |  |  |
| Scroll Area | 2 | scroll-area | Scroll Area | todo |  | Code Block also uses it, and `DirectionProvider` |
| Collapsible | 2 | collapsible | Collapsible | todo |  |  |
| Tabs | 2 | tabs | Tabs | todo |  |  |
| Tooltip | 3 | tooltip | Tooltip | todo |  |  |
| Hover Card | 3 | preview-card | Hover Card | todo |  | Drop the `popupVars` copy. ui-sdk's hover card trigger lists only `data-open`; check Button's open style when it ports |
| Dialog | 3 | dialog | Dialog | todo |  |  |
| Sheet | 3 | dialog | Drawer | todo |  | Or Dialog with `presentation="sheet"`; decide in the PR |
| Side Panel | 3 | dialog | Drawer | todo |  |  |
| Alert Dialog | 3 | alert-dialog | Alert Dialog | todo |  | Consider `createConfirm()` |
| Toast | 3 | toast | Toast | todo |  | No anchored toasts; region placement is ours without `web.css` |
| Select | 4 | select | Select | todo |  | Drop the `popupVars` copy |
| Dropdown Menu | 4 | menu | Menu | todo |  | No search input part documented; ours ships `dropdown-menu-input`. Drop the `popupVars` copy |
| Command | 4 | autocomplete | Command | todo |  | Ours is Base UI Autocomplete; ui-sdk ships a Command |
| Toggle Group | 4 | toggle-group, toggle | Toolbar? | todo |  | No Toggle Group documented; check |
| Segmented Control | 4 | toggle-group, toggle | Segmented Control | todo |  |  |
| Model Picker | 5 | popover, render helpers |  | todo |  | Popover parts ported with Popover; waits on Command |
| Prompt Input | 5 | autocomplete |  | todo |  | After Command. Drop the `popupVars` copy |
| Citation | 5 | avatar |  | todo |  | After Avatar, Hover Card |
| Settings Dialog | 5 | via Dialog |  | todo |  | Re-verify only |
| Sidebar | 5 | via Sheet, render helpers |  | todo |  | Re-verify only |

### Phase 6

| Unit | Status | PR | Notes |
| --- | --- | --- | --- |
| Agent bridge on the docs site (dev only) | todo |  | `createAgent` in the client entry |
| `definePrimitive` with `agent` key: Prompt Input, Attachment, Approval, Questionnaire | todo |  | Split per part when started |
| `definePrimitive` with `agent` key: Data Table, Chart | todo |  |  |

### Phase 7

| Task | Status | PR |
| --- | --- | --- |
| Remove `@base-ui/react` from `packages/ui` and `apps/site` | todo |  |
| Delete the `popupVars` token, the Base UI branch of `useSkipMotion` and the `[data-popup-open]` half of the open-state selector | todo |  |
| Rewrite Base UI mentions in ARCHITECTURE.md, DESIGN.md, `docs/design/*` | todo |  |
| Registry build and every docs page checked | todo |  |
| Land `ui-sdk` on `main` | todo |  |

## Done

The port lands on `main` when every row is `merged`, the ARCHITECTURE.md "Ready when" table is met, and no `@base-ui/react` import is left.

## Findings

Gaps and surprises found while porting, newest first. Move a settled one into ARCHITECTURE.md.

| Date | Unit | Finding |
| --- | --- | --- |
| 2026-11-14 | Separator | ui-sdk owns `data-slot`, so `ButtonGroupSeparator`, `ItemSeparator` and `SidebarSeparator` lost `button-group-separator`, `item-separator` and `sidebar-separator` and carry `separator`. The group joins (`styles.ts` `joined`) and Item Group's gap read `[data-slot='separator']`. The joins' selector change renames two classes on every joinable part in the built CSS; demos are pixel-identical before and after, light and dark |
| 2026-11-14 | Separator | Same markup as Base UI's (`div`, `role="separator"`, `aria-orientation`, `data-orientation`). New `decorative` prop gives `role="none"`; no Constella part sets it yet. A separator never shows in the agent `snapshot()` |
| 2026-11-14 | Toggle | Base UI and ui-sdk both mark a pressed toggle `data-pressed`, so `stateStyles.selectedFill`, Segmented Control and Chart Legend need no second selector while Toggle Group stays on Base UI. The markup loses Base UI's `tabindex="0"`, and a disabled toggle adds `aria-disabled="true"` beside `disabled` |
| 2026-11-14 | Toggle | A lone disabled toggle stays natively `disabled`, so Button's `:disabled` styles still match. With `focusableWhenDisabled` it carries only `aria-disabled` and `data-disabled`, which those styles miss until Button's port reads `[data-disabled]`. No demo uses it |
| 2026-11-14 | Toggle | `ToggleIcon` (hides its icon, `mirror` flips it right to left, sets `data-has-icon`) isn't wrapped; our demos mark their icons `aria-hidden` themselves. Decide with Toggle Group |
| 2026-11-14 | Popover | A Model Picker pick by pointer ran the 120ms exit; Base UI's build closed it at once. `controller.close()` reports `source: "programmatic"`, so `useSkipMotion` doesn't skip, and the batched `setPicked(true)` landed after ui-sdk read the transitions. `ModelPickerItem` commits `picked` with `flushSync` before it closes. A controller close takes only a `reason` from a fixed list, so a pick can't reach `useSkipMotion` |
| 2026-11-14 | Popover | StyleX can't share a selector key across files: a `defineConsts` value as a key compiles to a descendant selector (`:is(…) .x123`), and importing a plain one fails the compile, since StyleX resolves imports only from `.stylex.ts` files. `popupOpen` stays repeated in `styles.ts`, `button.tsx` and `prompt-input.tsx` |
| 2026-11-14 | Popover | Pre-existing on `main`: a click inside a popover opened from an `InputGroupAddon` reaches the addon's `onClick`, which focuses the group's input (`input-group.tsx` `InputGroupAddon`). Base UI kept the popover open; ui-sdk closes it, since focus left. Filed and fixed on `main` as [#23](https://github.com/aayushbtw/constella/issues/23), then merged in; this PR also skips clicks from in-place `[popover]` content, a DOM child of the addon after the port |
| 2026-11-14 | Popover | Pre-existing on `main`: the prerendered Date Range Picker page throws React error #418 (hydration text mismatch) on load, in both builds. Filed and fixed on `main` as [#24](https://github.com/aayushbtw/constella/issues/24) (date demos pinned), then merged in |
| 2026-11-14 | Popover | ui-sdk registers `--available-height` and `--available-width` without inheritance as soon as a popover mounts, so every Base UI popup on the page lost its max height and width. Their positioners now copy the values into `popupVars` |
| 2026-11-14 | Popover | The open content rendered in place counted as a ButtonGroup part and squared the trigger's end corners. The joins skip `[popover]` |
| 2026-11-14 | Popover | The content inherits from where it sits: an addon's weight, cursor and `user-select`, a group's joins. `popoverStyles.popup` resets them. ui-sdk's runtime layer, not `web.css`, resets the browser's `[popover]` box |
| 2026-11-14 | Popover | No documented ui-sdk hook tells popup content how a change came about (`data-instant` is Tooltip-only). `useSkipMotion` gained a ui-sdk branch: it skips on `details.source === "keyboard"` or `reason === "focus-out"`, and Popover and Model Picker content stamp `data-skip-motion`. It commits with `flushSync`, since ui-sdk reads the content's transitions right after `onOpenChange`; without it an Escape after a pointer open ran the 120ms exit. A `flushSync` inside a React commit (like `controller.close()` in an effect) is skipped with a logged error; it runs only when the value changes, which avoids most of those. `source` is read from trusted events only, so jsdom tests see `programmatic` and the keyboard path is checked in a browser. Remove the branch once ui-sdk ships `data-instant` on popup content |
| 2026-11-14 | Popover | `initialFocus` takes no open type, so Date Range Picker picks `"auto"` or `"content"` from `details.source` in `onOpenChange` |
| 2026-11-14 | Popover | Base UI's `actionsRef` is ui-sdk's controller: Model Picker closes on pick with `createPopoverController().close()` |
| 2026-11-14 | Popover | Not on `main`: Model Picker's docs linked Base UI `useRender` for `render`, left from #16; it now links ui-sdk's Parts and Composition. Empty, Kbd, Breadcrumb, Shimmer, Item, Card and Alert still link Base UI `useRender` |
| 2026-11-14 | Render helpers | `SidebarGroupAction` and `SidebarMenuAction` forced `type="button"` onto a `render` element on `main`. Found by the slop review of #16, filed and fixed on `main` as [#17](https://github.com/aayushbtw/constella/issues/17), then merged in |
| 2026-11-14 | Render helpers | A handler on a `render` element that calls `preventDefault()` now skips the part's own handler (ui-sdk `mergeProps`). Base UI needed `event.preventBaseUIHandler()` for that |
| 2026-11-14 | Render helpers | `AttachmentTrigger render={<DialogTrigger />}` rendered a button with no `type` on `main`, so it submitted a surrounding form. Filed and fixed on `main` as [#15](https://github.com/aayushbtw/constella/issues/15), then merged in |
| 2026-11-14 | Test setup | The skill's `testing.md` assigns the jsdom stubs and says not to use `??=`, since jsdom has some of them without the parts that matter; `core.md` "Testing in a Framework" uses `??=`. We follow the skill |
| 2026-11-14 | Test setup | The skill imports from `vitest`; Vite+ ships Vitest as `vite-plus/test`, and `vite-plus/prefer-vite-plus-imports` enforces it |
| 2026-11-14 | Test setup | `@stylexjs/unplugin` 0.19.1 leaves a polling interval running under Vitest, so each run hung 10 s on exit. 0.19.2 unrefs it. `packages/ui` takes ^0.19.2 for tests. The site stays on 0.19.1: 0.19.2 regroups StyleX's CSS layers and flips the cascade order of 63 rule pairs, so it gets its own upgrade with a popup-state check |

## Log

| Date | Event |
| --- | --- |
| 2026-11-14 | `ui-sdk` branch created; 0.1.0-beta.1 and the `ui-sdk` skill installed; tracker written |
| 2026-11-14 | Added the reuse review, slop check and pre-existing problem rules. Unit branches renamed `port/<unit>`, since git refuses `ui-sdk/<unit>` beside `ui-sdk` |
| 2026-11-14 | #13 merged: `@layer ui-sdk;` in the global stylesheet. The reuse review caught that declaring it in `base.css` loses to any layer declared earlier |
| 2026-11-14 | Advisor on the render helper swap: own attrs first so caller props win, add `type="button"` by hand, Textarea stays on Base UI until its row, HTML diff harness lands first |
| 2026-11-14 | Merged `main` into `ui-sdk` at c3b66d7: Loading Bar added (row added), Code Block now uses Scroll Area. Includes the #15 fix |
| 2026-11-14 | Filed and fixed #17 on `main` (Sidebar actions forced `type="button"` onto a `render` element), found by the slop review of #16; merged `main` in |
| 2026-11-14 | #16 merged: 21 wrappers on `renderElement`/`mergeProps`, 0 of 82 prerendered pages differ. Its review surfaced #15 and #17, both fixed on `main` first |
| 2026-11-14 | #18 merged: `vpr test` runs ui-sdk tests in jsdom with strict mode. Phase 0 done. The site stays on StyleX unplugin 0.19.1, since 0.19.2 regroups its CSS layers |
| 2026-11-14 | Filed and fixed #19 on `main`: `vpr check` now runs in a fresh checkout (route tree committed, `tomekit build` before check); merged `main` in |
| 2026-11-14 | Popover spike: GO with conditions. Filed and fixed #23 (InputGroupAddon focused the input on clicks inside a portaled popover) and #24 (date demos mismatched hydration) on `main`; merged `main` in |
| 2026-11-14 | #25 merged: Popover on ui-sdk, phase 1 done. Verdict GO. Bridges until phase 7: `popupVars`, `useSkipMotion`'s ui-sdk branch with `flushSync`, dual open-state selector. Paused here; next is phase 2 |
| 2026-11-14 | Filed and fixed #29 on `main` (Switch docs listed two sizes), found by the Switch port; merged `main` in |
| 2026-11-14 | #26 merged: Separator on ui-sdk. Its three parts read the `separator` slot |
