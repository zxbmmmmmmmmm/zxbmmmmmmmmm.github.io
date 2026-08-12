<script setup lang="ts">
import People from '../icons/8/People.vue'
import Chat from '../icons/8/Chat.vue'
import GithubContributions from './GithubContributions.vue'
import ProjectBanner from './ProjectBanner.vue'
import Tile from './Tile.vue'
</script>

<template>
  <div class="tiles">
    <Tile class="tile-banner">
      <ProjectBanner />
    </Tile>
    <div class="tiles-content">
      <Tile href="/posts">
        <h4>文章</h4>
      </Tile>
      <Tile href="https://github.com/zxbmmmmmmmmm">
        <h4>Github</h4>
        <GithubContributions class="github-contributions" />
      </Tile>
      <Tile href="/friends">
        <h4>友链</h4>
        <People class="tile-icon tile-icon-friends" />
      </Tile>
      <Tile href="/board">
        <h4>留言板</h4>
        <Chat class="tile-icon" />
      </Tile>
    </div>
  </div>
</template>

<style scoped>
.tiles {
  --tile-size: 170px;
  --tile-gap: 4px;
  --tile-rows: 2;
  --tile-columns: 3;
  position: relative;
  display: grid;
  height: calc(
    var(--tile-rows) * var(--tile-size) + (var(--tile-rows) - 1) *
      var(--tile-gap)
  );
  grid-template-columns: 1fr calc(
      var(--tile-columns) * var(--tile-size) + (var(--tile-columns) - 1) *
        var(--tile-gap)
    );
  column-gap: var(--tile-gap);
}

.tiles-content {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  row-gap: var(--tile-gap);
  column-gap: var(--tile-gap);
}

.tile-banner {
  min-width: 0;
  padding: 0;
  overflow: hidden;
}

.tile-banner > :deep(*) {
  height: 100%;
}

.tiles-content h4 {
  letter-spacing: 0.02em;
}

.tiles-content > :first-child {
  --tile-color: white;
  grid-row: 1 / 3;
  background-image: url('../assets/image.png');
  background-position: center center;
  background-size: cover;
}

.tiles-content > :nth-child(2) {
  grid-column: 2 / 4;
  overflow: hidden;
}

.tile-icon {
  position: absolute;
  width: 50%;
  height: 50%;
  right: 16px;
  bottom: 12px;
  opacity: 0.15;
  fill: var(--color-secondary);
}

.tile-icon-friends {
  height: 60%;
  width: 60%;
}

.github-contributions {
  position: absolute;
  bottom: 0;
  right: 0;
}

@media (max-width: 1000px) {
  .tiles {
    height: auto;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: clamp(240px, 42svh, 340px) calc(
        var(--tile-rows) * var(--tile-size) + (var(--tile-rows) - 1) *
          var(--tile-gap)
      );
    row-gap: var(--tile-gap);
  }
}

@media (max-width: 520px) {
  .tiles {
    --tile-size: 118px;
  }
}
</style>
