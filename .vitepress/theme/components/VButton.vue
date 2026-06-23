<script setup lang="ts">
import { computed } from 'vue'
import { EXTERNAL_URL_RE } from '../shared/utils'
import { normalizeLink } from '../shared/utils'

interface Props {
  text?: string
  href?: string
  theme?: 'default' | 'accent'
  rel?: string
}

const props = withDefaults(defineProps<Props>(), {})

const isExternal = computed(
  () => props.href && EXTERNAL_URL_RE.test(props.href)
)

const component = computed(() => {
  return props.href ? 'a' : 'button'
})
</script>

<template>
  <component
    :is="component"
    class="Button"
    :class="[theme]"
    :href="href ? normalizeLink(href) : undefined"
    :rel="props.rel ?? (isExternal ? 'noreferrer' : undefined)"
  >
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.Button {
  display: inline-block;
  padding: 0.45rem 1rem;
  color: var(--color-text);
  font-weight: 600;
  text-align: center;
  background: var(--color-bg-subtle);
  border-radius: var(--border-radius-control);
  transition: transform 0.2s ease;
}

.Button:hover {
  color: var(--color-text);
  background: var(--color-bg-elevated);
}

.Button :deep(svg) {
  fill: currentColor;
  stroke: currentColor;
}

.Button.accent {
  color: var(--color-accent-fg);
  background: var(--color-accent);
}

.Button.accent:hover {
  color: var(--color-accent-fg);
  background: var(--color-accent-hover);
}

.Button:active {
  transform: scale(0.96);
}
.Button{
  text-decoration: none;
}
</style>
