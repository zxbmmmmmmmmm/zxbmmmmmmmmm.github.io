<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseMermaid from 'vitepress-plugin-mermaid/Mermaid.vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    graph: string
    id: string
    class?: string
  }>(),
  {
    class: 'mermaid'
  }
)

const MIN_SCALE = 0.25
const MAX_SCALE = 3
const SCALE_STEP = 1.2

const viewport = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const scale = ref(1)
const naturalWidth = ref(1)
const naturalHeight = ref(1)
const isDragging = ref(false)

let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
let dragState = {
  pointerId: -1,
  x: 0,
  y: 0,
  scrollLeft: 0,
  scrollTop: 0
}

const rootClass = computed(() => [props.class, 'mermaid-viewer'])
const zoomLabel = computed(() => `${Math.round(scale.value * 100)}%`)
const viewportStyle = computed(() => ({
  height: `${Math.max(120, Math.ceil(naturalHeight.value))}px`
}))
const stageStyle = computed(() => ({
  width: `${Math.max(1, Math.ceil(naturalWidth.value * scale.value))}px`,
  height: `${Math.max(1, Math.ceil(naturalHeight.value * scale.value))}px`
}))
const contentStyle = computed(() => ({
  transform: `scale(${scale.value})`
}))

onMounted(() => {
  syncSize()

  if (content.value) {
    resizeObserver = new ResizeObserver(syncSize)
    resizeObserver.observe(content.value)

    mutationObserver = new MutationObserver(syncSize)
    mutationObserver.observe(content.value, {
      childList: true,
      subtree: true,
      attributes: true
    })
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  mutationObserver?.disconnect()
})

function syncSize() {
  const element = content.value
  if (!element) return

  naturalWidth.value = Math.max(1, element.scrollWidth, element.offsetWidth)
  naturalHeight.value = Math.max(1, element.scrollHeight, element.offsetHeight)
}

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value))
}

function setScale(value: number, anchor?: { x: number; y: number }) {
  const element = viewport.value
  const previousScale = scale.value
  const nextScale = clampScale(value)

  if (nextScale === previousScale) return

  const anchorX = anchor?.x ?? (element?.clientWidth ?? 0) / 2
  const anchorY = anchor?.y ?? (element?.clientHeight ?? 0) / 2
  const contentX = element ? (element.scrollLeft + anchorX) / previousScale : 0
  const contentY = element ? (element.scrollTop + anchorY) / previousScale : 0

  scale.value = nextScale

  nextTick(() => {
    syncSize()

    if (!element) return
    element.scrollLeft = contentX * nextScale - anchorX
    element.scrollTop = contentY * nextScale - anchorY
  })
}

function zoomIn() {
  setScale(scale.value * SCALE_STEP)
}

function zoomOut() {
  setScale(scale.value / SCALE_STEP)
}

function resetZoom() {
  scale.value = 1

  nextTick(() => {
    const element = viewport.value
    if (!element) return

    element.scrollLeft = 0
    element.scrollTop = 0
  })
}

function fitToWidth() {
  const element = viewport.value
  if (!element || !naturalWidth.value) return

  setScale(Math.min(1, element.clientWidth / naturalWidth.value))
}

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0 || isToolbarTarget(event.target)) return

  const element = viewport.value
  if (!element) return

  isDragging.value = true
  dragState = {
    pointerId: event.pointerId,
    x: event.clientX,
    y: event.clientY,
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  }

  element.setPointerCapture(event.pointerId)
  event.preventDefault()
}

function onPointerMove(event: PointerEvent) {
  const element = viewport.value

  if (!element || !isDragging.value || event.pointerId !== dragState.pointerId) {
    return
  }

  element.scrollLeft = dragState.scrollLeft - (event.clientX - dragState.x)
  element.scrollTop = dragState.scrollTop - (event.clientY - dragState.y)
}

function stopDragging(event: PointerEvent) {
  const element = viewport.value

  if (element?.hasPointerCapture(event.pointerId)) {
    element.releasePointerCapture(event.pointerId)
  }

  if (event.pointerId === dragState.pointerId) {
    isDragging.value = false
  }
}

function isToolbarTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest('.mermaid-toolbar'))
}
</script>

<template>
  <figure :class="rootClass">
    <div class="mermaid-toolbar" aria-label="Mermaid controls">
      <button
        type="button"
        class="mermaid-tool-button"
        title="缩小"
        aria-label="缩小"
        :disabled="scale <= MIN_SCALE"
        @click="zoomOut"
      >
        <span aria-hidden="true">-</span>
      </button>
      <button
        type="button"
        class="mermaid-tool-button mermaid-tool-button-reset"
        title="重置缩放"
        aria-label="重置缩放"
        @click="resetZoom"
      >
        <span aria-hidden="true">1:1</span>
      </button>
      <button
        type="button"
        class="mermaid-tool-button mermaid-tool-button-fit"
        title="适应宽度"
        aria-label="适应宽度"
        @click="fitToWidth"
      >
        <span aria-hidden="true"></span>
      </button>
      <button
        type="button"
        class="mermaid-tool-button"
        title="放大"
        aria-label="放大"
        :disabled="scale >= MAX_SCALE"
        @click="zoomIn"
      >
        <span aria-hidden="true">+</span>
      </button>
      <span class="mermaid-zoom-label" aria-live="polite">{{ zoomLabel }}</span>
    </div>

    <div
      ref="viewport"
      class="mermaid-viewport"
      :class="{ 'is-dragging': isDragging }"
      :style="viewportStyle"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="stopDragging"
      @pointercancel="stopDragging"
      @lostpointercapture="stopDragging"
    >
      <div class="mermaid-stage" :style="stageStyle">
        <div ref="content" class="mermaid-content" :style="contentStyle">
          <BaseMermaid :id="id" class="mermaid-rendered" :graph="graph" />
        </div>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.mermaid-viewer {
  position: relative;
  margin: 16px 0;
  border: 1px solid var(--vp-c-divider);
  background: var(--color-surface-container-high);
  overflow: hidden;
}

.mermaid-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: 6px 8px;
  color: var(--vp-c-text-1);
  background: var(--color-surface-container-higher);
  border-bottom: 1px solid var(--vp-c-divider);
}

.mermaid-tool-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: inherit;
  background: transparent;
  border-radius: var(--border-radius-control);
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
}

.mermaid-tool-button:hover:not(:disabled) {
  background: var(--color-surface-container-higher);
}

.mermaid-tool-button:disabled {
  color: var(--vp-c-text-3);
  cursor: default;
}

.mermaid-tool-button-reset {
  font-size: 11px;
}

.mermaid-tool-button-fit > span {
  position: relative;
  display: block;
  width: 14px;
  height: 10px;
  border: 1.5px solid currentColor;
}

.mermaid-tool-button-fit > span::before,
.mermaid-tool-button-fit > span::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 4px;
  border-top: 1.5px solid currentColor;
}

.mermaid-tool-button-fit > span::before {
  left: -3px;
}

.mermaid-tool-button-fit > span::after {
  right: -3px;
}

.mermaid-zoom-label {
  min-width: 40px;
  padding: 0 4px;
  font-size: 12px;
  line-height: 28px;
  text-align: center;
  color: var(--vp-c-text-2);
  user-select: none;
}

.mermaid-viewport {
  min-height: 120px;
  max-height: 72vh;
  overflow: auto;
  cursor: grab;
  overscroll-behavior: contain;
  touch-action: none;
}

.mermaid-viewport.is-dragging {
  cursor: grabbing;
}

.mermaid-stage {
  position: relative;
  min-width: 100%;
  min-height: 120px;
}

.mermaid-content {
  position: absolute;
  top: 0;
  left: 0;
  width: max-content;
  min-width: max-content;
  transform-origin: 0 0;
  user-select: none;
}

:deep(.mermaid-rendered) {
  width: max-content;
  min-width: max-content;
}

:deep(.mermaid-rendered > svg) {
  display: inline-block;
  max-width: none;
}
</style>
