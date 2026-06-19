// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import type { Theme } from 'vitepress'
import TagsView from './components/TagsView.vue'
import './styles/base.css'
import './styles/vars.css'
import './styles/post.css'
import './icons/icons.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('TagsView', TagsView)
  }
} satisfies Theme
