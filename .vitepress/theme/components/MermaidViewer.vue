<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseMermaid from 'vitepress-plugin-mermaid/Mermaid.vue'
import ZoomIn from '../icons/10/ZoomIn.vue'
import VButton from './VButton.vue'
import ZoomOut from '../icons/10/ZoomOut.vue'

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
const FIT_EPSILON = 1

const viewport = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)
const scale = ref(1)
const naturalWidth = ref(1)
const naturalHeight = ref(1)
const viewportWidth = ref(1)
const viewportHeight = ref(1)
const isDragging = ref(false)

let contentResizeObserver: ResizeObserver | null = null
let viewportResizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null
let hasAppliedInitialFit = false
let dragState = { pointerId: -1, x: 0, y: 0, scrollLeft: 0, scrollTop: 0 }

const rootClass = computed(() => [props.class, 'mermaid-viewer'])
const zoomLabel = computed(() => `${Math.round(scale.value * 100)}%`)
const viewportStyle = computed(() => ({
  height: `${Math.max(120, Math.ceil(naturalHeight.value))}px`
}))
const scaledWidth = computed(() => naturalWidth.value * scale.value)
const scaledHeight = computed(() => naturalHeight.value * scale.value)
const canFullyDisplay = computed(
  () =>
    scaledWidth.value <= viewportWidth.value + FIT_EPSILON &&
    scaledHeight.value <= viewportHeight.value + FIT_EPSILON
)
const stageWidth = computed(() =>
  canFullyDisplay.value
    ? viewportWidth.value
    : Math.max(viewportWidth.value, scaledWidth.value)
)
const stageHeight = computed(() =>
  canFullyDisplay.value
    ? viewportHeight.value
    : Math.max(viewportHeight.value, scaledHeight.value)
)
const contentLeft = computed(() =>
  Math.max(0, (stageWidth.value - scaledWidth.value) / 2)
)
const contentTop = computed(() =>
  Math.max(0, (stageHeight.value - scaledHeight.value) / 2)
)
const stageStyle = computed(() => ({
  width: `${Math.max(1, Math.ceil(stageWidth.value))}px`,
  height: `${Math.max(1, Math.ceil(stageHeight.value))}px`
}))
const contentStyle = computed(() => ({
  left: `${contentLeft.value}px`,
  top: `${contentTop.value}px`,
  transform: `scale(${scale.value})`
}))

onMounted(() => {
  syncSize()
  syncViewportSize()

  if (content.value) {
    contentResizeObserver = new ResizeObserver(syncSize)
    contentResizeObserver.observe(content.value)

    mutationObserver = new MutationObserver(syncSize)
    mutationObserver.observe(content.value, {
      childList: true,
      subtree: true,
      attributes: true
    })
  }

  if (viewport.value) {
    viewportResizeObserver = new ResizeObserver(syncViewportSize)
    viewportResizeObserver.observe(viewport.value)
  }
})

onBeforeUnmount(() => {
  contentResizeObserver?.disconnect()
  viewportResizeObserver?.disconnect()
  mutationObserver?.disconnect()
})

function syncSize() {
  const element = content.value
  if (!element) return

  const wasUnmeasured = naturalWidth.value === 1 && naturalHeight.value === 1
  naturalWidth.value = Math.max(1, element.scrollWidth, element.offsetWidth)
  naturalHeight.value = Math.max(1, element.scrollHeight, element.offsetHeight)

  nextTick(() => {
    syncViewportSize()

    if (applyInitialFit() || wasUnmeasured || canFullyDisplay.value) {
      centerViewport()
    }
  })
}

function syncViewportSize() {
  const element = viewport.value
  if (!element) return

  viewportWidth.value = Math.max(1, element.clientWidth)
  viewportHeight.value = Math.max(1, element.clientHeight)

  nextTick(() => {
    if (applyInitialFit() || canFullyDisplay.value) {
      centerViewport()
    }
  })
}

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value))
}

