<template>
  <main class="projects-page">
    <section class="projects-hero">
      <div
        v-for="row in rows"
        :key="row.id"
        class="projects-row"
        :style="{ '--row-columns': row.columns }"
      >
        <template v-for="tile in row.tiles" :key="tile.id">
          <article
            v-if="tile.kind === 'project'"
            class="projects-card"
            :class="`projects-card--${tile.size}`"
            tabindex="0"
          >
            <div class="projects-card__face projects-card__face--tile" aria-hidden="true">
              <div class="projects-card__icon-mark">{{ tile.icon }}</div>
              <p class="projects-card__name">{{ tile.name }}</p>
            </div>

            <div class="projects-card__face projects-card__face--detail">
              <p class="lab-label">{{ tile.name }}</p>
              <p class="projects-card__description">{{ tile.description }}</p>
            </div>
          </article>
        </template>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
type CardSize = "large" | "wide" | "small";

type ProjectTile = {
  id: string;
  kind: "project";
  name: string;
  icon: string;
  size: CardSize;
  description: string;
};

type EmptyTile = {
  id: string;
  kind: "empty";
  size: CardSize;
};

type Tile = ProjectTile | EmptyTile;

type TileRow = {
  id: string;
  columns: number;
  tiles: Tile[];
};

const rows: TileRow[] = [
  {
    id: "row-1-routing",
    columns: 6,
    tiles: [
      {
        id: "routing",
        kind: "project",
        name: "Routing",
        icon: "R",
        size: "wide",
        description: "通过 createPage 在构建阶段挂载 /lab/，保留站点原有导航和页脚。",
      },
      {
        id: "build",
        kind: "project",
        name: "Build",
        icon: "B",
        size: "small",
        description: "构建产物与页面注册流程。",
      },
      {
        id: "vue-sfc",
        kind: "project",
        name: "Vue SFC",
        icon: "V",
        size: "wide",
        description: "这里可以自由使用 template、script setup、scoped style，以及任意 Vue 逻辑。",
      },
    ],
  },
  {
    id: "row-2-lab",
    columns: 8,
    tiles: [
      {
        id: "overview",
        kind: "project",
        name: "Overview",
        icon: "O",
        size: "large",
        description: "大磁贴支持 2x2 跨格展示，适合放置总览、精选项目或需要更强视觉权重的入口。",
      },
      {
        id: "style",
        kind: "project",
        name: "Style",
        icon: "S",
        size: "small",
        description: "页面风格和主题变量联动。",
      },
      {
        id: "theme",
        kind: "project",
        name: "Theme",
        icon: "T",
        size: "wide",
        description: "页面仍然运行在 Theme Hope 的 Layout 内，因此头部导航和页脚会正常保留。",
      },
      {
        id: "posts",
        kind: "project",
        name: "Posts",
        icon: "P",
        size: "small",
        description: "博客内容与自定义页面并存。",
      },
      {
        id: "deploy",
        kind: "project",
        name: "Deploy",
        icon: "D",
        size: "wide",
        description: "静态站点构建完成后可直接发布到 GitHub Pages。",
      },
      {
        id: "assets",
        kind: "project",
        name: "Assets",
        icon: "A",
        size: "small",
        description: "文章配图和页面资源统一在站点中管理。",
      },
      {
        id: "assets",
        kind: "project",
        name: "Assets",
        icon: "A",
        size: "wide",
        description: "文章配图和页面资源统一在站点中管理。",
      },
    ],
  },
  {
    id: "row-3-content",
    columns: 6,
    tiles: [
      {
        id: "search",
        kind: "project",
        name: "Search",
        icon: "Q",
        size: "small",
        description: "内容索引和页面入口可以进一步扩展。",
      },
      {
        id: "media",
        kind: "project",
        name: "Media",
        icon: "M",
        size: "wide",
        description: "项目磁贴、文章封面和独立页面可以共享一套视觉资源。",
      },
      {
        id: "theme-lab",
        kind: "project",
        name: "Theme Lab",
        icon: "L",
        size: "small",
        description: "实验新的页面布局和主题表达。",
      },
      {
        id: "notes",
        kind: "project",
        name: "Notes",
        icon: "N",
        size: "small",
        description: "用于承接后续内容分区或工具页。",
      },
    ],
  },
];
</script>

<style scoped>
.projects-page {
  width: 100%;
}

.projects-hero {
  --tile-unit: clamp(104px, 11vw, 118px);
  --tile-gap: clamp(0.3rem, 0.8vw, 0.56rem);
  --projects-hero-image: url("/assets/images/background.jpg");

  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--tile-gap);
  padding: 1rem;
  overflow: hidden;
  background: var(--projects-hero-image) center / cover no-repeat;
}

