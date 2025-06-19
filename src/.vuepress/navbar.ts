import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "文章",
    link: "/posts/",
  },
  {
    text: "分类",
    link: "/category/",
  },
  {
    text: "标签",
    link: "/tag/",
  },
  {
    text: "时间线",
    link: "/timeline/",
  },
]);
