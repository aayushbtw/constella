# Docs

Pages are Markdown in `apps/site/content`: guides in `docs` (served at `/docs/<slug>`), components in `components` (`/docs/components/<slug>`). Both are parsed once at build time by tomekit, so a page ships no Markdown parser. Live previews are site-only components registered in `apps/site/src/components/demos` and placed with `<!-- ::demo name="…" -->`; they never go in the registry.

A page marked `draft: true` in its frontmatter is built in dev only, labelled "Draft", until the component has had its full design pass.

## Writing a page

Pages read like shadcn's, written for someone using the component, not for us:

- **Order:** preview (one plain example), installation, usage (the import, then the smallest snippet), Composition, one section per task, API Reference. Task sections run: the component's own (props, With Icon, parts), then states, then other components.
- **Headings name what you type:** a prop by its name, singular ("Size", "Variant"); a state by its attribute ("Disabled", "Invalid", "Busy"); a part by its name ("Badge", "Avatar Group Count"); another component by its name, linked in the first sentence ("Tooltip", "Dropdown Menu"). "With" only in "With Icon"; "Icon Only" for an icon with no text. No "Basic": the preview is the basic example.
- **Nest by topic:** a section's variants are h3s under it ("Badge" → "With Icon"), not h2s that repeat its name, so the outline groups them.
- **Composition** comes right after Usage on any component with more than one part.
- **Enforced:** `apps/site/src/lib/lint` checks them as each page parses, one rule per file in `rules/`, so a broken page fails dev and the build. A new rule that can be checked goes there, not only here. A new page that 404s in dev usually means the lint threw and dev shows nothing. The lint caches the component-name list at server start, so a heading that names a component created after start counts as the page's own section; restart dev.
- **Drafts track their gaps** in a `## Pending` section at the end: each line names the missing component and what it unblocks. A page leaves draft only once that section is gone.
- **Use the native term** (React, Base UI, CSS, shadcn) over a plain-English stand-in: "Controlled", not "Open from Code".
- **One or two plain sentences per section**, starting with what to do: "Use the `size` prop to…", "Add `data-icon` to…". No design reasoning; that lives in `DESIGN.md`.
- **Show a variant matrix once.** All variants in Variant, all sizes in Size; every other example shows one representative.
- **Previews:** place one with `<!-- ::demo name="…" -->`, and its code block right below it. Every code block gets a copy button; blocks of more than one line get line numbers.
- **Values go in a table**, not a sentence: a row per option (size, token, variant) with its values in columns.
- **Warn in bold** when the obvious way is wrong, and say why in one line.
- **API Reference** lists only what's added on top of Base UI and links to Base UI for the rest.
