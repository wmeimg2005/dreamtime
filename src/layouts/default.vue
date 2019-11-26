<template>
  <div class="layout">
    <layout-topbar />

    <layout-navbar />

    <div class="layout__body">
      <layout-navigation v-if="false" />
      <layout-jobs />

      <div class="layout__content">
        <nuxt />
      </div>
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
  @apply flex flex-col h-full;

  .layout__body {
    @apply flex-1 flex;
  }

  .layout__content {
    @apply flex-1 h-screen overflow-hidden overflow-y-auto;

    /*
    .content {
      @apply flex-1 relative;
      height: 90vh;
    }
    */
  }
}
</style>
