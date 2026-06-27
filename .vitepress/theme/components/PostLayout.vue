<script setup lang="ts">
import { useData, useRoute, Content } from 'vitepress'
import PostOutline from './PostOutline.vue'
import VButton from './VButton.vue'
import { getTagLink } from '../shared/tags'
import { formatDate } from '../shared/utils.ts'
import GiscusComments from './GiscusComments.vue'

const { frontmatter } = useData()
const route = useRoute()
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
      <GiscusComments v-if="frontmatter.date || frontmatter.comment" :key="route.path" class="comments"/>
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

.comments{
  margin: 48px;
}
.post-content.has-bg {
  padding: 24px 48px 48px 48px;
}
.post-content:not(.has-bg) {
  padding: 12px 48px 48px 48px;
}
.post-header.has-bg {
  background: var(--color-accent);
  color: var(--color-accent-fg);
}
.post-view.has-bg {
  background: var(--color-bg-card-alt);
}
.tag-button {
  background: var(--color-bg-card);
  color: var(--color-text);
}
@media (max-width: 720px) {
  .post-content.has-bg,
  .post-content:not(.has-bg) {
    padding: 0 24px 24px 24px;
  }
  .comments{
    margin: 24px;
  }
  .post-header.has-bg,
  .post-header:not(.has-bg) {
    padding: 24px 24px 4px 24px;
  }
}
</style>
