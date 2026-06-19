export interface Post {
  title: string
  url: string
  date: {
    time: number
    string: string
  }
  excerpt: string | undefined
  tags: string[]
}

export interface TagGroup {
  name: string
  posts: Post[]
  count: number
}

export function initTags(posts: Post[]): Record<string, Post[]> {
  const data: Record<string, Post[]> = {}
  posts.forEach((post) => {
    post.tags?.forEach((tag) => {
      data[tag] = data[tag] || []
      data[tag].push(post)
    })
  })

  return Object.fromEntries(
    Object.entries(data).sort(
      ([tag1, posts1], [tag2, posts2]) =>
        posts2.length - posts1.length || tag1.localeCompare(tag2)
    )
  )
}

export function getTagGroups(posts: Post[]): TagGroup[] {
  return Object.entries(initTags(posts)).map(([name, posts]) => ({
    name,
    posts,
    count: posts.length
  }))
}

export function getTopTags(posts: Post[], limit = 3): TagGroup[] {
  return getTagGroups(posts).slice(0, limit)
}

export function slugifyTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, (c) => `_${c.charCodeAt(0).toString(16)}_`)
}

export function getTagLink(tag: string): string {
  return `/tags/${slugifyTag(tag)}`
}

export function getTagSlugFromPath(pathname: string): string {
  const match = pathname.match(/\/tags\/([^/?#]+?)\/?$/)
  return match ? match[1].replace(/\.html$/, '') : ''
}

export function findTagBySlug(tags: string[], slug: string): string | undefined {
  return tags.find((tag) => slugifyTag(tag) === slug)
}
