<script setup lang="ts">
import ArticleList from './ArticleList.vue'
import { data as posts } from '../posts.data'
</script>

<template>
  <div class="layout">
    <ArticleList :posts="posts" />
  </div>
</template>
