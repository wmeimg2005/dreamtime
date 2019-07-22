import _ from 'lodash'

export default {
  init() {
    this.fetchGpuDevices()
  },

  async fetchGpuDevices() {
    try {
      const devices = await $tools.getGpusList()

      $sentry.captureEvent({
        message: 'GPU Devices',
        level: 'info',
        extra: {
          devices
        }
      })

      this.gpuDevices = _.filter(devices, { AdapterCompatibility: 'NVIDIA' })
    } catch (error) {
      this.gpuDevices = []
    }
  },

  getGpuDevices() {
    return this.gpuDevices
  }
}
