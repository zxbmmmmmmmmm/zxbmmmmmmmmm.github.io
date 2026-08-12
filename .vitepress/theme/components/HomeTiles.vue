<script setup lang="ts">
import ArrowRight from '../icons/8/ArrowRight.vue'
import Github from '../icons/Github.vue'
import VButton from './VButton.vue'
import People from '../icons/8/People.vue'
import Chat from '../icons/8/Chat.vue'
import GithubContributions from './GithubContributions.vue'
import ProjectBanner from './ProjectBanner.vue'
</script>

<template>
  <div class="tiles">
    <ProjectBanner class="tile tile-banner" />
    <div class="tiles-content">
      <div class="tile tile-articles">
        <h4>文章</h4>
      </div>
      <div class="tile tile-github">
        <h4>Github</h4>
        <GithubContributions class="github-contributions" />
      </div>
      <div class="tile">
        <h4>友链</h4>
        <People class="tile-icon tile-icon-friends" />
      </div>
      <div class="tile">
        <h4>留言板</h4>
        <Chat class="tile-icon" />
      </div>
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
.tile {
  padding: 16px 20px;
  background-color: var(--color-secondary-fg);
  color: var(--color-text);
  position: relative;
  transition: border-color scale 0.4s ease;
  box-shadow:
    inset 0 0 0 0 white,
    0 0 0 0 black;
  transition: 0.3s ease;
}
.tile-banner {
  min-width: 0;
  padding: 0;
}
.tile h4 {
  letter-spacing: 0.02em;
}
.tile-github {
  grid-column: 2 / 4;
  overflow: hidden;
}
.tile-articles {
  grid-row: 1 / 3;
  background-image: url('../assets/image.png');
  background-position: center center;
  background-size: cover;
  color: white;
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
  bottom: 0px;
  right: 0px;
}
@media (hover: hover) {
  .tile:hover {
    scale: 1.05;
    z-index: 1;
    box-shadow: inset 0 0 0 2px white,
    0 10px 25px -5px black;
  }
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

  .tile {
    padding: 12px;
  }

  .tile-banner {
    padding: 0;
  }
}
</style>
