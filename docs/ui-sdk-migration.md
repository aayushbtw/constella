# ui-sdk migration

The tracker for moving `packages/ui` from Base UI to ui-sdk. Read it first in any session that touches the port; update it in the same PR as the work. Why we're moving and what's known about ui-sdk live in [ARCHITECTURE.md, UI SDK watch](ARCHITECTURE.md#ui-sdk-watch).

## Branches and PRs

| What | Rule |
| --- | --- |
| Integration branch | `ui-sdk`, long-lived. Lands on `main` once, when [Done](#done) holds. Draft PR `ui-sdk` → `main` shows the whole diff |
| Unit branch | `ui-sdk/<unit>` off `ui-sdk`, one row of the tracker (or one phase-0 task) per branch |
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
| `ui-sdk` first in `useCSSLayers.before`; `@layer ui-sdk;` in the site's global CSS | todo | | |
| `useRender`/`mergeProps` to `renderElement`/`mergeProps` from `@ui-sdk/react/primitive` | todo | | 22 files: alert, badge, breadcrumb, button-group, card, empty, field, input-group, item, kbd, sidebar, textarea, the 5 typography parts, attachment, code-block, marker, model-picker, shimmer |
| Vitest, jsdom stubs and `__UI_SDK_STRICT__` per the skill's `testing.md` | todo | | |

### Phases 1 to 5

| Unit | Phase | Base UI parts | ui-sdk | Status | PR | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Popover | 1 | popover | Popover | todo | | The spike |
| Button | 2 | button | Button | todo | | |
| Separator | 2 | separator | Separator | todo | | |
| Toggle | 2 | toggle | Toggle | todo | | |
| Checkbox | 2 | checkbox | Checkbox | todo | | |
| Switch | 2 | switch | Switch | todo | | |
| Radio Group | 2 | radio-group, radio | Radio | todo | | |
| Progress | 2 | progress | Progress | todo | | |
| Meter | 2 | meter | Meter | todo | | |
| Slider | 2 | slider | Slider | todo | | Needs Tooltip for its demo; port after Tooltip or keep the demo on hold |
| Avatar | 2 | avatar | Avatar | todo | | Citation uses it too |
| Field | 2 | field, fieldset | Field | todo | | No Fieldset documented; check |
| Input Group | 2 | input | Input | todo | | |
| Textarea | 2 | field | Textarea | todo | | |
| Scroll Area | 2 | scroll-area | Scroll Area | todo | | |
| Collapsible | 2 | collapsible | Collapsible | todo | | |
| Tabs | 2 | tabs | Tabs | todo | | |
| Tooltip | 3 | tooltip | Tooltip | todo | | |
| Hover Card | 3 | preview-card | Hover Card | todo | | |
| Dialog | 3 | dialog | Dialog | todo | | |
| Sheet | 3 | dialog | Drawer | todo | | Or Dialog with `presentation="sheet"`; decide in the PR |
| Side Panel | 3 | dialog | Drawer | todo | | |
| Alert Dialog | 3 | alert-dialog | Alert Dialog | todo | | Consider `createConfirm()` |
| Toast | 3 | toast | Toast | todo | | No anchored toasts; region placement is ours without `web.css` |
| Select | 4 | select | Select | todo | | |
| Dropdown Menu | 4 | menu | Menu | todo | | No search input part documented; ours ships `dropdown-menu-input` |
| Command | 4 | autocomplete | Command | todo | | Ours is Base UI Autocomplete; ui-sdk ships a Command |
| Toggle Group | 4 | toggle-group, toggle | Toolbar? | todo | | No Toggle Group documented; check |
| Segmented Control | 4 | toggle-group, toggle | Segmented Control | todo | | |
| Model Picker | 5 | popover, render helpers | | todo | | After Popover, Command |
| Prompt Input | 5 | autocomplete | | todo | | After Command |
| Citation | 5 | avatar | | todo | | After Avatar, Hover Card |
| Settings Dialog | 5 | via Dialog | | todo | | Re-verify only |
| Sidebar | 5 | via Sheet, render helpers | | todo | | Re-verify only |

### Phase 6

| Unit | Status | PR | Notes |
| --- | --- | --- | --- |
| Agent bridge on the docs site (dev only) | todo | | `createAgent` in the client entry |
| `definePrimitive` with `agent` key: Prompt Input, Attachment, Approval, Questionnaire | todo | | Split per part when started |
| `definePrimitive` with `agent` key: Data Table, Chart | todo | | |

### Phase 7

| Task | Status | PR |
| --- | --- | --- |
| Remove `@base-ui/react` from `packages/ui` and `apps/site` | todo | |
| Rewrite Base UI mentions in ARCHITECTURE.md, DESIGN.md, `docs/design/*` | todo | |
| Registry build and every docs page checked | todo | |
| Land `ui-sdk` on `main` | todo | |

## Done

The port lands on `main` when every row is `merged`, the ARCHITECTURE.md "Ready when" table is met, and no `@base-ui/react` import is left.

## Findings

Gaps and surprises found while porting, newest first. Move a settled one into ARCHITECTURE.md.

| Date | Unit | Finding |
| --- | --- | --- |

## Log

| Date | Event |
| --- | --- |
| 2026-11-14 | `ui-sdk` branch created; 0.1.0-beta.1 and the `ui-sdk` skill installed; tracker written |
