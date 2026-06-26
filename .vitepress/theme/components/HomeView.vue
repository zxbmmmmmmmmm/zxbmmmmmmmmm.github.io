<script setup lang="ts">
import AboutCard from './AboutCard.vue'
import ArticleList from './ArticleList.vue'
import Tile from './Tile.vue'
import { data as posts } from '../posts.data'
import Github from '../icons/Github.vue'

import People from '../icons/8/People.vue'
import Tags from '../icons/8/Tags.vue'
import Bookmark from '../icons/8/Bookmark.vue'
import Projects from '../icons/8/Projects.vue'
import ArrowRight2 from '../icons/8/ArrowRight2.vue'
import {
  findTagBySlug,
  getTagGroups,
  getTagSlugFromPath,
  getTagLink
} from '../shared/tags.ts'
import { computed } from 'vue'
import VButton from './VButton.vue'
const tags = computed(() => getTagGroups(posts))
</script>

<template>
  <div class="layout">
    <div class="section header">
      <div class="section-content">
        <h1>Betta_Fish</h1>
        <h2>zxbmmmmmmmmm</h2>
        <ul class="social-buttons">
          <VButton href="https://github.com/zxbmmmmmmmmm" class="social-button" theme="accent">
            <Github />
            Github
          </VButton>
        </ul>
      </div>
    </div>
    <div class="section">
      <div class="section-content first-post">
        <h5>
          {{ posts[0].date.string }}
        </h5>
        <a :href="posts[0].url">
          <h3>
            {{ posts[0].title }}
          </h3>
        </a>
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
            <a :href="post.url">
              <h4>{{ post.title }}</h4>
            </a>
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
    <div class="section">
      <div class="section-content section-content-tags">
        <h2>标签</h2>
        <ul class="tags-list">
          <li v-for="tag in tags">
            <a :href="getTagLink(tag.name)">
              <h3>
                {{ tag.name }}
              </h3>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<style scoped>
.social-buttons{
  margin-top: 12px;
  gap: 12px;
}
.social-button{

}
.layout {
  display: grid;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  column-gap: 32px;
  row-gap: 8px;
}
.tags-list a {
  color: var(--color-text);
}
.tag-button {
  color: transparent;
}
.section-content-tags {
  gap: 1rem;
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
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(../assets//header.jpg);
  background-size: cover;
  background-position: center;
  min-height: clamp(400px, 50vh, 800px);
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
.first-post :deep(a) {
  color: var(--color-text);
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
.post-item :deep(a) {
  color: white;
}
@media (max-width: 720px) {
  .section {
    padding: 24px 16px;
  }
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
