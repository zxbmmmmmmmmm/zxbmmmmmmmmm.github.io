<script setup lang="ts">
import FriendCard from './FriendCard.vue'

interface Friend {
  name: string
  description?: string
  avatar: string
  link: string
}

const friends: Friend[] = [
  {
    name: '扑克',
    avatar: 'https://avatars.githubusercontent.com/u/62325494',
    link: 'https://poker-sang.github.io/'
  },
  {
    name: 'Raspberry Kan',
    avatar: 'https://avatars.githubusercontent.com/u/59819050',
    link: 'https://blog.raspberrykan.dev/'
  }
]
</script>
<template>
  <div>
    <ul class="friends-grid">
      <li v-for="friend in friends" :key="friend.name">
        <FriendCard :friend="friend" />
      </li>
    </ul>
  </div>
</template>
<style scoped>
.friends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
  list-style: none;
  padding: 0;
  gap: 16px;
}
.friends-grid li + li {
  margin-top: 0;
}
</style>
