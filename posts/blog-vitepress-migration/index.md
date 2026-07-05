---
title: 博客已迁移至VitePress
date: 2026-07-04
tag:
  - 前端
  - Vue
---

忙活了两周，总算迁移过来了！

---

去年的这个时候，我使用[vuepress-next](https://v2.vuepress.vuejs.org/)搭建了这个博客

原博客的主题基于[vuepress-theme-hope](https://theme-hope.vuejs.press/)，虽然提供了开箱即用的博客功能，但样式还是不太符合我的口味

![原主题](/01.png)

我本想在原主题上进一步修改，但我之前对前端一窍不通，让AI大改了一通反而越改越奇怪，自己也看不懂AI拉的CSS，于是寻思着能不能找个时机换个主题或者彻底重写一通...

后面发现VuePress的正统继承者[VitePress](https://vitepress.dev/)，尽管它的默认主题更像是一个文档而非博客网站，而现有的第三方主题大多基于默认主题，也不太能满足要求

但好在VitePress提供了完全自定义主题的能力，那我们只要用他的SSG功能，从零开始构建主题就行

***

还是想让自己的博客更有特色一点（可能也有一点情怀在？），最后用了Metro的设计风格

这是主页的初稿：

![主页初稿](/02.png)

后来寻思主页只展示文章还是太单调了，而且磁贴部分加的有些生硬，就仿照Windows 8的官网改成了现在这个样子

最终效果如下：

![修改后](/03.png)

![文章页面](/04.png)

现在的主题还是有点耦合，之后可能会找个时间，把主题配置文件啥的拆出来单独发布（当然代码已经在[zxbmmmmmmmmm/zxbmmmmmmmmm.github.io](https://github.com/zxbmmmmmmmmm/zxbmmmmmmmmm.github.io)上了）
