<script setup lang="ts">
import { computed } from 'vue'
import { EXTERNAL_URL_RE } from './../shared/utils'
import { normalizeLink } from './../shared/utils'

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
  padding: 0.45rem 0.85rem;
  color: var(--vp-c-text-1);
  text-align: center;
  background: var(--color-control-fill-default);
  border: 1px solid var(--color-control-stroke-default);
  border-radius: 6px;
}

.Button:hover {
  color: var(--vp-c-text-1);
  background: var(--color-control-fill-secondary);
}

.Button.accent {
  color: var(--color-text-on-accent-fill-primary);
  background: var(--color-accent);
  border-color: var(--color-control-stroke-on-accent-default);
}

.Button.accent:hover {
  color: var(--color-text-on-accent-fill-primary);
  background: var(--color-accent-hover);
}
</style>
