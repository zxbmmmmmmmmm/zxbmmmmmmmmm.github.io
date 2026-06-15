<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import ArticleList from './ArticleList.vue'

// https://vitepress.dev/reference/runtime-api#usedata
const { site, frontmatter } = useData()
const isHome = computed(() => Boolean(frontmatter.value.home))
</script>

<template>
  <div class="layout">
    <SiteHeader :title="site.title"/>

    <main class="site-main">
      <section v-if="isHome" class="home-view">
        <ArticleList/>  
      </section>
      <section v-else class="page_view">
        <Content />
      </section>
    </main>
    <SiteFooter :text="site.description"/>
  </div>
</template>
s