import { hasGlobalComponent } from "@vuepress/helper/client";
import { useFrontmatter } from "vuepress/client";
import { computed, defineComponent, h, resolveComponent } from "vue";
import MainLayout from "vuepress-theme-hope/components/base/MainLayout";
import SkipLink from "vuepress-theme-hope/components/base/SkipLink";

import ProjectsPage from "../components/pages/ProjectsPage.vue";

const customPageComponents = {
    ProjectsPage,
} as const;

export default defineComponent({
    name: "CustomPageLayout",

    slots: Object,

    setup(_props, { slots }) {
        const frontmatter = useFrontmatter<{ customPage?: keyof typeof customPageComponents }>();
        const currentPageComponent = computed(
            () =>
                (frontmatter.value.customPage
                    ? customPageComponents[frontmatter.value.customPage]
                    : null) ?? null,
        );

        return () => [
            h(SkipLink),
            h(MainLayout, null, {
                ...slots,
                default: () =>
                    h("main", { id: "main-content", class: "vp-page custom-page-layout" }, [
                        currentPageComponent.value ? h(currentPageComponent.value) : null,
                    ]),
                navScreenBottom:
                    slots.navScreenBottom ??
                    (hasGlobalComponent("BloggerInfo")
                        ? () => h(resolveComponent("BloggerInfo"))
                        : null),
            }),
        ];
    },
});