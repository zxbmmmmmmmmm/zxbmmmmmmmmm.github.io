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
