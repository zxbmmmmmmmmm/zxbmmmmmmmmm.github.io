<script setup lang="ts">
import { useData, Content } from 'vitepress'
import PostOutline from './PostOutline.vue'
import VButton from './VButton.vue'
import { getTagLink } from '../shared/tags'

const { frontmatter } = useData()
</script>

<template>
  <section class="post-page">
    <div class="page_view">
      <h1 v-if="frontmatter.title" class="post-title">
        {{ frontmatter.title }}
      </h1>
      <div v-if="frontmatter.tag?.length" class="post-tags">
        <VButton
          class="tag-button"
          v-for="tag in frontmatter.tag"
          :key="tag"
          :text="tag"
          :href="getTagLink(tag)"
        />
      </div>
      <Content />
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
</style>
