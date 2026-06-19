import { onMounted, onUnmounted, onUpdated, type Ref } from 'vue'

export interface OutlineItem {
  element: HTMLHeadingElement
  title: string
  link: string
  level: number
}

const resolvedHeaders: { element: HTMLHeadingElement; link: string }[] = []

export function getHeaders(): OutlineItem[] {
  resolvedHeaders.length = 0
  return [...document.querySelectorAll('.page_view h2, .page_view h3')]
    .filter((el): el is HTMLHeadingElement => !!el.id)
    .map((el) => {
      const item = {
        element: el as HTMLHeadingElement,
        title: serializeHeader(el),
        link: '#' + el.id,
        level: Number(el.tagName[1])
      }
      resolvedHeaders.push({ element: item.element, link: item.link })
      return item
    })
}

function serializeHeader(el: Element): string {
  let text = ''
  for (const node of el.childNodes) {
    if (node.nodeType === 1 && (node as Element).classList.contains('header-anchor')) continue
    text += node.textContent
  }
  return text.trim()
}

export function useActiveAnchor(
  container: Ref<HTMLElement | undefined>,
  marker: Ref<HTMLElement | undefined>
) {
  let prevActiveLink: HTMLAnchorElement | null = null
  let rafId = 0

  const onScroll = () => {
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(setActiveLink)
  }

  function setActiveLink() {
    const scrollY = window.scrollY
    const innerHeight = window.innerHeight
    const offsetHeight = document.body.offsetHeight
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1

    const headers = resolvedHeaders
      .map(({ element, link }) => ({ link, top: getAbsoluteTop(element) }))
      .filter(({ top }) => !isNaN(top))
      .sort((a, b) => a.top - b.top)

    if (!headers.length || scrollY < 1) { activateLink(null); return }
    if (isBottom) { activateLink(headers[headers.length - 1].link); return }

    let activeLink: string | null = null
    for (const { link, top } of headers) {
      if (top > scrollY + 128) break
      activeLink = link
    }0
    activateLink(activeLink)
  }

  function activateLink(hash: string | null) {
    if (prevActiveLink) prevActiveLink.classList.remove('active')
    if (hash == null) { prevActiveLink = null; return }
    prevActiveLink =
      container.value?.querySelector<HTMLAnchorElement>(
        `a[href="${decodeURIComponent(hash)}"]`
      ) ?? null
    if (prevActiveLink) {
      prevActiveLink.classList.add('active')
      if (marker.value) {
        marker.value.style.top = prevActiveLink.offsetTop + 39 + 'px'
        marker.value.style.opacity = '1'
      }
    } else if (marker.value) {
      marker.value.style.top = '33px'
      marker.value.style.opacity = '0'
    }
  }

  onMounted(() => {
    requestAnimationFrame(setActiveLink)
    window.addEventListener('scroll', onScroll)
  })

  onUpdated(() => activateLink(location.hash))

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(rafId)
  })
}

function getAbsoluteTop(el: HTMLElement): number {
  let top = 0
  while (el !== document.body) {
    if (!el) return NaN
    top += el.offsetTop
    el = el.offsetParent as HTMLElement
  }
  return top
}
