# Constella

Constella is a React component registry for the shadcn CLI. It uses [ui-sdk](https://ui-sdk.dev) for behavior and [StyleX](https://stylexjs.com) for styling. Components omit `className` and `style` props and accept StyleX overrides through an `sx` prop instead.

[Docs](https://constella.aayush.cv) · [Installation](https://constella.aayush.cv/docs/installation) · [Components](https://constella.aayush.cv/docs/components) · [Agents](https://constella.aayush.cv/docs/agents)

## Quick start

Add the `@constella` registry to `components.json`:

```json
{
  "registries": {
    "@constella": "https://constella.aayush.cv/r/{name}.json"
  }
}
```

Do not run `shadcn init`, because it configures Tailwind CSS. Add a component with the shadcn CLI:

```bash
npx shadcn@latest add @constella/button
```

The CLI also installs StyleX and writes `lib/constella` on the first run. Follow a framework guide to configure the StyleX compiler and base stylesheet:

- [Next.js installation guide](https://constella.aayush.cv/docs/installation/next)
- [TanStack Start installation guide](https://constella.aayush.cv/docs/installation/tanstack-start)

## Styling and constraints

Constella enforces styling constraints in TypeScript types.

- Components omit `className` and `style` from their prop types. Callers cannot pass arbitrary CSS classes or inline styles from outside.
- Components accept a StyleX object through the `sx` prop. Each component passes `sx` last to `stylex.props`, so caller styles override internal defaults. The `Sx` type restricts color, space, radius, shadow, font size, layer, and motion properties to named tokens from `tokens.stylex.ts`.
- Variant and size props use closed `as const` union types instead of open strings.

This approach follows the reasoning in [Styling Linear for the future](https://linear.app/now/styling-linear-for-the-future-stylex) and Polar's [Orbit](https://polar.sh/blog/orbit-llm-safe-design-system) post.

## Documentation

- [Installation](https://constella.aayush.cv/docs/installation) covers framework setup, fonts, dark mode, and RTL support.
- [Design system](https://constella.aayush.cv/docs/design-system) documents color roles, typography, spacing, radii, shadows, and motion tokens.
- [Theming](https://constella.aayush.cv/docs/theming) explains how to edit `theme.stylex.ts` and switch themes at runtime.
- [Agents](https://constella.aayush.cv/docs/agents) covers the agent skill, shadcn MCP setup, Markdown routes, and the ui-sdk agent bridge.
- [llms.txt](https://constella.aayush.cv/llms.txt) lists every documentation page as Markdown.

## Credits

- [Interfere design system](https://design.interfere.com)
- [@_heyrico](https://x.com/_heyrico)
- [@jakubkrehel](https://x.com/jakubkrehel)
