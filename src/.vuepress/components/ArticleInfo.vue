<template>
  <div class="custom-article-info">
    <span v-if="formattedDate" class="custom-article-info__meta-item">
      <span class="custom-article-info__meta-value">{{ formattedDate }}</span>
    </span>

    <ArticleInfoChipGroup v-if="info.category?.length" :items="info.category" variant="category" />

    <ArticleInfoChipGroup v-if="info.tag?.length" :items="info.tag" variant="tag" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import type { PropType } from "vue";
import type { ArticleInfoSlotData } from "vuepress-theme-hope/client";
import ArticleInfoChipGroup from "./ArticleInfoChipGroup.vue";

export default defineComponent({
  name: "ArticleInfo",

  components: {
    ArticleInfoChipGroup,
  },

  props: {
    info: {
      type: Object as PropType<ArticleInfoSlotData>,
      required: true,
    },
  },

  setup(props) {
    const formattedDate = computed(() => props.info.date?.toLocaleDateString("zh-CN") ?? "");

    return {
      formattedDate,
    };
  },
});
</script>