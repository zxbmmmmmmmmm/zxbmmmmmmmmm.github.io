<script setup lang="ts">
import AboutCard from './AboutCard.vue'
import ArticleList from './ArticleList.vue'
import Tile from './Tile.vue'
import { data as posts } from '../posts.data'
import People from '../icons/8/People.vue'
import Tags from '../icons/8/Tags.vue'
import Bookmark from '../icons/8/Bookmark.vue'
import Projects from '../icons/8/Projects.vue'
import ArrowRight from '../icons/8/ArrowRight.vue'
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
.header-img {
  inset: 0;
  object-fit: cover;
  width: 100%;
}
.header {
  min-height: clamp(200px, 25vh, 300px);
  background: var(--color-accent);
  padding: 24px 64px;
  align-content: center;
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
.social-media {
  background: var(--color-accent-tint、
  
  
  、);
  min-height: 100px;
  align-content: center;
}
.social-media-items {
  display: flex;
  align-content: center;
  gap: 24px;
}
.social-media-description{
  color:var(--color-accent-tint);
}
.social-media-icon {
  height: 80px;
  width: 80px;
  fill: var(--color-accent-tint);
}
</style>
