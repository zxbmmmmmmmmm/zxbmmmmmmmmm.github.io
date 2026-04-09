import { createPage } from "vuepress";

export const customPagesPlugin = () => ({
    name: "custom-pages",

    onInitialized: async (app) => {
        app.pages.push(
            await createPage(app, {
                path: "/projects/",
                frontmatter: {
                    title: "实验室",
                    layout: "CustomPageLayout",
                    customPage: "ProjectsPage",
                },
                content: "",
            }),
        );
    },
});