<template>
  <div class="settings-fields">
    <section class="box box-section">
      <box-section-item label="Device" description="Changing this option from CPU to GPU requires re-downloading DreamPower.">
        <select v-model="currentValue.processing.device" class="input">
          <option value="CPU">CPU</option>
          <option value="GPU">GPU</option>
        </select>
      </box-section-item>

      <box-section-item v-if="currentValue.processing.device === 'GPU'" label="GPU" description="Graphics card to be used for processing.">
        <select v-model="currentValue.processing.gpus[0]" class="input">
          <option v-for="(device, index) in gpuDevices" :key="index" :value="index">{{ device.Caption }}</option>
          <option v-for="n in 5" :key="`slot-${n - 1}`" :value="n - 1">Slot {{ n - 1 }}</option>
        </select>
      </box-section-item>

      <box-section-item label="Use Python" description="Use DreamPower python script instead of the executable. Enable this only if you know what are you doing.">
        <select v-model="currentValue.processing.usePython" class="input">
          <option :value="true">Enabled</option>
          <option :value="false">Disabled</option>
        </select>
      </box-section-item>
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
    this.gpuDevices = this.$platform.gpuDevices
    $nucleus.track('PAGE_SETTINGS_PROCESSING')
  }
}
</script>

