<template>
  <div class="settings-fields">
    <section class="box box--items">
      <div class="box__content">
        <box-item
          label="Bug report."
          description="Allow to report errors automatically.">
          <select v-model="currentValue.telemetry.bugs" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>

        <box-item
          label="Session tracking."
          description="Allow to send detailed information about how you use the application. (No sensitive information or photos will be sent)">
          <select v-model="currentValue.telemetry.dom" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
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
}
</script>

<style lang="scss" scoped>
p {
  @apply mb-4;
}
</style>
