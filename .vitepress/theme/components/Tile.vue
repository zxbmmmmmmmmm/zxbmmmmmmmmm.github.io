<script setup lang="ts">
import VButton from './VButton.vue'
interface Props {
  text?: string
  theme?: 'default' | 'accent'
  size?: 'small' | 'medium' | 'wide' | 'large'
}
const props = withDefaults(defineProps<Props>(), {
  text: 'Text',
  theme: 'default',
  size: 'medium'
})
</script>
<template>
  <VButton type="button" class="tile-button" :class="[size]" :theme="theme">
    <slot class="tile-content">11</slot>
    <p class="tile-text">{{ text }}</p>
  </VButton>
</template>
<style scoped>
.tile-button {
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
  position: relative;
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

.tile-button.small {
  width: 50px;
  height: 50px;
  .tile-text {
    display: none;
  }
}
.tile-button.medium {
  width: 100px;
  height: 100px;
}
.tile-button.wide {
  width: 200px;
  height: 100px;
}
.tile-button.large {
  width: 200px;
  height: 200px;
}
</style>
