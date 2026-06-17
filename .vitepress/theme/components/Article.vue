<script setup lang="ts">
import { getTagLink } from '../shared/tags'
import { normalizeLink } from '../shared/utils'

defineProps<{
  title: string
  url?: string
  date: string
  excerpt?: string
  tags?: string[]
}>()

const getArticleLink = (url: string) => normalizeLink(url)
</script>
<template>
  <article class="article">
    <h1 class="article-title">
      <a v-if="url" :href="getArticleLink(url)" class="article-link">{{ title }}</a>
      <template v-else>{{ title }}</template>
    </h1>
    <div v-if="excerpt" class="article-excerpt" v-html="excerpt"></div>
    <ul v-if="tags?.length" class="article-tags">
      <li v-for="tag in tags" :key="tag" class="article-tag-item">
        <a :href="getTagLink(tag)" class="article-tag">{{ tag }}</a>
      </li>
    </ul>
    <p class="article-date">{{ date }}</p>
  </article>
</template>

<style scoped>
.article {
  display: grid;
  gap: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.article-title {
  margin: 0;
  font-size: 1.75rem;
  line-height: 1.2;
}

.article-link {
  text-decoration: none;
}

.article-link:hover {
}

.article-excerpt {
  line-height: 1.75;
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
}

.article-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  text-decoration: none;
}

.article-tag:hover {
  background: #cffafe;
}

.article-date {
  margin: 0;
  color: var(--text-outline);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .article {
    padding: 1.25rem;
    border-radius: 0.875rem;
  }

  .article-title {
    font-size: 1.5rem;
  }
}
</style>