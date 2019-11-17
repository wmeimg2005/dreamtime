<template>
  <div class="settings-fields">
    <p class="notification">
      Preferences are applied as default and can be customized before each photo.
    </p>

    <settings-preferences v-model="currentValue.preferences" />
  </div>
</template>

<script>
import { VModel } from '~/mixins'

export default {
  mixins: [VModel],

  created() {
    $nucleus.track('PAGE_SETTINGS_PREFERENCES')
  },
}
</script>

<style lang="scss" scoped>
</style>
