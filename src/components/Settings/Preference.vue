<template>
  <section class="box box--items">
    <div class="box__content">
      <box-item :description="`Value: ${currentValue.size}`" :label="`${label} size`">
        <VueSlider v-model="currentValue.size" :min="0.3" :max="2" :interval="0.05" />
      </box-item>

      <box-item
        v-show="!body.randomize && body.progressive.enabled"
        label="Progressive."
        description="Increase the value progressively in each run">
        <select v-model="currentValue.progressive" class="input">
          <option :value="true">
            Enabled
          </option>
          <option :value="false">
            Disabled
          </option>
        </select>
      </box-item>

      <div v-show="body.randomize">
        <box-item
          label="Randomize."
          description="Randomize the value in each run.">
          <select v-model="currentValue.randomize.enabled" class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </box-item>

        <box-item
          label="Range."
          :description="`Min: ${currentValue.randomize.min} - Max: ${currentValue.randomize.max}`">
          <VueSlider
            v-model="randomizeRange"
            :min-range="0.05"
            :min="minRange"
            :max="maxRange"
            :interval="0.05" />
        </box-item>
      </div>
    </div>
  </section>
</template>

<script>
import { VModel } from '~/mixins'

export default {

  mixins: [VModel],
  props: {
    label: {
      type: String,
      required: true,
    },
    minRange: {
      type: Number,
      default: 0.3,
    },
    maxRange: {
      type: Number,
      default: 2,
    },
  },

  computed: {
    randomizeRange: {
      get() {
        return [this.currentValue.randomize.min, this.currentValue.randomize.max]
      },
      set(value) {
        const [min, max] = value

        this.currentValue.randomize.min = min
        this.currentValue.randomize.max = max
      },
    },

    body() {
      return this.$parent.currentValue?.body
    },
  },
}
</script>
