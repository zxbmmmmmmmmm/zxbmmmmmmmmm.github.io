import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync
} from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { vsLight, vsDark } from './shiki-themes'

// https://vitepress.dev/reference/site-config
export default withMermaid(defineConfig({
  title: "Betta_Fish's Blog",
  description: "Betta_Fish's Blog",
  ignoreDeadLinks: ['./692041'],
  vite: {
    plugins: [copyPostAssets()],
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
      const postsDir = join(srcDir, 'posts')
      const outDir = join(srcDir, '.vitepress', 'dist')

      if (!existsSync(postsDir)) return

      for (const file of getPostAssetFiles(postsDir, mediaFileRE)) {
        const target = join(outDir, relative(srcDir, file))
        mkdirSync(dirname(target), { recursive: true })
        copyFileSync(file, target)
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
