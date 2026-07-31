<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import type { ResolvedAttachments } from '../../attachments'

const { frontmatter } = useData()
const attachments = computed(
  () => frontmatter.value.attachments as ResolvedAttachments | undefined
)

function typeLabel(type: 'file' | 'zip', fileName: string): string {
  if (type === 'zip') return 'ZIP'
  const extension = fileName.includes('.') ? fileName.split('.').pop() : undefined
  return extension ? extension.toUpperCase() : '文件'
}
</script>

<template>
  <section v-if="attachments" class="attachments" :aria-label="attachments.title">
    <header class="attachments-header">
      <h2 class="attachments-title">
        {{ attachments.title }}
      </h2>
      <p v-if="attachments.description" class="attachments-description">
        {{ attachments.description }}
      </p>
    </header>

    <ul class="attachment-list">
      <li v-for="item in attachments.items" :key="item.url" class="attachment-item">
        <div class="attachment-copy">
          <div class="attachment-heading">
            <span class="attachment-name">{{ item.title }}</span>
          </div>
          <p v-if="item.description" class="attachment-description">
            {{ item.description }}
          </p>
        </div>
        <a class="attachment-download" :href="withBase(item.url)" :download="item.download"
          :aria-label="`下载 ${item.title}`">
          <span class="attachment-download-label">下载</span>
          <span class="attachment-type">{{ typeLabel(item.type, item.download) }}</span>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.attachments {
  color: var(--color-text);
}

.attachments-header {
  padding: 0px 0px 12px;
}

.attachments-title {
  margin: 0;
  font-size: 16px;
}

.attachment-list .attachment-item {
  margin-top: 0;
}

.attachments-description,
.attachment-description {
  margin: 6px 0 0;
  color: var(--color-text-muted);
  font-size: 14px;
  line-height: 1.5;
}

.attachment-list {

  margin: 0;
  padding: 0;
  list-style: none;
}

.attachment-item {
  background: var(--color-bg-card);
  padding: 14px 16px 16px;
}

.attachment-heading {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.attachment-name {
  min-width: 0;
  flex: 1;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.attachment-download {
  display: inline-flex;
  align-items: center;
  height: 32px;
  margin-top: 12px;
  padding: 0;
  overflow: hidden;
  color: var(--color-accent-fg);
  font-size: 14px;
  line-height: 1;
  text-decoration: none;
  transition: background-color 0.2s;
}

.attachment-download-label,
.attachment-type {
  display: inline-flex;
  align-items: center;
  align-self: stretch;
  padding: 0 10px;
}

.attachment-download-label {
  background: var(--color-accent);
  white-space: nowrap;
}

.attachment-type {
  background: var(--color-bg-subtle);
  color: var(--color-text);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.attachment-download:hover {
  background: var(--color-accent-hover);
  color: var(--color-accent-fg);
}

.attachment-download:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
</style>
