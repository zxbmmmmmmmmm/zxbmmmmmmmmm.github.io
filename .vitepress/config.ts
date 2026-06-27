import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { vsLight, vsDark } from './shiki-themes'
import { light, dark } from './theme/shared/colors'

const scrollableMermaidDiagram = { useMaxWidth: false }

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: "Betta_Fish",
  description: "Betta_Fish's Blog",
  ignoreDeadLinks: ['./692041'],
  mermaid: {
    architecture: scrollableMermaidDiagram,
    block: scrollableMermaidDiagram,
    c4: scrollableMermaidDiagram,
    class: scrollableMermaidDiagram,
    er: scrollableMermaidDiagram,
    eventmodeling: scrollableMermaidDiagram,
    flowchart: scrollableMermaidDiagram,
    gantt: scrollableMermaidDiagram,
    gitGraph: scrollableMermaidDiagram,
    ishikawa: scrollableMermaidDiagram,
    journey: scrollableMermaidDiagram,
    kanban: scrollableMermaidDiagram,
    mindmap: scrollableMermaidDiagram,
    packet: scrollableMermaidDiagram,
    pie: scrollableMermaidDiagram,
    quadrantChart: scrollableMermaidDiagram,
    requirement: scrollableMermaidDiagram,
    sankey: scrollableMermaidDiagram,
    sequence: scrollableMermaidDiagram,
    state: scrollableMermaidDiagram,
    timeline: scrollableMermaidDiagram,
    xyChart: scrollableMermaidDiagram
  },
  vite: {
    plugins: [copyPostAssets(), generateGiscusThemes()],
    optimizeDeps: {
      include: ['mermaid']
    }
  },
  markdown: {
    theme: {
      light: vsLight,
      dark: vsDark
    },
    languageAlias: { 'xaml': 'xml' },
    config(md) {
      md.core.ruler.after('inline', 'post-local-assets', (state) => {
        const env = state.env as { path?: string; relativePath?: string }
        if (!env.path || !env.relativePath?.startsWith('posts/')) return

        const postDir = dirname(env.path)
        const rewrite = (url: string) => {
          if (!isPostAssetPath(url)) return url

          const pathnameEnd = url.search(/[?#]/)
          const pathname = pathnameEnd >= 0 ? url.slice(0, pathnameEnd) : url
          const suffix = pathnameEnd >= 0 ? url.slice(pathnameEnd) : ''
          const fileName = decodeURIComponent(pathname.slice(1))
          const filePath = join(postDir, fileName)

          return existsSync(filePath)
            ? `/${encodeUrlPath(env.relativePath!.replace(/\/index\.md$/, ''))}/${encodeURIComponent(fileName)}${suffix}`
            : url
        }

        for (const token of state.tokens) {
          rewriteAssetAttributes(token, rewrite)

          if (token.children) {
            for (const child of token.children) {
              rewriteAssetAttributes(child, rewrite)
            }
          }
        }
      })
    }
  }
}))

function rewriteAssetAttributes(
  token: { attrs: [string, string][] | null; content?: string },
  rewrite: (url: string) => string
) {
  for (const attrName of ['src', 'poster']) {
    const attr = token.attrs?.find(([name]) => name === attrName)
    if (!attr) continue

    const rewritten = rewrite(attr[1])
    if (rewritten !== attr[1]) {
      attr[0] = `:${attrName}`
      attr[1] = JSON.stringify(rewritten)
    }
  }

  if (typeof token.content === 'string') {
    token.content = token.content.replace(
      /\b(src|poster)=(["'])(\/[^"']+)\2/g,
      (match, attrName, quote, url) => {
        const rewritten = rewrite(url)
        return rewritten === url
          ? match
          : `:${attrName}='${JSON.stringify(rewritten)}'`
      }
    )
  }
}

function isPostAssetPath(url: string): boolean {
  return /^\/(?!\/)[^?#]+\.(?:apng|avif|bmp|gif|ico|jpe?g|png|svg|tiff?|webp|mp4|m4v|mov|webm|ogv|mp3|m4a|ogg|oga|wav|aac|flac|vtt|pdf)(?:[?#].*)?$/i.test(
    url
  )
}

function copyPostAssets() {
  const mediaFileRE =
    /\.(?:apng|avif|bmp|gif|ico|jpe?g|png|svg|tiff?|webp|mp4|m4v|mov|webm|ogv|mp3|m4a|ogg|oga|wav|aac|flac|vtt|pdf)$/i

  return {
    name: 'copy-post-assets',
    closeBundle() {
      const srcDir = process.cwd()
      const outDir = join(srcDir, '.vitepress', 'dist')

      for (const subDir of ['posts', 'projects']) {
        const dir = join(srcDir, subDir)
        if (!existsSync(dir)) continue
        for (const file of getPostAssetFiles(dir, mediaFileRE)) {
          const target = join(outDir, relative(srcDir, file))
          mkdirSync(dirname(target), { recursive: true })
          copyFileSync(file, target)
        }
      }
    }
  }
}

function getPostAssetFiles(dir: string, mediaFileRE: RegExp): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    const stat = statSync(path)

    if (stat.isDirectory()) return getPostAssetFiles(path, mediaFileRE)
    return mediaFileRE.test(name) ? [path] : []
  })
}

