<template>
  <div class="c-preferences">
    <section v-show="currentValue.advanced.transformMode !== 'import-maskfin'" class="box box--items">
      <div class="box__header">
        <h2 class="title">
          Per run.
        </h2>
        <h3 class="subtitle">
          Customize what will happen in each transformation.
        </h3>
      </div>

      <div class="box__content">
        <box-item
          label="Runs."
          description="Number of times the photo will be transformed.">
          <input v-model="currentValue.body.executions" type="number" min="1" class="input">
        </box-item>

        <box-item
          label="Randomize."
          description="Random body preferences will be set at each run.">
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
          :description="`Body preferences will increase their value ${currentValue.body.progressive.rate} at each run.`">
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
          v-show="!currentValue.body.randomize"
          label="Progressive Rate."
          :description="`Value: ${currentValue.body.progressive.rate}`">
          <VueSlider v-model="currentValue.body.progressive.rate" :min="0.1" :max="0.9" :interval="0.05" />
        </box-item>
      </div>
    </section>

    <!-- Boobs -->
    <Preference v-model="currentValue.body.boobs" label="Boobs" />

    <!-- Areola -->
    <Preference v-model="currentValue.body.areola" label="Areola" />

    <!-- Nipple -->
    <Preference v-model="currentValue.body.nipple" label="Nipple" />

    <!-- Vagina -->
    <Preference v-model="currentValue.body.vagina" label="Vagina" :max-range="1.5" />

    <!-- Pubic Hair -->
    <Preference v-model="currentValue.body.pubicHair" label="Pubic Hair" :min-range="0" />

    <!-- Advanced -->
    <section class="box box--items">
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
          label="Scale method."
          description="Method to scale the photo to 512x512">
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
              Manual crop
            </option>
          </select>
        </box-item>

        <box-item
          label="Transform method."
          description="Transformation method, only recommended for advanced users.">
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

        <box-item
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
