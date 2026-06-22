<script setup lang="ts">
import { useData, Content } from 'vitepress'
import PostOutline from './PostOutline.vue'
import VButton from './VButton.vue'
import { getTagLink } from '../shared/tags'
import { formatDate } from '../shared/utils.ts'

const { frontmatter } = useData()
</script>

<template>
  <section class="post-page">
    <div class="post-view" :class="{ 'has-bg': frontmatter.date }">
      <div class="post-header" :class="{ 'has-bg': frontmatter.date }">
        <h1 v-if="frontmatter.title" class="post-title">
          {{ frontmatter.title }}
        </h1>
        <p v-if="frontmatter.date">
          {{ formatDate(new Date(frontmatter.date)) }}
        </p>
        <div v-if="frontmatter.tag?.length" class="post-tags">
          <VButton
            class="tag-button"
            v-for="tag in frontmatter.tag"
            :key="tag"
            :text="tag"
            :href="getTagLink(tag)"
          />
        </div>
      </div>

      <Content class="post-content" :class="{ 'has-bg': frontmatter.date }"/>
    </div>
    <aside class="post-aside">
      <PostOutline />
    </aside>
  </section>
</template>

<style scoped>
.post-title {
  margin-bottom: 1rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.post-view {
  min-height: calc(100dvh - var(--header-height));
}
.post-header.has-bg {
  padding: 48px 48px 16px 48px;
}
.post-header:not(.has-bg) {
  padding: 48px 48px 0px 48px;
}

.post-content.has-bg {
  padding: 24px 48px 48px 48px;
}
.post-content:not(.has-bg) {
  padding: 12px 48px 48px 48px;
}
.post-header.has-bg {
  background: var(--color-primary);
  color: var(--color-on-primary);
}
.post-view.has-bg {
  background: var(--color-surface-variant);
}
.tag-button {
  background: var(--color-surface);
  color: var(--color-on-surface);
}
@media (max-width: 720px) {
  .post-content.has-bg,
  .post-content:not(.has-bg) {
    padding: 0 24px 24px 24px;
  }
  .post-header.has-bg,
  .post-header:not(.has-bg) {
    padding: 24px 24px 4px 24px;
  }
}
</style>
