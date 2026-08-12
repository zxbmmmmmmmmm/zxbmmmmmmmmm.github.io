<script setup lang="ts">
import { getTagLink } from '../shared/tags.ts'
import { normalizeLink } from '../shared/utils.ts'
import VButton from './VButton.vue'
import Tile from './Tile.vue'

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
  <Tile class="article">
    <a v-if="url" :href="getArticleLink(url)" class="tile-overlay"></a>
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
  </Tile>
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