.projects-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(8, 12, 18, 0.34), rgba(8, 12, 18, 0.16)),
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.14), transparent 36%),
    radial-gradient(circle at bottom left, rgba(255, 255, 255, 0.08), transparent 32%);
  pointer-events: none;
}

.projects-row {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(var(--row-columns), var(--tile-unit));
  grid-auto-rows: var(--tile-unit);
  gap: var(--tile-gap);
  width: max-content;
  max-width: 100%;
}

.projects-card {
  position: relative;
  min-height: var(--tile-unit);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.08)),
    rgba(12, 18, 28, 0.2);
  box-shadow:
    0 16px 30px -24px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(18px) saturate(135%);
  -webkit-backdrop-filter: blur(18px) saturate(135%);
  color: #fff;
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
  outline: none;
}

.projects-card--small {
  grid-column: span 1;
}

.projects-card--wide {
  grid-column: span 2;
}

.projects-card--large {
  grid-column: span 2;
  grid-row: span 2;
}


.projects-card::before,
.projects-card::after {
  content: "";
  position: absolute;
  inset: auto;
  pointer-events: none;
}


.projects-card:hover,
.projects-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.34);
  box-shadow:
    0 22px 36px -24px rgba(0, 0, 0, 0.52),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.projects-card__face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.projects-card__face--tile {
  justify-content: center;
  align-items: center;
  padding: 0.95rem;
}

.projects-card--large .projects-card__face--tile {
  padding: 1.15rem;
}

.projects-card__face--detail {
  justify-content: flex-end;
  gap: 0.25rem;
  padding: 0.9rem;
  background:
    linear-gradient(180deg, rgba(10, 16, 24, 0.08), rgba(10, 16, 24, 0.72) 38%, rgba(10, 16, 24, 0.84));
  opacity: 0;
  transform: translateY(16px);
}

.projects-card--large .projects-card__face--detail {
  gap: 0.45rem;
  padding: 1rem;
}

.projects-card:hover .projects-card__face--tile,
.projects-card:focus-visible .projects-card__face--tile {
  opacity: 0;
  transform: scale(1.06);
}

.projects-card:hover .projects-card__face--detail,
.projects-card:focus-visible .projects-card__face--detail {
  opacity: 1;
  transform: translateY(0);
}


.projects-card__icon-mark {
  display: grid;
  place-items: center;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.14);
  color: rgba(255, 255, 255, 0.96);
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-indent: 0.08em;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 8px 18px -14px rgba(0, 0, 0, 0.45);
}

.projects-card--large .projects-card__icon-mark {
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  font-size: 1.95rem;
}

.projects-card--small .projects-card__icon-mark {
  width: 2.8rem;
  height: 2.8rem;
  font-size: 1.32rem;
}

.projects-card__name {
  position: absolute;
  left: 0.64rem;
  bottom: 0.48rem;
  margin: 0;
  font-size: 0.88rem;
  letter-spacing: 0.02em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
}

.lab-label {
  margin: 0;
  font-size: 0.94rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.projects-card__description {
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.84rem;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}

.projects-card--large .projects-card__description {
  -webkit-line-clamp: 5;
  line-clamp: 5;
}


@media (max-width: 719px) {
  .projects-hero {
    --tile-unit: clamp(92px, 18vw, 104px);
    --tile-gap: 0.26rem;

    width: 100%;
    padding: 0.75rem;
  }

  .projects-card {
    min-height: var(--tile-unit);
  }

  .projects-row {
    transform: scale(0.92);
    transform-origin: left top;
  }

  .projects-card__icon-mark {
    width: 2.9rem;
    height: 2.9rem;
    font-size: 1.42rem;
  }

  .projects-card--large .projects-card__icon-mark {
    width: 3.45rem;
    height: 3.45rem;
    font-size: 1.68rem;
  }

  .projects-card--small .projects-card__icon-mark {
    width: 2.55rem;
    height: 2.55rem;
    font-size: 1.2rem;
  }

  .projects-card__description {
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
}

@media (max-width: 430px) {
  .projects-hero {
    --tile-unit: clamp(92px, 28vw, 108px);
    align-items: stretch;
  }

  .projects-row {
    grid-template-columns: repeat(4, minmax(0, var(--tile-unit)));
    width: 100%;
    justify-content: start;
    transform: none;
  }

  .projects-card {
    min-height: var(--tile-unit);
  }

}
</style>