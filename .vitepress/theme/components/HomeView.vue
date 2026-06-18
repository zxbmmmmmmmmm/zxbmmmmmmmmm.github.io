<script setup lang="ts">
import ArticleList from './ArticleList.vue'
import Tile from './Tile.vue'
import { data as posts } from '../posts.data'
import ArrowRight from '../icons/8/ArrowRight.vue'
import VButton from './VButton.vue'
import Github from '../icons/Github.vue'
import People from '../icons/8/People.vue'
import Tags from '../icons/8/Tags.vue'
import Bookmark from '../icons/8/Bookmark.vue'
import Projects from '../icons/8/Projects.vue'
</script>

<template>
  <div class="layout">
    <div class="home-view-header">
      <Tile class="tile-1" text="所有文章" theme="accent">
        <Bookmark />
      </Tile>
      <Tile class="tile-2" text="标签" theme="accent">
        <Tags />
      </Tile>
      <Tile class="tile-3" text="友链" theme="accent">
        <People />
      </Tile>
      <Tile class="tile-4" text="项目" theme="accent">
        <Projects />
      </Tile>
      <div class="about-card">
        <img
          class="avatar"
          src="https://avatars.githubusercontent.com/u/96322503?v=4"
          alt="Avatar"
        />
        <div class="about-content-layer">
          <div class="about-content">
            <h2>Betta_Fish</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam
            </p>
            <ul>
              <li class="social-buttons">
                <VButton
                  href="https://github.com/zxbmmmmmmmmm"
                  class="social-button"
                >
                  <Github />
                  Github
                </VButton>
              </li>
            </ul>
          </div>
          <ArrowRight class="arrow-icon" />
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
  position: relative;
  transition: transform 0.2s ease;
}
.about-card:hover {
  transform: translateY(-2px);
}
.about-card:active:not(:has(.social-button:active)) {
  transform: scale(0.99);
}
.avatar {
  height: 100%;
  object-fit: cover;
}
.about-content-layer {
  padding: 20px 24px;
  background-color: var(--color-secondary);
  width: 100%;
  height: 100%;
  color: var(--color-on-secondary);
  position: relative;
}
.about-content {
  position: relative;
  display: grid;
  z-index: 1;
  gap: 0.4rem;
}
.arrow-icon {
  position: absolute;
  right: 16px;
  bottom: 16px;
  height: 96px;
  width: 96px;
  color: var(--color-on-secondary);
  z-index: 0;
  opacity: 0.4;
  pointer-events: none;
}
.social-buttons {
  margin-top: 1rem;
}
.social-button {
  font-size: 1rem;
  display: inline-flex;
  gap: 12px;
  padding: 0.5rem 1rem;
  align-items: center;
}
</style>