function setScale(value: number, anchor?: { x: number; y: number }) {
  const element = viewport.value
  const previousScale = scale.value
  const previousLeft = contentLeft.value
  const previousTop = contentTop.value
  const nextScale = clampScale(value)

  if (nextScale === previousScale) return

  const anchorX = anchor?.x ?? (element?.clientWidth ?? 0) / 2
  const anchorY = anchor?.y ?? (element?.clientHeight ?? 0) / 2
  const contentX = element
    ? (element.scrollLeft + anchorX - previousLeft) / previousScale
    : naturalWidth.value / 2
  const contentY = element
    ? (element.scrollTop + anchorY - previousTop) / previousScale
    : naturalHeight.value / 2

  scale.value = nextScale

  nextTick(() => {
    syncSize()

    if (!element) return

    if (canFullyDisplay.value) {
      centerViewport()
      return
    }

    element.scrollLeft = contentLeft.value + contentX * nextScale - anchorX
    element.scrollTop = contentTop.value + contentY * nextScale - anchorY
  })
}

function zoomIn() {
  setScale(scale.value * SCALE_STEP)
}

function zoomOut() {
  setScale(scale.value / SCALE_STEP)
}

function toggleFit() {
  const fittedScale = getFitScale()

  if (Math.abs(scale.value - fittedScale) < 0.01) {
    resetZoom()
  } else {
    fitToWidth()
  }
}

function resetZoom() {
  setScale(1, getViewportCenter())
}

function fitToWidth() {
  const element = viewport.value
  if (!element || !naturalWidth.value) return

  setScale(getFitScale(), getViewportCenter())
}

function getFitScale() {
  const element = viewport.value

  return clampScale(
    Math.min(1, element ? element.clientWidth / naturalWidth.value : 1)
  )
}

function applyInitialFit() {
  if (hasAppliedInitialFit || naturalWidth.value <= 1) return false

  const element = viewport.value
  if (!element || element.clientWidth <= 1) return false

  hasAppliedInitialFit = true
  scale.value = getFitScale()
  return true
}

function getViewportCenter() {
  const element = viewport.value

  return {
    x: (element?.clientWidth ?? 0) / 2,
    y: (element?.clientHeight ?? 0) / 2
  }
}

function centerViewport() {
  const element = viewport.value
  if (!element) return

  element.scrollLeft = Math.max(0, (stageWidth.value - element.clientWidth) / 2)
  element.scrollTop = Math.max(0, (stageHeight.value - element.clientHeight) / 2)
}

function onPointerDown(event: PointerEvent) {
  if (event.pointerType !== 'mouse' || event.button !== 0 || canFullyDisplay.value) return

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
  if (!isDragging.value || event.pointerId !== dragState.pointerId) return

  const element = viewport.value
  if (!element) return

  element.scrollLeft = dragState.scrollLeft - (event.clientX - dragState.x)
  element.scrollTop = dragState.scrollTop - (event.clientY - dragState.y)
}

function stopDragging(event: PointerEvent) {
  if (event.pointerId !== dragState.pointerId) return

  viewport.value?.releasePointerCapture(event.pointerId)
  isDragging.value = false
}
</script>

<template>
  <figure :class="rootClass">
    <div class="mermaid-toolbar" aria-label="Mermaid controls">
      <VButton
        type="button"
        class="mermaid-tool-button"
        title="缩小"
        aria-label="缩小"
        :disabled="scale <= MIN_SCALE"
        @click="zoomOut"
      >
        <ZoomOut />
      </VButton>
      <VButton @click="toggleFit">
        <span class="mermaid-zoom-label" aria-live="polite">{{
          zoomLabel
        }}</span>
      </VButton>
      <VButton
        type="button"
        class="mermaid-tool-button"
        title="放大"
        aria-label="放大"
        :disabled="scale >= MAX_SCALE"
        @click="zoomIn"
      >
        <ZoomIn />
      </VButton>
    </div>

    <div
      ref="viewport"
      class="mermaid-viewport"
      :class="{ 'is-dragging': isDragging, 'is-draggable': !canFullyDisplay }"
      :style="viewportStyle"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="stopDragging"
      @pointercancel="stopDragging"
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
  background: var(--color-surface-container-high);
  overflow: hidden;
}

.mermaid-toolbar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  color: var(--vp-c-text-1);
  background: var(--color-surface-container-higher);
}

.mermaid-tool-button {
  height: 100%;
  width: 36px;
  padding: 8px;
}

.mermaid-tool-button:disabled {
  color: var(--vp-c-text-3);
  cursor: default;
}

.mermaid-zoom-label {
  text-align: center;
  color: var(--vp-c-text-2);
  user-select: none;
  font-size: 0.9rem;
}

.mermaid-viewport {
  min-height: 120px;
  max-height: 72vh;
  overflow: auto;
  scrollbar-width: none;
}

.mermaid-viewport.is-draggable {
  cursor: grab;
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
