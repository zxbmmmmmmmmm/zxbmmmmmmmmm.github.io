<script setup lang="ts">
defineProps<{ text: string }>()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <a href="/" class="footer-logo">Betta_Fish</a>
        <p class="footer-desc">{{ text }}</p>
      </div>
      <nav class="footer-nav">
        <div class="footer-nav-group">
          <h3 class="footer-nav-title">导航</h3>
          <ul>
            <li><a href="/tags">标签</a></li>
            <li><a href="/projects">项目</a></li>
            <li><a href="/friends">友链</a></li>
          </ul>
        </div>
        <div class="footer-nav-group">
          <h3 class="footer-nav-title">关于</h3>
          <ul>
            <li>
              <a
                href="https://github.com/zxbmmmmmmmmm"
                target="_blank"
                rel="noreferrer"
                >GitHub</a
              >
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <div class="footer-bottom">
      <div class="footer-bottom-text">
        <span>© {{ year }} Betta_Fish</span>
        <span>Built with VitePress</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--color-bg-nav);
  color: #8e8e8e;
  font-size: 0.8125rem;
  margin-top: auto;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 48px;
}

.footer-bottom-text:first-child {
  display: flex;

  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 48px;
  gap: 16px;
}

.footer-inner:first-child {
  display: flex;
  gap: 128px;
  padding-top: 2.5rem;
  padding-bottom: 2rem;
}

.footer-logo {
  display: inline-block;
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-decoration: none;
}

.footer-logo:hover {
  color: var(--color-accent);
}

.footer-desc {
  color: #8e8e8e;
  line-height: 1.6;
  max-width: 280px;
}

.footer-nav {
  display: flex;
  gap: 3rem;
}

.footer-nav-group ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-nav-title {
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.footer-nav-group a {
  color: #8e8e8e;
  text-decoration: none;
}

.footer-nav-group a:hover {
  color: #ffffff;
}

.footer-bottom {
  border-top: 1px solid #333333;
}

.footer-bottom .footer-inner {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

@media (max-width: 640px) {
  .footer-inner:first-child {
    flex-direction: column;
    gap: 1.5rem;
  }
  .footer-nav {
    gap: 2rem;
  }
}
</style>
