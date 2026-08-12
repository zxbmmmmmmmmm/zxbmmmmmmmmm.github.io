<script setup lang="ts">
import ArrowRight from '../icons/8/ArrowRight.vue'
import Github from '../icons/Github.vue'
import VButton from './VButton.vue'
import People from '../icons/8/People.vue'
import Chat from '../icons/8/Chat.vue'
import GithubContributions from './GithubContributions.vue'
</script>

<template>
  <div class="tiles">
    <div class="tile tile-banner"></div>
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
  position: relative;
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
}
.tile-icon {
  position: absolute;
  fill: white;
  width: 50%;
  height: 50%;
  right: 16px;
  bottom: 12px;
  opacity: 0.15;
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
</style>
