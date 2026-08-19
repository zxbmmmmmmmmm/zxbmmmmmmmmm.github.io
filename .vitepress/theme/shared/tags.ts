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

export function getTagLink(tag: string): string {
  const query = new URLSearchParams({ tag })
  return `/posts?${query.toString()}`
}

export function getTagFromQuery(query: string, tags: readonly string[]): string {
  const tag = new URLSearchParams(query).get('tag')
  return tag && tags.includes(tag) ? tag : ''
}

export function getTagToggleLink(tag: string, activeTag: string): string {
  return tag === activeTag ? '/posts' : getTagLink(tag)
}

export function filterPostsByTag(posts: Post[], tag: string): Post[] {
  return tag ? posts.filter((post) => post.tags.includes(tag)) : posts
}
