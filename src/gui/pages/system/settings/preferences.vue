<template>
  <div class="settings-fields">
    <p class="notification">These are the default preferences, you can change them before each transformation.</p>

    <section class="box box-section">
      <form-inline-field label="Boob Size">
        <div class="slider-container">
          <input type="range" class="slider" in=0.3 max=2 step=0.1 v-model="currentValue.preferences.boobsSize"></input>
          <span class="min">0.3</span>
          <span class="max">2.0</span>
        </div>

      </form-inline-field>

      <form-inline-field label="Areola Size">
        <div class="slider-container">
          <input type="range" class="slider" in=0.3 max=2 step=0.1 v-model="currentValue.preferences.areolaSize"></input>
          <span class="min">0.3</span>
          <span class="max">2.0</span>
        </div>

      </form-inline-field>

      <form-inline-field label="Nipple Size">
        <div class="slider-container">
          <input type="range" class="slider" in=0.3 max=2 step=0.1 v-model="currentValue.preferences.nippleSize"></input>
          <span class="min">0.3</span>
          <span class="max">2.0</span>
        </div>
      </form-inline-field>
        
      <box-section-item
        label="Number of executions"
        description="Because the photo transformation can be different each time here you can configure how many times your photo will be processed. In the end you can save the one you like best.">
        <input v-model="currentValue.preferences.executions" type="number" min="1" class="input" />
      </box-section-item>

      <box-section-item
        label="Boobs Size"
        description="The algorithm will try to create the indicated size">
        <select v-model="currentValue.preferences.boobsSize" class="input">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="big">Big</option>
        </select>
      </box-section-item>

      <box-section-item
        label="Pubic Hair Size"
        description="The algorithm will try to create the indicated size">
        <select v-model="currentValue.preferences.pubicHairSize" class="input">
          <option value="none">None</option>
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="big">Big</option>
        </select>
      </box-section-item>

      <form-inline-field label="Vagina Size">
        <div class="slider-container">
          <input type="range" class="slider" in=0.3 max=1.5 step=0.1 v-model="currentValue.preferences.vaginaSize"></input>
          <span class="min">0.3</span>
          <span class="max">1.5</span>
        </div>
      </form-inline-field>

      <form-inline-field label="Pubic Hair">
        <div class="slider-container">
          <input type="range" class="slider" in=0 max=2 step=0.1 v-model="currentValue.preferences.pubicHairSize"></input>
          <span class="min">None</span>
          <span class="max">2.0</span>
        </div>
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
