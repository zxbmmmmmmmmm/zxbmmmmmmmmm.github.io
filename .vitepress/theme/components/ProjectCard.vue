<script setup lang="ts">
import VButton from './VButton.vue'

defineProps<{
  name: string
  url: string
  description?: string
  headerImage?: string
  repository?: string
  tags?: string[]
}>()
</script>
<template>
  <article class="card card-lift project-card" role="button">
    <a v-if="repository" :href="repository" target="_blank" rel="noopener" class="card-overlay"></a>
    <h3 class="project-title">{{ name }}</h3>

    <img v-if="headerImage" :src="headerImage" class="project-header-image" alt="" />
    <div class="project-body">
      <div class="project-body-content">
        <p v-if="description" class="project-desc">{{ description }}</p>
        <ul v-if="tags?.length" class="tag-list">
          <li v-for="tag in tags" :key="tag">
            <span class="tag-text">{{ tag }}</span>
          </li>
        </ul>
      </div>
      <div class="bg-container">
        <div class="bg"></div>
        <div class="bg-2"></div>
      </div>

    </div>

  </article>
</template>
<style scoped>
.project-card {
  display: grid;
  background: var(--color-bg-card-alt);
  color: var(--color-text);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.project-card img {
  image-rendering: -webkit-optimize-contrast;
}

.project-card:has(.card-overlay:active) {
  transform: scale(0.99);
}

.project-header-image {
  display: block;
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin: 0;
}

.project-body-content {
  position: relative;
  display: grid;
  gap: 0.5rem;
  padding: 1.25rem 1.6rem;
  z-index: 2;
}

.project-body {
  position: relative;
  overflow: hidden;
}

.project-card h3 {
  margin: 0px;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: 0.5px;
  padding: 0.5rem 1.6rem;
  font-size: 1.1rem;
  background: var(--color-bg-subtle);
}

.project-desc {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1rem;
}

.tag-list li:not(:first-child)::before {
  content: "·";
  color: var(--color-text-muted);
  display: inline-block;
  margin-right: 0.25rem;
}

.tag-text {
  padding: 0rem;
  color: var(--color-text-muted);
  margin: 0px;
  line-height: 1rem;
}

.card .tag-list {
  display: flex;
  gap: 0.25rem;
}

.bg,
.bg-2 {
  top: 0;
  right: 0;
  width: 100%;
  height: 80%;
  pointer-events: none;
  transition: transform 0.2s ease;
}

.bg-container {
  position: absolute;
  top: 0;
  left: 35%;
  width: 100%;
  height: 100%;
  rotate: -45deg;
  transform-origin: center;
  pointer-events: none;
  z-index: 0;
}

.bg {
  background: var(--color-bg-elevated);
  z-index: -1;
}

.card-lift:has(.card-overlay:active) .bg,
.card-lift:hover .bg {
  transform: scale(2);
}

.card-lift:has(.card-overlay:active) .bg,
.card-lift:hover .bg-2 {
  transform: scale(1.2);
}

.bg-2 {
  background: var(--color-bg-subtle);
  z-index: 1;
}
</style>
