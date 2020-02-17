<template>
  <div class="settings-fields">
    <div class="notification">
      <span class="icon"><font-awesome-icon icon="info-circle" /></span>
      <span>These preferences will be applied by default on new photos.</span>
    </div>

    <settings-preferences v-model="currentValue.preferences" />
  </div>
</template>

<script>
import { VModel } from '~/mixins'

export default {
  mixins: [VModel],
}
</script>

<style lang="scss" scoped>
.title {
  @apply text-white text-lg font-bold mb-4 mt-0;
}
</style>
