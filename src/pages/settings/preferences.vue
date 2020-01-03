<template>
  <div class="settings-fields">
    <h1 class="title">
      Default preferences
    </h1>

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
