<template>
  <div class="settings-fields">
    <p class="notification">These are the default preferences, you can change them before each transformation.</p>

    <section class="settings-fields-section">
      <form-inline-field
        label="Number of executions"
        hint="The transformation process will be repeated this number of times and you can select the one that has the best result.">
        <input v-model="currentValue.preferences.executions" type="number" min="1" class="input" />
      </form-inline-field>

      <form-inline-field
        label="Boobs Size"
        hint="The algorithm will try to create the indicated size">
        <select v-model="currentValue.preferences.boobsSize" class="input">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="big">Big</option>
        </select>
      </form-inline-field>

      <form-inline-field
        label="Pubic Hair Size"
        hint="The algorithm will try to create the indicated size">
        <select v-model="currentValue.preferences.pubicHairSize" class="input">
          <option value="none">None</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="big">Big</option>
        </select>
      </form-inline-field>

      <form-inline-field
        label="Use Custom Mask"
        hint="(Advanced) You can edit the masks of the photo before processing.">
        <select v-model="currentValue.preferences.useCustomMask" class="input">
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


