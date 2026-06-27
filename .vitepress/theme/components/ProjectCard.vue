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
      <ul v-if="tags?.length" class="tag-list">
        <li v-for="tag in tags" :key="tag">
          <VButton class="tag-pill" :text="tag" />
        </li>
      </ul>
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
  height: 196px;
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
  color: var(--color-text-muted);
  line-height: 1.75;
}

/* Scoped override: reshape VButton into a pill */
.tag-pill {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
}
</style>
