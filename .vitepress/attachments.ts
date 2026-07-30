import { ZipArchive } from 'archiver'
import {
  createReadStream,
  createWriteStream,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync
} from 'node:fs'
import { pipeline } from 'node:stream/promises'
import {
  basename,
  dirname,
  isAbsolute,
  join,
  posix,
  relative,
  resolve,
  sep,
  win32
} from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import type { PageData } from 'vitepress'

export type AttachmentType = 'file' | 'zip'

export interface ResolvedAttachment {
  title: string
  description?: string
  url: string
  download: string
  type: AttachmentType
}

export interface ResolvedAttachments {
  title: string
  description?: string
  items: ResolvedAttachment[]
}

interface AttachmentRecord extends ResolvedAttachment {
  articleDir: string
  outputRelative: string
  rawPath: string
  sourcePath: string
}

interface PageRecord {
  items: AttachmentRecord[]
}

type PageDataLike = Pick<PageData, 'filePath' | 'frontmatter' | 'relativePath'>

const DEFAULT_TITLE = '附件'

export class AttachmentManager {
  private readonly pages = new Map<string, PageRecord>()
  private readonly outputs = new Map<string, AttachmentRecord>()

  private readonly root: string

  constructor(root: string = process.cwd()) {
    this.root = root
  }

  transformPageData(pageData: PageDataLike): Partial<PageData> | void {
    const pageKey = normalizeSlashes(pageData.filePath)
    this.unregisterPage(pageKey)

    if (pageData.frontmatter.attachments == null) return

    if (!/^posts\/[^/]+\/index\.md$/i.test(pageKey)) {
      throw attachmentError(
        pageKey,
        undefined,
        '只能在 posts/*/index.md 文章入口中声明附件'
      )
    }

    const raw = pageData.frontmatter.attachments
    if (!isPlainObject(raw)) {
      throw attachmentError(pageKey, undefined, 'frontmatter attachments 必须是对象')
    }

    assertOptionalString(raw.title, pageKey, 'attachments.title')
    assertOptionalString(raw.description, pageKey, 'attachments.description')

    if (!Array.isArray(raw.items) || raw.items.length === 0) {
      throw attachmentError(pageKey, undefined, 'attachments.items 必须是非空数组')
    }

    const articleFile = resolve(this.root, pageKey.split('/').join(sep))
    const articleDir = dirname(articleFile)
    const routePath = normalizeSlashes(pageData.relativePath)
    const outputDir = posix.dirname(routePath)
    const records: AttachmentRecord[] = []

    try {
      for (const [index, item] of raw.items.entries()) {
        if (!isPlainObject(item)) {
          throw attachmentError(pageKey, `items[${index}]`, '附件项必须是对象')
        }

        if (typeof item.path !== 'string' || item.path.trim() === '') {
          throw attachmentError(pageKey, `items[${index}]`, 'path 为必填的非空字符串')
        }

        const rawPath = item.path
        assertOptionalString(item.title, pageKey, rawPath, 'title')
        assertOptionalString(item.description, pageKey, rawPath, 'description')

        const sourcePath = resolveAttachmentPath(articleDir, rawPath, pageKey)
        validateAttachmentSource(articleDir, sourcePath, pageKey, rawPath)

        const sourceStat = lstatSync(sourcePath)
        const sourceName = basename(sourcePath)
        const type: AttachmentType = sourceStat.isDirectory() ? 'zip' : 'file'
        const download = type === 'zip' ? `${sourceName}.zip` : sourceName
        const outputRelative = posix.join(outputDir, download)
        const url = `/${encodeUrlPath(outputRelative)}`
        const record: AttachmentRecord = {
          articleDir,
          description: item.description as string | undefined,
          download,
          outputRelative,
          rawPath,
          sourcePath,
          title: (item.title as string | undefined) ?? sourceName,
          type,
          url
        }

        this.registerOutput(pageKey, record)
        records.push(record)
      }
    } catch (error) {
      for (const record of records) this.outputs.delete(outputKey(record.outputRelative))
      throw error
    }

    this.pages.set(pageKey, { items: records })
    const attachments: ResolvedAttachments = {
      title: (raw.title as string | undefined) ?? DEFAULT_TITLE,
      description: raw.description as string | undefined,
      items: records.map(({ title, description, url, download, type }) => ({
        title,
        description,
        url,
        download,
        type
      }))
    }

    return {
      frontmatter: {
        ...pageData.frontmatter,
        attachments
      }
    }
  }

