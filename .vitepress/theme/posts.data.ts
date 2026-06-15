import { createContentLoader } from 'vitepress'

interface Post {
    title: string
    url: string
    date: {
        time: number
        string: string
    }
    excerpt: string | undefined
    category: string[]
    tag: string[]
}

declare const data: Post[]
export { data }

export default createContentLoader('posts/*.md', {
    excerpt: true,
    transform(raw): Post[] {
        return raw
            .map(({ url, frontmatter, excerpt }) => ({
                title: frontmatter.title,
                url,
                excerpt,
                date: formatDate(frontmatter.date),
                category: normalizeList(frontmatter.category),
                tag: normalizeList(frontmatter.tag)
            }))
            .sort((a, b) => b.date.time - a.date.time)
    }
})

function formatDate(raw: string): Post['date'] {
    const date = new Date(raw)
    date.setUTCHours(12)
    return {
        time: +date,
        string: date.toDateString()
    }
}

function normalizeList(value: unknown): string[] {
    if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === 'string')
    }
    if (typeof value === 'string' && value.length > 0) {
        return [value]
    }
    return []
}