<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '../shared/tags'
import Article from './ArticleCard.vue'

const props = defineProps<{
  heading?: string
  posts: Post[]
}>()

interface DatedPost {
  post: Post
  month: number
  day: number
}

interface YearGroup {
  year: string
  posts: DatedPost[]
}

const postGroups = computed<YearGroup[]>(() => {
  const groups = new Map<string, DatedPost[]>()

  props.posts.forEach((post) => {
    const [year, month, day] = post.date.string.split('-')
    const posts = groups.get(year) ?? []
    posts.push({ post, month: Number(month), day: Number(day) })
    groups.set(year, posts)
  })

  return Array.from(groups, ([year, posts]) => ({ year, posts }))
})
</script>
<template>
  <div>
    <h2 v-if="heading">{{ heading }}</h2>
    <div class="year-list">
      <section v-for="group in postGroups" :key="group.year" class="year-group">
        <h2 class="article-year">{{ group.year }}</h2>
        <ul class="article-list">
          <li
            v-for="item in group.posts"
            :key="item.post.url"
            class="article-item"
          >
            <time
              class="article-date"
              :datetime="item.post.date.string"
              :aria-label="item.post.date.string"
            >
              <div>
                <span class="article-month">{{ item.month }}</span>
                <span>月</span>
              </div>
              <span class="article-day">{{ item.day }}</span>
            </time>
            <Article class="article-card"
              :title="item.post.title"
              :url="item.post.url"
              :excerpt="item.post.excerpt"
              :date="item.post.date.string"
              :tags="item.post.tags"
            />
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
<style scoped>
.year-list,
.year-group,
.article-list {
  display: grid;
  gap: 1rem;
}

.year-list {
  gap: 3rem;
}

.article-year {
  font-size: 2.5rem;
  font-weight: 200;
  line-height: 1;
  margin-top: 0;
}

.article-list {
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.article-item {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}

.article-date {
  display: grid;
  justify-items: right;
  padding-top: 0.75rem;
  color: var(--color-text-muted);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.article-card :deep(.article-meta) {
  display: none;
}

.article-month {
  font-weight: 200;
  font-size: 2rem;
}

.article-day {
  margin-top: 0.35rem;
  font-weight: 200;
}

@media (max-width: 640px) {
  .article-year {
    font-size: 2rem;
  }

  .article-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  .article-date{
    display: none;
  }

  .article-card :deep(.article-meta) {
    display: flex;
  }
}
</style>
