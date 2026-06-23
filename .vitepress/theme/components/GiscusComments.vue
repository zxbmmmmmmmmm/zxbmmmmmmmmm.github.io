<template>
  <div class="comment">
    <component
      :is="'script'"
      src="https://giscus.app/client.js"
      data-repo="zxbmmmmmmmmm/zxbmmmmmmmmm.github.io"
      data-repo-id="R_kgDOO-ZK8w"
      data-category="General"
      data-category-id="DIC_kwDOO-ZK884CrzrP"
      data-mapping="pathname"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="bottom"
      :data-theme="initialTheme"
      data-lang="zh-CN"
      crossorigin="anonymous"
      data-loading="eager"
      async
    />
  </div>
</template>
<script setup lang="ts">
  import { watch } from 'vue';
  import { useData } from 'vitepress';

  const { isDark } = useData();

  const THEME_LIGHT = 'https://zxbmmmmmmmmm.github.io/giscus-metro-light.css';
  const THEME_DARK  = 'https://zxbmmmmmmmmm.github.io/giscus-metro-dark.css';

  const initialTheme = isDark.value ? THEME_DARK : THEME_LIGHT;

  watch(isDark, (dark) => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    iframe?.contentWindow?.postMessage(
      { giscus: { setConfig: { theme: dark ? THEME_DARK : THEME_LIGHT } } },
      'https://giscus.app'
    );
  });
</script>
<style lang="css" scoped>
</style>