  vitePlugin(): Plugin {
    let base = '/'

    return {
      name: 'post-attachments',
      enforce: 'pre',
      configResolved(config) {
        base = config.base
      },
      configureServer: (server) => {
        server.middlewares.use((request, response, next) => {
          void this.serve(request, response, base).then((handled) => {
            if (!handled) next()
          }, next)
        })
      }
    }
  }

  async writeAll(outDir: string): Promise<void> {
    for (const { items } of this.pages.values()) {
      for (const item of items) {
        validateAttachmentSource(
          item.articleDir,
          item.sourcePath,
          this.pageFor(item),
          item.rawPath
        )

        const target = resolve(outDir, item.outputRelative.split('/').join(sep))
        assertInside(resolve(outDir), target, this.pageFor(item), item.rawPath)
        mkdirSync(dirname(target), { recursive: true })

        if (item.type === 'zip') {
          await createZip(item.sourcePath, target, item.download)
        } else {
          await pipeline(createReadStream(item.sourcePath), createWriteStream(target))
        }
      }
    }
  }

  private async serve(
    request: IncomingMessage,
    response: ServerResponse,
    base: string
  ): Promise<boolean> {
    if (request.method !== 'GET' && request.method !== 'HEAD') return false

    const requestUrl = new URL(request.url ?? '/', 'http://vitepress.local')
    let pathname = requestUrl.pathname
    const normalizedBase = base === '/' ? '/' : `/${base.replace(/^\/+|\/+$/g, '')}/`
    if (normalizedBase !== '/') {
      if (!pathname.startsWith(normalizedBase)) return false
      pathname = `/${pathname.slice(normalizedBase.length)}`
    }

    let decodedPath: string
    try {
      decodedPath = decodeURIComponent(pathname).replace(/^\/+/, '')
    } catch {
      return false
    }

    const item = this.outputs.get(outputKey(decodedPath))
    if (!item) return false

    validateAttachmentSource(
      item.articleDir,
      item.sourcePath,
      this.pageFor(item),
      item.rawPath
    )

    response.statusCode = 200
    response.setHeader(
      'Content-Disposition',
      contentDisposition(item.download)
    )
    response.setHeader(
      'Content-Type',
      item.type === 'zip' ? 'application/zip' : 'application/octet-stream'
    )

    if (item.type === 'file') {
      response.setHeader('Content-Length', statSync(item.sourcePath).size)
    }

    if (request.method === 'HEAD') {
      response.end()
      return true
    }

    if (item.type === 'zip') {
      await streamZip(item.sourcePath, response)
    } else {
      await pipeline(createReadStream(item.sourcePath), response)
    }
    return true
  }

  private registerOutput(pageKey: string, record: AttachmentRecord): void {
    const key = outputKey(record.outputRelative)
    const conflict = this.outputs.get(key)
    if (conflict) {
      throw attachmentError(
        pageKey,
        record.rawPath,
        `输出文件名与附件 "${conflict.rawPath}" 冲突：${record.download}`
      )
    }
    this.outputs.set(key, record)
  }

  private unregisterPage(pageKey: string): void {
    const previous = this.pages.get(pageKey)
    if (!previous) return
    for (const item of previous.items) {
      this.outputs.delete(outputKey(item.outputRelative))
    }
    this.pages.delete(pageKey)
  }

  private pageFor(record: AttachmentRecord): string {
    for (const [page, pageRecord] of this.pages) {
      if (pageRecord.items.includes(record)) return page
    }
    return '<unknown page>'
  }
}

