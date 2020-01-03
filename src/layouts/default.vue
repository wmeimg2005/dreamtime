<template>
  <div class="layout">
    <!-- Window Buttons -->
    <LayoutTopbar />

    <!-- Navigation -->
    <LayoutNavbar />

    <!-- Queue -->
    <LayoutQueuebar />

    <!-- Content -->
    <div id="layout-content" class="layout__content">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['wizard'],
}
</script>

<style lang="scss" scoped>
.layout {
  @apply h-full;

  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 30px 50px 1fr;
  grid-template-areas: "topbar topbar topbar" "navbar navbar navbar" "content content jobbar";

  .layout__topbar {
    grid-area: topbar;
  }

  .layout__navbar {
    grid-area: navbar;
  }

  .layout__jobbar {
    grid-area: jobbar;
  }

  .layout__content {
    @apply relative overflow-hidden overflow-y-auto;
    grid-area: content;
    height: calc(100vh - 80px);
  }
}
</style>
