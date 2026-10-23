# Constella

**Components, crafted with care.**

Components your LLM can't easily get wrong. shadcn-style parts on [Base UI](https://base-ui.com) and [StyleX](https://stylexjs.com), with no `className` or `style`, so an off-brand choice is hard to even write.

[Docs](https://constella.aayush.cv) · [Installation](https://constella.aayush.cv/docs/installation) · [Components](https://constella.aayush.cv/docs/components) · [For agents](https://constella.aayush.cv/docs/agents)

## Why

An LLM writes `p-5`, `bg-zinc-100` and `text-[#3b82f6]` fluently. It passes lint, renders fine and sits slightly off your system. A rule in `CLAUDE.md` makes that less likely, not impossible.

So Constella moves the rules out of prose and into types:

- **No `className` or `style`.** A part can't be restyled from outside.
- **`sx` takes tokens.** Color, space, radius, shadow, type size, layer and motion come from named roles, never raw values.
- **Variants are closed lists,** not free strings.

Two teams got there first. Polar: "make it hard to express an off-brand decision in code in the first place" ([Orbit](https://polar.sh/blog/orbit-llm-safe-design-system)). Linear: "the endless configurability became a liability" ([Styling Linear for the future](https://linear.app/now/styling-linear-for-the-future-stylex)). Constella grew out of studying both.

## Credits

- [Interfere design system](https://design.interfere.com)
- [@_heyrico](https://x.com/_heyrico)
- [@jakubkrehel](https://x.com/jakubkrehel)
