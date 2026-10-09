<!-- intent-skills:start -->

## Skill Loading

Before editing files for a substantial task:

- Run `vp dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `vp dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->

## Where decisions live

Read the one that fits before changing things, and record new decisions in it, not in another:

- **`DESIGN.md`:** how it looks and moves. Color, surfaces, spacing, details, focus, motion.
- **`docs/ARCHITECTURE.md`:** how it's built. Stack, workspace, registry items, component API and composition, token rules, theme wiring.
- **`docs/DOCS.md`:** how to write the docs pages in `apps/site/content`.

`DESIGN.md` and `docs/ARCHITECTURE.md` are long. List their headings with `rg -n '^## ' DESIGN.md`, then `Read` only the section the task touches, with `offset` and `limit`.

## Workflow

- Review also checks: `DESIGN.md` and `docs/ARCHITECTURE.md`, and that no demo fakes a missing component.

## Dependencies first

Before building a component, list every component it and its docs examples use (read shadcn's page for it: Slider needs Label and Tooltip, Tooltip needs Kbd, Label needs Checkbox, Checkbox needs Field). If any is missing, stop and build those first, bottom-up. Never fake a missing one in a demo with a native element or hand-rolled styles.

## Motion skills

Load these from `.agents/skills/` at these points, every time:

- **Writing or changing any transition, keyframe or `:active`/hover motion:** `emil-design-eng`. Add `apple-design` when it's a gesture, drag, sheet or spring.
- **A component is done, before committing:** `find-animation-opportunities` on it, then apply what fits `DESIGN.md`.
- **Motion across several components:** `improve-animations` for the audit.
- **The user describes an effect without naming it:** `animation-vocabulary` to get the term before building.
