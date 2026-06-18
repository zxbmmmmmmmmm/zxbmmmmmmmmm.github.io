<script setup lang="ts">
import ArticleList from './ArticleList.vue'
import Tile from './Tile.vue'
import { data as posts } from '../posts.data'
</script>

<template>
  <div class="layout">
    <div class="home-view-header">
      <Tile class="tile-1" text="所有文章" theme="accent"> 11 </Tile>
      <Tile class="tile-2" text="标签"  theme="accent"> 11 </Tile>
      <Tile class="tile-3" text="友链" theme="accent"> 11 </Tile>
      <Tile class="tile-4" text="项目" theme="accent"> 11 </Tile>
      <div class="about-card">
        <img
          class="avatar"
          src="https://avatars.githubusercontent.com/u/96322503?v=4"
          alt="Avatar"
        />
        <div class="about-content">
          <h2>About Me</h2>
          <p>
            Hi, I'm a passionate developer who loves to explore new technologies
            and share knowledge through blogging.
          </p>
        </div>
      </div>
    </div>
    <ArticleList :posts="posts" />
  </div>
</template>
<style scoped>
.layout {
  padding: 24px;
  display: grid;
  gap: 24px;
}
.home-view-header {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr repeat(3, 108px);
  grid-template-rows: repeat(2, 108px);
  grid-auto-rows: auto;
}
.tile-1 {
  grid-column: 2 / 4;
}
.tile-3 {
  grid-row: 2;
}
.tile-4 {
  grid-column: 3 / 5;
}
.about-card {
  grid-column: 1;
  grid-row: 1 / 3;
  background-color: var(--color-surface);
  display: flex;
}
.avatar {
  height: 100%;
  object-fit: cover;
}
.about-content {
  padding: 20px 24px;
  background-color: var(--color-secondary);
  color: var(--color-on-secondary);
}
</style>
