import { h } from "vue";
import { defineClientConfig } from "vuepress/client";
import type { ArticleInfoSlotData } from "vuepress-theme-hope/client";
import { Blog } from "vuepress-theme-hope/blog";
import ArticleInfo from "./components/ArticleInfo.vue";

export default defineClientConfig({
    layouts: {
        Blog: () =>
            h(Blog, null, {
                articleInfo: (info: ArticleInfoSlotData) => h(ArticleInfo, { info }),
            }),
    },
});