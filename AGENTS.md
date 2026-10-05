<!-- intent-skills:start -->

## Skill Loading

Before editing files for a substantial task:

- Run `vp dlx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `vp dlx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.

<!-- intent-skills:end -->

## Motion skills

Load these from `.agents/skills/` at these points, every time:

- **Writing or changing any transition, keyframe or `:active`/hover motion:** `emil-design-eng`. Add `apple-design` when it's a gesture, drag, sheet or spring.
- **A component is done, before committing:** `find-animation-opportunities` on it, then apply what fits `DESIGN.md`.
- **Motion across several components:** `improve-animations` for the audit.
- **The user describes an effect without naming it:** `animation-vocabulary` to get the term before building.

## Comments

`DESIGN.md` holds the _why_. A comment that repeats it, or needs a paragraph, is a `DESIGN.md` edit instead.
