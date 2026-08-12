<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  /** Number of days to show. Defaults to one year. */
  days?: number
  username?: string
}

interface ContributionDay {
  date: string
  count: number
}

const props = withDefaults(defineProps<Props>(), {
  days: 150,
  username: 'zxbmmmmmmmmm'
})

const loading = ref(true)
const failed = ref(false)
const contributions = ref<ContributionDay[]>([])

const toDateKey = (date: Date) => date.toISOString().slice(0, 10)
const endDate = new Date()
endDate.setHours(23, 59, 59, 999)
const startDate = new Date(endDate)
startDate.setDate(startDate.getDate() - Math.max(1, props.days - 1))

// Pad to complete Sunday-to-Saturday columns, like GitHub's calendar.
const calendarStart = new Date(startDate)
calendarStart.setDate(calendarStart.getDate() - calendarStart.getDay())
calendarStart.setHours(0, 0, 0, 0)
const calendarEnd = new Date(endDate)
calendarEnd.setDate(calendarEnd.getDate() + (6 - calendarEnd.getDay()))
calendarEnd.setHours(23, 59, 59, 999)

const days = computed(() => {
  const byDate = new Map(contributions.value.map((day) => [day.date, day]))
  const result: ContributionDay[] = []
  const cursor = new Date(calendarStart)
  while (cursor <= calendarEnd) {
    const date = toDateKey(cursor)
    result.push(byDate.get(date) ?? { date, count: 0 })
    cursor.setDate(cursor.getDate() + 1)
  }
  return result
})

const maxCount = computed(() =>
  Math.max(...days.value.map((day) => day.count), 0)
)
const level = (day: ContributionDay) => {
  if (!day.count || !maxCount.value) return 0
  if (maxCount.value <= 4) return Math.min(day.count, 4)
  if (day.count >= maxCount.value * 0.75) return 4
  if (day.count >= maxCount.value * 0.5) return 3
  if (day.count >= maxCount.value * 0.25) return 2
  return 1
}

const weeks = computed(() => {
  const result: ContributionDay[][] = []
  for (let index = 0; index < days.value.length; index += 7) {
    result.push(days.value.slice(index, index + 7))
  }
  return result
})

const fetchContributions = async () => {
  loading.value = true
  failed.value = false
  try {
    // This endpoint mirrors GitHub's contribution calendar and is not limited
    // to the 90-day window of the public Events API. Only request the calendar
    // years touched by the configured range.
    const years = Array.from(
      { length: endDate.getFullYear() - startDate.getFullYear() + 1 },
      (_, index) => startDate.getFullYear() + index
    )
    const payloads = await Promise.all(
      years.map(async (year) => {
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(props.username)}?y=${year}`,
          { headers: { Accept: 'application/json' } }
        )
        if (!response.ok)
          throw new Error(`Contribution API returned ${response.status}`)
        return response.json() as Promise<{ contributions?: ContributionDay[] }>
      })
    )
    const cutoff = toDateKey(startDate)
    const end = toDateKey(endDate)
    contributions.value = payloads
      .flatMap((payload) => payload.contributions ?? [])
      .filter((day) => day.date >= cutoff && day.date <= end)
  } catch {
    failed.value = true
    contributions.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchContributions)
</script>

<template>
  <div
    class="github-contributions"
    :class="{ 'is-loading': loading, 'is-failed': failed }"
    aria-label="GitHub contributions"
  >
    <div
      class="contributions-graph"
      role="img"
      aria-label="GitHub contribution calendar"
    >
      <div class="contributions-weeks">
        <div
          v-for="(week, weekIndex) in weeks"
          :key="weekIndex"
          class="contributions-week"
        >
          <span
            v-for="day in week"
            :key="day.date"
            class="contribution-day"
            :class="`level-${level(day)}`"
            :title="`${day.count} contributions on ${day.date}`"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.github-contributions {
  width: 100%;
  min-width: 0;
}
.contributions-graph {
  width: 100%;
  overflow: hidden;
}
.contributions-weeks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(2px, 1fr));
  width: 100%;
}
.contributions-week {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  min-width: 0;
}
.contribution-day {
  display: block;
  aspect-ratio: 1;
  min-width: 2px;
  background: var(--color-secondary);
  opacity: 0.04;
}
.contribution-day.level-1 {
  opacity: 0.12;
}
.contribution-day.level-2 {
  opacity: 0.24;
}
.contribution-day.level-3 {
  opacity: 0.32;
}
.contribution-day.level-4 {
  opacity: 0.6;
}
.is-loading .contribution-day {
  opacity: 0.12;
}
.is-failed .contribution-day {
  opacity: 0.45;
}
</style>
