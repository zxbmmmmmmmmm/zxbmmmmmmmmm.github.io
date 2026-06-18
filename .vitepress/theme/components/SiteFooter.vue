<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
<template>
  <div class="layout">
    <p>{{ text }}</p>
  </div>
</template>
<style scoped>
.layout {
  padding-left: 32px;
}
</style>