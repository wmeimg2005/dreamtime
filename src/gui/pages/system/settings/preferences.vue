<template>
  <div class="settings-fields">
    <p class="notification">These are the default preferences, you can change them before each transformation.</p>

    <settings-preferences v-model="currentValue.preferences" />
  </div>
</template>

<script>
import { VModel } from '~/mixins'

export default {
  mixins: [VModel]
}
</script>

<style lang="scss" scoped>
p {
  @apply mb-5;
}
</style>
