<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{ title: string }>()

const hidden = ref(false)
let lastY = 0
let timer: ReturnType<typeof setTimeout> | null = null

function onScroll() {
  const y = window.scrollY
  if (y > lastY) {
    if (!timer)
      timer = setTimeout(() => {
        hidden.value = true
        timer = null
      }, 300)
  } else {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    hidden.value = false
  }
  lastY = y
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="site-header" :class="{ 'header-hidden': hidden }">
    <div class="header-inner">
      <a class="site-logo" href="/">{{ title }}</a>
      <ul>
        <a href="/posts">文章</a>
        <a href="/tags">标签</a>
        <a href="/projects">项目</a>
        <a href="/friends">友链</a>
        <a href="/board">留言板</a>
      </ul>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--color-divider);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  padding: 16px 32px;
  align-items: center;
  gap: 2rem;
}

.site-logo {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.site-header ul {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.site-header a {
  color: var(--vp-c-text-2);
}

.site-header a:hover,
.site-logo:hover {
  color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .header-inner {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-height: 900px) {
  .site-header {
    transition: transform 0.3s ease;
  }
  .site-header.header-hidden {
    transform: translateY(-100%);
  }
}
</style>
