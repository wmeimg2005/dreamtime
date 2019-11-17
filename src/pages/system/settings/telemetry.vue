<template>
  <div class="settings-fields">
    <section class="box box--items">
      <div class="box__content">
        <box-item
          label="Telemetry"
          description="Send anonymous information about the program that will help us to continue improving it. This includes: Errors, GPU information and performance.">
          <select v-model="currentValue.telemetry.enabled" class="input">
            <option :value="false">
              Disabled
            </option>
            <option :value="true">
              Enabled
            </option>
          </select>
        </box-item>
      </div>
    </section>
  </div>
</template>

<script>
import { VModel } from '~/mixins'

export default {
  mixins: [VModel],

  data: () => ({}),

  created() {
    $nucleus.track('PAGE_SETTINGS_TELEMETRY')
  },
}
</script>

<style lang="scss" scoped>
p {
  @apply mb-4;
}
</style>
