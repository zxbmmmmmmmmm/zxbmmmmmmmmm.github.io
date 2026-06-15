<script setup lang="ts">
defineProps<{
    title: string,
    date: string,
    excerpt?: string
}>()
</script>
<template>
    <article>
        <h1>{{ title }}</h1>
        <div v-if="excerpt" v-html="excerpt"></div>
        <p>{{ date }}</p>
    </article>
</template>