<template>
  <div class="nudify-preferences wrapper">
    <div class="notification">
      <span class="icon"><font-awesome-icon icon="info-circle" /></span>
      <span>These preferences will only apply to the current photo. To change global preferences visit the <nuxt-link to="/settings/preferences">settings</nuxt-link>.</span>
    </div>

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
