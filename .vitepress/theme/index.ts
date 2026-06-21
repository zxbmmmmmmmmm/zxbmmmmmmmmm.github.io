// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import type { Theme } from 'vitepress'
import TagsView from './components/TagsView.vue'
import ProjectsView from './components/ProjectsView.vue'
import MermaidViewer from './components/MermaidViewer.vue'
import './styles/base.css'
import './styles/vars.css'
import './styles/components/custom-block.css'
import './styles/components/post.css'
import './icons/icons.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('TagsView', TagsView)
    app.component('ProjectsView', ProjectsView)
    app.component('Mermaid', MermaidViewer)
  }
} satisfies Theme
