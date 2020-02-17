<template>
  <div class="c-preferences">
    <section v-show="currentValue.advanced.transformMode !== 'import-maskfin'" id="preferences-runs" class="box box--items">
      <div class="box__header">
        <h2 class="title">
          Per run.
        </h2>
        <h3 class="subtitle">
          Customize what will happen when you nudify.
        </h3>
      </div>

      <div class="box__content">
        <box-item
          label="Runs."
          description="Number of times the photo will be nudified.">
          <input v-model="currentValue.body.executions" type="number" min="1" class="input">
        </box-item>

        <box-item
          label="Randomize."
          description="Set random body preferences at each run.">
          <select v-model="currentValue.body.randomize" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>

        <box-item
          v-show="!currentValue.body.randomize"
          label="Progressive."
          :description="`Body preferences will increase ${currentValue.body.progressive.rate} at each run.`">
          <select v-model="currentValue.body.progressive.enabled" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>

        <box-item
          v-show="!currentValue.body.randomize && currentValue.body.progressive.enabled"
          label="Progressive rate."
          :description="`Value: ${currentValue.body.progressive.rate}`">
          <VueSlider v-model="currentValue.body.progressive.rate" :min="0.1" :max="0.9" :interval="0.05" />
        </box-item>
      </div>
    </section>

    <!-- Boobs -->
    <Preference id="preferences-body" v-model="currentValue.body.boobs" label="Boobs" />

    <!-- Areola -->
    <Preference v-model="currentValue.body.areola" label="Areola" :min="0" />

    <!-- Nipple -->
    <Preference v-model="currentValue.body.nipple" label="Nipple" :min="0" />

    <!-- Vagina -->
    <Preference v-model="currentValue.body.vagina" label="Vagina" :max="1.5" />

    <!-- Pubic Hair -->
    <Preference v-model="currentValue.body.pubicHair" label="Pubic Hair" :min="0" />

    <!-- Advanced -->
    <section id="preferences-advanced" class="box box--items">
      <div class="box__header">
        <h2 class="title">
          Advanced.
        </h2>
        <h3 class="subtitle">
          Additional processing settings.
        </h3>
      </div>

      <div class="box__content">
        <box-item
          id="preferences-advanced-scale"
          label="Scale method."
          description="Indicates how the photo will be scaled, this changes the quality of the result dramatically.">
          <select v-model="currentValue.advanced.scaleMode" class="input">
            <option value="none">
              None
            </option>
            <option value="auto-rescale">
              Fixed
            </option>
            <option value="auto-resize">
              Scale and pad
            </option>
            <option value="auto-resize-crop">
              Scale and crop
            </option>
            <option value="overlay">
              Overlay
            </option>
            <option value="cropjs">
              Crop
            </option>
          </select>
        </box-item>

        <box-item
          id="preferences-advanced-color"
          label="Color transfer."
          description="Use a experimental algorithm to try to recover the original colors of the photo.">
          <select v-model="currentValue.advanced.useColorTransfer" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>

        <box-item
          label="Transformation method."
          description="Advanced users. Indicates additional options for transformation.">
          <select v-model="currentValue.advanced.transformMode" class="input">
            <option value="normal">
              Nudify
            </option>
            <option value="export-maskfin">
              Nudify & Maskfin
            </option>
            <option value="import-maskfin">
              Nudify with Maskfin
            </option>
          </select>
        </box-item>
      </div>
    </section>
  </div>
</template>

<script>
import { tutorial } from '~/modules'
import { VModel } from '~/mixins'

export default {
  mixins: [VModel],

  mounted() {
    tutorial.preferences()
  },
}
</script>
