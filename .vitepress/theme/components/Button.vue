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
  />
</template>
