<template>
  <div class="vp-article-wrapper" @click="handleWrapperClick">
    <article class="vp-article-item" vocab="https://schema.org/" typeof="Article">
      <slot name="articleCover" :cover="cover">
        <template v-if="cover">
          <img class="vp-article-cover" :src="coverSrc" alt="" loading="lazy">
          <meta property="image" :content="coverSrc">
        </template>
      </slot>

      <StickyIcon v-if="sticky" />

      <RouteLink :to="path">
        <slot name="articleTitle" :title="title" :is-encrypted="isEncrypted" :type="type">
          <header class="vp-article-title">
            <LockIcon v-if="isEncrypted" />
            <SlideIcon v-if="type === 'slide'" />
            <span property="headline">{{ title }}</span>
          </header>
        </slot>
      </RouteLink>

      <slot name="articleInfo" v-bind="pageInfo">
        <PageInfo :info="pageInfo" :items="items" @click.stop />
      </slot>

      <hr class="vp-article-hr">

      <slot name="articleExcerpt" :excerpt="excerpt">
        <div v-if="excerptPreview" class="vp-article-excerpt" v-html="excerptPreview" />
      </slot>
    </article>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRef } from "vue";
import { RouteLink, useRouter, withBase } from "vuepress/client";

import { SlideIcon, StickyIcon } from "vuepress-theme-hope/components/blog/icons";
import LockIcon from "vuepress-theme-hope/components/encrypt/LockIcon";
import PageInfo from "vuepress-theme-hope/components/info/PageInfo";
import { useArticleInfo } from "vuepress-theme-hope/composables/blog/useArticleInfo";
import type { PropType } from "vue";
import type { ArticleInfoData } from "vuepress-theme-hope/client";

import "vuepress-theme-hope/styles/blog/article-item.scss";

const getExcerptParagraphs = (excerpt: string, count: number): string => {
  const paragraphMatches = [...excerpt.matchAll(/<p\b[^>]*>[\s\S]*?<\/p>/gi)]
    .slice(0, count)
    .map(([paragraph]) => paragraph.trim());

  if (paragraphMatches.length) return paragraphMatches.join("");

  return excerpt.trim();
};

export default defineComponent({
  name: "ArticleItem",

  components: {
    LockIcon,
    PageInfo,
    RouteLink,
    SlideIcon,
    StickyIcon,
  },

  props: {
    info: {
      type: Object as PropType<ArticleInfoData>,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const articleInfo = toRef(props, "info");
    const { info: pageInfo, items } = useArticleInfo(props);
    const router = useRouter();

    const cover = computed(() => articleInfo.value.cover ?? null);
    const coverSrc = computed(() => (cover.value ? withBase(cover.value) : ""));
    const excerpt = computed(() => articleInfo.value.excerpt ?? null);
    const excerptPreview = computed(() =>
      excerpt.value ? getExcerptParagraphs(excerpt.value, 2) : null,
    );
    const isEncrypted = computed(() => articleInfo.value.isEncrypted ?? false);
    const sticky = computed(() => articleInfo.value.sticky ?? false);
    const title = computed(() => articleInfo.value.title);
    const type = computed(() => articleInfo.value.type);

    const handleWrapperClick = (event: MouseEvent): void => {
      if ((event.target as HTMLElement | undefined)?.matches("summary")) return;

      event.preventDefault();
      void router.push(props.path);
    };

    return {
      cover,
      coverSrc,
      excerpt,
      excerptPreview,
      handleWrapperClick,
      isEncrypted,
      items,
      pageInfo,
      sticky,
      title,
      type,
    };
  },
});
</script>