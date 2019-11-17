<template>
  <div class="c-preferences">
    <section class="box box--items">
      <div class="box__header">
        <h2 class="title">
          Runs
        </h2>
        <h3 class="subtitle">
          Customize what will happen in each processing.
        </h3>
      </div>

      <div class="box__content">
        <box-item
          label="Number of runs"
          description="How many times will the photo be processed?">
          <input v-model="currentValue.body.executions" type="number" min="1" class="input">
        </box-item>

        <box-item
          label="Randomize"
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
          label="Progressive"
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
          label="Progressive rate"
          :description="`Current value: ${currentValue.body.progressive.rate}`">
          <div class="slider-container">
            <input
              v-model="currentValue.body.progressive.rate"
              type="range"
              class="slider"
              min="0.1"
              max="0.9"
              step="0.1">
            <span class="min">0.1</span>
            <span class="max">0.9</span>
          </div>
        </box-item>
      </div>
    </section>

    <section class="box box--items">
      <div class="box__header">
        <h2 class="title">
          Body
        </h2>
        <h3 class="subtitle">
          Customize the body of your dream.
        </h3>
      </div>

      <div class="box__content">
        <!-- Boobs -->
        <box-item :description="`Current value: ${currentValue.body.boobs.size}`" label="Boobs size">
          <div class="slider-container">
            <input
              v-model="currentValue.body.boobs.size"
              type="range"
              class="slider"
              in="0.3"
              max="2"
              step="0.1">
            <span class="min">0.3</span>
            <span class="max">2.0</span>
          </div>
        </box-item>

        <box-item
          v-show="currentValue.body.randomize"
          label="Randomize"
          description="Randomize the value in each run."
          class="box__item--sub">
          <select v-model="currentValue.body.boobs.randomize" class="input">
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
          label="Progressive"
          description="Increase the value progressively in each run"
          class="box__item--sub">
          <select v-model="currentValue.body.boobs.progressive" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>

        <!-- Areola -->
        <box-item :description="`Current value: ${currentValue.body.areola.size}`" label="Areola size">
          <div class="slider-container">
            <input
              v-model="currentValue.body.areola.size"
              type="range"
              class="slider"
              in="0.3"
              max="2"
              step="0.1">
            <span class="min">0.3</span>
            <span class="max">2.0</span>
          </div>
        </box-item>

        <box-item
          v-show="currentValue.body.randomize"
          label="Randomize"
          description="Randomize the value in each run."
          class="box__item--sub">
          <select v-model="currentValue.body.areola.randomize" class="input">
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
          label="Progressive"
          description="Increase the value progressively in each run"
          class="box__item--sub">
          <select v-model="currentValue.body.areola.progressive" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>

        <!-- Nipple -->
        <box-item :description="`Current value: ${currentValue.body.nipple.size}`" label="Nipple Size">
          <div class="slider-container">
            <input
              v-model="currentValue.body.nipple.size"
              type="range"
              class="slider"
              in="0.3"
              max="2"
              step="0.1">
            <span class="min">0.3</span>
            <span class="max">2.0</span>
          </div>
        </box-item>

        <box-item
          v-show="currentValue.body.randomize"
          label="Randomize"
          description="Randomize the value in each run."
          class="box__item--sub">
          <select v-model="currentValue.body.nipple.randomize" class="input">
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
          label="Progressive"
          description="Increase the value progressively in each run"
          class="box__item--sub">
          <select v-model="currentValue.body.nipple.progressive" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>

        <!-- Vagina -->
        <box-item :description="`Current value: ${currentValue.body.vagina.size}`" label="Vagina Size">
          <div class="slider-container">
            <input
              v-model="currentValue.body.vagina.size"
              type="range"
              class="slider"
              in="0.3"
              max="1.5"
              step="0.1"></input>
            <span class="min">0.3</span>
            <span class="max">1.5</span>
          </div>
        </box-item>

        <box-item
          v-show="currentValue.body.randomize"
          label="Randomize"
          description="Randomize the value in each run."
          class="box__item--sub">
          <select v-model="currentValue.body.vagina.randomize" class="input">
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
          label="Progressive"
          description="Increase the value progressively in each run"
          class="box__item--sub">
          <select v-model="currentValue.body.vagina.progressive" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>

        <box-item :description="`Current value: ${currentValue.body.pubicHair.size}`" label="Pubic Hair">
          <div class="slider-container">
            <input
              v-model="currentValue.body.pubicHair.size"
              type="range"
              class="slider"
              in="0"
              max="2"
              step="0.1"></input>
            <span class="min">Disabled</span>
            <span class="max">2.0</span>
          </div>
        </box-item>

        <box-item
          v-show="currentValue.body.randomize"
          label="Randomize"
          description="Randomize the value in each run."
          class="box__item--sub">
          <select v-model="currentValue.body.pubicHair.randomize" class="input">
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
          label="Progressive"
          description="Increase the value progressively in each run"
          class="box__item--sub">
          <select v-model="currentValue.body.pubicHair.progressive" class="input">
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

    <section class="box box--items">
      <div class="box__header">
        <h2 class="title">
          Advanced
        </h2>
        <h3 class="subtitle">
          Additional processing settings.
        </h3>
      </div>

      <div class="box__content">
        <box-item
          label="Scale mode"
          description="Method that will be used to scale your photo to 512x512.">
          <select v-model="currentValue.advanced.scaleMode" class="input">
            <option value="none">
              None
            </option>
            <option value="cropjs">
              Manual Crop (Not recommended)
            </option>
            <option value="auto-rescale">
              Fixed Scale
            </option>
            <option value="auto-resize">
              Scale and pad
            </option>
            <!--
            <option value="auto-resize-crop">
              Scale and crop
            </option>
            -->
          </select>
        </box-item>

        <box-item
          label="Color transfer"
          description="(Experimental) At the end of the transformation, a color transfer algorithm will be applied to try to recover the original colors of the photo.">
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
