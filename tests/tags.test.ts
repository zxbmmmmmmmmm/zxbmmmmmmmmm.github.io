import assert from 'node:assert/strict'
import test from 'node:test'
import {
  filterPostsByTag,
  getTagFromQuery,
  getTagLink,
  getTagToggleLink,
  type Post
} from '../.vitepress/theme/shared/tags.ts'

const posts: Post[] = [
  {
    title: 'First post',
    url: '/posts/first',
    date: { time: 2, string: '2026-08-19' },
    excerpt: undefined,
    tags: ['C#', '前端']
  },
  {
    title: 'Second post',
    url: '/posts/second',
    date: { time: 1, string: '2026-08-18' },
    excerpt: undefined,
    tags: ['Windows Phone']
  }
]

test('getTagLink encodes the original tag name as a query parameter', () => {
  assert.equal(getTagLink('C#'), '/posts?tag=C%23')
  assert.equal(getTagLink('Windows Phone'), '/posts?tag=Windows+Phone')
  assert.equal(getTagLink('前端'), '/posts?tag=%E5%89%8D%E7%AB%AF')
})

test('getTagFromQuery resolves only exact, known tag names', () => {
  const tags = ['C#', 'Windows Phone', '前端']

  assert.equal(getTagFromQuery('?tag=C%23', tags), 'C#')
  assert.equal(getTagFromQuery('?source=footer&tag=Windows+Phone', tags), 'Windows Phone')
  assert.equal(getTagFromQuery('?tag=c%23', tags), '')
  assert.equal(getTagFromQuery('?tag=unknown', tags), '')
  assert.equal(getTagFromQuery('', tags), '')
})

test('getTagToggleLink clears the active filter and selects inactive tags', () => {
  assert.equal(getTagToggleLink('C#', 'C#'), '/posts')
  assert.equal(getTagToggleLink('前端', 'C#'), '/posts?tag=%E5%89%8D%E7%AB%AF')
})

test('filterPostsByTag returns all posts without an active selection', () => {
  assert.equal(filterPostsByTag(posts, ''), posts)
  assert.deepEqual(filterPostsByTag(posts, 'C#'), [posts[0]])

  const invalidTag = getTagFromQuery('?tag=unknown', ['C#', '前端'])
  assert.equal(filterPostsByTag(posts, invalidTag), posts)
})
