<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import HomeView from './components/HomeView.vue'
import PostLayout from './components/PostLayout.vue'

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
const isHome = computed(() => Boolean(frontmatter.value.home))
</script>

<template>
  <div class="layout">
    <SiteHeader :title="site.title"/>
    <main class="site-main">
      <section v-if="isHome" class="home-view">
        <HomeView />
      </section>
      <PostLayout v-else />
    </main>
    <SiteFooter :text="site.description"/>
  </div>
</template>
