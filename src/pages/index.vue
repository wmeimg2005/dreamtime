<template>
  <div class="home">
    <div class="content-body">
      <div v-if="alert" class="notification is-warning" v-html="alert" />

      <!-- Quick Upload -->
      <nudity-upload />
    </div>
  </div>
</template>

<script>
const { nucleus } = $provider.services

export default {
  data: () => ({}),

  computed: {
    alert() {
      return nucleus.enabled ? nucleus.alerts.index : undefined
    },
  },

  created() {},
}
</script>

<style lang="scss">
.home {

}
</style>
