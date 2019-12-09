<template>
  <div class="home content-body">
    <div v-if="alert" class="notification" v-html="alert" />

    <!-- Quick Upload -->
    <nudify-upload />
  </div>
</template>

<script>
const { nucleus } = $provider.services

export default {
  computed: {
    alert() {
      return nucleus.alerts?.index
    },
  },
}
</script>

<style lang="scss" scoped>
.home {

}
</style>
