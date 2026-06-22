<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onContentUpdated } from 'vitepress'
import { getHeaders, useActiveAnchor, type OutlineItem } from '../composables/outline'

const container = ref<HTMLElement>()
const marker = ref<HTMLElement>()
const headers = ref<OutlineItem[]>([])

function update() {
  headers.value = getHeaders()
}

onMounted(update)
onContentUpdated(update)

useActiveAnchor(container, marker)
</script>

<template>
  <nav v-if="headers.length" class="outline" ref="container" aria-label="On this page">
    <div class="outline-content">
      <ul class="outline-list">
        <li v-for="item in headers" :key="item.link">
          <a
            class="outline-link"
            :class="{ nested: item.level === 3 }"
            :href="item.link"
            :title="item.title"
          >{{ item.title }}</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.outline {
  position: sticky;
  top: calc(var(--header-height) + 32px);
}

.outline-content {
  position: relative;
  padding-left: 8px;
}

.outline-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  z-index: 1;
  gap:  1.25rem;
  display: flex;
  flex-direction: column;
}

.outline-link {
  display: block;
  font-size: 1rem;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.25s;
}

.outline-link:hover,
.outline-link.active {
  color: var(--vp-c-text-1);
}

</style>
