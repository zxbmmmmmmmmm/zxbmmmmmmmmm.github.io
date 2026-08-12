<script setup lang="ts">
import Tile from './Tile.vue'

export interface Friend {
  name: string
  avatar: string
  description?: string
  link: string
}
defineProps<{ friend: Friend }>()
</script>
<template>
  <Tile :href="friend.link" class="friend-card">
    <img class="avatar" :src="friend.avatar" />
    <div class="friend-content">
      <h1 class="friend-name">{{ friend.name }}</h1>
      <p v-if="friend.description">{{ friend.description }}</p>
    </div>
  </Tile>
</template>
<style scoped>
.avatar {
  height: 128px;
  width: 128px;
}
.friend-card {
  display: flex;
  flex-direction: row;
  padding: 0;
  background: var(--color-bg-card-alt);
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
</style>
