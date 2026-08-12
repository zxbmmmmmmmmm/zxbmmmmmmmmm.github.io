<script setup lang="ts">
defineProps<{
  href?: string
}>()
</script>

<template>
  <component :is="href ? 'a' : 'div'" class="tile" :href="href">
    <slot />
  </component>
</template>

<style scoped>
.tile {
  display: block;
  padding: 16px 20px;
  background-color: var(--color-secondary-fg);
  color: var(--tile-color, var(--color-text));
  position: relative;
  box-shadow:
    inset 0 0 0 0 white,
    0 0 0 0 black;
  transition:
    scale 0.25s ease,
    box-shadow 0.25s ease;
  text-decoration: none;
}

.tile:active {
  z-index: 1;
  scale: 1.03;
  box-shadow:
    inset 0 0 0 2px white,
    0 10px 25px -5px black;
}

@media (hover: hover) {
  .tile:hover:not(:active) {
    color: var(--tile-color, var(--color-text));
    scale: 1.05;
    z-index: 1;
    box-shadow:
      inset 0 0 0 2px white,
      0 10px 25px -5px black;
  }
}

@media (max-width: 520px) {
  .tile {
    padding: 12px;
  }
}
</style>
