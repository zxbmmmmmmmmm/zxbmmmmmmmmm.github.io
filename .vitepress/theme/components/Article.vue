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
  <article>
    <h1>
      <a v-if="url" :href="getArticleLink(url)">{{ title }}</a>
      <template v-else>{{ title }}</template>
    </h1>
    <div v-if="excerpt" v-html="excerpt"></div>
    <ul>
      <li v-for="tag in tags" :key="tag">
        <a :href="getTagLink(tag)">{{ tag }}</a>
      </li>
    </ul>
    <p>{{ date }}</p>
  </article>
</template>
