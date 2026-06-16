<script setup lang="ts">
import { data, initTags } from '../posts.data'
import { data as posts } from '../posts.data'
import { useData } from 'vitepress'
import { computed } from 'vue';

const tags = computed(() =>{
  initTags(data)
})
defineProps<{
  title: string
}>()
</script>

<template>
  <header class="site-header">
    <a class="site-logo" href="/">{{ title }}</a>
    <ul>
      <li v-for="value in tags" >
      </li>
    </ul>
  </header>
</template>
