// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import type { Theme } from 'vitepress'
import TagsView from './components/TagsView.vue'
import ProjectsView from './components/ProjectsView.vue'
import MermaidViewer from './components/MermaidViewer.vue'
import FriendsView from './components/FriendsView.vue'
import PostsView from './components/PostsView.vue'
import './styles/base.css'
import './styles/vars.css'
import './styles/utilities.css'
import './styles/components/custom-block.css'
import './styles/components/post.css'
import './icons/icons.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('TagsView', TagsView)
    app.component('PostsView', PostsView)
    app.component('ProjectsView', ProjectsView)
    app.component('Mermaid', MermaidViewer)
    app.component('FriendsView', FriendsView)
  }
} satisfies Theme
