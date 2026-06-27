<template>
  <div class="layout">
    <img class="akrin" src="./assets/akrin.png" />
    <div class="description">
      <h1>404 Not Found</h1>
      <h3>这里似乎什么都没有</h3>
    </div>
  </div>
</template>
<style scoped>
.layout {
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  gap:32px;
}
.description{
  margin: auto 0;
}
.description h1{
  font-size: 56px;
}
.akrin{
  height: 500px;
}
@media (max-width:960px){
  .description h1{
    font-size: 42px;
  }
  .description{
    text-align: center;
  }
  .layout{
    flex-direction: column;
  }
}
@media (prefers-color-scheme: dark) {
  .akrin {
    filter: invert();
  }
}
</style>