function resolveAttachmentPath(articleDir: string, rawPath: string, page: string): string {
  if (
    rawPath.includes('\0') ||
    isAbsolute(rawPath) ||
    posix.isAbsolute(rawPath) ||
    win32.isAbsolute(rawPath)
  ) {
    throw attachmentError(page, rawPath, '路径必须是文章目录内的相对路径')
  }

  const sourcePath = resolve(articleDir, rawPath.replace(/[\\/]+/g, sep))
  const relativePath = relative(articleDir, sourcePath)
  if (
    relativePath === '' ||
    relativePath === '..' ||
    relativePath.startsWith(`..${sep}`) ||
    isAbsolute(relativePath)
  ) {
    throw attachmentError(page, rawPath, '路径越出了文章目录')
  }
  return sourcePath
}

function validateAttachmentSource(
  articleDir: string,
  sourcePath: string,
  page: string,
  rawPath: string
): void {
  if (!existsSync(sourcePath)) {
    throw attachmentError(page, rawPath, '路径不存在')
  }

  let current = articleDir
  for (const segment of relative(articleDir, sourcePath).split(sep)) {
    current = join(current, segment)
    const stat = lstatSync(current)
    if (stat.isSymbolicLink()) {
      throw attachmentError(page, rawPath, `不允许符号链接：${relative(articleDir, current)}`)
    }
  }

  validateTree(sourcePath, articleDir, page, rawPath)
}

function validateTree(path: string, articleDir: string, page: string, rawPath: string): void {
  const stat = lstatSync(path)
  if (stat.isSymbolicLink()) {
    throw attachmentError(page, rawPath, `不允许符号链接：${relative(articleDir, path)}`)
  }
  if (stat.isFile()) return
  if (!stat.isDirectory()) {
    throw attachmentError(page, rawPath, `不支持的附件类型：${relative(articleDir, path)}`)
  }

  for (const entry of readdirSync(path)) {
    validateTree(join(path, entry), articleDir, page, rawPath)
  }
}

async function createZip(sourceDir: string, target: string, download: string): Promise<void> {
  const temporary = `${target}.tmp-${process.pid}`
  rmSync(temporary, { force: true })
  try {
    const output = createWriteStream(temporary)
    await streamZip(sourceDir, output)
    renameSync(temporary, target)
  } catch (error) {
    rmSync(temporary, { force: true })
    throw new Error(`生成 ZIP "${download}" 失败`, { cause: error })
  }
}

async function streamZip(sourceDir: string, output: NodeJS.WritableStream): Promise<void> {
  const archive = new ZipArchive({ zlib: { level: 9 } })
  const completed = new Promise<void>((resolvePromise, reject) => {
    output.once('close', resolvePromise)
    output.once('finish', resolvePromise)
    output.once('error', reject)
    archive.once('error', reject)
  })

  archive.pipe(output)
  archive.append('', { name: `${basename(sourceDir)}/`, type: 'directory' })
  archive.directory(sourceDir, basename(sourceDir))
  await archive.finalize()
  await completed
}

function assertOptionalString(
  value: unknown,
  page: string,
  pathOrField: string,
  field?: string
): void {
  if (value != null && typeof value !== 'string') {
    const path = field ? pathOrField : undefined
    const name = field ?? pathOrField
    throw attachmentError(page, path, `${name} 必须是字符串`)
  }
}

function assertInside(root: string, target: string, page: string, rawPath: string): void {
  const relativePath = relative(root, target)
  if (relativePath === '..' || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    throw attachmentError(page, rawPath, '输出路径越界')
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function attachmentError(page: string, path: string | undefined, message: string): Error {
  const context = path ? `${page} -> ${path}` : page
  return new Error(`[attachments] ${context}: ${message}`)
}

function normalizeSlashes(path: string): string {
  return path.replace(/\\/g, '/')
}

function outputKey(path: string): string {
  return normalizeSlashes(path).normalize('NFC').toLocaleLowerCase('en-US')
}

function encodeUrlPath(path: string): string {
  return normalizeSlashes(path)
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
}

function contentDisposition(fileName: string): string {
  const fallback = fileName
    .replace(/[^\x20-\x7e]/g, '_')
    .replace(/["\\]/g, '_')
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(fileName)}`
}
