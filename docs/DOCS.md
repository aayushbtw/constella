# Docs

Pages are Markdown in `apps/site/content`: guides in `docs` (served at `/docs/<slug>`; a framework guide in `docs/installation/` opens from the Installation page's cards at `/docs/installation/<slug>` and stays out of the sidebar; a new one needs an entry in `apps/site/src/lib/frameworks.ts`), components in `components` (`/docs/components/<slug>`), blocks in `blocks` (`/blocks/<slug>`, with their own sidebar). A block page starts like a component's: the preview, Installation, then Usage. All three are parsed once at build time by tomekit, so a page ships no Markdown parser. Live previews are site-only components registered in `apps/site/src/components/demos` and placed with `<!-- ::demo name="…" -->`; they never go in the registry.

Every page is also Markdown for agents, at its URL plus `/index.md`, or at its URL with `Accept: text/markdown`; `/llms.txt` lists them and `/llms-full.txt` joins them. The `markdown` collection in `tomekit.config.ts` builds them from the same files with `agentMarkdown` in `src/lib/markdown.ts`: previews are dropped (the code block under each stays), `::install` becomes the shadcn command, and page links become absolute `/index.md` URLs on the production origin. A new comment component needs a rewrite there too. Each component page also becomes a `<name>-demo` registry example of its tsx snippets, one file per section, for shadcn's MCP server.

A page marked `draft: true` in its frontmatter is built in dev only, badged "Draft" in the sidebar, until the component has had its full design pass. A page whose component or demos use a draft is a draft too. A page built on a library names it in `section` (`TanStack`), which lists it under its own sidebar section instead of Components; chat parts take `section: AI`.

## Writing a page

Pages read like shadcn's, written for someone using the component, not for us:

- **Order:** preview (one plain example), installation, usage (the import, then the smallest snippet), Composition, one section per task, API Reference. Task sections run: the component's own (props, With Icon, parts), then states, then other components.
- **Headings name what you type:** a prop by its name, singular ("Size", "Variant"); a state by its attribute ("Disabled", "Invalid", "Busy"); a part by its name ("Badge", "Avatar Group Count"); another component by its name, linked in the first sentence ("Tooltip", "Dropdown Menu"). "With" only in "With Icon"; "Icon Only" for an icon with no text. No "Basic": the preview is the basic example.
- **Nest by topic:** a section's variants are h3s under it ("Badge" → "With Icon"), not h2s that repeat its name, so the outline groups them.
- **Composition** comes right after Usage on any component with more than one part.
- **Enforced:** `apps/site/src/lib/lint` checks them as each page parses, one rule per file in `rules/`, so a broken page fails dev and the build. A new rule that can be checked goes there, not only here. A new page that 404s in dev usually means the lint threw and dev shows nothing. The lint caches the component-name list at server start, so a heading that names a component created after start counts as the page's own section; restart dev.
- **Drafts track their gaps** in a `## Pending` section at the end: each line names the missing component and what it unblocks. A page leaves draft only once that section is gone.
- **Use the native term** (React, Base UI, CSS, shadcn) over a plain-English stand-in: "Controlled", not "Open from Code".
- **One or two plain sentences per section**, starting with what to do: "Use the `size` prop to…", "Add `data-icon` to…". No design reasoning; that lives in `docs/design/`.
- **Show a variant matrix once.** All variants in Variant, all sizes in Size; every other example shows one representative.
- **Previews:** place one with `<!-- ::demo name="…" -->`, and its code block right below it. Every code block gets a copy button; blocks of more than one line get line numbers.
- **Values go in a table**, not a sentence: a row per option (size, token, variant) with its values in columns.
- **Example data is generic.** People are Alex Smith, Sam Lee, Jordan Kim and Taylor Brown (`@alex`, `alex@acme.com`), or plain first names in a long list. The company is Acme and the domain `acme.com`. Use no real names, handles or companies.
- **Avatar photos are the exception.** They are shadcn, emilkowalski, evilrabbit and aayushbtw, saved by handle in `apps/site/public/avatars`, and keep their own handle. A company shows its initials. Break fixtures keep their long and non-Latin names, on `acme.com`.
- **AI providers are the exception too.** A model picker with invented providers reads as fake, so models and their logos are real (Anthropic, OpenAI, Google, DeepSeek, Mistral, xAI), saved by provider in `apps/site/public/logos`. Framework logos on the installation cards (Next.js, TanStack) are real too, saved there by name.
- **Warn in bold** when the obvious way is wrong, and say why in one line.
- **API Reference** lists only what's added on top of Base UI and links to Base UI for the rest.
