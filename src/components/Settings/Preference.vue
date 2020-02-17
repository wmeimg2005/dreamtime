<template>
  <section class="box box--items">
    <div class="box__content">
      <box-item :description="`Value: ${currentValue.size}`" :label="`${label} size`">
        <div :style="{ opacity: body.randomize ? 0.3 : 1.0 }">
          <VueSlider v-model="currentValue.size" :min="min" :max="max" :interval="0.05" />
        </div>
      </box-item>

      <box-item
        v-show="!body.randomize && body.progressive.enabled"
        label="Progressive?"
        description="Increase this body part progressively in each run.">
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
          label="Randomize?"
          description="Randomize this body part in each run.">
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
          label="Random range"
          :description="`Min: ${currentValue.randomize.min} - Max: ${currentValue.randomize.max}`">
          <VueSlider
            v-model="randomizeRange"
            :min-range="0.05"
            :min="min"
            :max="max"
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
    min: {
      type: Number,
      default: 0.3,
    },
    max: {
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
