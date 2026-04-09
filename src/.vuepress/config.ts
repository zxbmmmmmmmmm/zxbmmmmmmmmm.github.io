import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";
import { commentPlugin } from '@vuepress/plugin-comment'
import { defineGiscusConfig } from '@vuepress/plugin-comment/client'
import { defineClientConfig } from 'vuepress/client'

import theme from "./theme.js";
import { customPagesPlugin } from "./plugins/customPagesPlugin.js";

const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
    base: "/",

    lang: "zh-CN",
    title: "Betta_Fish",
    description: "Betta_Fish 的博客",
    theme,
    plugins: [customPagesPlugin()],
    alias: {
        "@theme-hope/components/blog/ArticleItem": path.resolve(__dirname, "./components/ArticleItem.vue"),
        "@custom-pages": path.resolve(__dirname, "./components/pages"),
    }
    // 和 PWA 一起启用
    // shouldPrefetch: false,
});

