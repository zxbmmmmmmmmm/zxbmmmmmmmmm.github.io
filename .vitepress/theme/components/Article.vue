<script setup lang="ts">
import Button from './Button.vue';

defineProps<{
  title: string
  date: string
  excerpt?: string
  tags?: string[]
}>()
</script>
<template>
  <article>
    <h1>{{ title }}</h1>
    <div v-if="excerpt" v-html="excerpt"></div>
    <ul>
      <li v-for="tag in tags" :key="tag">
        <Button :text="tag"/>
      </li>
    </ul>
    <p>{{ date }}</p>
  </article>
</template>
