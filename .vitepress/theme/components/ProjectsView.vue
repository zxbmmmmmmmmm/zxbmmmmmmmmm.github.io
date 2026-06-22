<script setup lang="ts">
import { data as projects } from '../projects.data'
import ProjectCard from './ProjectCard.vue'
</script>
<template>
  <div class="projects-page">
    <ul class="projects-grid">
      <li v-for="project in projects" :key="project.url">
        <ProjectCard v-bind="project" />
      </li>
    </ul>
  </div>
</template>
<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
}
.layout li + li {
  margin-top: 0;
}
</style>
