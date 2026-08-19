<script setup lang="ts">
import VButton from './VButton.vue'
import { usePostTags } from '../composables/postTags'

defineProps<{
  variant: 'sidebar' | 'mobile'
}>()

const { activeTag, getFilterLink, selectTag, tagGroups } = usePostTags()

function getAriaLabel(tag: string): string {
  return tag === activeTag.value
    ? `取消 ${tag} 标签筛选`
    : `按 ${tag} 标签筛选`
}
</script>

<template>
  <nav
    class="tag-filter"
    :class="`tag-filter-${variant}`"
    aria-label="按标签筛选"
  >
    <h2 class="tag-filter-title">标签</h2>

    <ul class="tag-filter-list">
      <li v-for="tag in tagGroups" :key="tag.name">
        <a
          v-if="variant === 'sidebar'"
          class="tag-filter-link vp-raw"
          :class="{ active: tag.name === activeTag }"
          :href="getFilterLink(tag.name)"
          :aria-label="getAriaLabel(tag.name)"
          @click="selectTag(tag.name, $event)"
        >
          {{ tag.name }} ({{ tag.count }})
        </a>

        <VButton
          v-else
          class="tag-filter-button vp-raw"
          :theme="tag.name === activeTag ? 'accent' : 'default'"
          :href="getFilterLink(tag.name)"
          :normalize-href="false"
          :aria-label="getAriaLabel(tag.name)"
          @click="selectTag(tag.name, $event)"
        >
          {{ tag.name }} ({{ tag.count }})
        </VButton>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.tag-filter .tag-filter-title {
  margin: 0;
  padding-bottom: 20px;
  line-height: 24px;
  font-size: 16px;
}

.tag-filter .tag-filter-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tag-filter-list li + li {
  margin-top: 0;
}

.tag-filter-sidebar .tag-filter-list {
  --tag-filter-row-height: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 8px;
  padding-right: 8px;
  max-height: calc(var(--tag-filter-row-height) * 5 + 16px * 4);
  overflow-x: hidden;
  overflow-y: auto;
}

.tag-filter-sidebar .tag-filter-link {
  line-height: var(--tag-filter-row-height);
}

.tag-filter-link {
  display: block;
  color: var(--vp-c-text-2);
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.25s;
}

.tag-filter-link:hover,
.tag-filter-link.active {
  color: var(--vp-c-text-1);
}

.tag-filter-mobile {
  display: none;
  margin-bottom: 1.5rem;
}

.tag-filter-mobile .tag-filter-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-filter-button:not(.accent) {
  background: var(--color-bg-sunken);
}

.tag-filter-sidebar .tag-filter-list::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 5px;
  height: 0;
}

.tag-filter-sidebar .tag-filter-list::-webkit-scrollbar-button,
.tag-filter-sidebar .tag-filter-list::-webkit-scrollbar-button:single-button,
.tag-filter-sidebar .tag-filter-list::-webkit-scrollbar-button:vertical:decrement,
.tag-filter-sidebar .tag-filter-list::-webkit-scrollbar-button:vertical:increment {
  -webkit-appearance: none;
  display: none;
  width: 0;
  height: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.tag-filter-sidebar .tag-filter-list::-webkit-scrollbar-track,
.tag-filter-sidebar .tag-filter-list::-webkit-scrollbar-track-piece {
  border-radius: 0;
  background: transparent;
}

.tag-filter-sidebar .tag-filter-list::-webkit-scrollbar-thumb {
  -webkit-appearance: none;
  border-radius: 999px;
  background: var(--color-border);
}

.tag-filter-sidebar .tag-filter-list::-webkit-scrollbar-corner {
  display: none;
  background: transparent;
}

.tag-filter-sidebar .tag-filter-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-faint);
}

@media (max-width: 1120px) {
  .tag-filter-mobile {
    display: block;
  }
  .tag-filter-title{
    display: none;
  }
}
</style>
