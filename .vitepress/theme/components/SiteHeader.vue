<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../posts.data'
import { getTagLink, getTopTags } from '../shared/tags'

const tags = computed(() => {
  return getTopTags(posts)
})

defineProps<{
  title: string
}>()
</script>

<template>
  <header class="site-header">
    <a class="site-logo" href="/">{{ title }}</a>
    <ul v-if="tags.length">
      <a href="/tags">标签</a>
      <a href="/projects">项目</a>
      <li v-for="tag in tags" :key="tag.name">
        <a :href="getTagLink(tag.name)">
          {{ tag.name }}
        </a>
      </li>
    </ul>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--vp-c-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 1rem 1.25rem;
}

.site-logo {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.site-header ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.site-header a {
  color: var(--vp-c-text-2);
}

.site-header a:hover,
.site-logo:hover {
  color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .site-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
