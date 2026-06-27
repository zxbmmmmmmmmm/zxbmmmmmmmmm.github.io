<script setup lang="ts">
import ArticleList from './ArticleList.vue'
import { data as posts } from '../posts.data'
</script>

<template>
  <div class="layout">
    <div class="content">
      <ArticleList class="article-list" :posts="posts" />
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
