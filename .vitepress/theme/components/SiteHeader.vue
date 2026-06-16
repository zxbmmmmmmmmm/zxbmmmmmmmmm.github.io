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
