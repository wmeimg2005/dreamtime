<template>
  <div class="nudify-preferences wrapper">
    <settings-preferences v-model="photo.preferences" />
  </div>
</template>

<script>
export default {
  computed: {
    photo() {
      return this.$parent.photo
    },
  },
}
</script>

<style lang="scss">
.nudify-preferences {

}
</style>
