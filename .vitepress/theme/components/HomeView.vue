<script setup lang="ts">
import AboutCard from './AboutCard.vue'
import ArticleList from './ArticleList.vue'
import Tile from './Tile.vue'
import { data as posts } from '../posts.data'
import People from '../icons/8/People.vue'
import Tags from '../icons/8/Tags.vue'
import Bookmark from '../icons/8/Bookmark.vue'
import Projects from '../icons/8/Projects.vue'
import ArrowRight2 from '../icons/8/ArrowRight2.vue'
</script>

<template>
  <div class="layout">
    <div class="section header">
      <div class="section-content">
        <h1>Betta_Fish</h1>
        <h2>zxbmmmmmmmmm</h2>
      </div>
    </div>
    <div class="section">
      <div class="section-content first-post">
        <h3>
          {{ posts[0].title }}
        </h3>
        <div v-if="posts[0].excerpt" v-html="posts[0].excerpt"></div>
        <a class="continue-reading" :href="posts[0].url">
          <ArrowRight2 />
          <p>继续阅读</p>
        </a>
      </div>
    </div>

    <div class="section posts-section">
      <ul class="section-content posts-section-content">
        <li v-for="post in posts.slice(2, 5)">
          <div class="post-item">
            <h4>{{ post.title }}</h4>
            <div
              class="post-item-excerpt"
              v-if="post.excerpt"
              v-html="post.excerpt"
            ></div>
            <a class="continue-reading" :href="post.url">
              <ArrowRight2 />
              <p>继续阅读</p>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.layout {
  display: grid;
}
.posts-section {
  background: #ff1769;
  width: 100%;
}
.posts-section-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 4rem;
  overflow-x: auto;
}
.section {
  min-height: clamp(200px, 25vh, 300px);
  padding: 24px 64px;
  align-content: center;
}
.continue-reading svg {
  height: 24px;
  width: 24px;
}
.continue-reading {
  display: flex;
  gap: 12px;
  color: var(--color-text);
  font-size: larger;
  align-items: center;
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
.first-post {
  gap: 1rem;
}
.post-item {
  display: flex;
  flex-direction: column;
  max-height: 196px;
  gap: 0.75rem;
}
.post-item-excerpt {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  word-break: break-word;
}
.post-item-excerpt :deep(a) {
  color: white;
}
@media (min-width: 720px) {
  .posts-section-content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .post-item {
    height: 100%;
  }
  .post-item .continue-reading {
    margin-top: auto;
  }
}
</style>
