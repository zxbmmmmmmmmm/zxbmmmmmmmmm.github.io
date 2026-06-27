<script setup lang="ts">
import ArrowRight from '../icons/8/ArrowRight.vue'
import Github from '../icons/Github.vue'
import VButton from './VButton.vue'
</script>

<template>
  <div class="card card-lift about-card">
    <img
      class="avatar"
      src="https://avatars.githubusercontent.com/u/96322503?v=4"
      alt="Avatar"
    />
    <div class="about-content-layer">
      <div class="about-content">
        <h2>Betta_Fish</h2>
        <p class="about-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam
        </p>
        <ul>
          <li class="social-buttons">
            <VButton
              href="https://github.com/zxbmmmmmmmmm"
              class="social-button"
            >
              <Github />
              Github
            </VButton>
          </li>
        </ul>
      </div>
      <ArrowRight class="arrow-icon" />
    </div>
  </div>
</template>

<style scoped>
.about-card {
  background-color: var(--color-bg-card);
  container-type: inline-size;
  container-name: about-card;
  display: flex;
  transition: transform 0.2s ease;
  overflow: hidden;
}

.about-card:active:not(:has(.social-button:active)) {
  transform: scale(0.99);
}

.about-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

.avatar {
  height: 100%;
  object-fit: cover;
}

.about-content-layer {
  padding: 20px 24px;
  background-color: var(--color-secondary);
  width: 100%;
  height: 100%;
  color: var(--color-secondary-fg);
  position: relative;
}

.about-content {
  position: relative;
  display: grid;
  grid-template-rows: max-content minmax(0, 1fr) max-content;
  z-index: 1;
  height: 100%;
  gap: 0.4rem;
}

.arrow-icon {
  position: absolute;
  right: 16px;
  bottom: 16px;
  height: 96px;
  width: 96px;
  color: var(--color-secondary-fg);
  z-index: 0;
  opacity: 0.2;
  pointer-events: none;
}

.social-buttons {
  margin-top: 1rem;
}

.social-button {
  font-size: 1rem;
  display: inline-flex;
  gap: 12px;
  padding: 0.5rem 1rem;
  align-items: center;
  background: var(--color-secondary-tint);
  color: var(--color-secondary-tint-fg);
}

html.dark .about-content-layer {
  background-color: var(--color-secondary-tint);
  color: var(--color-secondary-tint-fg);
}

@container about-card (max-width: 500px) {
  .avatar {
    display: none;
  }
}
</style>
