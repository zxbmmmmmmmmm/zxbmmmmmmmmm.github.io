<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'
import { data as posts } from '../posts.data'
import { getTagFromPath, getTagGroups, getTagLink } from '../shared/tags'
import ArticleList from './ArticleList.vue'

const { params } = useData()
const router = useRouter()
const tagGroups = getTagGroups(posts)
const initialTag =
  typeof params.value?.tag === 'string' ? params.value.tag : tagGroups[0]?.name
const activeTag = ref(initialTag ?? '')

const activeTagPosts = computed(() => {
  return tagGroups.find((tag) => tag.name === activeTag.value)?.posts ?? []
})

function readTagFromLocation() {
  if (typeof window === 'undefined') return

  const tag = getTagFromPath(window.location.pathname)
  activeTag.value = tagGroups.some((group) => group.name === tag)
    ? tag
    : tagGroups[0]?.name ?? ''
}

function selectTag(tag: string) {
  activeTag.value = tag
  router.go(withBase(getTagLink(tag)))
}

onMounted(() => {
  readTagFromLocation()
  window.addEventListener('popstate', readTagFromLocation)
})

onBeforeUnmount(() => {
  window.removeEventListener('popstate', readTagFromLocation)
})
</script>

<template>
  <div class="tag-list">
    <ul>
      <li v-for="tag in tagGroups" :key="tag.name">
        <button
          type="button"
          :aria-pressed="tag.name === activeTag"
          @click="selectTag(tag.name)"
        >
          {{ tag.name }} ({{ tag.count }})
        </button>
      </li>
    </ul>

    <section v-if="activeTag">
      <ArticleList :posts="activeTagPosts" />
    </section>

    <p v-else>暂无标签。</p>
  </div>
</template>

<style scoped>
.tag-list {
  display: grid;
  gap: 1.5rem;
}

.tag-list ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-list button {
  padding: 0.45rem 0.8rem;
  color: var(--vp-c-text-2);
  background: var(--color-control-fill-default);
  border: 1px solid var(--color-control-stroke-default);
  border-radius: 6px;
}

.tag-list button:hover {
  color: var(--vp-c-text-1);
  background: var(--color-control-fill-secondary);
}

.tag-list button[aria-pressed='true'] {
  color: var(--color-text-on-accent-fill-primary);
  background: var(--color-accent);
  border-color: var(--color-control-stroke-on-accent-default);
}
</style>
