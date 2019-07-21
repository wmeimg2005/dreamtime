<template>
  <div class="settings-fields">
    <section class="settings-fields-section">
      <form-inline-field
        label="Device"
        hint="GPU is fast but is only compatible with an NVIDIA graphics card. CPU is slower but has support for all computers.">
        <select v-model="currentValue.processing.device" class="input">
          <option value="CPU">CPU</option>
          <option value="GPU">GPU</option>
        </select>
      </form-inline-field>

      <form-inline-field
        v-show="currentValue.processing.device === 'GPU'"
        label="GPU"
        hint="Graphics card to be used for processing.">
        <select v-model="currentValue.processing.gpus[0]" class="input">
          <option v-for="(device, index) in gpuDevices" :key="index" :value="index">{{ device.Caption }}</option>
          <option v-for="n in 5" :key="n - 1" :value="n - 1">{{ n - 1 }}</option>
        </select>
      </form-inline-field>

      <form-inline-field
        label="Photo restoration"
        hint="Restore the cropped photo to the original photo">
        <select v-model="currentValue.processing.useRestoration" class="input">
          <option :value="true">Enabled</option>
          <option :value="false">Disabled</option>
        </select>
      </form-inline-field>
    </section>
  </div>
</template>

<script>
import { VModel } from '~/mixins'

export default {
  mixins: [VModel],

  data: () => ({
    gpuDevices: []
  }),

  created() {
    this.gpuDevices = this.$platform.getGpuDevices()
  }
}
</script>

