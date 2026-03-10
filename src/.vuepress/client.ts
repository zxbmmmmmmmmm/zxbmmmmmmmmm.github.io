import { h } from "vue";
import { defineClientConfig, RouteLink } from "vuepress/client";
import type { ArticleInfoSlotData } from "vuepress-theme-hope/client";
import { Blog } from "vuepress-theme-hope/blog";

const renderInfoLabel = (label: string, value: string) =>
    h("span", { class: "custom-article-info__meta-item" }, [
        h("span", { class: "custom-article-info__meta-label" }, `${label} `),
        h("span", { class: "custom-article-info__meta-value" }, value),
    ]);

const renderChipGroup = (
    label: string,
    items: { name: string; path?: string }[],
    variant: "category" | "tag",
) =>
    h("span", { class: "custom-article-info__group" }, [
        h(
            "span",
            { class: "custom-article-info__chips" },
            items.map((item) =>
                item.path
                    ? h(
                        RouteLink,
                        {
                            to: item.path,
                            class: ["custom-article-info__chip", `custom-article-info__chip--${variant}`],
                        },
                        () => item.name,
                    )
                    : h(
                        "span",
                        {
                            class: ["custom-article-info__chip", `custom-article-info__chip--${variant}`],
                        },
                        item.name,
                    ),
            ),
        ),
    ]);

const renderArticleInfo = (info: ArticleInfoSlotData) => {
    const children = [];
    const metaItems = [];

    if (info.date)
        metaItems.push(
            h("span", { class: "custom-article-info__meta-item" },
                h("span", { class: "custom-article-info__meta-value" }, info.date.toLocaleDateString("zh-CN"))
            ));

    if (metaItems.length)
        children.push(...metaItems);

    if (info.category?.length)
        children.push(renderChipGroup("分类", info.category, "category"));

    if (info.tag?.length)
        children.push(renderChipGroup("标签", info.tag, "tag"));

    return h("div", { class: "custom-article-info" }, children);
};

export default defineClientConfig({
    layouts: {
        Blog: () =>
            h(Blog, null, {
                articleInfo: (info: ArticleInfoSlotData) => renderArticleInfo(info),
            }),
    },
});