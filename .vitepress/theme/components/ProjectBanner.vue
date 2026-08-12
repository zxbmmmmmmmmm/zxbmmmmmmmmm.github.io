<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { data as projects } from '../projects.data'

const viewport = ref<HTMLElement | null>(null)
const physicalIndex = ref(projects.length > 1 ? 1 : 0)
const isResetting = ref(false)

let resizeObserver: ResizeObserver | undefined
let settleTimer: ReturnType<typeof setTimeout> | undefined

const slides = computed(() => {
  if (projects.length < 2) return projects
  return [projects.at(-1)!, ...projects, projects[0]]
})

const activeIndex = computed(() => {
  if (projects.length < 2) return 0
  return (physicalIndex.value - 1 + projects.length) % projects.length
})

const scrollToPhysical = (index: number, smooth = true) => {
  const el = viewport.value
  if (!el) return

  physicalIndex.value = index
  el.scrollTo({
    left: index * el.clientWidth,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

const settle = () => {
  const el = viewport.value
  if (!el || projects.length < 2) return

  const index = Math.round(el.scrollLeft / el.clientWidth)
  physicalIndex.value = index

  if (index !== 0 && index !== projects.length + 1) return

  isResetting.value = true
  scrollToPhysical(index === 0 ? projects.length : 1, false)
  requestAnimationFrame(() => {
    isResetting.value = false
  })
}

const handleScroll = () => {
  const el = viewport.value
  if (!el || isResetting.value) return

  physicalIndex.value = Math.round(el.scrollLeft / el.clientWidth)
  clearTimeout(settleTimer)
  settleTimer = setTimeout(settle, 120)
}

const changeSlide = (offset: number) => {
  if (projects.length < 2) return
  scrollToPhysical(physicalIndex.value + offset)
}

const selectSlide = (index: number) => {
  if (index === activeIndex.value) return
  scrollToPhysical(projects.length > 1 ? index + 1 : index)
}

onMounted(() => {
  nextTick(() => scrollToPhysical(physicalIndex.value, false))

  if (viewport.value) {
    resizeObserver = new ResizeObserver(() => {
      scrollToPhysical(physicalIndex.value, false)
    })
    resizeObserver.observe(viewport.value)
    viewport.value.addEventListener('scrollend', settle, { passive: true })
  }
})

onUnmounted(() => {
  clearTimeout(settleTimer)
  resizeObserver?.disconnect()
  viewport.value?.removeEventListener('scrollend', settle)
})
</script>

<template>
  <section class="project-banner" aria-roledescription="carousel">
    <div
      ref="viewport"
      class="project-banner-viewport"
      @scroll.passive="handleScroll"
    >
      <div class="project-banner-track">
        <a
          v-for="(project, index) in slides"
          :key="`${project.url}-${index}`"
          class="project-slide"
          :href="project.url"
          :aria-hidden="
            projects.length > 1 && (index === 0 || index === slides.length - 1)
          "
          :tabindex="
            projects.length > 1 && (index === 0 || index === slides.length - 1)
              ? -1
              : 0
          "
          draggable="false"
        >
          <img
            v-if="project.headerImage"
            class="project-slide-image"
            :src="project.headerImage"
            :alt="`${project.name}`"
            draggable="false"
          />
          <span class="project-slide-shade"></span>
          <span class="project-slide-info">
            <p class="project-slide-title">{{ project.name }}</p>
            <p class="project-slide-description">{{ project.description }}</p>
          </span>
        </a>
      </div>
    </div>

    <template v-if="projects.length > 1">
      <button
        class="edge-control edge-control-left"
        type="button"
        aria-label="上一个"
        @click="changeSlide(-1)"
      >
        <span aria-hidden="true">&#x2039;</span>
      </button>
      <button
        class="edge-control edge-control-right"
        type="button"
        aria-label="下一个"
        @click="changeSlide(1)"
      >
        <span aria-hidden="true">&#x203a;</span>
      </button>

      <div class="pips-pager">
        <button
          v-for="(project, index) in projects"
          :key="project.url"
          class="pip"
          :class="{ active: index === activeIndex }"
          type="button"
          :aria-current="index === activeIndex ? 'true' : undefined"
          @click="selectSlide(index)"
        ></button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.project-banner {
  position: relative;
  min-width: 0;
  min-height: 100%;
  overflow: hidden;
  background: var(--color-bg-inverse);
  color: white;
  isolation: isolate;
}

.project-banner-viewport {
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  touch-action: pan-x pan-y;
}

.project-banner-viewport::-webkit-scrollbar {
  display: none;
}

.project-banner-track {
  display: flex;
  height: 100%;
}

.project-slide {
  position: relative;
  flex: 0 0 100%;
  min-width: 0;
  height: 100%;
  overflow: hidden;
  color: white;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  user-select: none;
}

.project-slide:hover {
  color: white;
}

.project-slide-image {
  width: 100%;
  height: 100%;
  max-width: none;
  object-fit: cover;
}

.project-slide-shade {
  position: absolute;
  inset: 0;
  bottom: 0px;
  background: linear-gradient(
    180deg,
   transparent 60%, 
   rgba(0, 0, 0, 0.7) 85%,
   rgba(0, 0, 0, 1) 100%);
  pointer-events: none;
}

.project-slide-info {
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 24px;
  bottom: 20px;
  z-index: 1;
  max-width: calc(100% - 120px);
  gap: 4px;
  color: white;
}
.project-slide-title {
  font-size: 22px;
}
.project-slide-description {
  opacity: 55%;
}
.edge-control {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 2;
  width: 18%;
  min-width: 48px;
  color: white;
  opacity: 0;
  transition: opacity 160ms ease;
}

.edge-control span {
  position: absolute;
  top: 50%;
  translate: 0 -50%;
  font-family: 'Segoe UI', sans-serif;
  font-size: 3rem;
  font-weight: 200;
  line-height: 1;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.75);
}

.edge-control-left {
  left: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.32), transparent);
}

.edge-control-left span {
  left: 14px;
}

.edge-control-right {
  right: 0;
  background: linear-gradient(-90deg, rgba(0, 0, 0, 0.32), transparent);
}

.edge-control-right span {
  right: 14px;
}

@media (hover: hover) {
  .project-banner:hover .edge-control,
  .edge-control:focus-visible {
    opacity: 0.55;
  }

  .edge-control:hover,
  .edge-control:focus-visible {
    opacity: 1;
  }
}

.pips-pager {
  position: absolute;
  right: 18px;
  bottom: 20px;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 7px;
}

.pip {
  width: 8px;
  height: 8px;
  min-width: 8px;
  border-radius: 50%;
  background: white;
  opacity: 0.32;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
  transition:
   opacity 160ms ease,
}

.pip.active {
  opacity: 1;
}


@media (hover: none) {
  .edge-control {
    display: none;
  }
}
</style>
