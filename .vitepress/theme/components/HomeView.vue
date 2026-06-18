<script setup lang="ts">
import ArticleList from './ArticleList.vue'
import Tile from './Tile.vue'
import { data as posts } from '../posts.data'
</script>

<template>
  <div class="layout">
    <div class="home-view-header">
      <Tile theme="accent"> 11 </Tile>
      <Tile theme="accent" size="wide"> 11 </Tile>
    </div>
    <ArticleList :posts="posts" />
  </div>
</template>
<style scoped>
.layout {
  padding: 1rem;
  display: grid;
  gap: 1rem;
}
.home-view-header {
  display: flex;
  gap: 1rem;
}
</style>
