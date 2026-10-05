# Docs

Pages are Markdown in `apps/site/content`: guides in `docs` (served at `/docs/<slug>`), components in `components` (`/docs/components/<slug>`). Both are parsed once at build time by tomekit, so a page ships no Markdown parser. Live previews are site-only components registered in `apps/site/src/components/demos` and placed with `<!-- ::demo name="…" -->`; they never go in the registry.

A page marked `draft: true` in its frontmatter is built in dev only, labelled "Draft", until the component has had its full design pass.

## Writing a page

Pages read like shadcn's, written for someone using the component, not for us:

- **Order:** preview (one plain example), installation, usage (the import, then the smallest snippet), one section per task, API Reference.
- **Headings name a task or option** ("Size", "With Icon", "As Link"), not a design idea.
- **One or two plain sentences per section**, starting with what to do: "Use the `size` prop to…", "Add `data-icon` to…". No design reasoning; that lives in `DESIGN.md`.
- **Show a variant matrix once.** All variants in Variants, all sizes in Size; every other example shows one representative.
- **Previews:** place one with `<!-- ::demo name="…" -->`, and its code block right below it. Every code block gets a copy button; blocks of more than one line get line numbers.
- **Warn in bold** when the obvious way is wrong, and say why in one line.
- **API Reference** lists only what's added on top of Base UI and links to Base UI for the rest.
