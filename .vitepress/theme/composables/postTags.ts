import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, withBase } from 'vitepress'
import { data as posts } from '../posts.data'
import {
  filterPostsByTag,
  getTagFromQuery,
  getTagGroups,
  getTagToggleLink
} from '../shared/tags'

const tagGroups = getTagGroups(posts)
const tagNames = tagGroups.map((tag) => tag.name)
const activeTag = ref('')
let activeConsumers = 0

function syncTagFromQuery(query: string) {
  activeTag.value = getTagFromQuery(query, tagNames)
}

function syncTagFromLocation() {
  if (typeof window !== 'undefined') syncTagFromQuery(window.location.search)
}

function handlePostLinkClick(event: MouseEvent) {
  if (
    event.button !== 0 ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    event.metaKey ||
    !(event.target instanceof Element)
  )
    return

  const link = event.target.closest('a')
  if (!link || link.hasAttribute('download') || link.hasAttribute('target')) return

  const target = new URL(link.href, window.location.href)
  if (
    target.origin === window.location.origin &&
    /\/posts(?:\.html)?\/?$/.test(target.pathname)
  )
    syncTagFromQuery(target.search)
}

function addLocationListeners() {
  if (activeConsumers++ > 0) return
  window.addEventListener('popstate', syncTagFromLocation)
  document.addEventListener('click', handlePostLinkClick)
}

function removeLocationListeners() {
  activeConsumers -= 1
  if (activeConsumers > 0) return
  window.removeEventListener('popstate', syncTagFromLocation)
  document.removeEventListener('click', handlePostLinkClick)
}

export function usePostTags() {
  const route = useRoute()
  const router = useRouter()
  const filteredPosts = computed(() =>
    filterPostsByTag(posts, activeTag.value)
  )

  watch(() => route.query, syncTagFromQuery)
  onMounted(() => {
    syncTagFromLocation()
    addLocationListeners()
  })
  onBeforeUnmount(removeLocationListeners)

  function getFilterLink(tag: string): string {
    return getTagToggleLink(tag, activeTag.value)
  }

  async function selectTag(tag: string, event: MouseEvent) {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.metaKey
    )
      return

    event.preventDefault()
    event.stopPropagation()

    const target = getFilterLink(tag)
    activeTag.value = tag === activeTag.value ? '' : tag
    await router.go(withBase(target))
  }

  return {
    activeTag,
    filteredPosts,
    getFilterLink,
    selectTag,
    tagGroups
  }
}
