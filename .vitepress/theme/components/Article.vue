<script setup lang="ts">
import { getTagLink } from '../shared/tags'
import { normalizeLink } from '../shared/utils'
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
  <article class="article" role="button">
    <a v-if="url" :href="getArticleLink(url)" class="card-overlay"></a>
    <h1 class="article-title">
      <p>{{ title }}</p>
    </h1>
    <div class="article-meta">
      <p class="article-date">{{ date }}</p>
    </div>
    <div v-if="excerpt" class="article-excerpt" v-html="excerpt"></div>
    <ul v-if="tags?.length" class="article-tags">
      <li v-for="tag in tags" :key="tag" class="article-tag-item">
        <VButton class="article-tag" :text="tag" :href="getTagLink(tag)" />
      </li>
    </ul>
  </article>
</template>

<style scoped>
.article {
  position: relative;
  display: grid;
  min-width: 0;
  gap: 0.5rem;
  padding: 1.75rem;
  color: var(--color-text);
  background: var(--color-bg-card);
  border-radius: var(--border-radius-overlay);
  border-left: 3px solid transparent;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.article:has(.card-overlay:active):not(:has(.article-tag:active))
{
  transform: scale(0.99);
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

.article-link {
  color: inherit;
  text-decoration: none;
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

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.article-tag-item {
  margin: 0;
  z-index: 2;
}

.article-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: var(--color-bg-subtle);
  font-size: 0.875rem;
  text-decoration: none;
  border: 0;
}

.article-tag:hover {
  background: var(--color-bg-elevated);
}

.article:hover:not(:active):not(:has(.card-overlay:active)) {
  border-left-color: var(--color-accent);
}

.article-date {
  margin: 0;
  color: var(--color-text-faint);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
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
