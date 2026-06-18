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
  color: var(--vp-c-text-1);
  text-align: center;
  background: var(--color-surface-container-high);
  border-radius: var(--border-radius-control);
  transition: 
    transform 0.2s ease;
}

.Button:hover {
  color: var(--vp-c-text-1);
  background: var(--color-surface-container-highest);
}

.Button.accent {
  color: var(--color-on-primary);
  background: var(--color-primary);
  border-color: var(--color-on-primary);
}

.Button.accent:hover {
  color: var(--color-on-primary);
  background: var(--color-inverse-primary);
}

.Button:active{
  transform: scale(0.96);
}
</style>
