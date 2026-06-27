<script setup lang="ts">
import { data as posts } from '../posts.data'
import { data as projects } from '../projects.data'
import { nextTick, onUnmounted, ref } from 'vue'

import Github from '../icons/Github.vue'
import ArrowRight2 from '../icons/8/ArrowRight2.vue'
import ProjectCard from './ProjectCard.vue'
import { getTagGroups, getTagLink } from '../shared/tags.ts'
import { computed, onMounted } from 'vue'
import VButton from './VButton.vue'
import ArrowLeft2 from '../icons/8/ArrowLeft2.vue'
const tags = computed(() => getTagGroups(posts))

let resizeObserver: ResizeObserver | undefined = undefined
const carousel = ref<HTMLElement | null>(null)
const carouselContainer = ref<HTMLElement | null>(null)
const cardWidth = ref(0)
const minCardWidth = 300
const gap = 16

const updateLayout = (containerWidth: number) => {
  let cardsCount = Math.max(
    1,
    Math.floor((containerWidth + gap) / (minCardWidth + gap))
  )
  cardWidth.value = (containerWidth - gap * (cardsCount - 1)) / cardsCount
  nextTick(updateScrollState)
}

const canScrollPrev = ref(false)
const canScrollNext = ref(false)

const updateScrollState = () => {
  const el = carousel.value
  if (!el) return
  canScrollPrev.value = el.scrollLeft > 0
  canScrollNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
}

const scrollPrev = () => {
  const el = carousel.value
  if (!el) return
  el.scrollBy({ left: -(cardWidth.value + gap), behavior: 'smooth' })
  canScrollPrev.value = el.scrollLeft - (cardWidth.value + gap) > 0
  canScrollNext.value = true
}
const scrollNext = () => {
  const el = carousel.value
  if (!el) return
  el.scrollBy({ left: cardWidth.value + gap, behavior: 'smooth' })
  canScrollPrev.value = true
  canScrollNext.value = el.scrollLeft + (cardWidth.value + gap) + el.clientWidth < el.scrollWidth - 1
}

onMounted(() => {
  if (carouselContainer.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        updateLayout(entry.contentRect.width)
      }
    })
    resizeObserver.observe(carouselContainer.value)
  }
  carousel.value?.addEventListener('scrollend', updateScrollState, { passive: true })
})
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  carousel.value?.removeEventListener('scrollend', updateScrollState)
})
</script>

<template>
  <div class="layout">
    <div class="section header">
      <div class="section-content">
        <h1>Betta_Fish</h1>
        <h3>zxbmmmmmmmmm</h3>
        <ul class="social-buttons">
          <VButton
            href="https://github.com/zxbmmmmmmmmm"
            class="social-button"
            theme="accent"
          >
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
    <div class="section section-projects">
      <div class="section-content section-content-projects">
        <div class="carousel-header">
          <h2>项目</h2>
          <div class="carousel-controls">
            <button
              class="carousel-btn"
              :disabled="!canScrollPrev"
              @click="scrollPrev"
            >
              <ArrowLeft2 />
            </button>
            <button
              class="carousel-btn"
              :disabled="!canScrollNext"
              @click="scrollNext"
            >
              <ArrowRight2 />
            </button>
          </div>
        </div>
        <div class="carousel-container" ref="carouselContainer">
          <ul class="projects-grid" ref="carousel">
            <li v-for="project in projects" :key="project.url">
              <ProjectCard v-bind="project" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.section-projects {
  background: var(--color-accent);
  color:white
}
.section-content-projects {
  gap: 24px;
}
.carousel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.carousel-controls {
  display: flex;
  gap: 16px;
}
.carousel-btn:disabled {
  opacity: 0.3;
  cursor: default;
}
.carousel-btn {
  width: 32px;
  height: 32px;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
}
.carousel-container {
  overflow: hidden;
}
.projects-grid {
  display: flex;
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.projects-grid::-webkit-scrollbar {
  display: none;
}
.projects-grid li {
  flex: 0 0 v-bind('cardWidth + "px"');
}
.social-buttons {
  margin-top: 12px;
  gap: 12px;
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
  color:white;
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
  min-height: clamp(200px, 25svh, 300px);
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
  background-attachment: fixed;

  min-height: clamp(400px, 50svh, 800px);
  color: white;
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
