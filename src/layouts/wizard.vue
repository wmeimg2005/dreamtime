<template>
  <div class="layout">
    <!-- Window Buttons -->
    <LayoutTopbar />

    <!-- Content -->
    <div id="layout-content" class="layout__content">
      <div class="container">
        <nuxt />
      </div>
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
    @apply border-t border-dark-500;
    grid-area: content;
    height: calc(100vh - 30px);

    .container {
      @apply h-full m-auto;
    }
  }
}
</style>

<style lang="scss">
.layout__header {
  @apply flex flex-col justify-center items-center;
  @apply font-semibold mb-8;
  @apply border-b border-dark-500;
  height: 90px;

  .title {
    @apply text-xl text-white;
  }

  .subtitle {
    @apply text-lg;
  }
}
</style>
