<script setup lang="ts">
defineProps<{
    title: string,
    date: string
}>()
</script>
<template>
    <article>
        <h1>{{ title }}</h1>
        <p>{{ date }}</p>
    </article>
</template>