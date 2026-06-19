<script setup lang="ts">
import type { Post } from '../shared/tags'
import Article from './Article.vue'

defineProps<{
  heading?: string
  posts: Post[]
}>()
</script>
<template>
  <div>
    <h2 v-if="heading">{{ heading }}</h2>
    <ul class="article-list">
      <li v-for="post in posts" :key="post.url">
        <Article
          :title="post.title"
          :url="post.url"
          :date="post.date.string"
          :excerpt="post.excerpt"
          :tags="post.tags"
        />
      </li>
    </ul>
  </div>
</template>
<style scoped>
.article-list {
  display: grid;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-list li + li {
  margin-top: 0;
}
</style>
