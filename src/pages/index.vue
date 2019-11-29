<template>
  <div class="home content-body">
    <div v-if="alert" class="notification is-warning" v-html="alert" />

    <div v-if="$nudify.photos.length >= 100" class="notification is-warning">
      The application may become unstable by keeping {{ $nudify.photos.length }} photos in the queue.
    </div>

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
