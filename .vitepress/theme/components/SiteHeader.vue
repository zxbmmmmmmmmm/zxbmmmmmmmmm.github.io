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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
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
