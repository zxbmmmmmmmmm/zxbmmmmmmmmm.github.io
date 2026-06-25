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
    <div class="section header">
      <div class="section-content">
        <h1>Betta_Fish</h1>
        <h2>zxbmmmmmmmmm</h2>
      </div>
    </div>
    <div class="section posts">
      <div class="section-content">
        <div>
          <h2>文章</h2>
          <ul class="posts-list">
            <li v-for="post in posts">
              <div>
                <h4>
                  {{ post.title }}
                </h4>
                <div class="post-excerpt"
                  v-if="post.excerpt"
                  v-html="post.excerpt"
                ></div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.layout {
  display: grid;
}
.posts-list {
  display: grid;
  gap: 1rem;
  margin-top: 24px;
}
.section {
  min-height: clamp(200px, 25vh, 300px);
  padding: 24px 64px;
  align-content: center;
}
.header {
  background: var(--color-accent);
}
.section-content {
  display: grid;
  padding: 24px;

  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
.social-media {
  background: #ff1769;
}
.social-media-items {
  display: flex;
  align-content: center;
  gap: 24px;
}
.social-media-description {
  color: white;
}
.social-media-icon {
  height: 80px;
  width: 80px;
}
</style>
