// https://vitepress.dev/guide/custom-theme
import Layout from './Layout.vue'
import type { Theme } from 'vitepress'
import TagList from './components/TagList.vue'
import './styles/base.css'
import './styles/vars.css'

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('TagList', TagList)
  }
} satisfies Theme
