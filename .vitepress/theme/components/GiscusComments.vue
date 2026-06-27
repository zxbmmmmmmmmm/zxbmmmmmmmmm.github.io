<template>
  <div class="comment" ref="container" />
</template>
<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue';
  import { useData } from 'vitepress';

  const { isDark } = useData();
  const container = ref<HTMLElement>();

  const THEME_LIGHT = 'https://zxbmmmmmmmmm.github.io/giscus-metro-light.css';
  const THEME_DARK  = 'https://zxbmmmmmmmmm.github.io/giscus-metro-dark.css';

  onMounted(() => {
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.async = true;
    s.crossOrigin = 'anonymous';
    Object.assign(s.dataset, {
      repo: 'zxbmmmmmmmmm/zxbmmmmmmmmm.github.io',
      repoId: 'R_kgDOO-ZK8w',
      category: 'General',
      categoryId: 'DIC_kwDOO-ZK884CrzrP',
      mapping: 'pathname',
      reactionsEnabled: '1',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: isDark.value ? THEME_DARK : THEME_LIGHT,
      lang: 'zh-CN',
      loading: 'eager',
    });
    container.value!.appendChild(s);
  });

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
