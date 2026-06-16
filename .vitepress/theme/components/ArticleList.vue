<script setup lang="ts">
import type { Post } from '../shared/tags'
import Article from './Article.vue'

defineProps<{
  heading?: string
  posts: Post[]
}>()
</script>
<template>
  <div class="article-list">
    <h2 v-if="heading">{{ heading }}</h2>
    <ul>
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
