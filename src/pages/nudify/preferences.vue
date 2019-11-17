<template>
  <div class="nudify-preferences">
    <settings-preferences v-model="photo.preferences" />
  </div>
</template>

<script>
export default {
  computed: {
    photo() {
      return this.$nudify.photo
    },
  },
}
</script>

<style lang="scss">
.nudify-preferences {

}
</style>
