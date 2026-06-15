<script setup lang="ts">
import { data as posts } from './posts.data'
import Article from './components/Article.vue'

defineProps<{
    heading?: string
}>()

</script>
<template>
    <div class="article-list">
        <h2 v-if="heading">{{ heading }}</h2>
        <ul>
            <li v-for="post in posts" :key="post.title">
                <Article :title="post.title" :date="post.date.string"/>
            </li>
        </ul>
    </div>
</template>