function encodeUrlPath(path: string): string {
  return path
    .split(/[\\/]+/)
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

type Metro = typeof light

function giscusThemeCss(c: Metro, isDark: boolean): string {
  const a40        = c.accent + '40'
  const a00        = c.accent + '00'
  const a99        = c.accent + '99'
  const neutral    = isDark ? '#ffffff26' : '#00000026'
  const hoverBg    = isDark ? '#ffffff10' : '#00000010'
  const ctrlBg     = isDark ? '#ffffff15' : '#00000015'
  const btnBg      = isDark ? c.bgSubtle : c.bgCard
  const btnBorder  = isDark ? '#444444'   : c.border
  const btnHover   = isDark ? '#3d3d3d'   : c.bgPage
  const btnHoverBd = isDark ? '#555555'   : c.textFaint
  const btnActive  = isDark ? '#666666'   : c.textMuted
  const errText    = isDark ? c.text      : '#ffffff'
  const errBg      = isDark ? '#93000a'   : '#ba1a1a'
  const insAdded   = isDark ? '#1b4721'   : '#e8f5e9'
  const chgBg      = isDark ? '#3d2700'   : '#fff3e0'
  const attSubtle  = isDark ? '#3d2700'   : '#fff3e0'
  const ignoredBg  = isDark ? c.bgElevated : c.bgPage
  const successFg  = isDark ? '#81c784'   : '#2e7d32'
  const attFg      = isDark ? '#ffcc80'   : '#f57f17'
  const dangerFg   = isDark ? '#ffb4ab'   : '#ba1a1a'
  const dangerSubtle = isDark ? '#93000a' : '#ffdad6'
  const kwFg       = isDark ? '#ef9a9a'   : '#ba1a1a'
  const strFg      = isDark ? '#80cbc4'   : '#0277bd'
  const varFg      = isDark ? '#ffcc80'   : '#f57f17'
  const constFg    = isDark ? '#4dd0e1'   : c.accent
  const entityFg   = isDark ? '#c3c4eb'   : '#5a5d7e'
  const commentFg  = isDark ? c.textMuted : c.textMuted
  const loader     = isDark
    ? 'url(https://github.githubassets.com/images/mona-loading-dimmed.gif)'
    : 'url(https://github.githubassets.com/images/mona-loading-default.gif)'
  const pagination = isDark
    ? 'url(https://github.com/images/modules/pulls/progressive-disclosure-line-dark.svg)'
    : 'url(https://github.com/images/modules/pulls/progressive-disclosure-line.svg)'

  return `main {
  --color-canvas-default: ${c.bgCard};
  --color-canvas-overlay: ${c.bgElevated};
  --color-canvas-inset: ${c.bgSunken};
  --color-canvas-subtle: ${c.bgSubtle};
  --color-fg-default: ${c.text};
  --color-fg-muted: ${c.textMuted};
  --color-fg-subtle: ${c.textFaint};
  --color-border-default: ${c.border};
  --color-border-muted: ${c.divider};
  --color-neutral-muted: ${neutral};
  --color-accent-fg: ${c.accent};
  --color-accent-emphasis: ${c.accent};
  --color-accent-muted: ${a40};
  --color-accent-subtle: ${c.accentTint};
  --color-success-fg: ${successFg};
  --color-attention-fg: ${attFg};
  --color-attention-muted: ${attFg}40;
  --color-attention-subtle: ${attSubtle};
  --color-danger-fg: ${dangerFg};
  --color-danger-muted: ${dangerFg}40;
  --color-danger-subtle: ${dangerSubtle};
  --color-primer-shadow-inset: 0 0 #0000;
  --color-btn-text: ${c.text};
  --color-btn-bg: ${btnBg};
  --color-btn-border: ${btnBorder};
  --color-btn-shadow: 0 0 #0000;
  --color-btn-inset-shadow: 0 0 #0000;
  --color-btn-hover-bg: ${btnHover};
  --color-btn-hover-border: ${btnHoverBd};
  --color-btn-active-bg: ${c.bgElevated};
  --color-btn-active-border: ${btnActive};
  --color-btn-selected-bg: ${isDark ? c.bgCard : c.bgSubtle};
  --color-btn-primary-text: #ffffff;
  --color-btn-primary-bg: ${c.accent};
  --color-btn-primary-border: ${a00};
  --color-btn-primary-shadow: 0 0 #0000;
  --color-btn-primary-inset-shadow: 0 0 #0000;
  --color-btn-primary-hover-bg: ${c.accentHover};
  --color-btn-primary-hover-border: ${a00};
  --color-btn-primary-selected-bg: ${c.accent};
  --color-btn-primary-selected-shadow: 0 0 #0000;
  --color-btn-primary-disabled-text: #ffffff80;
  --color-btn-primary-disabled-bg: ${a99};
  --color-btn-primary-disabled-border: ${a00};
  --color-action-list-item-default-hover-bg: ${hoverBg};
  --color-segmented-control-bg: ${ctrlBg};
  --color-segmented-control-button-bg: ${btnBg};
  --color-segmented-control-button-selected-border: ${c.textFaint};
  --color-prettylights-syntax-comment: ${commentFg};
  --color-prettylights-syntax-constant: ${constFg};
  --color-prettylights-syntax-entity: ${entityFg};
  --color-prettylights-syntax-storage-modifier-import: ${c.text};
  --color-prettylights-syntax-entity-tag: ${successFg};
  --color-prettylights-syntax-keyword: ${kwFg};
  --color-prettylights-syntax-string: ${strFg};
  --color-prettylights-syntax-variable: ${varFg};
  --color-prettylights-syntax-brackethighlighter-unmatched: ${dangerFg};
  --color-prettylights-syntax-invalid-illegal-text: ${errText};
  --color-prettylights-syntax-invalid-illegal-bg: ${errBg};
  --color-prettylights-syntax-carriage-return-text: ${errText};
  --color-prettylights-syntax-carriage-return-bg: ${errBg};
  --color-prettylights-syntax-string-regexp: ${successFg};
  --color-prettylights-syntax-markup-list: ${varFg};
  --color-prettylights-syntax-markup-heading: ${constFg};
  --color-prettylights-syntax-markup-italic: ${c.text};
  --color-prettylights-syntax-markup-bold: ${c.text};
  --color-prettylights-syntax-markup-deleted-text: ${dangerFg};
  --color-prettylights-syntax-markup-deleted-bg: ${dangerSubtle};
  --color-prettylights-syntax-markup-inserted-text: ${successFg};
  --color-prettylights-syntax-markup-inserted-bg: ${insAdded};
  --color-prettylights-syntax-markup-changed-text: ${varFg};
  --color-prettylights-syntax-markup-changed-bg: ${chgBg};
  --color-prettylights-syntax-markup-ignored-text: ${c.textFaint};
  --color-prettylights-syntax-markup-ignored-bg: ${ignoredBg};
  --color-prettylights-syntax-meta-diff-range: ${entityFg};
  --color-prettylights-syntax-brackethighlighter-angle: ${c.textFaint};
  --color-prettylights-syntax-sublimelinter-gutter-mark: ${c.border};
  --color-prettylights-syntax-constant-other-reference-link: ${strFg};
  --color-social-reaction-bg-hover: ${isDark ? c.bgSubtle : c.bgPage};
  --color-social-reaction-bg-reacted-hover: ${c.accentTint};
  --color-scale-gray-7: ${isDark ? c.bgSubtle : c.divider};
  --color-scale-blue-8: ${c.accentTint};
}
main .pagination-loader-container { background-image: ${pagination}; }
main .gsc-loading-image { background-image: ${loader}; }
.gsc-reactions-count { display: none; }
.gsc-timeline { flex-direction: column-reverse; }
.gsc-header { padding-bottom: 1rem; }
.gsc-comments > .gsc-header { order: 1; }
.gsc-comments > .gsc-comment-box { margin-bottom: 1rem; order: 2; }
.gsc-comments > .gsc-timeline { order: 3; }
.gsc-homepage-bg { background-color: ${c.bgPage}; }
`
}

function generateGiscusThemes() {
  const write = () => {
    const pub = join(process.cwd(), 'public')
    mkdirSync(pub, { recursive: true })
    writeFileSync(join(pub, 'giscus-metro-light.css'), giscusThemeCss(light, false))
    writeFileSync(join(pub, 'giscus-metro-dark.css'),  giscusThemeCss(dark,  true))
  }
  return { name: 'generate-giscus-themes', buildStart: write, configureServer: write }
}
