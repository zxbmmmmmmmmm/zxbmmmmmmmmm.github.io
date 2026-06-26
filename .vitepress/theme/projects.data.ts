import { createContentLoader } from 'vitepress'

export interface Project {
  name: string
  url: string
  description?: string
  headerImage?: string
  repository?: string
  tags?: string[]
}

declare const data: Project[]
export { data }

export default createContentLoader('projects/**/*.md', {
  transform(raw): Project[] {
    return raw.map(({ url, frontmatter }) => ({
      name: frontmatter.name,
      url,
      description: frontmatter.description,
      headerImage: (() => {
        const img = frontmatter['header-image']
        if (!img || !img.startsWith('./')) return img
        const dir = url.endsWith('/') ? url : url + '/'
        return dir + img.slice(2)
      })(),
      repository: frontmatter.repository,
      tags: Array.isArray(frontmatter.tag)
        ? frontmatter.tag
        : frontmatter.tag ? [frontmatter.tag] : []
    }))
  }
})
