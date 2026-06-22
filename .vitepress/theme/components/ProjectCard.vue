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
  <article class="project-card" role="button">
    <a
      v-if="repository"
      :href="repository"
      target="_blank"
      rel="noopener"
      class="card-overlay"
    ></a>
    <img
      v-if="headerImage"
      :src="headerImage"
      class="project-header-image"
      alt=""
    />
    <div class="project-body">
      <h1 class="project-title">{{ name }}</h1>
      <p v-if="description" class="project-desc">{{ description }}</p>
      <ul v-if="tags?.length" class="project-tags">
        <li v-for="tag in tags" :key="tag">
          <VButton class="project-tag" :text="tag" />
        </li>
      </ul>
    </div>
  </article>
</template>
<style scoped>
.project-card {
  position: relative;
  display: grid;
  background: var(--color-surface-variant);
  color: var(--vp-c-text-1);
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--app-shadow-elevation-medium);
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

.project-body {
  display: grid;
  gap: 0.5rem;
  padding: 1.25rem 1.75rem 1.75rem;
}

.project-title {
  margin: 0;
  font-size: 1.5rem;
}

.project-desc {
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.75;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.project-tag {
  border-radius: 999px;
  background: var(--color-surface-container-higher);
  font-size: 0.875rem;
  border: 0;
  z-index: 2;
}

.card-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.layout li + li {
  margin-top: 0;
}</style>
