<template>
  <div class="settings-fields">
    <section class="box">
      <div class="box__content">
        <MenuItem
          v-if="!isMacOS"
          label="Device."
          description="Device that will be used to nudify. GPU is faster.">
          <select v-model="currentValue.processing.device"
                  class="input">
            <option value="CPU">
              CPU
            </option>
            <option value="GPU">
              NVIDIA GPU
            </option>
          </select>
        </MenuItem>

        <MenuItem
          v-else
          label="Device."
          description="GPU is not available in macOS.">
          <select v-model="currentValue.processing.device"
                  class="input"
                  disabled>
            <option value="CPU">
              CPU
            </option>
          </select>
        </MenuItem>

        <MenuItem
          v-if="currentValue.processing.device === 'GPU'"
          label="GPU."
          description="Graphics card to use.">
          <select v-model="currentValue.processing.gpus[0]"
                  class="input">
            <option v-for="(device, index) in $provider.system.graphics"
                    :key="index"
                    :value="index">
              {{ device.model }}
            </option>
            <option v-for="n in 5"
                    :key="`slot-${n - 1}`"
                    :value="n - 1">
              Slot {{ n - 1 }}
            </option>
          </select>
        </MenuItem>

        <MenuItem
          v-if="currentValue.processing.device === 'CPU'"
          label="CPU Cores."
          description="Increasing this can improve transformation speed but decrease system stability.">
          <input v-model="currentValue.processing.cores"
                 type="number"
                 min="1"
                 :max="$provider.system.cores"
                 class="input">
        </MenuItem>

        <MenuItem
          label="Use Python."
          description="Use Python to start the nudification algorithm. Enable this only if you know what are you doing.">
          <select v-model="currentValue.processing.usePython"
                  class="input">
            <option :value="true">
              Enabled
            </option>
            <option :value="false">
              Disabled
            </option>
          </select>
        </MenuItem>
      </div>
    </section>
  </div>
</template>

<script>
import { VModel } from '~/mixins'

export default {
  mixins: [VModel],

  computed: {
    isMacOS() {
      return process.platform === 'darwin'
    },
  },
}
</script>
