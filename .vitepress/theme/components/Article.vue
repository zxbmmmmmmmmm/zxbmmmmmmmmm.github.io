<script setup lang="ts">
defineProps<{
    title: string,
    date: string,
    excerpt?: string,
    category?: string[],
    tag?: string[]
}>()
</script>
<template>
    <article>
        <h1>{{ title }}</h1>
        <div v-if="excerpt" v-html="excerpt"></div>
        <p v-if="category?.length">Category: {{ category.join(' / ') }}</p>
        <p v-if="tag?.length">Tag: {{ tag.join(' / ') }}</p>
        <p>{{ date }}</p>
    </article>
</template>