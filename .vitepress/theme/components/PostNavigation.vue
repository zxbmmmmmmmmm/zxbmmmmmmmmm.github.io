<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data as posts } from '../posts.data'
import ArrowLeft2 from '../icons/8/ArrowLeft2.vue'
import ArrowRight2 from '../icons/8/ArrowRight2.vue'

const route = useRoute()
const { frontmatter } = useData()

const currentIndex = computed(() =>
  posts.findIndex((p) => p.url === route.path)
)

// 上一篇: the older post (higher index in newest-first array)
const prevPost = computed(() =>
  currentIndex.value < posts.length - 1 ? posts[currentIndex.value + 1] : null
)

// 下一篇: the newer post (lower index in newest-first array)
const nextPost = computed(() =>
  currentIndex.value > 0 ? posts[currentIndex.value - 1] : null
)
</script>

<template>
  <nav
    v-if="frontmatter.date && (prevPost || nextPost)"
    class="post-nav"
    aria-label="文章导航"
  >
    <a v-if="prevPost" class="post-nav-item prev" :href="prevPost.url">
      <span class="nav-direction">上一篇</span>
      <span class="nav-title">{{ prevPost.title }}</span>
      <ArrowLeft2 class="icon icon-left" />
    </a>
    <span v-else class="post-nav-item" />

    <a v-if="nextPost" class="post-nav-item next" :href="nextPost.url">
      <ArrowRight2 class="icon icon-right" />

      <span class="nav-direction">下一篇</span>
      <span class="nav-title">{{ nextPost.title }}</span>
    </a>
    <span v-else class="post-nav-item" />
  </nav>
</template>

<style scoped>
.post-nav {
  display: flex;
  margin: 0 48px 48px;
}
.divider {
  margin: 0 48px;
}
.divider-item {
  height: 20px;
  width: 20px;
  background: var(--color-accent);
}

.icon {
  position: absolute;
  height: 100px;
  width: 100px;
  opacity: 0;
  transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.icon-left {
  right: -40px;
  bottom: -20px;
}

.icon-right {
  left: -40px;
  bottom: -20px;
}

.post-nav-item {
  overflow: hidden;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 16px;
  color: var(--color-text);
  text-decoration: none;
  transition: background 0.15s;
  min-width: 0;
  -webkit-tap-highlight-color: transparent;
}

@media (hover: hover) {
  a.post-nav-item:hover .icon {
    opacity: 0.2;
  }
  a.post-nav-item:hover .icon-left {
    transform: translateX(-20px);
  }
  a.post-nav-item:hover .icon-right {
    transform: translateX(20px);
  }
  a.post-nav-item:hover {
    background: var(--color-accent-tint);
    color: var(--color-accent-tint-fg);
  }
}

.post-nav-item.prev {
  text-align: left;
}

.post-nav-item.next {
  text-align: right;
}

.nav-direction {
  color: var(--color-accent);
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

a.post-nav-item:hover .nav-direction {
  color: inherit;
}

.nav-title {
  line-height: 1.4;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (min-width: 720px) {
  .post-nav-item {
    max-width: 360px;
  }
  .post-nav-item.next {
    margin-left: auto;
  }
}

@media (max-width: 720px) {
  .post-nav {
    flex-direction: column;
    margin: 0 12px 12px;
  }

  .post-nav-item.prev {
    border-right: none;
  }

  .post-nav-item.next {
    text-align: left;
  }
}
</style>
