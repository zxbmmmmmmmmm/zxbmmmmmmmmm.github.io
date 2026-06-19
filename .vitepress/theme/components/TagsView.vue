<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'
import { data as posts } from '../posts.data.ts'
import {
  findTagBySlug,
  getTagGroups,
  getTagLink,
  getTagSlugFromPath
} from '../shared/tags.ts'
import ArticleList from './ArticleList.vue'
import VButton from './VButton.vue'

const { params } = useData()
const router = useRouter()
const tagGroups = getTagGroups(posts)
const allTagNames = tagGroups.map((group) => group.name)
const initialTag =
  typeof params.value?.name === 'string' ? params.value.name : tagGroups[0]?.name
const activeTag = ref(initialTag ?? '')

const activeTagPosts = computed(() => {
  return tagGroups.find((tag) => tag.name === activeTag.value)?.posts ?? []
})

function readTagFromLocation() {
  if (typeof window === 'undefined') return

  const slug = getTagSlugFromPath(window.location.pathname)
  const matched = findTagBySlug(allTagNames, slug)
  activeTag.value = matched ?? (tagGroups[0]?.name ?? '')
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
  <div class="layout">
    <ul>
      <li v-for="tag in tagGroups" :key="tag.name">
        <VButton
          type="button"
          class="tag-button"
          :theme="tag.name === activeTag ? 'accent' : 'default'"
          :aria-pressed="tag.name === activeTag"
          @click="selectTag(tag.name)"
        >
          {{ tag.name }} ({{ tag.count }})
        </VButton>
      </li>
    </ul>

    <section v-if="activeTag">
      <ArticleList :posts="activeTagPosts" />
    </section>

    <p v-else>暂无标签</p>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  gap: 1.5rem;
  padding: 1rem;
}

.layout ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.layout li + li {
  margin-top: 0;
}

.tag-button {
  background: var(--color-surface-container);
}
</style>
