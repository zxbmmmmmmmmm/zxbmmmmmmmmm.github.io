<script setup lang="ts">
import { getTagLink } from '../shared/tags.ts'
import { normalizeLink } from '../shared/utils.ts'
import VButton from './VButton.vue'

const props = defineProps<{
  title: string
  url?: string
  date: string
  excerpt?: string
  tags?: string[]
}>()

const getArticleLink = (url: string) => normalizeLink(url)
</script>
<template>
  <article class="card card-lift article" role="button">
    <a v-if="url" :href="getArticleLink(url)" class="card-overlay"></a>
    <h1 class="article-title">
      <p>{{ title }}</p>
    </h1>
    <div class="article-meta">
      <p class="article-date">{{ date }}</p>
    </div>
    <div v-if="excerpt" class="article-excerpt" v-html="excerpt"></div>
    <ul v-if="tags?.length" class="tag-list">
      <li v-for="tag in tags" :key="tag">
        <VButton class="tag-pill" :text="tag" :href="getTagLink(tag)" />
      </li>
    </ul>
  </article>
</template>

<style scoped>
.article {
  display: grid;
  min-width: 0;
  gap: 0.5rem;
  padding: 1.75rem;
  color: var(--color-text);
  background: var(--color-bg-card);
  border-radius: var(--border-radius-overlay);
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.article:has(.card-overlay:active):not(:has(.tag-pill:active)) {
  transform: scale(0.99);
}

.article:hover:not(:active):not(:has(.card-overlay:active)) {
  border-left-color: var(--color-accent);
}

.article-title {
  margin: 0;
  font-size: 1.75rem;
  line-height: 1.2;
}

.article-title p {
  margin: 0;
  line-height: inherit;
}

.article-excerpt {
  color: var(--color-text-muted);
  line-height: 1.75;
  overflow-x: clip;
  min-width: 0;
}

.article-excerpt :deep(p) {
  margin: 0;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.article-date {
  margin: 0;
  color: var(--color-text-faint);
}

/* Scoped override: reshape VButton into a pill */
.tag-pill {
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
}

@media (max-width: 640px) {
  .article {
    padding: 1.25rem;
  }

  .article-title {
    font-size: 1.5rem;
  }
}
</style>
