<script setup lang="ts">
import AboutCard from './AboutCard.vue'
import ArticleList from './ArticleList.vue'
import Tile from './Tile.vue'
import { data as posts } from '../posts.data'
import People from '../icons/8/People.vue'
import Tags from '../icons/8/Tags.vue'
import Bookmark from '../icons/8/Bookmark.vue'
import Projects from '../icons/8/Projects.vue'
</script>

<template>
  <div class="layout">
    <div class="content">
      <div class="home-view-header">
        <Tile class="tile-1" text="所有文章" theme="accent">
          <Bookmark />
        </Tile>
        <Tile class="tile-2" text="标签" theme="accent" href="/tags">
          <Tags />
        </Tile>
        <Tile class="tile-3" text="友链" theme="accent" href="/friends">
          <People />
        </Tile>
        <Tile class="tile-4" text="项目" theme="accent" href="/projects">
          <Projects />
        </Tile>
        <AboutCard class="about-card" />
      </div>
      <ArticleList class="article-list" :posts="posts" />
    </div>
  </div>
</template>
<style scoped>
.layout {
  padding: 24px;
  display: grid;
  gap: 24px;
}
.content {
  display: grid;
  gap: 24px;
  width: 100%;
}

.home-view-header {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr repeat(3, 108px);
  grid-template-rows: repeat(2, 108px);
  grid-auto-rows: auto;
}

.tile-1 {
  grid-column: 2 / 4;
}

.tile-3 {
  grid-row: 2;
}

.tile-4 {
  grid-column: 3 / 5;
}

.about-card {
  grid-column: 1;
  grid-row: 1 / 3;
}

.article-list {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
}

@media (max-width: 840px) {
  .home-view-header {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 216px repeat(2, 108px);
  }
  .tile-1 {
    grid-column: 1 / 3;
    grid-row: 2;
  }
  .tile-2 {
    grid-column: 3;
    grid-row: 2;
  }

  .tile-3 {
    grid-column: 1;
    grid-row: 3;
  }
  .tile-4 {
    grid-column: 2 / 4;
    grid-row: 3;
  }
  .about-card {
    grid-column: 1 / 4;
    grid-row: 1;
  }
}
@media (min-width: 1200px) {
  .content {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1200px) auto minmax(0, 1fr);
    align-items: start;
  }
  .home-view-header {
    grid-column: 3;
    grid-template-columns: repeat(3, 108px);
    grid-template-rows: 216px repeat(2, 108px);
  }
  .article-list {
    grid-column: 2;
    grid-row: 1;
    max-width: none;
    margin-inline: 0;
  }
  .tile-1 {
    grid-column: 1 / 3;
    grid-row: 2;
  }
  .tile-2 {
    grid-column: 3;
    grid-row: 2;
  }

  .tile-3 {
    grid-column: 1;
    grid-row: 3;
  }
  .tile-4 {
    grid-column: 2 / 4;
    grid-row: 3;
  }
  .about-card {
    grid-column: 1 / 4;
    grid-row: 1;
  }
}
</style>
