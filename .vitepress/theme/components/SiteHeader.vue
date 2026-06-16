<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <header class="site-header">
    <a class="site-logo" href="/">{{ title }}</a>
  </header>
</template>
