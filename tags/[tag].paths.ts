import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { slugifyTag } from '../.vitepress/theme/shared/tags'

export default {
  paths() {
    return getTags().map((tag) => ({
      params: {
        tag: slugifyTag(tag),
        name: tag
      }
    }))
  }
}

function getTags(): string[] {
  const tags = new Set<string>()
  for (const file of getMarkdownFiles('posts')) {
    readTags(readFileSync(file, 'utf8')).forEach((tag) => tags.add(tag))
  }
  return [...tags].sort((tag1, tag2) => tag1.localeCompare(tag2))
}

function getMarkdownFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    const stat = statSync(path)
    if (stat.isDirectory()) return getMarkdownFiles(path)
    return path.endsWith('.md') ? [relative('.', path)] : []
  })
}

function readTags(source: string): string[] {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  const lines = frontmatter.split(/\r?\n/)
  const tags: string[] = []

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const scalar = line.match(/^tags?:\s*(.+)$/)
    if (scalar) {
      tags.push(...normalizeTags(scalar[1]))
      continue
    }

    if (/^tags?:\s*$/.test(line)) {
      while (index + 1 < lines.length && /^\s+-\s+/.test(lines[index + 1])) {
        index += 1
        tags.push(...normalizeTags(lines[index].replace(/^\s+-\s+/, '')))
      }
    }
  }

  return tags
}

function normalizeTags(value: string): string[] {
  return value
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean)
}
