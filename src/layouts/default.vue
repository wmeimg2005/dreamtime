<template>
  <div class="layout">
    <layout-topbar />

    <layout-navbar />

    <layout-navigation v-if="false" />

    <layout-jobbar />

    <div class="layout__content">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  middleware: ['checks'],
}
</script>


<style lang="scss">
.layout {
  @apply h-full;

  display: grid;
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: 30px 50px 1fr;
  grid-template-areas: "topbar topbar topbar" "jobbar navbar navbar" "jobbar content content";

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
    @apply overflow-hidden overflow-y-auto;
    grid-area: content;
    height: calc(100vh - 80px);
  }
}
</style>
