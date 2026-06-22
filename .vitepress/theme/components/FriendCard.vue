<script setup lang="ts">
import VButton from './VButton.vue'

export interface Friend {
  name: string
  avatar: string
  description: string
  link: string
}
defineProps<{ friend: Friend }>()
</script>
<template>
  <article class="card friend-card">
    <a :href="friend.link" class="card-overlay" />
    <img class="avatar" :src="friend.avatar" />
    <div class="friend-content">
      <h1 class="friend-name">{{ friend.name }}</h1>
      <p>{{ friend.description }}</p>
    </div>
  </article>
</template>
<style scoped>
.avatar {
  height: 128px;
  width: 128px;
}
.friend-card {
  display: flex;
  flex-direction: row;
  background: var(--color-surface-variant);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.friend-card:hover {
  transform: translateY(-2px);
}
.friend-card:active {
  transform: scale(0.98);
}
.h1 {
  padding: 0;
}
.friend-content {
  padding: 12px 24px;
  display: flex;
  width: 100%;
  gap: 12px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}
.friend-content p {
  line-height: normal;
  margin: 0;
}
.card-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
}
</style>
