<template>
  <div class="settings-fields">
    <section class="settings-fields-section">
      <form-inline-field
        label="Telemetry"
        hint="Send anonymous information about the program that will help us to continue improving it. This includes: Errors, GPU information, performance and number of people using the application.">
        <select v-model="currentValue.telemetry.enabled" class="input">
          <option :value="false">Disabled</option>
          <option :value="true">Enabled</option>
        </select>
      </form-inline-field>
    </section>
  </div>
</template>

<script>
import { VModel } from '~/mixins'

export default {
  mixins: [VModel],

  data: () => ({}),

  created() {}
}
</script>

<style lang="scss" scoped>
p {
  @apply mb-5;
}
</style>


