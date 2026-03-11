<template>
  <span v-if="items.length" class="custom-article-info__group">
    <span class="custom-article-info__chips">
      <template v-for="item in items" :key="`${variant}-${item.name}-${item.path ?? ''}`">
        <RouteLink
          v-if="item.path"
          :to="item.path"
          :class="['custom-article-info__chip', `custom-article-info__chip--${variant}`]"
        >
          {{ item.name }}
        </RouteLink>
        <span v-else :class="['custom-article-info__chip', `custom-article-info__chip--${variant}`]">
          {{ item.name }}
        </span>
      </template>
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouteLink } from "vuepress/client";
import type { PropType } from "vue";

type ArticleInfoChipItem = {
  name: string;
  path?: string;
};

export default defineComponent({
  name: "ArticleInfoChipGroup",

  components: {
    RouteLink,
  },

  props: {
    items: {
      type: Array as PropType<ArticleInfoChipItem[]>,
      required: true,
    },
    variant: {
      type: String as PropType<"category" | "tag">,
      required: true,
    },
  },
});
</script>