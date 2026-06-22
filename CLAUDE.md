# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm docs:dev      # Start dev server
pnpm docs:build    # Build static site
pnpm docs:preview  # Preview production build
```

Package manager is **pnpm**.

## Architecture

VitePress 2 blog (Vue 3 + TypeScript). All custom code lives in `.vitepress/`.

**`.vitepress/`**
- `config.ts` — VitePress config: registers the `copyPostAssets()` Vite plugin, configures Mermaid, sets up Shiki themes, and adds an XAML→XML language alias.
- `theme/index.ts` — Theme entry: registers global components (`TagsView`, `ProjectsView`, `Mermaid`) and imports global styles.
- `theme/Layout.vue` — Root layout component.
- `theme/posts.data.ts` / `projects.data.ts` — Build-time content loaders that read frontmatter and expose typed data to components.
- `theme/components/` — Vue SFCs for all UI (header, footer, post listing, tag/project views, Mermaid viewer, etc.).
- `theme/shared/` — Shared types and tag utilities.
- `shiki-themes.ts` — Custom VS Light/Dark syntax highlight themes.

**Content directories**
- `posts/[slug]/` — Each post is a folder containing `index.md` plus any media assets. Frontmatter keys: `title`, `date`, `tags` (array), `excerpt`.
- `projects/` — Project showcase pages.
- `tags/[tag].md` + `tags/[tag].paths.ts` — Dynamically generated tag pages.

## Key Custom Behaviour: `copyPostAssets()`

A custom Vite plugin in `config.ts` that:
1. Rewrites local asset references in post markdown to absolute `/posts/[slug]/[file]` paths during the Vite transform step.
2. Copies those asset files into `.vitepress/dist/posts/[slug]/` during the build close step.

Supported types: images (png, jpg, gif, svg, webp, avif, …), video (mp4, webm, mov, …), audio (mp3, ogg, wav, …), and PDF.

When adding new media types, update the extension lists in `copyPostAssets()` inside `config.ts`.
