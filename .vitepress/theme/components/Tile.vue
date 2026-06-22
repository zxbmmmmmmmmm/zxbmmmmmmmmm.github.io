<script setup lang="ts">
import VButton from './VButton.vue'
interface Props {
  text?: string
  theme?: 'default' | 'accent'
  href?: string
}
const props = withDefaults(defineProps<Props>(), {
  text: 'Text',
  theme: 'default',
  size: 'medium'
})
</script>
<template>
  <VButton type="button" class="tile-button" :theme="theme" :href="href">
    <slot class="tile-content"></slot>
    <p class="tile-text">{{ text }}</p>
  </VButton>
</template>
<style scoped>

.tile-button {
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.2s ease;
  padding: 32px;
  user-select: none;
}
.tile-button:hover {
  transform: translateY(-2px);
}
.tile-button:active {
  transform: scale(0.99);
}

.tile-content {
  grid-area: 1 / 1 / 2 / 2;
  align-self: center;
  justify-self: center;
}

.tile-text {
  font-size: 0.8rem;
  position: absolute;
  right: 0.4rem;
  bottom: 0.2rem;
}
</style>
