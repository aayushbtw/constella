# ui-sdk migration

The tracker for moving `packages/ui` from Base UI to ui-sdk. Read it first in any session that touches the port; update it in the same PR as the work. Why we're moving and what's known about ui-sdk live in [ARCHITECTURE.md, UI SDK watch](ARCHITECTURE.md#ui-sdk-watch).

## Branches and PRs

| What | Rule |
| --- | --- |
| Integration branch | `ui-sdk`, long-lived. Lands on `main` once, when [Done](#done) holds. Draft PR `ui-sdk` → `main` shows the whole diff |
| Unit branch | `port/<unit>` off `ui-sdk`, one row of the tracker (or one phase-0 task) per branch |
| Unit PR | Base `ui-sdk`, label `ui-sdk`, title `feat(<component>): port to ui-sdk`. Squash-merged once its checklist passes |
| Tracker | The unit PR sets its row's status and PR link. When units run in parallel, a follow-up docs commit on `ui-sdk` sets them instead, so the PRs don't conflict. No other place tracks status |
| Syncing `main` | Merge `main` into `ui-sdk` (never rebase; unit branches sit on it) at least weekly and before each phase starts. A `main` change to a ported component gets ported in the same merge. Record the merge below |

## Unit checklist

A unit PR merges when all hold:

1. No `@base-ui/react` import left in the unit's files.
2. Slots follow ui-sdk's names; every style and `:has()` selector that read the old name is updated (`rg` the old name across `packages/ui` and `apps/site`).
3. The docs page's demos render and behave as before, screenshotted light and dark, with popups open.
4. A test with `@testing-library/react` and the agent bridge from `@ui-sdk/react/agent`: our wiring, plus a `snapshot` that names every control.
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
| Button | 2 | button | Button | merged | [#27](https://github.com/aayushbtw/constella/pull/27) |  |
| Separator | 2 | separator | Separator | merged | [#26](https://github.com/aayushbtw/constella/pull/26) | Button Group, Item and Sidebar separators now carry `separator` |
| Toggle | 2 | toggle | Toggle | merged | [#30](https://github.com/aayushbtw/constella/pull/30) | Toggle Group and Segmented Control keep Base UI's toggle until phase 4 |
| Checkbox | 2 | checkbox | Checkbox | merged | [#28](https://github.com/aayushbtw/constella/pull/28) | In the Field PR |
| Switch | 2 | switch | Switch | merged | [#28](https://github.com/aayushbtw/constella/pull/28) | In the Field PR. `packages/ui/test/agent.test.tsx` uses ours |
| Radio Group | 2 | radio-group, radio | Radio | merged | [#28](https://github.com/aayushbtw/constella/pull/28) | In the Field PR |
| Progress | 2 | progress | Progress | merged | [#33](https://github.com/aayushbtw/constella/pull/33) |  |
| Loading Bar | 2 | progress | Progress | merged | [#42](https://github.com/aayushbtw/constella/pull/42) | Built on ui-sdk's Progress root and indicator, not ours |
| Meter | 2 | meter | Meter | merged | [#34](https://github.com/aayushbtw/constella/pull/34) |  |
| Slider | 2 | slider | Slider | todo |  | Needs Tooltip for its demo; port after Tooltip or keep the demo on hold. Drop its `useFieldControl` and its half of `field-mixed.test.tsx` |
| Avatar | 2 | avatar | Avatar | merged | [#36](https://github.com/aayushbtw/constella/pull/36) | Ports Citation's logo too |
| Field | 2 | field, fieldset | Field | merged | [#28](https://github.com/aayushbtw/constella/pull/28) | Carries Checkbox, Switch, Radio Group, Input Group and Textarea: no one of them could port alone without temporary code in the Field demos. `FieldSetDescription` is gone; `FieldDescription` describes a set |
| Input Group | 2 | input | Input | merged | [#28](https://github.com/aayushbtw/constella/pull/28) | In the Field PR. Keeps our `InputGroup` over ui-sdk's, which lacks the #23 guard against clicks from portaled content, takes the first input or textarea anywhere in its subtree, sets `data-disabled` only after mount, and owns `data-slot`, so Command's `command-input` and Dropdown Menu's `dropdown-menu-input` would be lost. Revisit when we want `InputClear` |
| Textarea | 2 | field | Textarea | merged | [#28](https://github.com/aayushbtw/constella/pull/28) | In the Field PR |
| Scroll Area | 2 | scroll-area | Scroll Area | merged | [#37](https://github.com/aayushbtw/constella/pull/37) | Ports Code Block's scroller too. Known gap: a viewport that overflows by under a pixel is a Tab stop |
| Collapsible | 2 | collapsible | Collapsible | merged | [#40](https://github.com/aayushbtw/constella/pull/40) | Ports Trace's collapsibles too |
| Tabs | 2 | tabs | Tabs | merged | [#41](https://github.com/aayushbtw/constella/pull/41) |  |
| Tooltip | 3 | tooltip | Tooltip | todo |  |  |
| Hover Card | 3 | preview-card | Hover Card | todo |  | Drop the `popupVars` copy. ui-sdk's hover card trigger lists only `data-open`; check Button's open style when it ports |
| Dialog | 3 | dialog | Dialog | todo |  |  |
| Sheet | 3 | dialog | Drawer | todo |  | Or Dialog with `presentation="sheet"`; decide in the PR |
| Side Panel | 3 | dialog | Drawer | todo |  |  |
| Alert Dialog | 3 | alert-dialog | Alert Dialog | todo |  | Consider `createConfirm()` |
| Toast | 3 | toast | Toast | todo |  | No anchored toasts; region placement is ours without `web.css` |
| Select | 4 | select | Select | todo |  | Drop the `popupVars` copy, its `useFieldControl` and its half of `field-mixed.test.tsx` |
| Dropdown Menu | 4 | menu | Menu | todo |  | No search input part documented; ours ships `dropdown-menu-input`. Drop the `popupVars` copy |
| Command | 4 | autocomplete | Command | todo |  | Ours is Base UI Autocomplete; ui-sdk ships a Command |
| Toggle Group | 4 | toggle-group, toggle | Toolbar? | todo |  | No Toggle Group documented; check |
| Segmented Control | 4 | toggle-group, toggle | Segmented Control | todo |  |  |
| Model Picker | 5 | popover, render helpers |  | todo |  | Popover parts ported with Popover; waits on Command |
| Prompt Input | 5 | autocomplete |  | todo |  | After Command. Drop the `popupVars` copy |
| Citation | 5 | avatar |  | todo |  | Logo ported with Avatar ([#36](https://github.com/aayushbtw/constella/pull/36)); waits on Hover Card |
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
| 2026-11-14 | Collapsible | ui-sdk owns `data-slot`, so the content is `collapsible-panel`, not `collapsible-content`. Trace's five `trace-*` collapsible slots are gone. Its selectors read `[data-slot='collapsible-trigger'][data-open]`, and a context tells the run trigger from a step trigger |
| 2026-11-14 | Collapsible | ui-sdk holds `data-starting-style` for one frame, so the content skips it during a keyboard toggle (`data-collapsible-instant`) and under reduced motion. Without the skip, a 0s open painted 1 or 2 empty frames; the verifier caught it under reduced motion |
| 2026-11-14 | Collapsible | A pointer close starts one frame sooner than on Base UI, which isn't visible. Trace's live run clips the same 54 frames on both builds |
| 2026-11-14 | Collapsible | A disabled trigger carries `aria-disabled` and `data-disabled`, not native `disabled`, and stays in the Tab order. It looks the same, and a press does nothing |
| 2026-11-14 | Collapsible | A closed `keepMounted` panel keeps the trigger's `aria-controls`, which Base UI removed. Server HTML loses the inline `--collapsible-panel-height`; the paint with JavaScript off is unchanged |
| 2026-11-14 | Collapsible | Trace steps with no trigger show in the agent `snapshot()` as unnamed collapsibles that offer `setOpen` and `press`. Phase 6 gives Trace its own entry |
| 2026-11-14 | Collapsible | The React entry exports no root props type, though Popover exports `PopoverProps`. `CollapsibleTrigger` children may be a function of state, which the docs don't mention; Trace's triggers limit `children` to `ReactNode` |
| 2026-11-14 | Collapsible | Pre-existing on `main`: Trace's step trigger shows no chevron on keyboard focus. Filed as [#39](https://github.com/aayushbtw/constella/issues/39) |
| 2026-11-14 | Loading Bar | Built on ui-sdk's Progress root and indicator, not our Progress parts, since ours bring the track, its width transition and the indeterminate sweep. Its parts read `progress` and `progress-indicator`; nothing read the old `loading-bar` slots |
| 2026-11-14 | Loading Bar | Props drop `children`, `min`, `max`, `format` and `locale`; `getValueLabel` stays. Timing, reduced motion and restart match Base UI frame for frame |
| 2026-11-14 | Loading Bar | Candidate follow-up, not done: the `finishing` phase and its `setTimeout` before removal could use `@ui-sdk/core`'s `animateOut`. Nobody has checked how `animateOut` handles a restart during the finish |
| 2026-11-14 | Tabs | ui-sdk owns `data-slot`, so `tabs-trigger` is `tabs-tab` and `tabs-content` is `tabs-panel`. The selected style reads `[data-selected]`, not `[data-active]`. Nothing outside `tabs.tsx` read them |
| 2026-11-14 | Tabs | We keep our `aria-selected` reveal observer and wheel relay. With the observer off, a pointer pick of a half-hidden tab doesn't scroll in Chromium or WebKit. ui-sdk's press focuses with `preventScroll`, and its reveal skips a focused tab, though its docs say "the browser reveals it". Upstream note drafted, not filed |
| 2026-11-14 | Tabs | ui-sdk writes `--active-tab-*` 0.6ms before `data-activation-direction` leaves `none`, so its documented rule ("`none` means don't animate") snapped the first pointer pick. Our indicator skips its transition only while nothing in the list has focus and the attribute is `none` |
| 2026-11-14 | Tabs | `activateOnFocus` on `TabsList` is gone. ui-sdk's default `activation="automatic"` matches it, and `activation="manual"` switches on Enter. `Tabs` is generic over its value, and `onValueChange` can receive `null` |
| 2026-11-14 | Tabs | In RTL, arrows follow the reading direction without a provider; Base UI ignored `dir`. A scripted `element.click()` now focuses the tab. A text-only panel gets `tabindex="0"` after mount, and only when it holds nothing focusable |
| 2026-11-14 | Tabs | The agent bridge names tabs by the list's name, so every `TabsList` in the demos, the break page, the docs and the skill snippet now has an `aria-label`. A disabled tab shows in the `snapshot()` items with nothing that marks it disabled |
| 2026-11-14 | Tabs | `TabsTabIcon` isn't wrapped; no demo uses tab icons. Under 6x CPU throttle the indicator paints about 0.8s late before hydration on both builds, so Base UI's `renderBeforeHydration` bought nothing |
| 2026-11-14 | Scroll Area | ui-sdk writes its own `scroll-area` slot over `code-block-content` and `table-container`. The focus rings in `base.css` now read `[data-slot="code-block"] > [data-slot="scroll-area"]` and `[data-slot="scroll-area"]` |
| 2026-11-14 | Scroll Area | With no Scrollbar part ui-sdk keeps the browser's scrollbars, so `scrollbar="none"` adds `scrollbar-width: none` |
| 2026-11-14 | Scroll Area | `scrollHideDelay` is 0, so leaving hides the bar at once, as before. A bar shown by scrolling fades by about 400ms, where Base UI held it about 800ms (measured) |
| 2026-11-14 | Scroll Area | A viewport that holds a link or control is no longer a tab stop: the docs sidebar, suggestions and data tables. Keyboard reach is unchanged, with 76 of 76 sidebar links and 184 of 184 table controls. `docs/design/components.md` says so |
| 2026-11-14 | Scroll Area | Known regression, shipped on the advisor's call. ui-sdk counts overflow in whole pixels, so a viewport that overflows by under a pixel gets no `tabindex`, while Chromium makes it a keyboard-focusable scroller. A Tab sweep of the docs found 12 phantom stops in 946 page-widths at a 16px root and 8 in 258 at 17px; Base UI had none. A `test.fails` pins it. A CSS workaround (`overflow: hidden` on viewports that don't overflow) was tried and dropped, since it locked content that grows after hydration. An upstream issue that asks for `tabindex="-1"` when the viewport can't scroll is drafted, not filed |
| 2026-11-14 | Scroll Area | Every scroll area shows in the agent `snapshot()` as an unnamed `scroll-area` unless its root has an `aria-label`. A `test.fails` pins it |
| 2026-11-14 | Scroll Area | Without `DirectionProvider`, thumbs follow `dir`; Base UI shrank an RTL thumb. Code Block drops the provider and keeps `dir="ltr"` |
| 2026-11-14 | Scroll Area | `ScrollAreaContent` isn't used: its `min-width: fit-content` would cut Code Block's line highlights short |
| 2026-11-14 | Scroll Area | Bars that don't overflow, and the corner, stay mounted with an inline `display: none`, so every page's server HTML grows. Bars on both axes now stop short of the corner |
| 2026-11-14 | Avatar | Server markup now holds the photo as a hidden `<img>` (inline hide, `aria-hidden`) plus a hoisted `<link rel="preload" as="image">` for each photo; Base UI rendered no image until it loaded. Clearing ui-sdk's inline hide starts the existing 300ms fade, so the `[data-starting-style]` rule is gone |
| 2026-11-14 | Avatar | A broken photo stays in the DOM, hidden, beside the fallback, and every part carries `data-loading-status`. The fallback unmounts on load, as before |
| 2026-11-14 | Avatar | Citation's logo carries `data-slot="avatar"`, so Badge's leading-avatar padding rule matches it. Pixels are unchanged; screenshots prove it, and no test does |
| 2026-11-14 | Avatar | An avatar shows in `snapshot()` named by its image's `alt`. A fallback-only avatar, as in the Fallback demo, has no name. Citation's logos stay out, since they're `aria-hidden` |
| 2026-11-14 | Avatar | In tests, a fallback `delay` needs `vi.advanceTimersByTimeAsync` inside `act` |
| 2026-11-14 | Meter | Slots keep their names, and `meter-ring` stays ours. The root gains `--meter-value`, and the label loses `role="presentation"`. Base UI's hidden `x` span is gone; it caused a diff too faint to see (12/20px) in the open Model Picker |
| 2026-11-14 | Meter | Custom text moves from `MeterValue` children and `getAriaValueText` to `format`, so screen readers hear the shown text ("7 of 10", "None yet") instead of a percent. The demos and Model Picker's ratings changed; the visible text didn't |
| 2026-11-14 | Meter | The ring reads `percent` from the root's render state instead of our `percentOf`. It can't use `--meter-value`, a percentage, since `stroke-dasharray` on a `pathLength` circle needs a plain number |
| 2026-11-14 | Meter | A meter shows in `snapshot()` as `meter` with its label, value, min and max, and no actions |
| 2026-11-14 | Meter | Pre-existing on `main`: with `max <= min` the ring drew full while the value disagreed. Filed as [#35](https://github.com/aayushbtw/constella/issues/35). On ui-sdk both come from one computation |
| 2026-11-14 | Progress | Slots and state attributes (`data-indeterminate`, `data-progressing`, `data-complete`) match Base UI's, so no reader changed. The root gains `--progress-value`. The indicator loses Base UI's inline `height: inherit` and its hidden `x` span, which Chromium exposed as a stray "x" text node under every bar |
| 2026-11-14 | Progress | ui-sdk 0.1.0-beta.1's `ProgressValue` sets no `aria-hidden`, though its docs say the value is hidden. Chromium exposes its text under the progressbar, so ours adds `aria-hidden` until ui-sdk hides it. `MeterValue` gets the same |
| 2026-11-14 | Progress | Custom text goes through `format`, which writes both the visible value and `aria-valuetext`. The port fixed [#38](https://github.com/aayushbtw/constella/issues/38), where the Uploads demo showed MB and screen readers heard a percent, as Textarea did #31. `ProgressValue`'s function child gets `(state)`. `value` is optional, and leaving it out means indeterminate. An indeterminate bar loses Base UI's `aria-valuetext="indeterminate progress"` |
| 2026-11-14 | Separator | ui-sdk owns `data-slot`, so `ButtonGroupSeparator`, `ItemSeparator` and `SidebarSeparator` lost `button-group-separator`, `item-separator` and `sidebar-separator` and carry `separator`. The group joins (`styles.ts` `joined`) and Item Group's gap read `[data-slot='separator']`. The joins' selector change renames two classes on every joinable part in the built CSS; demos are pixel-identical before and after, light and dark |
| 2026-11-14 | Separator | Same markup as Base UI's (`div`, `role="separator"`, `aria-orientation`, `data-orientation`). New `decorative` prop gives `role="none"`; no Constella part sets it yet. A separator never shows in the agent `snapshot()` |
| 2026-11-14 | Toggle | Base UI and ui-sdk both mark a pressed toggle `data-pressed`, so `stateStyles.selectedFill`, Segmented Control and Chart Legend need no second selector while Toggle Group stays on Base UI. The markup loses Base UI's `tabindex="0"`, and a disabled toggle adds `aria-disabled="true"` beside `disabled` |
| 2026-11-14 | Toggle | A lone disabled toggle stays natively `disabled`, so Button's `:disabled` styles still match. With `focusableWhenDisabled` it carries only `aria-disabled` and `data-disabled`, which those styles miss until Button's port reads `[data-disabled]`. No demo uses it |
| 2026-11-14 | Toggle | `ToggleIcon` (hides its icon, `mirror` flips it right to left, sets `data-has-icon`) isn't wrapped; our demos mark their icons `aria-hidden` themselves. Decide with Toggle Group |
| 2026-11-14 | Button | ui-sdk's Button writes `data-slot="button"` over a passed slot, and inside a ui-sdk trigger the innermost part's slot wins. Every part built on Button and every trigger rendered as one would have become `button`, breaking Sidebar's `[data-slot='sidebar-trigger']:hover *` and Dialog and Sheet's `:has(> [data-slot='dialog-close-button'])`. Our Button renders a passed slot back over it through a `render` function (`renderElement`, composing a caller's `render`). The agent bridge doesn't read slots: these still show as `button` in `snapshot()`. Drop the function if ui-sdk lets the outer part's slot win |
| 2026-11-14 | Button | Base UI triggers rendered as our Button now also register with the agent bridge as `button` with `press` |
| 2026-11-14 | Button | Server markup for a disabled Button carries `aria-disabled="true"` beside `disabled`, since ui-sdk can't tell the element kind before mount; the client doesn't set it. 16 prerendered buttons gain it. Every `render={<a />}` gets `type="button"` on the server but not on the client, an attribute mismatch at hydration (the As Link demo shows it); a disabled one also gets `disabled`. ui-sdk's docs say `type` is ignored on other elements; worth an upstream report |
| 2026-11-14 | Button | Base UI added `tabindex="0"` to every Button; ui-sdk leaves a native button's focus to the browser. 1,254 prerendered buttons lose the attribute |
| 2026-11-14 | Button | ui-sdk marks `focusableWhenDisabled` and a disabled link with `data-disabled` and `aria-disabled`, not `:disabled`, and a running Promise from `onClick` with `data-pending`, `aria-busy` and `aria-disabled`, never `:disabled`. Button's fade, hover and press, and `stateStyles`' hover, now read `:disabled`, `[data-disabled]` and `[data-pending]`; a pending press looks loading, like `aria-busy` with `disabled`, and its cursor comes from `aria-busy`. `:disabled` stays for `buttonStyles` on elements that aren't Buttons (Toggle, Questionnaire's nav), and `aria-busy` for callers that mark their own work. Toggle's `selectable` guards still read `:disabled` only, which Base UI Toggle also sets |
| 2026-11-14 | Button | Not adopted yet: a Promise-pending press has no way to swap its content (ui-sdk's `data-show="idle\|pending"` pattern), and the Saving, showcase and Approval demos still hand-roll `aria-busy` with `useState` timers. Adopt both when a caller first returns a Promise from `onClick`; until then the docs don't advertise it |
| 2026-11-14 | Field | Field, Checkbox, Switch, Radio Group, Input Group and Textarea port together. A ui-sdk control in a Base UI `Field` joined nothing (no name, description, `disabled` or `invalid`), and the reverse held for Base UI's controls, so any one alone needed a bridge in the Field demos |
| 2026-11-14 | Field | Base UI's Select and Slider still sit in Fields (Field, Input and Select demos). ui-sdk's Field binds a control it finds in the DOM after mount, so they worked in the browser without help, but the server's HTML had the label's `for` on an id no element had. Each calls ui-sdk's documented `useFieldControl` (`select.tsx`, `slider.tsx`) until its row ports; `field-mixed.test.tsx` checks name, description, `disabled` and `invalid`, and the server's `for`. Base UI's Field described each Slider thumb's input as well as the group; `Slider` hands the field's `aria-describedby` to every thumb through a context, after the thumb's own, so server and client HTML match the Base UI build |
| 2026-11-14 | Field | Pressing a `FieldLabel` opens a Select in a Field, before and after: its `for` points at the trigger, a button, and a label click activates a button. Not changed by the port |
| 2026-11-14 | Field | ui-sdk's `FieldLegend` is a native `<legend>`, outside the set's flex flow, so the set's `gap` no longer spaced it from what follows; the legend takes `marginBlockEnd: space.sm`. Base UI's legend was a `div`. 192 demo shots on 11 pages match Base UI's pixel for pixel, light and dark, after the fix |
| 2026-11-14 | Field | The legend names the `fieldset`, not a radio group inside it, and the agent bridge then names the group after its first radio. The Field and Radio Group fieldset demos point the group at the legend with `aria-labelledby`, as ui-sdk's Radio docs do |
| 2026-11-14 | Field | ui-sdk writes the field's control id into the label's `for`, so `FieldLabel` no longer takes `htmlFor`: a silently ignored prop is a trap. A control with its own `id` kept it, and the server's `for` missed until hydration; Card's and Sheet's demos and the Card and Label docs dropped their explicit ids and let the `Field` generate them |
| 2026-11-14 | Textarea | Pre-existing on `main`: Textarea grew only through CSS `field-sizing: content`, which Firefox lacks, though the docs said it grows with its content. Filed as [#31](https://github.com/aayushbtw/constella/issues/31) and fixed here, not on `main`, since ui-sdk's `autoResize` replaces what would be throwaway code. `Textarea` always passes `autoResize` (not a prop of ours) and keeps `fieldSizing: "content"`. Where the browser lacks `field-sizing`, ui-sdk's fallback rewrites the inline `height` on each change, so a manual resize drag resets on the next keystroke |
| 2026-11-14 | Input Group | ui-sdk owns `data-slot`, so the control is `input` (inside `input-group-input`) or `textarea`, not `input-group-control`. The group's ring, invalid edge and fade (`input-group.tsx` `control`, `base.css`, Prompt Input's invalid edge) read those, plus `input-group-control`, which a custom control still carries by hand. Command and Dropdown Menu render our Input from Base UI's autocomplete and menu inputs; typing, filtering and arrow keys work as before |
| 2026-11-14 | Radio Group | Slots are `radio` and `radio-indicator`, not `radio-group-item` and `radio-group-indicator`; nothing read the old names. The radio is a `<button>`, disabled natively. The dot's pop and its keyboard skip match Base UI's frame for frame |
| 2026-11-14 | Switch | Checkbox and Switch drop the Base UI field bridge their solo ports needed. A note from Switch's solo port said Base UI exports no field context; it does (`internals/field-root-context`, `internals/labelable-provider` in 1.9.0), and we chose not to use it |
| 2026-11-14 | Checkbox | Base UI's `indeterminate` prop is gone: ui-sdk takes `checked="indeterminate"`, and `onCheckedChange` gets `true`, `false` or `"indeterminate"` (a press only ever reports a boolean). Callers narrow with `checked === true`, since `strict-boolean-expressions` rejects the union. Data Table's select-all and the docs demos changed |
| 2026-11-14 | Checkbox | The root is a `<button type="button">`, not Base UI's `<span>`, and disabled is native `disabled` (Base UI used `tabindex="-1"`). The hidden input carries `data-slot="checkbox-input"` and sits `position: absolute`, not `fixed`. State attributes (`data-checked`, `data-unchecked`, `data-indeterminate`, `data-disabled`) keep Base UI's names, so no reader changed |
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
| 2026-11-14 | #30 merged: Toggle on ui-sdk. Both libraries emit `data-pressed`, so no bridge |
| 2026-11-14 | #27 merged: Button on ui-sdk. Button re-applies a passed `data-slot`, the one sanctioned exception; disabled and pending styles read ui-sdk's `data-disabled` and `data-pending` |
| 2026-11-14 | Filed #31 (Textarea didn't grow without field-sizing) and #32 (CopyButton drops the clipboard Promise), found by reviews; #31 fixed in #28 with ui-sdk's autoResize, #32 open on `main` |
| 2026-11-14 | #28 merged: Field, Checkbox, Switch, Radio Group, Input Group and Textarea on ui-sdk as one unit, since a ui-sdk control in a Base UI Field loses its wiring. Select and Slider use ui-sdk's `useFieldControl` until their rows. Phase 2 so far: Button, Separator, Toggle and the Field unit merged |
| 2026-11-14 | The rest of phase 2 ran as parallel unit PRs, each with an independent reuse review and verifier: #33 Progress, #34 Meter, #36 Avatar, #37 Scroll Area, #41 Tabs, #42 Loading Bar and #40 Collapsible merged. Verifiers failed Progress once (value text exposed twice), Scroll Area twice (a phantom Tab stop, then a workaround that locked late-growing content) and Collapsible once (empty frames under reduced motion). Each was fixed before merge. Filed #35, #38 (fixed in #33) and #39 |
| 2026-11-14 | Phase 2 done except Slider, which waits on Tooltip (phase 3). Open on `main`: #32, #35 and #39. Upstream drafts not filed: the scroll area sub-pixel Tab stop, the Tabs `preventScroll` docs, and the Progress and Meter value `aria-hidden` docs |
