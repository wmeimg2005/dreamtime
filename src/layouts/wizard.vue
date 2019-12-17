<template>
  <div class="layout">
    <layout-topbar />

    <div id="layout-content" class="layout__content">
      <nuxt />
    </div>
  </div>
</template>

<script>


export default {

}
</script>

<style lang="scss" scoped>
.layout {
  @apply h-full;

  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 30px 1fr;
  grid-template-areas: "topbar" "content";

  .layout__topbar {
    grid-area: topbar;
  }

  .layout__content {
    @apply relative overflow-hidden overflow-y-auto;
    @apply p-6;
    grid-area: content;
    height: calc(100vh - 30px);
  }
}
</style>

<style lang="scss">
.layout__header {
  @apply flex justify-center items-center;
  @apply text-3xl font-semibold mb-6;
  height: 60px;

  h1 {
    @apply text-xl text-white;
  }
}
</style>
