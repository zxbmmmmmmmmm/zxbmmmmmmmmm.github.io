<script setup lang="ts">
import { Content } from 'vitepress'
import PostOutline from './PostOutline.vue'
</script>

<template>
  <section class="post-page">
    <div class="page_view">
      <Content />
    </div>
    <aside class="post-aside">
      <PostOutline />
    </aside>
  </section>
</template>
