<script setup lang="ts">
import ArticleList from './ArticleList.vue'
import PostTagFilter from './PostTagFilter.vue'
import { usePostTags } from '../composables/postTags'

const { filteredPosts } = usePostTags()
</script>

<template>
  <div class="layout">
    <div class="content">
      <PostTagFilter variant="mobile" />
      <ArticleList class="article-list" :posts="filteredPosts" />
    </div>
  </div>
</template>
<style scoped>
.layout {
  display: grid;
}
.content {
  display: grid;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
.article-list {
  width: 100%;
  margin-inline: auto;
}
</style>
